import { useState } from 'react';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import { TrashIcon } from '@phosphor-icons/react';
import { useGoalContext } from '@App/context';
import { toast } from 'react-toastify';
import { firebaseGoal } from '@fb/goal';
import { GOAL_KINDS } from '@utils/goalKinds';
import DeleteGoalUseCase from '@usecases/goals/deleteGoal';
import Goal from '@domain/entities/Goal';

type Props = {
  goal: Goal,
};

const DeleteButton = ({ goal }:Props) => {
  const { dispatch } = useGoalContext();

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const toggleDialog = () => setShowConfirmationDialog((current) => !current);

  const onDeleteClick = async () => {
    try {
      const deleteUseCase = new DeleteGoalUseCase(firebaseGoal);
      await deleteUseCase.execute(goal.id);

      toast.success('Meta excluída com sucesso!');

      dispatch({
        type: 'DELETE_GOAL', id: goal.id,
      });
      toggleDialog();
    } catch {
      toast.error('Erro ao excluir a meta. Tente novamente.');
    }
  };

  return (
    <>
      <IconButton onClick={toggleDialog} color="error">
        <TrashIcon size={20} />
      </IconButton>
      {showConfirmationDialog && (
        <Dialog
          open
          onClose={toggleDialog}
          maxWidth="xs"
          fullWidth
        >
          <Typography variant="h6" fontWeight={600} lineHeight={1.2} align="center">
            Tem certeza que deseja excluir a meta de
            {' '}
            <strong>
              {GOAL_KINDS[goal.kind]}
            </strong>
            {' '}
            da fazenda
            {' '}
            <strong>
              {goal.farm.name}
            </strong>
            ?
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={3} gap={3}>
            <Button
              onClick={toggleDialog}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onDeleteClick}
              fullWidth
            >
              Excluir
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
}

export default DeleteButton;
