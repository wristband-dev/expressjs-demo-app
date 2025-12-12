import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export function ResponseBox({ message = '', title = '' }) {
  return (
    <Paper variant="outlined" sx={{ mt: 2, overflow: 'hidden', width: '100%' }}>
      <Box
        sx={{
          p: 1,
          bgcolor: 'grey.100',
          borderBottom: 1,
          borderColor: 'divider',
          ...(theme) => ({
            [theme.breakpoints.up('sm')]: {
              bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
            },
          }),
        }}
      >
        <Typography variant="body2" fontWeight="bold" textAlign="center">
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 1, maxHeight: 240, overflow: 'auto' }}>
        <Typography
          component="pre"
          variant="body2"
          sx={{
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            m: 0,
            fontFamily: 'monospace',
            textAlign: 'left',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Paper>
  );
}
