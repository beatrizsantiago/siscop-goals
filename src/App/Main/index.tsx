import { Box } from '@mui/material';

import List from '../List';
import Add from '../Add';

const Main = () => (
  <Box padding={2}>
    <Box display="flex" justifyContent="flex-end" marginBottom={3}>
      <Add />
    </Box>
    <List />
  </Box>
);

export default Main;
