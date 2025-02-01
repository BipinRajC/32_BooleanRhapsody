// src/components/Button.js
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/system';

const Button = styled(MuiButton)`
  padding: 10px 20px;
  font-size: 16px;
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

export default Button;
