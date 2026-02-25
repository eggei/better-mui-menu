import type { ReactNode } from 'react';
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

const renderMenuIcon = (icon?: MenuIcon) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const IconComponent = icon;
  return <IconComponent />;
};

export const MenuEntry = forwardRef<HTMLLIElement, MenuEntryProps>(function MenuEntry(
  { label, startIcon, endIcon, onClick, ...muiMenuItemProps },
  ref
) {
  return (
    <MuiMenuItem ref={ref} {...muiMenuItemProps} onClick={onClick}>
      <MenuItemContent>
        <span style={{ alignSelf: 'flex-start', height: '100%', alignItems: 'center', display: 'flex' }}>
          {renderMenuIcon(startIcon)}
        </span>
        <Typography component='span' sx={{ flex: 1, fontFamily: 'inherit' }}>
          {label}
        </Typography>
        {renderMenuIcon(endIcon)}
      </MenuItemContent>
    </MuiMenuItem>
  );
});
