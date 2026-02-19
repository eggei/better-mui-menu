import { Fade, Stack, styled } from '@mui/material';

export const CLOSE_DELAY = 50;
export const transitionConfig = {
  type: Fade,
  timeout: { enter: CLOSE_DELAY + 50, exit: CLOSE_DELAY + 50 },
};
export const DEFAULT_ELEVATION = 1;

export const MenuItemContent = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '8px',
  padding: 0,
});
