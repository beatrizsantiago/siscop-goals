import { Box, Button, CircularProgress } from '@mui/material';

import { useGoalContext } from '../context';
import Goal from './components/Goal';

const List = () => {
  const { state, getMoreGoals } = useGoalContext();

  return (
    <Box>
      {state.goals.map((item) => (
        <Goal key={item.id} goal={item} />
      ))}

      {state.loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {state.hasMore && !state.loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={getMoreGoals}>
            Carregar mais
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default List;
