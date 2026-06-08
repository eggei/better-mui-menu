import type { ReactNode, CSSProperties } from 'react';
import { forwardRef, isValidElement } from 'react';
import type { MenuItemProps } from '@mui/material';
import { MenuItem as MuiMenuItem, Typography } from '@mui/material';
import { MenuItemContent } from './common';
import type { MenuIcon } from './types';

type MenuEntryProps = Omit<MenuItemProps, 'children'> & {
  label: ReactNode;
  startIcon?: MenuIcon;
  endIcon?: MenuIcon;
};

const renderMenuIcon = (icon?: MenuIcon, alignSelf?: CSSProperties['alignSelf']) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const IconComponent = icon;
  return (
    <span style={{ alignSelf, height: '100%', alignItems: 'center', display: 'flex' }}>
      <IconComponent />
    </span>
  );
};

export const MenuEntry = forwardRef<HTMLLIElement, MenuEntryProps>(function MenuEntry(
  { label, startIcon, endIcon, onClick, ...muiMenuItemProps },
  ref
) {
  return (
    <MuiMenuItem ref={ref} {...muiMenuItemProps} onClick={onClick}>
      <MenuItemContent>
        {renderMenuIcon(startIcon, 'flex-start')}
        <Typography component='span' sx={{ flex: 1, fontFamily: 'inherit' }}>
          {label}
        </Typography>
        {renderMenuIcon(endIcon, 'center')}
      </MenuItemContent>
    </MuiMenuItem>
  );
});
