# better-mui-menu

`better-mui-menu` is a tiny component library that supplies a keyboard- and mouse-friendly Material UI menu with unlimited nesting depth. It wraps `@mui/material/Menu` + `Popper` + `Fade` and exposes a simple data-driven API so that a single `items` array can render both leaves and nested submenus.

## Installation

```bash
npm install better-mui-menu
```

Because the package delegates rendering to Material UI, make sure the runtime peers are installed as well:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

The icons dependency is only required when you pass `startIcon`/`endIcon`, but it is part of the peer dependency list so that consumers can supply Material icons without additional typings setup.

## Usage

```tsx
import { useState } from 'react'
import Button from '@mui/material/Button'
import Cloud from '@mui/icons-material/Cloud'
import Save from '@mui/icons-material/Save'
import { MultiLevelMenu, type MultiLevelMenuItem } from 'better-mui-menu'

const menuItems: MultiLevelMenuItem[] = [
  {
    id: 'save',
    label: 'Save',
    startIcon: Save,
    onClick: () => {
      console.log('Save action')
    },
  },
  {
    type: 'divider',
  },
  {
    label: 'Cloud actions',
    startIcon: Cloud,
    items: [
      {
        label: 'Upload',
        onClick: () => console.log('Upload'),
      },
      {
        label: 'Download',
        onClick: () => console.log('Download'),
      },
    ],
  },
]

export function FileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  return (
    <>
      <Button variant='contained' onClick={event => setAnchorEl(event.currentTarget)}>
        Open file menu
      </Button>
      <MultiLevelMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        items={menuItems}
      />
    </>
  )
}
```

## API

### `MultiLevelMenu` props

- `anchorEl: HTMLElement | null` – the anchor element that the root menu positions itself against.
- `open: boolean` – controlled open state of the root menu.
- `onClose: () => void` – invoked whenever the menu should close (overlay click, Escape, item selection).
- `items: MultiLevelMenuItem[]` – the array that drives both leaf menu items and nested branches.

### `MultiLevelMenuItem`

`MultiLevelMenuItem` extends `@mui/material/MenuItemProps` (excluding `children`) so you can pass `disabled`, `dense`, `divider`, etc. The shape adds a few helpers:

- `type?: 'item' | 'divider'` – set `'divider'` to render a `Divider` instead of a `MenuItem`.
- `id?: string` – optional string used for ARIA attributes; a stable ID is generated automatically when omitted.
- `label: ReactNode` – the text or custom node shown inside the menu entry.
- `startIcon?: SvgIconComponent`, `endIcon?: SvgIconComponent` – render Material icons before/after the label using the shared `MenuItemContent` layout.
- `items?: MultiLevelMenuItem[]` – nested descriptors that render as a submenu via `NestedMenuItem`.
- `onClick?: MenuItemProps['onClick']` – clicking a leaf entry automatically propagates the handler and closes the entire menu stack.

## Interactions & accessibility

- Nested menus appear in a `Popper` placed `right-start` from the parent trigger and use a shared fade transition (`transitionConfig`).
- Mouse hover keeps submenus open while the cursor travels between a trigger and its nested popper; moving away closes the submenu.
- Keyboard navigation supports `ArrowRight`/`Enter`/`Space` to open children, `ArrowLeft` to close, `ArrowUp`/`ArrowDown` to move between entries, and `Escape` to dismiss everything. The component wires the necessary `aria-haspopup`, `aria-controls`, `aria-expanded`, and `aria-labelledby` attributes so that screen readers describe the menu hierarchy.

## Development

All development happens under `package/better-mui-menu`:

- `npm run dev` – runs `tsup --watch` to rebuild `src` into `dist`.
- `npm run build` – creates production bundles ready for publication.
- `npm run test` – executes the Jest suite defined in `src/MultiLevelMenu/MultiLevelMenu.test.tsx`.

The root workspace exposes `npm run dev:lib` and `npm run dev:demo` to simultaneously rebuild the library and power the demo app. When you change the menu source, keep `npm run dev` (or `npm run build`) running before refreshing the demo because the Vite app imports the library via its `file:` workspace link.

## Demo

`app/demo` is a Vite + React 19 application that consumes the built package. From the repository root run:

```bash
npm run dev:demo
```

Check `app/demo/README.md` for more Vite-specific guidance.
