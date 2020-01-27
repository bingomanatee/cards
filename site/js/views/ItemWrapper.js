import { Box } from 'grommet';
import React from 'react';

export default ({ children }) => (
  <Box fill="horizontal" gap="large" pad="6px" border="light-4" round="1px" margin="6px">
    {children}
  </Box>
);
