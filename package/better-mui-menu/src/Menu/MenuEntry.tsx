import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import type { MenuItemProps } from '@mui/material/MenuItem';
import MuiMenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import { MenuItemContent } from './common';

type MenuEntryProps = Omit<MenuItemProps, 'children'> & {
  label: ReactNode;
  startIcon?: SvgIconComponent;
  endIcon?: SvgIconComponent;
};

export const MenuEntry = forwardRef<HTMLLIElement, MenuEntryProps>(function MenuEntry(
  { label, startIcon: StartIcon, endIcon: EndIcon, onClick, ...muiMenuItemProps },
  ref
) {
  return (
    <MuiMenuItem ref={ref} {...muiMenuItemProps} onClick={onClick}>
      <MenuItemContent>
        {StartIcon ? <StartIcon /> : null}
        <Typography sx={{ flex: 1, fontFamily: 'inherit' }}>{label}</Typography>
        {EndIcon ? <EndIcon /> : null}
      </MenuItemContent>
    </MuiMenuItem>
  );
});
