import type { ReactNode } from 'react';
import type { MenuItemProps } from '@mui/material/MenuItem';
import { SvgIconComponent } from '@mui/icons-material';

export type MultiLevelMenuItemBase =
  | { type: 'divider' }
  | {
      type?: 'item';
      id?: string;
      label: ReactNode;
      startIcon?: SvgIconComponent;
      endIcon?: SvgIconComponent;
      items?: MultiLevelMenuItem[];
    };

export type MultiLevelMenuItem = MultiLevelMenuItemBase & Omit<MenuItemProps, 'children'>;
