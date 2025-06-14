import React, { useState } from 'react';
import {
  Box, Button, TextField, Grid, CircularProgress, Autocomplete,
  IconButton, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { useGoalContext } from '@App/context';
import { toast } from 'react-toastify';
import { TrashIcon } from '@phosphor-icons/react';
import { firebaseGoal } from '@fb/goal';
import { KINDS_OPTIONS } from '@utils/goalKinds';
import AddGoalUseCase from '@usecases/goals/addGoal';
import useGetFarms from '@hooks/useGetFarms';
import Farm from '@domain/entities/Farm';
import Product from '@domain/entities/Product';

type ItemType = {
  amount: number;
  product: Product | null
}
type Props = {
  handleClose: () => void;
};

const FormContainer = ({ handleClose }:Props) => {
  const { dispatch } = useGoalContext();

  const { farms, loading: farmsLoading } = useGetFarms();

  const [loading, setLoading] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedKind, setSelectedKind] = useState('');
  const [itemsList, setItemsList] = useState<ItemType[]>([{
    amount: 0,
    product: null,
  }]);

  const clearData = () => {
    setItemsList([{
      amount: 0,
      product: null,
    }]);
    setSelectedFarm(null);
    setSelectedKind('');
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (itemsList.some((item) => item.product === null || item.amount <= 0)) {
      toast.error('Todos os itens devem ter um produto selecionado e uma quantidade maior que zero.');
      return;
    }

    setLoading(true);

    try {
      const addUseCase = new AddGoalUseCase(firebaseGoal);
      const response = await addUseCase.execute({
        kind: selectedKind,
        farm: selectedFarm!,
        items: itemsList.map((item) => ({
          product: item.product!,
          amount: item.amount,
        })),
      });

      dispatch({
        type: 'ADD_GOAL',
        item: response,
      });

      toast.success('Meta criada com sucesso!');
      clearData();
      handleClose();
    } catch {
      toast.error('Erro ao criar a meta. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (index: number, product: Product | null) => {
    const updatedItemsList = [...itemsList];

    if (!product) {
      updatedItemsList[index] = {
        amount: 0,
        product: null,
      };
      setItemsList(updatedItemsList);
      return;
    }

    updatedItemsList[index].product = product;
    setItemsList(updatedItemsList);
  };

  const handleAmountChange = (index: number, amount: number) => {
    const updatedItemsList = [...itemsList];
    updatedItemsList[index].amount = amount;
    setItemsList(updatedItemsList);
  };

  const onAddItemClick = () => {
    setItemsList([
      ...itemsList,
      {
        amount: 0,
        product: null,
      },
    ]);
  };

  const onDeleteItemClick = (index: number) => {
    const updatedItemsList = itemsList.filter((_, i) => i !== index);
    setItemsList(updatedItemsList);
  };

  const onCancelClick = () => {
    clearData();
    handleClose();
  };

  if (farmsLoading) return <CircularProgress />;

  const lastItem = itemsList[itemsList.length - 1];
  const availableProductsList = selectedFarm
    ? selectedFarm.available_products.filter(
      (product) => !itemsList.some((item) => item.product?.id === product.id),
    ) : [];

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            value={selectedFarm}
            onChange={(_, newValue) => {
              setSelectedFarm(newValue);
            }}
            options={farms}
            renderInput={(params) => <TextField {...params} label="Selecione a fazenda" variant="standard" required />}
            getOptionLabel={(option) => option.name}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl variant="standard" fullWidth>
            <InputLabel id="kind-select">Tipo</InputLabel>
            <Select
              labelId="kind-select"
              value={selectedKind}
              onChange={(e) => setSelectedKind(e.target.value)}
              required
            >
              {KINDS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedKind && selectedFarm && (
          <>
            {itemsList.map((item, index) => (
              <React.Fragment key={index}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    options={availableProductsList}
                    renderInput={(params) => <TextField {...params} label="Selecione o produto" variant="standard" required />}
                    getOptionLabel={(option) => option.name}
                    value={item.product}
                    onChange={(_, newValue) => handleSelectProduct(index, newValue)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    label="Quantidade (Kg)"
                    variant="standard"
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => handleAmountChange(index, Number(e.target.value))}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <Box display={{ xs: 'flex', md: 'none' }} alignItems="flex-end" justifyContent="center" height="100%">
                    <Button
                      color="error"
                      onClick={() => onDeleteItemClick(index)}
                      disabled={itemsList.length <= 1}
                      variant="outlined"
                    >
                      Excluir item
                    </Button>
                  </Box>
                  <Box display={{ xs: 'none', md: 'flex' }}>
                    <IconButton
                      sx={{ color: 'error.main' }}
                      onClick={() => onDeleteItemClick(index)}
                      disabled={itemsList.length <= 1}
                    >
                      <TrashIcon size={20} />
                    </IconButton>
                  </Box>
                </Grid>
              </React.Fragment>
            ))}

            {itemsList.length < selectedFarm.available_products.length && (
              <Grid size={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={lastItem.product === null || lastItem.amount <= 0}
                    loading={loading}
                    loadingPosition="start"
                    onClick={onAddItemClick}
                  >
                    Adicionar item
                  </Button>
                </Box>
              </Grid>
            )}
          </>
        )}
      </Grid>

      <Box marginTop={4} display="flex" justifyContent="space-between">
        <Button onClick={onCancelClick} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
          loadingPosition="start"
        >
          Salvar
        </Button>
      </Box>
    </form>
  );
}

export default FormContainer;
