# better-mui-menu
<<<<<<< Updated upstream
`better-mui-menu` is a tiny npm workspace that houses a reusable Material UI-based multilevel menu together with a minimal Vite demo that lets you visualize changes instantly.

## Repository layout
- `package/better-mui-menu` – the library package, authored in TypeScript, bundled with `tsup`, and exported for both ESM and CommonJS consumers. It exposes the `<MultiLevelMenu />` component plus the `MultiLevelMenuItem` type.
=======

`better-mui-menu` is a tiny npm workspace that houses a reusable Material UI-based multilevel menu together with a minimal Vite demo that lets you visualize changes.

## Repository layout

- `package/better-mui-menu` – the library package, authored in TypeScript, bundled with `tsup`, and exported for both ESM and CommonJS consumers. It exposes the `<Menu />` component plus the `MenuItem` type.
>>>>>>> Stashed changes
- `app/demo` – a Vite + React 19 preview application that consumes the local package via the `file:../../package/better-mui-menu` dependency.

## Getting started
1. Run `npm install` in the repository root so npm links the workspaces and installs all dependencies.
2. Use `npm run dev:lib` to keep the library bundle in sync as you edit the source.
3. Run `npm run dev:demo` to start the Vite dev server and interact with the menu in a browser. Rebuilding the library automatically updates the demo if both servers run together.

## Handy scripts
- `npm run dev:lib` – watches `package/better-mui-menu` with `tsup --watch`.
- `npm run dev:demo` – launches the Vite dev server located in `app/demo`.
- `npm --workspace package/better-mui-menu run build` – creates production-ready bundles in `package/better-mui-menu/dist`.
- `npm --workspace package/better-mui-menu run test` – runs the Jest suite for the component.
- `npm --workspace app/demo run build` – compiles the demo for production and outputs to `app/demo/dist`.
- `npm --workspace app/demo run preview` – serves the production build locally for verification.

## Notes
- The demo reads the library via a local workspace reference. After making changes to `package/better-mui-menu`, keep its build output fresh before reloading the demo (either by rerunning `npm run dev:lib` or manually running the build script).
- Library-specific documentation lives in `package/better-mui-menu/README.md` (API, props, installation, and workflow tips). The demo also carries guidance in `app/demo/README.md`.
