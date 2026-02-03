import type { FC, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { Children, cloneElement, isValidElement, useCallback, useId, useRef, useState } from 'react';
import Fade from '@mui/material/Fade';
import type { MenuItemProps } from '@mui/material/MenuItem';
import MuiMenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import type { SvgIconComponent } from '@mui/icons-material';
import { MenuList, Paper, Popper, Typography } from '@mui/material';
import type { MenuItem } from './types';
import { MenuItemContent, transitionConfig } from './common';

type NestedMenuItemProps = MenuItemProps & {
  label: ReactNode;
  startIcon?: SvgIconComponent;
  endIcon?: SvgIconComponent;
  parentMenuClose: () => void;
  children?: ReactNode;
  items?: MenuItem[];
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
    endIcon: _,
    ...menuItemProps
  } = props;
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(subMenuAnchorEl);
  const menuItemRef = useRef<HTMLLIElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const menuItemId = providedId ?? `nested-menu-trigger-${generatedId}`;
  const subMenuId = `${menuItemId}-submenu`;

  const handleOpen = (event: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setSubMenuAnchorEl(null);
  }, []);

  const renderChildren = Children.map(children, child => {
    if (!isValidElement(child)) return child;

    // Ensure we only process MUI MenuItem children
    if (child.type === MuiMenuItem) {
      const childOnClick = (child.props as MenuItemProps).onClick;
      // Merge any user-defined click logic with the submenu closing behavior.
      const clonedOnClick = (event: MouseEvent<HTMLLIElement>) => {
        childOnClick?.(event);
        handleClose(); // Close the submenu
        parentMenuClose();
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
          />
        );
      }

      const handleItemClick = (event: MouseEvent<HTMLLIElement>) => {
        onClick?.(event);
        handleClose();
        parentMenuClose();
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
          // TODO(ege): There can be a timeout here before we execute closing to improve UX - in case user is not very precise with mouse.
          if (isNodeInstance(e.relatedTarget) && subMenuRef.current?.contains(e.relatedTarget)) return;
          // If the cursor leaves to anywhere else, close the submenu.
          handleClose();
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
          <Typography sx={{ flex: 1 }}>{label}</Typography>
          <ArrowRightIcon />
        </MenuItemContent>
      </MuiMenuItem>

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
        onMouseLeave={e => {
          // CRITICAL FEATURE:
          // Checking whether cursor left the submenu onto the related trigger item. If so, do not close.
          // TODO(ege): There can be a timeout here before we execute closing to improve UX - in case user is not very precise with mouse.
          if (isNodeInstance(e.relatedTarget) && menuItemRef.current?.contains(e.relatedTarget)) return;
          // If the cursor leaves to anywhere else, close the submenu.
          handleClose();
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={transitionConfig.timeout}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 1,
                bgcolor: 'background.default',
              }}
            >
              <MenuList
                autoFocusItem
                id={subMenuId}
                aria-labelledby={menuItemId}
                role='menu'
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
                    e.preventDefault();
                    e.stopPropagation();
                    // immediately halt any other listeners so we have exclusive control now
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
