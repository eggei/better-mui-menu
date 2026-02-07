import { Stack, styled } from '@mui/material';
import Fade from '@mui/material/Fade';

export const CLOSE_DELAY = 50;
export const transitionConfig = {
  type: Fade,
  timeout: { enter: CLOSE_DELAY + 50, exit: CLOSE_DELAY + 50 },
};
export const DEFAULT_ELEVATION = 8; // this is also what MUI menu uses as default

export const MenuItemContent = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
  padding: 0,
});
