import React, { useState } from 'react';
import {
  Box, Paper, Typography, Collapse,
  Divider, Grid, useTheme, Chip,
} from '@mui/material';
import { formatDate } from 'date-fns';
import { GOAL_KINDS } from '@utils/goalKinds';
import Goal from '@domain/entities/Goal';

import DeleteButton from './DeleteButton';

type Props = {
  goal: Goal,
};

const GoalItem = ({ goal }:Props) => {
  const { palette } = useTheme();

  const [showDetails, setShowDetails] = useState(false);

  return (
    <Paper elevation={0} sx={{ borderRadius: 3 }}>
      <Box mt={2} display="flex" alignItems="center">
        <Box
          padding={2}
          display="flex"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          flexDirection={{ xs: 'column', sm: 'row' }}
          onClick={() => setShowDetails(!showDetails)}
          sx={{ cursor: 'pointer' }}
          width="100%"
          gap={1}
        >
          <Box
            display="flex"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={1}
          >
            {goal.finished && (
              <Chip
                label="Finalizada"
                sx={{
                  backgroundColor: 'secondary.dark',
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              />
            )}
            <Typography fontWeight={500} color="textSecondary">
              Meta de
              {' '}
              <span style={{ color: goal.kind == 'SALE' ? palette.blue.dark : palette.secondary.main }}>
                <b>
                  {GOAL_KINDS[goal.kind]}
                </b>
              </span>
              {' '}
              da fazenda
              {' '}
              <span style={{ color: palette.primary.main }}>
                <b>
                  {goal.farm.name}
                </b>
              </span>
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="textSecondary"
          >

            {formatDate(goal.created_at, "dd/MM/yyyy 'às' HH:mm'h'")}
          </Typography>
        </Box>
        {!goal.finished && (
          <Box px={1}>
            <DeleteButton goal={goal} />
          </Box>
        )}
      </Box>
      
      <Collapse in={showDetails} unmountOnExit>
        <Box px={2} pb={2}>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography fontSize="0.75rem" color="textSecondary" fontWeight={600} lineHeight={1}>
                Produto
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography fontSize="0.75rem" color="textSecondary" fontWeight={600} lineHeight={1}>
                Quantidade
              </Typography>
            </Grid>

            {goal.items.map((item, index) => (
              <React.Fragment key={index}>
                <Grid size={6}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.product.name}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.amount}
                  </Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default GoalItem;
