import { Stack, styled } from '@mui/material';
import Fade from '@mui/material/Fade';

export const transitionConfig = {
  type: Fade,
  timeout: { enter: 100, exit: 100 },
};

export const MenuItemContent = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: theme.typography.body1.fontSize,
  '& .MuiSvgIcon-root': {
    fontSize: theme.typography.body2.fontSize,
  },
  padding: 0,
}));
