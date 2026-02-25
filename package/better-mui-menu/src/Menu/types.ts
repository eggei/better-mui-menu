import type { ReactElement, ReactNode } from 'react';
import type { MenuItemProps as MuiMenuItemProps } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

export type MenuIcon = SvgIconComponent | ReactElement;

export type MenuItemBase =
  | { type: 'divider' }
  | {
      type?: 'item';
      id?: string;
      label: ReactNode;
      startIcon?: MenuIcon;
      endIcon?: MenuIcon;
      items?: MenuItem[];
    };

export type MenuItem = MenuItemBase & Omit<MuiMenuItemProps, 'children'>;
