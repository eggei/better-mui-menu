import type { ReactNode } from 'react';
import type { MenuItemProps as MuiMenuItemProps } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

export type MenuItemBase =
  | { type: 'divider' }
  | {
      type?: 'item';
      id?: string;
      label: ReactNode;
      startIcon?: SvgIconComponent;
      endIcon?: SvgIconComponent;
      items?: MenuItem[];
    };

export type MenuItem = MenuItemBase & Omit<MuiMenuItemProps, 'children'>;
