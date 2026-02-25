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

type DataAttributes = {
  // TS accepts data-* attributes in JSX, but object literals (our data-driven MenuItem[] config)
  // require explicit keys. This mapped type enables data-* props like data-testid on menu items.
  [K in `data-${string}`]?: string | number | boolean | undefined;
};

export type MenuItem = MenuItemBase & Omit<MuiMenuItemProps, 'children'> & DataAttributes;
