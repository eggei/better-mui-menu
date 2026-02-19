/**
 * @jest-environment jsdom
 */
/// <reference types="@testing-library/jest-dom" />
import { execFileSync } from 'child_process';
import path from 'path';
import type { ComponentType } from 'react';
import { createElement } from 'react';
import { cleanup, render } from '@testing-library/react';

type BuiltMenuProps = {
  items: unknown[];
  open: boolean;
  anchorEl: null;
  onClose: () => void;
};

const baseProps: BuiltMenuProps = {
  items: [],
  open: false,
  anchorEl: null,
  onClose: () => { },
};

const packageRoot = path.resolve(__dirname, '..');

const renderBuiltMenu = (Menu: ComponentType<BuiltMenuProps>) => {
  render(createElement(Menu, baseProps));
};

describe('dist artifact interop', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders CJS export loaded via require(dist/index.cjs)', () => {
    const cjsModule = jest.requireActual('../dist/index.cjs') as {
      Menu: ComponentType<BuiltMenuProps>;
    };

    expect(() => renderBuiltMenu(cjsModule.Menu)).not.toThrow(/Element type is invalid/i);
  });

  it('renders ESM export loaded via import(dist/index.js)', () => {
    const script = `
      import React from 'react';
      import { renderToString } from 'react-dom/server';
      import { Menu } from './dist/index.js';

      renderToString(
        React.createElement(Menu, {
          items: [],
          open: false,
          anchorEl: null,
          onClose: () => {},
        })
      );
    `;

    expect(() => {
      execFileSync(process.execPath, ['--input-type=module', '-e', script], {
        cwd: packageRoot,
        stdio: 'pipe',
      });
    }).not.toThrow(/Element type is invalid/i);
  });
});
