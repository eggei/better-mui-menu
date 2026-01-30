import { Menu, MenuProps } from '@mui/material'

export type CustomMenuProps = MenuProps & {
  variant?: 'default' | 'dense'
}

export function CustomMenu({
  ...props
}: CustomMenuProps) {
  return (
    <Menu
      {...props}
    />
  )
}