/**
 * @jest-environment jsdom
 */
/// <reference types="@testing-library/jest-dom" />
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cloud from '@mui/icons-material/Cloud';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentPaste from '@mui/icons-material/ContentPaste';
import type { MenuItem } from './types';
import { Menu } from './index';

const buildMenuItems = () => {
  const spies = {
    cut: jest.fn(),
    google: jest.fn(),
    deep: jest.fn(),
  };

  const items: MenuItem[] = [
    {
      id: 'cut',
      label: 'Cut',
      startIcon: ContentCut,
      onClick: spies.cut,
    },
    {
      id: 'web-clipboard',
      label: 'Web Clipboard',
      startIcon: Cloud,
      items: [
        {
          id: 'google-cloud',
          label: 'Google Cloud',
          startIcon: ContentCopy,
          onClick: spies.google,
        },
        {
          id: 'deep-options',
          label: 'Deep Options',
          startIcon: ContentPaste,
          items: [
            {
              id: 'deep-item',
              label: 'Deep Item',
              startIcon: Cloud,
              onClick: spies.deep,
            },
          ],
        },
      ],
    },
  ];

  return { items, spies };
};

function MenuWithTrigger({ items }: { items: MenuItem[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        type='button'
        aria-controls={anchorEl ? 'icon-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleOpen}
      >
        Menu Actions
      </button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} items={items} />
    </>
  );
}

const setupMenu = () => {
  const user = userEvent.setup();
  const { items, spies } = buildMenuItems();
  render(<MenuWithTrigger items={items} />);
  const toggleButton = screen.getByRole('button', { name: /menu actions/i });
  return { user, toggleButton, spies };
};

describe('Menu', () => {
  it('renders root-level divider entries from data-driven items', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      { id: 'copy', label: 'Copy', startIcon: ContentCopy },
      { type: 'divider' },
      { id: 'paste', label: 'Paste', startIcon: ContentPaste },
    ];

    render(<MenuWithTrigger items={items} />);
    const toggleButton = screen.getByRole('button', { name: /menu actions/i });
    await user.click(toggleButton);

    await screen.findByRole('menuitem', { name: 'Copy' });
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument();
  });

  it('accepts JSX icon elements with custom props in root and nested items', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      {
        id: 'copy',
        label: 'Copy',
        startIcon: <ContentCopy data-testid='copy-icon-jsx' fontSize='large' sx={{ ml: 0.5 }} />,
      },
      {
        id: 'more',
        label: 'More',
        startIcon: <Cloud data-testid='more-icon-jsx' color='primary' />,
        items: [
          {
            id: 'nested-paste',
            label: 'Nested Paste',
            startIcon: <ContentPaste data-testid='nested-paste-icon-jsx' style={{ marginLeft: 4 }} />,
          },
        ],
      },
    ];

    render(<MenuWithTrigger items={items} />);
    const toggleButton = screen.getByRole('button', { name: /menu actions/i });
    await user.click(toggleButton);

    expect(await screen.findByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByTestId('copy-icon-jsx')).toBeInTheDocument();
    expect(screen.getByTestId('more-icon-jsx')).toBeInTheDocument();

    const moreTrigger = screen.getByRole('menuitem', { name: 'More' });
    await user.hover(moreTrigger);

    expect(await screen.findByRole('menuitem', { name: 'Nested Paste' })).toBeInTheDocument();
    expect(screen.getByTestId('nested-paste-icon-jsx')).toHaveStyle({ marginLeft: '4px' });
  });

  it('falls back to the item id when a root item label is omitted', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [{ id: 'fallback-id', label: null, startIcon: ContentCopy }];

    render(<MenuWithTrigger items={items} />);
    const toggleButton = screen.getByRole('button', { name: /menu actions/i });
    await user.click(toggleButton);

    expect(await screen.findByRole('menuitem', { name: 'fallback-id' })).toBeInTheDocument();
  });

  it('closes the root menu after selecting a leaf action', async () => {
    const { user, toggleButton, spies } = setupMenu();
    await user.click(toggleButton);
    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    const cutItem = await screen.findByRole('menuitem', { name: 'Cut' });
    await user.click(cutItem);

    expect(spies.cut).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(toggleButton).not.toHaveAttribute('aria-expanded');
    });
  });

  it('handles actions when callers omit explicit ids', async () => {
    const user = userEvent.setup();
    const spies = {
      copy: jest.fn(),
      nested: jest.fn(),
    };
    const items: MenuItem[] = [
      {
        label: 'Copy',
        startIcon: ContentCopy,
        onClick: spies.copy,
      },
      {
        label: 'More options',
        startIcon: Cloud,
        items: [
          {
            label: 'Nested action',
            startIcon: ContentCopy,
            onClick: spies.nested,
          },
        ],
      },
    ];

    render(<MenuWithTrigger items={items} />);
    const toggleButton = screen.getByRole('button', { name: /menu actions/i });
    await user.click(toggleButton);

    const copyItem = await screen.findByRole('menuitem', { name: 'Copy' });
    await user.click(copyItem);

    expect(spies.copy).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(toggleButton).not.toHaveAttribute('aria-expanded');
    });

    await user.click(toggleButton);
    const nestedTrigger = await screen.findByRole('menuitem', { name: 'More options' });
    await user.hover(nestedTrigger);
    const nestedAction = await screen.findByRole('menuitem', { name: 'Nested action' });
    await user.click(nestedAction);

    expect(spies.nested).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(toggleButton).not.toHaveAttribute('aria-expanded');
    });
  });

  it('invokes a nested menu action and closes both menus', async () => {
    const { user, toggleButton, spies } = setupMenu();
    await user.click(toggleButton);

    const nestedTrigger = await screen.findByRole('menuitem', { name: 'Web Clipboard' });
    await user.hover(nestedTrigger);

    const googleItem = await screen.findByRole('menuitem', { name: 'Google Cloud' });
    await user.click(googleItem);

    expect(spies.google).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Web Clipboard' })).not.toBeInTheDocument();
    });
    expect(toggleButton).not.toHaveAttribute('aria-expanded');
  });

  it('fires deep-nested actions and closes the root menu', async () => {
    const { user, toggleButton, spies } = setupMenu();
    await user.click(toggleButton);

    const webClipboardTrigger = await screen.findByRole('menuitem', { name: 'Web Clipboard' });
    await user.hover(webClipboardTrigger);

    const deepTrigger = await screen.findByRole('menuitem', { name: 'Deep Options' });
    await user.hover(deepTrigger);

    const deepItem = await screen.findByRole('menuitem', { name: 'Deep Item' });
    await user.click(deepItem);

    expect(spies.deep).toHaveBeenCalledTimes(1);
    expect(webClipboardTrigger).not.toHaveAttribute('aria-expanded');
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Web Clipboard' })).not.toBeInTheDocument();
    });
    expect(toggleButton).not.toHaveAttribute('aria-expanded');
  });

  it('keeps the submenu open when the mouse leaves the trigger toward the submenu (critical feature)', async () => {
    const { user, toggleButton } = setupMenu();
    await user.click(toggleButton);

    const nestedTrigger = await screen.findByRole('menuitem', { name: 'Web Clipboard' });
    await user.hover(nestedTrigger);

    const nestedMenu = await screen.findByRole('menu', { name: 'Web Clipboard' });
    fireEvent.mouseLeave(nestedTrigger, { relatedTarget: nestedMenu });
    fireEvent.mouseLeave(nestedMenu, { relatedTarget: nestedTrigger });

    expect(nestedMenu).toBeVisible();
  });

  it('closes the submenu when the mouse leaves away from the trigger (critical Popper behavior)', async () => {
    const { user, toggleButton } = setupMenu();
    await user.click(toggleButton);

    const nestedTrigger = await screen.findByRole('menuitem', { name: 'Web Clipboard' });
    await user.hover(nestedTrigger);

    const nestedMenu = await screen.findByRole('menu', { name: 'Web Clipboard' });
    fireEvent.mouseLeave(nestedMenu, { relatedTarget: document.body });

    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Web Clipboard' })).not.toBeInTheDocument();
    });
    expect(nestedTrigger).not.toHaveAttribute('aria-expanded');
  });

  describe('Accessibility features', () => {
    it('exposes ARIA relationships so screen readers can describe nested menus', async () => {
      const { user, toggleButton } = setupMenu();
      await user.click(toggleButton);

      const nestedTrigger = await screen.findByRole('menuitem', { name: 'Web Clipboard' });
      expect(nestedTrigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(nestedTrigger).toHaveAttribute('aria-controls', 'web-clipboard-submenu');
      expect(nestedTrigger.id).toBe('web-clipboard');
      expect(nestedTrigger).not.toHaveAttribute('aria-expanded');

      await user.hover(nestedTrigger);
      const nestedMenu = await screen.findByRole('menu', { name: 'Web Clipboard' });
      expect(nestedMenu).toHaveAttribute('id', 'web-clipboard-submenu');
      expect(nestedMenu).toHaveAttribute('aria-labelledby', nestedTrigger.id);
      expect(nestedMenu).toHaveAttribute('role', 'menu');
      expect(nestedTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('supports keyboard navigation so focus stays with the active branch', async () => {
      const { user, toggleButton } = setupMenu();
      await user.click(toggleButton);

      const nestedTrigger = await screen.findByRole('menuitem', { name: 'Web Clipboard' });
      await act(() => {
        nestedTrigger.focus();
      });

      await user.keyboard('{ArrowRight}');
      const firstNestedItem = await screen.findByRole('menuitem', { name: 'Google Cloud' });
      await waitFor(() => {
        expect(firstNestedItem).toHaveFocus();
      });

      await user.keyboard('{ArrowLeft}');
      await waitFor(() => {
        expect(screen.queryByRole('menu', { name: 'Web Clipboard' })).not.toBeInTheDocument();
        expect(nestedTrigger).toHaveFocus();
      });

      await user.keyboard('{Enter}');
      const reopenedItem = await screen.findByRole('menuitem', { name: 'Google Cloud' });
      await waitFor(() => {
        expect(reopenedItem).toHaveFocus();
      });
    });

    describe('Keyboard actions & Focus management', () => {
      it('traversing down to deepest level and back with keyboard', async () => {
        const { user, toggleButton } = setupMenu();
        await user.click(toggleButton);
        await waitFor(async () => {
          expect(screen.getByTestId('root-menu')).toBeVisible();
          // jump in the menu
          await user.keyboard('{ArrowDown}');
        });

        // Step 1: Open Web Clipboard submenu
        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}');
        await waitFor(() => {
          expect(screen.getByTestId('web-clipboard-submenu')).toBeVisible();
        });
        expect(screen.getByRole('menuitem', { name: 'Google Cloud' })).toHaveFocus();

        // Step 2: Open Deep Options submenu
        await user.keyboard('{ArrowDown}{ArrowRight}');
        await waitFor(() => {
          expect(screen.getByRole('menu', { name: 'Deep Options' })).toBeVisible();
        });
        expect(screen.getByRole('menuitem', { name: 'Deep Item' })).toHaveFocus();

        // Step 3: Close Deep Options submenu
        await user.keyboard('{ArrowLeft}');
        const deepOptionsTrigger = screen.getByRole('menuitem', { name: 'Deep Options' });
        await waitFor(() => {
          expect(screen.queryByRole('menu', { name: 'Deep Options' })).not.toBeInTheDocument();
          expect(deepOptionsTrigger).toHaveFocus();
        });

        // Step 4: Close Web Clipboard submenu
        await user.keyboard('{ArrowLeft}');
        const webClipboardTrigger = screen.getByRole('menuitem', { name: 'Web Clipboard' });
        await waitFor(() => {
          expect(screen.queryByRole('menu', { name: 'Web Clipboard' })).not.toBeInTheDocument();
          expect(webClipboardTrigger).toHaveFocus();
        });
      });

      it('traversing down to deepest level and back using mouse', async () => {
        const { user, toggleButton } = setupMenu();
        await user.click(toggleButton);
        await waitFor(() => {
          expect(screen.getByTestId('root-menu')).toBeVisible();
        });
        // Step 1: Open Web Clipboard submenu
        const webClipboardTrigger = screen.getByRole('menuitem', { name: 'Web Clipboard' });
        await user.hover(webClipboardTrigger);
        await waitFor(() => {
          expect(screen.getByTestId('web-clipboard-submenu')).toBeVisible();
        });

        // Step 2: Open Deep Options submenu
        const deepOptionsTrigger = screen.getByRole('menuitem', { name: 'Deep Options' });
        await user.hover(deepOptionsTrigger);
        await waitFor(() => {
          expect(screen.getByRole('menu', { name: 'Deep Options' })).toBeVisible();
        });

        // Step 3: Go in the deep options menu
        const deepItem = screen.getByRole('menuitem', { name: 'Deep Item' });
        await user.hover(deepItem);

        // Step 4: Hover deep options trigger and expect submenu to not close
        await user.hover(deepOptionsTrigger);
        expect(screen.getByRole('menu', { name: 'Deep Options' })).toBeVisible();

        // Step 5: Hover Google Cloud trigger and expect deep options submenu to close
        const googleCloudTrigger = screen.getByRole('menuitem', { name: 'Google Cloud' });
        await user.hover(googleCloudTrigger);
        await waitFor(() => {
          expect(screen.queryByRole('menu', { name: 'Deep Options' })).not.toBeInTheDocument();
        });

        // Step 6: Hover Cut trigger and expect Web Clipboard submenu to close
        const cutTrigger = screen.getByRole('menuitem', { name: 'Cut' });
        await user.hover(cutTrigger);
        await waitFor(() => {
          expect(screen.queryByRole('menu', { name: 'Web Clipboard' })).not.toBeInTheDocument();
        });

        // Finally, click out side and expect root menu to close
        const backdrop = document.querySelector('[class*="MuiBackdrop-root"]');
        if (!backdrop) throw new Error('Backdrop not found');
        await user.click(backdrop);
        await waitFor(() => {
          expect(screen.queryByTestId('root-menu')).not.toBeInTheDocument();
        });
      });
    });
  });
});
