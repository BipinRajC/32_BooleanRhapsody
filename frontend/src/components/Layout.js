// src/components/Layout.js
import { styled } from '@mui/system';

export const Container = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;
