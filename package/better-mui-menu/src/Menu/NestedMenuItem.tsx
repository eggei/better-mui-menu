import type { FC, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { Children, cloneElement, isValidElement, useCallback, useId, useRef, useState } from 'react';
import Fade from '@mui/material/Fade';
import type { MenuItemProps } from '@mui/material/MenuItem';
import MuiMenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import type { SvgIconComponent } from '@mui/icons-material';
import type { MenuListProps, MenuProps, PaperProps } from '@mui/material';
import { MenuList, Paper, Popper, Typography } from '@mui/material';
import type { MenuItem } from './types';
import { CLOSE_DELAY, MenuItemContent, transitionConfig } from './common';
import type { Props as BetterMenuProps } from '.';

type NestedMenuItemProps = MenuItemProps & {
  label: ReactNode;
  startIcon?: SvgIconComponent;
  endIcon?: SvgIconComponent;
  parentMenuClose: BetterMenuProps['onClose'];
  children?: ReactNode;
  items?: MenuItem[];
  menuProps: MenuProps;
};

const isNodeInstance = (target: EventTarget | null): target is Node => target instanceof Node;

export const NestedMenuItem: FC<NestedMenuItemProps> = props => {
  const {
    id: providedId,
    label,
    startIcon: StartIconComponent,
    parentMenuClose,
    children,
    items,
    endIcon: EndIconComponent,
    menuProps,
    ...menuItemProps
  } = props;
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(subMenuAnchorEl);
  const menuItemRef = useRef<HTMLLIElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const menuItemId = providedId ?? `nested-menu-trigger-${generatedId}`;
  const subMenuId = `${menuItemId}-submenu`;

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearCloseTimer();
    setSubMenuAnchorEl(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      handleClose();
    }, CLOSE_DELAY);
  }, [clearCloseTimer, handleClose]);

  const handleOpen = (event: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>) => {
    clearCloseTimer();
    setSubMenuAnchorEl(event.currentTarget);
  };


  // eslint-disable-next-line react-hooks/refs
  const renderChildren = Children.map(children, child => {
    if (!isValidElement(child)) return child;

    // Ensure we only process MUI MenuItem children
    if (child.type === MuiMenuItem) {
      const childOnClick = (child.props as MenuItemProps).onClick;
      // Merge any user-defined click logic with the submenu closing behavior.
      const clonedOnClick = (event: MouseEvent<HTMLLIElement>) => {
        childOnClick?.(event);
        handleClose(); // Close the submenu
        parentMenuClose?.(event, "itemClick", menuItemId);
      };
      return cloneElement(child, { onClick: clonedOnClick } as Partial<MenuItemProps>);
    }
    return child;
  });

  const renderItemsFromData = () => {
    if (!items || items.length === 0) return null;

    return items.map((item, index) => {
      if (item.type === 'divider') {

        return <Divider key={`divider-${index}`} />;
      }

      const {
        type: __,
        items: entryItems,
        startIcon: NestedMenuItemStartIcon,
        endIcon: NestedMenuItemEndIcon,
        label: entryLabel,
        onClick,
        id,
      } = item;
      const entryId = id ?? `${menuItemId}-entry-${index}`;
      const entryKey = `nested-entry-${entryId}`;
      const entryLabelValue = entryLabel ?? entryId;

      if (entryItems && entryItems.length > 0) {
        return (
          <NestedMenuItem
            key={entryKey}
            id={entryId}
            label={entryLabelValue}
            startIcon={NestedMenuItemStartIcon}
            endIcon={NestedMenuItemEndIcon}
            parentMenuClose={parentMenuClose}
            items={entryItems}
            menuProps={menuProps}
          />
        );
      }

      const handleItemClick = (event: MouseEvent<HTMLLIElement>) => {
        onClick?.(event);
        handleClose();
        parentMenuClose?.(event, "itemClick", entryId);
      };

      return (
        <MuiMenuItem key={entryKey} onClick={handleItemClick}>
          <MenuItemContent>
            {NestedMenuItemStartIcon ? <NestedMenuItemStartIcon /> : null}
            <Typography sx={{ flex: 1 }}>{entryLabelValue}</Typography>
            {NestedMenuItemEndIcon ? <NestedMenuItemEndIcon /> : null}
          </MenuItemContent>
        </MuiMenuItem>
      );
    });
  };

  const renderedSubMenuItems = items && items.length > 0 ? renderItemsFromData() : renderChildren;

  return (
    <>
      <MuiMenuItem
        data-testid={`${menuItemId}-trigger`}
        id={menuItemId}
        ref={menuItemRef}
        onMouseEnter={handleOpen}
        onMouseLeave={e => {
          // CRITICAL FEATURE:
          // Checking whether cursor left the menu item onto the related menu. If so, do not close.
          if (isNodeInstance(e.relatedTarget) && subMenuRef.current?.contains(e.relatedTarget)) return;
          // If the cursor leaves to anywhere else, close the submenu.
          scheduleClose();
        }}
        onKeyDown={e => {
          e.preventDefault();
          if (e.key === 'ArrowLeft') {
            handleClose();
          }
          if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
            handleOpen(e);
          }
        }}
        aria-haspopup='menu'
        aria-controls={subMenuId}
        aria-expanded={open ? 'true' : undefined}
        {...menuItemProps}
      >
        <MenuItemContent>
          {StartIconComponent ? <StartIconComponent /> : null}
          <Typography sx={{ flex: 1, fontFamily: 'inherit' }}>{label}</Typography>
          {EndIconComponent ? <EndIconComponent /> : <ArrowRightIcon />}
        </MenuItemContent>
      </MuiMenuItem>

      {/**
       * CRITICAL FEATURE: Menu over Menu fails with focus management and keyboard navigations. 
       *  It is way more complex to make Menu to work compared to Popper. So, I made the decision to use Popper for submenus.
       *  This way we can manage focus and keyboard navigation simpler, and we can also avoid some weird edge cases.
       *  If you change this to regular Menu, you will realize that you need to add many custom JS logic to manage focus and keyboard navigation,
       *  as well as to block Menu's internal logic.
      */}
      <Popper
        data-testid={`${menuItemId}-submenu`}
        open={open}
        ref={subMenuRef}
        anchorEl={subMenuAnchorEl}
        transition
        sx={{ zIndex: t => t.zIndex.modal + 1 }}
        placement='right-start'
        onKeyDown={e => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handleClose();
            menuItemRef.current?.focus();
          }
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={e => {
          // CRITICAL FEATURE:
          // Checking whether cursor left the submenu onto the related trigger item. If so, do not close.
          if (isNodeInstance(e.relatedTarget) && menuItemRef.current?.contains(e.relatedTarget)) return;
          // If the cursor leaves to anywhere else, close the submenu.
          scheduleClose();
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={transitionConfig.timeout}>
            <Paper elevation={menuProps.elevation} {...(menuProps?.slotProps?.paper as PaperProps) || {}}>
              <MenuList
                id={subMenuId}
                aria-labelledby={menuItemId}
                role='menu'
                {...(menuProps?.slotProps?.list as MenuListProps) || {}}
                // What's under is not allowed to be overridden for now
                autoFocusItem
                onKeyDown={e => {
                  if (e.key === 'ArrowLeft') {
                    const { nativeEvent } = e as KeyboardEvent<HTMLUListElement> & {
                      nativeEvent: KeyboardEvent & {
                        // our custom flag to avoid duplicate handling in nested menus
                        __nestedMenuArrowLeftHandled?: boolean;
                      };
                    };
                    if (nativeEvent.__nestedMenuArrowLeftHandled) {
                      // return early if we have already handled this event in a nested menu
                      // prevents duplicate logic when the browser bubbles the same keypress through multiple nodes
                      return;
                    }
                    if (!subMenuRef.current?.contains(e.target as Node)) {
                      // confirm the event’s target is still inside this submenu;
                      // if the keypress originated elsewhere, we don’t continue so other menus can handle it
                      return;
                    }
                    // Mark this event as handled to prevent parent menus from also processing it
                    nativeEvent.__nestedMenuArrowLeftHandled = true;
                    // preventDefault is needed so the browser doesn’t do its own “arrow left” behavior (like moving the text caret
                    // or changing focus) while the menu is managing the navigation. Without this, the closed submenu or focused item
                    // might jump unexpectedly even though the menu logic is running.
                    e.preventDefault();
                    // stopPropagation stops the event from bubbling up to parent DOM nodes that might also have onKeyDown, which could
                    // otherwise fight the menu’s own logic or trigger duplicate navigation even though we guard with __nestedMenuArrowLeftHandled
                    e.stopPropagation();
                    // stopImmediatePropagation keeps any other keydown handlers registered on this same DOM node from running after ours.
                    // This is preventing all submenus to close when pressing ArrowLeft in a, say, third level menu. With this, ArrowLeft will only
                    // close the current submenu. The __nestedMenuArrowLeftHandled flag only guards against bubbling; this stopImmediatePropagation()
                    // ensures no other handlers wired to the same node interfere once we decide to close and focus.
                    nativeEvent.stopImmediatePropagation();
                    // close the sub menu
                    handleClose();
                    // move focus back to the parent MenuItem, letting the user continue navigation up the menu hierarchy
                    menuItemRef.current?.focus();
                  }
                }}
              >
                {renderedSubMenuItems}
              </MenuList>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};
