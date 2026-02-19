import type { MenuProps } from '@mui/material';
import { Divider, Menu as MuiMenu } from '@mui/material';
import React, { useId } from 'react';
import { NestedMenuItem } from './NestedMenuItem';
import { MenuEntry } from './MenuEntry';
import type { MenuItem } from './types';
import { DEFAULT_ELEVATION, transitionConfig } from './common';

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
      id,
      label,
      items: childItems,
      onClick: itemOnClick,
      startIcon: StartIcon,
      endIcon: EndIcon,
      ...muiMenuItemProps
    } = item;
    const entryId = id ?? `${generatedMenuId}-entry-${index}`;
    const itemKey = `menu-item-id:${entryId}`;
    const displayLabel = label ?? entryId;

    if (childItems && childItems.length > 0) {
      return (
        <NestedMenuItem
          key={itemKey}
          id={entryId}
          label={displayLabel}
          startIcon={StartIcon}
          endIcon={EndIcon}
          parentMenuClose={menuProps.onClose}
          menuProps={menuProps}
          items={childItems}
          {...muiMenuItemProps}
        />
      );
    }

    const handleItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
      itemOnClick?.(event);
      menuProps.onClose?.(event, "itemClick", entryId);
    };

    return (
      <MenuEntry
        key={itemKey}
        label={displayLabel}
        startIcon={StartIcon}
        endIcon={EndIcon}
        {...muiMenuItemProps}
        onClick={handleItemClick}
      />
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
