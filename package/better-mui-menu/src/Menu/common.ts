import { Stack, styled } from '@mui/material';
import Fade from '@mui/material/Fade';

export const CLOSE_DELAY = 50;
export const transitionConfig = {
  type: Fade,
  timeout: { enter: CLOSE_DELAY + 50, exit: CLOSE_DELAY + 50 },
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
