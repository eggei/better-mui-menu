# better-mui-menu

[![CI](https://github.com/eggei/better-mui-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/eggei/better-mui-menu/actions/workflows/ci.yml) [![Security](https://github.com/eggei/better-mui-menu/actions/workflows/security.yml/badge.svg)](https://github.com/eggei/better-mui-menu/actions/workflows/security.yml) [![coverage](https://codecov.io/gh/eggei/better-mui-menu/branch/main/graph/badge.svg)](https://codecov.io/gh/eggei/better-mui-menu) [![npm version](https://img.shields.io/npm/v/better-mui-menu.svg?color=brightgreen)](https://www.npmjs.com/package/better-mui-menu) [![npm downloads](https://img.shields.io/npm/dt/better-mui-menu.svg?color=informational)](https://www.npmjs.com/package/better-mui-menu) [![License: MIT](https://img.shields.io/npm/l/better-mui-menu.svg)](https://opensource.org/licenses/MIT)

`better-mui-menu` is a zero-dependency wrapper for Material UI Menu to support nested menus and full keyboard accessibility with **proper focus management**.

## Live demo

[![Edit better-mui-menu-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/9j2z7n)

[Edit in StackBlitz](https://stackblitz.com/edit/vitejs-vite-autejxh8?embed=1&file=src%2FMenuDemo.tsx&view=preview)

![Menu demo preview](./app/demo/assets/bmm-demo.gif)

## Features

- **Excellent Keyboard Navigation for Accessibility** – navigate with arrow keys, open submenus with right arrow or Enter, close them with left arrow or Escape, and have the menu stack stay in sync with focus.
- **Unlimited nesting** – describe every submenu with an `items` array and `better-mui-menu` renders `NestedMenuItem` poppers that stay synchronized with their parents.
- **Customizable** – style your menu and menu items using MUI's Menu and MenuItem props.
- **Data-driven API** – you keep work in a single `MenuItem[]` list; leaves, dividers, and nested branches all live alongside each other.

## Installation

```bash
(yarn | npm | pnpm) install better-mui-menu
```

Since the component renders Material UI primitives, also install the peer dependencies:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

## Usage

```tsx
import { Menu, type MenuItem } from 'better-mui-menu'

const menuItems: MenuItem[] = [
  {
    id: 'save',
    label: 'Save',
    startIcon: Save,
    onClick: () => console.log('Save action'),
  },
  { type: 'divider' },
  {
    label: (
      <Stack>
        Cloud actions
        <Typography variant="caption" color="text.secondary">
          Requires internet connection
        </Typography>
      </Stack>
    ),
    startIcon: <Cloud fontSize='small' sx={{ ml: 0.5 }} />,
    items: [
      { label: 'Upload', onClick: () => console.log('Upload') },
      { label: 'Download', onClick: () => console.log('Download') },
    ],
  },
]

export function FileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  return (
    <>
      <Button variant="contained" onClick={event => setAnchorEl(event.currentTarget)}>
        Open file menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        items={menuItems}
      />
    </>
  )
}
```

## MenuItem Reference

`MenuItem` extends `@mui/material/MenuItemProps` (excluding `children`) so you can still pass `disabled`, `sx`, `aria-*`, `data-*`, etc.

| Field | Applies to | Type / values | Required | Default | Notes |
| --- | --- | --- | --- | --- | --- |
| `type` | all entries | `'item' \| 'divider' \| 'header'` | no | `'item'` | Use `'divider'` for separators, `'header'` for section labels. |
| `id` | `'item'` | string | no | auto-generated | Used for stable ARIA/menu item IDs. |
| `label` | `'item'`, `'header'` | text or JSX | yes (`'item'`, `'header'`) | none | Not used for `'divider'`. |
| `startIcon` | `'item'` | MUI Icon or JSX | no | none | Example: `Save` or `<Save fontSize='small' />`. |
| `endIcon` | `'item'` | MUI Icon or JSX | no | none | For submenu triggers, a right-arrow icon is shown when omitted. |
| `items` | `'item'` | `MenuItem[]` | no | none | If present and non-empty, renders a nested submenu. |
| `onClick` | `'item'` | function | no | none | Runs on leaf item click; menu stack closes afterward. |
| `...MenuItemProps` | `'item'` | MUI `MenuItem` props (except `children`, `type`) | no | MUI defaults | Example: `disabled`, `dense`, `selected`, `data-*`. |
