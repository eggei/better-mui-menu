import type { ReactElement, ReactNode } from 'react';
import type { MenuItemProps as MuiMenuItemProps } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

export type MenuIcon = SvgIconComponent | ReactElement;

type DataAttributes = {
  // TS accepts data-* attributes in JSX, but object literals (our data-driven MenuItem[] config)
  // require explicit keys. This mapped type enables data-* props like data-testid on menu items.
  [K in `data-${string}`]?: string | number | boolean | undefined;
};

type MenuDividerItem = {
  type: 'divider';
} & DataAttributes;

type MenuHeaderItem = {
  type: 'header';
  label: ReactNode;
} & DataAttributes;

type MenuActionItem = {
  type?: 'item';
  id?: string;
  label: ReactNode;
  startIcon?: MenuIcon;
  endIcon?: MenuIcon;
  items?: MenuItem[];
} & Omit<MuiMenuItemProps, 'children' | 'type'> & DataAttributes;

export type MenuItem = MenuDividerItem | MenuHeaderItem | MenuActionItem;
