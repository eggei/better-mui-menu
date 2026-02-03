import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import React, { useId } from 'react';
import { Typography } from '@mui/material';
import { NestedMenuItem } from './NestedMenuItem';
import type { MultiLevelMenuItem } from './types';
import { MenuItemContent, transitionConfig } from './common';

type Props = {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  items: MultiLevelMenuItem[];
};

export function MultiLevelMenu({ anchorEl, open, onClose, items }: Props) {
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
          parentMenuClose={onClose}
          items={nestedItems}
        />
      );
    }

    const handleItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
      onClick?.(event);
      onClose();
    };

    return (
      <MenuItem key={itemKey} onClick={handleItemClick} {...menuItemProps}>
        <MenuItemContent>
          {StartIconComponent ? <StartIconComponent /> : null}
          <Typography sx={{ flex: 1 }}>{displayLabel}</Typography>
          {EndIconComponent ? <EndIconComponent /> : null}
        </MenuItemContent>
      </MenuItem>
    );
  });

  return (
    <Menu
      data-testid='root-menu'
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape' && open) onClose();
      }}
      transitionDuration={transitionConfig.timeout}
      slots={{ transition: transitionConfig.type }}
      slotProps={{
        list: {
          'aria-labelledby': 'icon-menu-button',
        },
      }}
    >
      {renderedMenuEntries}
    </Menu>
  );
}
