import { useState } from 'react';
import {
  Box, Button, Dialog, Typography,
} from '@mui/material';
import { PlusIcon } from '@phosphor-icons/react';
import Form from './components/Form';

const Add = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = () => setShowDialog(false);

  return (
    <Box>
      <Button
        startIcon={<PlusIcon size={16} weight="bold" />}
        onClick={() => setShowDialog(true)}
        variant="contained"
      >
        Adicionar
      </Button>

      {showDialog && (
        <Dialog
          open
          fullWidth
          maxWidth="md"
        >
          <Typography variant="h6" fontWeight={600} marginBottom={2}>
            Nova meta
          </Typography>

          <Form handleClose={handleClose} />
        </Dialog>
      )}
    </Box>
  );
}

export default Add;
