/**
 * @jest-environment jsdom
 */
/// <reference types="@testing-library/jest-dom" />
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { SvgIconComponent } from '@mui/icons-material';
import { MenuEntry } from './MenuEntry';

const StartIcon = (() => <svg data-testid='start-icon' />) as unknown as SvgIconComponent;
const EndIcon = (() => <svg data-testid='end-icon' />) as unknown as SvgIconComponent;

describe('MenuEntry', () => {
  it('renders the menu item label without icons by default', () => {
    render(<MenuEntry label='Copy' />);

    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();
  });

  it('renders start and end icons when provided', () => {
    render(<MenuEntry label='Copy' startIcon={StartIcon} endIcon={EndIcon} />);

    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('renders JSX icon elements with custom props', () => {
    render(
      <MenuEntry
        label='Copy'
        startIcon={<svg data-testid='start-icon-element' data-size='large' style={{ marginLeft: 4 }} />}
        endIcon={<svg data-testid='end-icon-element' aria-label='end icon' />}
      />
    );

    const startIconElement = screen.getByTestId('start-icon-element');
    const endIconElement = screen.getByTestId('end-icon-element');
    expect(startIconElement).toHaveAttribute('data-size', 'large');
    expect(startIconElement).toHaveStyle({ marginLeft: '4px' });
    expect(endIconElement).toHaveAttribute('aria-label', 'end icon');
  });

  it('forwards ref to the underlying li element', () => {
    const ref = createRef<HTMLLIElement>();

    render(<MenuEntry ref={ref} label='Ref target' />);

    const menuItem = screen.getByRole('menuitem', { name: 'Ref target' });
    expect(ref.current).toBe(menuItem);
    expect(ref.current?.tagName).toBe('LI');
  });

  it('invokes onClick when clicked', () => {
    const onClick = jest.fn();
    render(<MenuEntry label='Trigger click' onClick={onClick} />);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Trigger click' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
