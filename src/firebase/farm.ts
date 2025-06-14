import { FarmRepository } from '@domain/repositories/FarmRepository';
import {
  collection, DocumentReference, getDoc, getDocs, query,
} from 'firebase/firestore';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';
import Product from '@domain/entities/Product';

class FirebaseFarm implements FarmRepository {
  async getAll(): Promise<Farm[]> {
    const farmsQuery = query(collection(firestore, 'farms'));
    const snapshot = await getDocs(farmsQuery);

    const farms: Farm[] = [];

    for (const docSnapshot of snapshot.docs) {
      const farmData = docSnapshot.data();

      const productRefs = Array.isArray(farmData.available_products)
        ? farmData.available_products.filter((ref) => ref && typeof ref === 'object' && 'id' in ref)
        : [];

      const products: Product[] = await Promise.all(
        productRefs.map(async (ref: DocumentReference) => {
          const productSnap = await getDoc(ref);
          if (productSnap.exists()) {
            const data = productSnap.data();
            return new Product(productSnap.id, data.name, data.unit_value, data.cycle_days);
          }
          return null;
        })
      ).then((results) => results.filter((p): p is Product => p !== null));

      const farm = new Farm(docSnapshot.id, farmData.name, farmData.geolocation, products);
      farms.push(farm);
    };

    return farms;
  };
};

export const firebaseFarm = new FirebaseFarm();
