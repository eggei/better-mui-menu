import { Menu, MenuProps, Typography } from '@mui/material'

export type CustomMenuProps = MenuProps & {
  variant?: 'default' | 'dense'
}

export function CustomMenu({
  ...props
}: CustomMenuProps) {
  return (
    <Typography variant='h1'>Better MUI Menu</Typography>
  )
}