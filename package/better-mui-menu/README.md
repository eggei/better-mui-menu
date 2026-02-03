# A Better MUI Material UI Menu

A plain Material UI (MUI) `Menu` with added features (keyboard navigation, nested submenus) designed to drop into an existing MUI project, inherit your theme, and improve accessibility.

## Installation

```bash
npm i better-mui-menu
# or
npm install better-mui-menu
# or
yarn add better-mui-menu
# or
pnpm add better-mui-menu
```

## Who should use this?

Use this if:

- You discovered the default MUI menu behavior isn’t meeting your keyboard navigation / accessibility needs.
- You need nested menus (submenus) and want them to work reliably.
- You want a menu that “just works” in an MUI app, using your existing theme.

## Usage

### Minimal example

```tsx
import Menu, { type MenuItem } from 'better-mui-menu'
import { useRef, useState } from 'react'
import { Button } from '@mui/material'

const items: MenuItem[] = [
  { label: 'Cut', onClick: () => console.log('Cut') },
  { label: 'Delete', onClick: () => console.log('Delete') },
  { type: 'divider' },
  { label: 'Other', items: [{ label: 'Nested', onClick: () => console.log('Nested') }] }, // Nested menu
]

export default function Example() {
  const anchorRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button ref={anchorRef} variant="contained" onClick={() => setOpen(true)}>
        Open Menu
      </Button>

      <Menu
        items={items}
        anchorRef={anchorRef}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
```

## Items shape

```ts
import type { MenuItem } from 'better-mui-menu'

// Each menu item is extended from MUI's MenuItemProps, so you can use any prop from there as well.
const items: MenuItem[] = [
  {
    label: 'Action item',
    onClick: () => {},
    'aria-selected': selected ? 'true' : 'false',
  },
  {
    label: 'Item with submenu',
    items: [
      { label: 'Nested action', onClick: () => {} },
      { type: 'divider' },
      { label: 'Another nested action', onClick: () => {} },
    ],
  },
  { type: 'divider' },
  {
    label: 'Disabled item',
    disabled: true,
    onClick: () => {},
  },
]
```

## Why?

I realized that it is a big pain creating a menu with nested menus, and making it keyboard accessible for an accessible product.

I wasn't liking the -very few- existing solutions out there. They were either not handling things properly or too much opinionated interface that I needed to learn about.

So, I decided to share this menu component which has no extra styling, nor so much new interface to learn about. Just drop it in your MUI project, it will pick up your theme, and use it with ease knowing that it is accessible and works well.
