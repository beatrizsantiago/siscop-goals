import { firebaseFarm } from '@fb/farm';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GetAllFarmsUseCase from '@usecases/farms/getAllFarms';
import Farm from '@domain/entities/Farm';

const useGetFarms = () => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(false);

  const getFarms = useCallback(async () => {
    setLoading(true);
    try {
      const getUserCase = new GetAllFarmsUseCase(firebaseFarm);
      const list = await getUserCase.execute();
      setFarms(list);
    } catch {
      toast.error('Erro ao carregar as fazendas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getFarms();
  }, [getFarms]);

  return {
    farms,
    loading,
  };
}

export default useGetFarms;
