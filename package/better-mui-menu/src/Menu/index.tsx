import type { MenuProps } from '@mui/material/Menu';
import MuiMenu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MuiMenuItem from '@mui/material/MenuItem';
import React, { useId } from 'react';
import { Typography } from '@mui/material';
import { NestedMenuItem } from './NestedMenuItem';
import type { MenuItem } from './types';
import { DEFAULT_ELEVATION, MenuItemContent, transitionConfig } from './common';

export type Props = {
  items: MenuItem[];
  onClose?: (event: React.MouseEvent | React.KeyboardEvent, reason: 'itemClick' | 'escapeKeyDown' | 'backdropClick', menuItemId?: string
  ) => void;
} & Omit<MenuProps, 'onClose'>;

export function Menu({ items, elevation = DEFAULT_ELEVATION, ...rest }: Props) {
  const menuProps: Omit<Props, 'items'> = { elevation, ...rest }; // setting the elevation for all nested menus here
  const generatedMenuId = useId();

  const renderedMenuEntries = items.map((item, index) => {
    if (item.type === 'divider') {
      return <Divider key={`divider-${index}`} />;
    }

    const {
      type: _,
      items: nestedItems,
      startIcon: StartIconComponent,
      endIcon: EndIconComponent,
      label,
      onClick,
      id,
      ...menuItemProps
    } = item;
    const entryId = id ?? `${generatedMenuId}-entry-${index}`;
    const itemKey = `menu-item-id:${entryId}`;
    const displayLabel = label ?? entryId;

    if (nestedItems && nestedItems.length > 0) {
      return (
        <NestedMenuItem
          key={itemKey}
          id={entryId}
          label={displayLabel}
          startIcon={StartIconComponent}
          endIcon={EndIconComponent}
          parentMenuClose={menuProps.onClose}
          items={nestedItems}
          menuProps={menuProps}
        />
      );
    }

    const handleItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
      onClick?.(event);
      menuProps.onClose?.(event, "itemClick", entryId);
    };

    return (
      <MuiMenuItem key={itemKey} onClick={handleItemClick} {...menuItemProps}>
        <MenuItemContent>
          {StartIconComponent ? <StartIconComponent /> : null}
          <Typography sx={{ flex: 1 }}>{displayLabel}</Typography>
          {EndIconComponent ? <EndIconComponent /> : null}
        </MenuItemContent>
      </MuiMenuItem>
    );
  });

  return (
    <MuiMenu
      data-testid='root-menu'
      {...menuProps}
      transitionDuration={menuProps.transitionDuration || transitionConfig.timeout}
      slots={{ transition: transitionConfig.type, ...menuProps.slots }}
    >
      {renderedMenuEntries}
    </MuiMenu>
  );
}
