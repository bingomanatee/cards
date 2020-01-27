import { Box } from 'grommet';
import React from 'react';

export default ({ children }) => (
  <Box
    fill="horizontal"
    gap="large"
    elevation="small"
    background="white"
    pad="6px"
    border={{ size: '1px', color: 'light-6' }}
    round="1px"
    margin="6px"
  >
    {children}
  </Box>
);
