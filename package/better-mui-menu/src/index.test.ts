/**
 * @jest-environment jsdom
 */
import { Menu as BarrelMenu } from './index';
import { Menu as DirectMenu } from './Menu';
import type { MenuItem as BarrelMenuItem } from './index';
import type { MenuItem as DirectMenuItem } from './Menu/types';

type IsEqual<A, B> = (
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false
);
type Assert<T extends true> = T;
type MenuItemTypeExportIsStable = Assert<IsEqual<BarrelMenuItem, DirectMenuItem>>;

/*
 If these tests are ever failing, it is likely you have a BREAKING CHANGE in the current version.
 Make sure to bump major version in package.json.
*/
describe('package barrel exports', () => {
  it('re-exports Menu from ./Menu', () => {
    expect(BarrelMenu).toBe(DirectMenu);
  });

  it('re-exports MenuItem type from ./Menu/types', () => {
    const typeExportIsStable: MenuItemTypeExportIsStable = true;
    expect(typeExportIsStable).toBe(true);
  });
});
