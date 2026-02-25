/**
 * @jest-environment jsdom
 */
/// <reference types="@testing-library/jest-dom" />
import type { ReactNode } from 'react';
import { createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MenuItem as MuiMenuItem } from '@mui/material';
import type { MenuProps } from '@mui/material';
import type { MenuItem } from './types';
import { NestedMenuItem } from './NestedMenuItem';

type SetupOptions = {
  id?: string;
  label?: ReactNode;
  items?: MenuItem[];
  children?: ReactNode;
  parentMenuClose?: jest.Mock;
};

const baseMenuProps = { open: true } as MenuProps;

const renderNestedMenuItem = ({
  id = 'nested-parent',
  label = 'Nested Parent',
  items,
  children,
  parentMenuClose = jest.fn(),
}: SetupOptions = {}) => {
  render(
    <NestedMenuItem
      id={id}
      label={label}
      items={items}
      parentMenuClose={parentMenuClose}
      menuProps={baseMenuProps}
    >
      {children}
    </NestedMenuItem>
  );

  const trigger = screen.getByRole('menuitem', { name: String(label) });
  fireEvent.mouseEnter(trigger);

  return { trigger, parentMenuClose, id };
};

describe('NestedMenuItem', () => {
  it('clones MuiMenuItem children and wires close behavior on child click', async () => {
    const childOnClick = jest.fn();
    const parentMenuClose = jest.fn();
    const { id } = renderNestedMenuItem({
      id: 'children-parent',
      label: 'Children Parent',
      parentMenuClose,
      children: [
        <MuiMenuItem key='child-action' onClick={childOnClick}>Child action</MuiMenuItem>,
        <div key='non-menu-child' data-testid='non-menu-child'>Non menu child</div>,
      ],
    });

    const submenu = await screen.findByRole('menu', { name: 'Children Parent' });
    expect(submenu).toBeVisible();
    expect(screen.getByTestId('non-menu-child')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitem', { name: 'Child action' }));

    expect(childOnClick).toHaveBeenCalledTimes(1);
    expect(parentMenuClose).toHaveBeenCalledTimes(1);
    expect(parentMenuClose).toHaveBeenCalledWith(expect.anything(), 'itemClick', id);
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Children Parent' })).not.toBeInTheDocument();
    });
  });

  it('renders divider entries for data-driven submenu items', async () => {
    renderNestedMenuItem({
      label: 'With Divider',
      items: [
        { type: 'divider' },
        { id: 'leaf-item', label: 'Leaf item' },
      ],
    });

    await screen.findByRole('menu', { name: 'With Divider' });
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Leaf item' })).toBeInTheDocument();
  });

  it('closes submenu and refocuses trigger on ArrowLeft from Popper', async () => {
    const { trigger, id } = renderNestedMenuItem({
      id: 'arrow-left-parent',
      label: 'Arrow Left Parent',
      items: [{ id: 'leaf-item', label: 'Leaf item' }],
    });

    const submenu = await screen.findByTestId(`${id}-submenu`);
    fireEvent.keyDown(submenu, { key: 'ArrowLeft' });

    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Arrow Left Parent' })).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('ignores ArrowLeft when nested handler flag is already set', async () => {
    renderNestedMenuItem({
      label: 'Flagged Parent',
      items: [{ id: 'leaf-item', label: 'Leaf item' }],
    });

    const submenuMenuList = await screen.findByRole('menu', { name: 'Flagged Parent' });
    const event = createEvent.keyDown(submenuMenuList, { key: 'ArrowLeft' }) as KeyboardEvent & {
      __nestedMenuArrowLeftHandled?: boolean;
    };
    event.__nestedMenuArrowLeftHandled = true;
    fireEvent(submenuMenuList, event);

    expect(screen.getByRole('menu', { name: 'Flagged Parent' })).toBeInTheDocument();
  });

  it('ignores ArrowLeft when the event target is outside the submenu', async () => {
    const { id } = renderNestedMenuItem({
      id: 'outside-target-parent',
      label: 'Outside Target Parent',
      items: [{ id: 'leaf-item', label: 'Leaf item' }],
    });

    const submenuRoot = await screen.findByTestId(`${id}-submenu`);
    const submenuMenuList = await screen.findByRole('menu', { name: 'Outside Target Parent' });
    const nativeContains = Node.prototype.contains;
    const containsSpy = jest.spyOn(Node.prototype, 'contains').mockImplementation(function contains(this: Node, other: Node | null) {
      if (this === submenuRoot) return false;
      return nativeContains.call(this, other);
    });

    try {
      fireEvent.keyDown(submenuMenuList, { key: 'ArrowLeft' });
    } finally {
      containsSpy.mockRestore();
    }

    expect(screen.getByRole('menu', { name: 'Outside Target Parent' })).toBeInTheDocument();
  });
});
