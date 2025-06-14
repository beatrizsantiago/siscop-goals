import { GoalRepository } from '@domain/repositories/GoalRepository';
import {
  addDoc, collection, deleteDoc, doc, DocumentSnapshot,
  getDoc, getDocs, limit, orderBy, query, startAfter, Timestamp,
} from 'firebase/firestore';
import Goal from '@domain/entities/Goal';
import Product from '@domain/entities/Product';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';

const PAGE_SIZE = 10;

class FirebaseGoal implements GoalRepository {
  async add(goal: Goal): Promise<Goal> {
    const docRef = await addDoc(collection(firestore, 'goals'), {
      kind: goal.kind,
      farm_id: doc(firestore, 'farms', goal.farm.id),
      items: goal.items.map(item => ({
        product_id: doc(firestore, 'products', item.product.id),
        amount: item.amount,
      })),
      created_at: Timestamp.fromDate(goal.created_at),
    });

    return new Goal(
      docRef.id,
      goal.kind,
      goal.farm,
      goal.items,
      goal.created_at,
    );
  }

  async getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Goal[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }> {
    const goalRef = collection(firestore, 'goals');

    let q = query(goalRef, orderBy('created_at', 'desc'), limit(PAGE_SIZE));

    if (lastDoc) {
      q = query(goalRef, orderBy('created_at', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
    }

    const snapshot = await getDocs(q);

    const goals = await Promise.all(snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();

      const farmRef = data.farm_id;
      const farmSnap = await getDoc(farmRef);
      const farmData = farmSnap.data() as Omit<Farm, 'id'>;

      const availableProducts: Product[] = (farmData.available_products || []).map((prod: any) =>
        new Product(prod.id, prod.name, prod.unit_value, prod.cycle_days)
      );

      const farm = new Farm(
        farmRef.id,
        farmData.name,
        farmData.geolocation,
        availableProducts
      );

      const items = await Promise.all((data.items || []).map(async (itemData: any) => {
        const productRef = itemData.product_id;
        const productSnap = await getDoc(productRef);
        const productData = productSnap.data()  as Omit<Product, 'id'>;;

        const product = new Product(
          productRef.id,
          productData.name,
          productData.unit_value,
          productData.cycle_days
        );

        return {
          product,
          amount: itemData.amount,
        };
      }));

      return new Goal(
        docSnap.id,
        data.kind,
        farm,
        items,
        data.created_at.toDate()
      );
    }));

    return {
      list: goals,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === PAGE_SIZE,
    };
  }

  async delete(id: string): Promise<void> {
    return await deleteDoc(doc(firestore, 'goals', id));
  }
};

export const firebaseGoal = new FirebaseGoal();
