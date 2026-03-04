import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Menu, type MenuItem } from "better-mui-menu";
import { useState } from "react";
import {
  AccessibilityNewRounded,
  ArrowForward,
  CloudOutlined,
  ContentCopy,
  ContentPaste,
  DeleteOutlined,
  Google,
  Storage,
} from "@mui/icons-material";
import { blue, blueGrey } from "@mui/material/colors";

const theme = createTheme();
const macOSMenuTheme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          minWidth: 300,
          color: "rgba(242, 247, 249, 0.95)",
          backgroundColor: "rgba(52, 65, 72, 0.72)",
          backgroundImage: "linear-gradient(180deg, rgba(80, 96, 105, 0.32) 0%, rgba(39, 50, 56, 0.72) 100%)",
          border: "1px solid rgba(226, 236, 241, 0.25)",
          borderRadius: 18,
          boxShadow: "0 24px 48px rgba(7, 18, 25, 0.38)",
          backdropFilter: "saturate(130%) blur(14px)",
        },
        list: {
          padding: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 38,
          borderRadius: 11,
          color: "rgba(238, 245, 249, 0.9)",
          paddingInline: 12,
          transition: "background-color 120ms ease, color 120ms ease",
          "& .macos-shortcut": {
            marginLeft: "auto",
            opacity: 0.6,
            letterSpacing: 0.6,
            fontSize: "0.95rem",
          },
          "&:hover, &.Mui-focusVisible": {
            backgroundColor: "rgba(54, 138, 255, 0.95)",
            color: "#fff",
            "& .macos-shortcut": {
              opacity: 0.95,
            },
          },
          "&.Mui-disabled": {
            color: "rgba(238, 245, 249, 0.38)",
            "& .macos-shortcut": {
              opacity: 0.35,
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(220, 232, 238, 0.24)",
          margin: "6px 10px",
        },
      },
    },
  },
});

const menuItems: MenuItem[] = [
  {
    label: "Copy",
    startIcon: ContentCopy,
  },
  {
    label: "Paste",
    startIcon: ContentPaste,
    "aria-label": "Paste",
    "data-testid": "paste-menu-item",
  },
  {
    label: "Colored via props",
    sx: { color: "error.main" },
    "aria-label": "Delete",
    startIcon: DeleteOutlined,
  },
  {
    type: "divider",
  },
  {
    label: (
      <Stack width="fit-content">
        Web Clipboard
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textWrap: "auto", maxWidth: 200 }}
        >
          This is an example of a menu item with a secondary text.
        </Typography>
      </Stack>
    ),
    startIcon: CloudOutlined,
    items: [
      {
        label: "Google Cloud",
        startIcon: Google,
      },
      {
        label: "Azure Clipboard",
        startIcon: CloudOutlined,
      },
      {
        label: "Local Storage",
        startIcon: Storage,
      },
    ],
  },
  {
    type: "header",
    label: "Category Header Support",
  },
  {
    label: "Disabled submenu (keyboard edge case)",
    startIcon: DeleteOutlined,
    items: [
      {
        label: "Disabled action 1",
        disabled: true,
      },
      {
        label: "Disabled action 2",
        disabled: true,
      },
      {
        label: "Disabled action 3",
        disabled: true,
      },
    ],
  },
  {
    label: "Using custom icons and styles",
    startIcon: (
      <AccessibilityNewRounded
        color="primary"
        sx={{ backgroundColor: blue[50], borderRadius: "50%" }}
      />
    ),
    endIcon: ArrowForward,
    sx: { fontFamily: "cursive" },
    items: [
      {
        label: "Google Cloud",
        startIcon: Google,
      },
      {
        label: "Azure Clipboard",
        startIcon: CloudOutlined,
        items: [
          {
            type: "header",
            label: (
              <Typography
                variant="overline"
                sx={{
                  color: blue[700],
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  px: 0.5,
                }}
              >
                Category Header (JSX)
              </Typography>
            )
          },
          {
            label: "Google Cloud",
            startIcon: Google,
          },
          {
            label: "Azure Clipboard",
            startIcon: CloudOutlined,
          },
          {
            label: (
              <Stack>
                Local Storage
                <Typography variant="caption" color="text.secondary">
                  Save your clipboard to your browser's local storage.
                </Typography>
              </Stack>
            ),
            startIcon: Storage,
          },
        ],
      },
      {
        label: "Local Storage",
        startIcon: Storage,
      },
    ],
  },
];
const macOSMenuItems: MenuItem[] = [
  {
    label: "Undo Rename",
    startIcon: ArrowForward,
    endIcon: (
      <Typography component="span" className="macos-shortcut">
        ⌘Z
      </Typography>
    ),
  },
  {
    label: "Redo",
    startIcon: ArrowForward,
    disabled: true,
    endIcon: (
      <Typography component="span" className="macos-shortcut">
        ⇧⌘Z
      </Typography>
    ),
  },
  {
    label: "Show Clipboard",
    startIcon: Storage,
  },
  {
    label: "Writing Tools",
    startIcon: CloudOutlined,
    items: [
      {
        label: "Rewrite",
        startIcon: Google,
        items: [
          {
            label: "Professional",
            startIcon: Storage,
          },
          {
            label: "Friendly",
            startIcon: Storage,
          },
        ],
      },
      {
        label: "Proofread",
        startIcon: AccessibilityNewRounded,
      },
    ],
  },
  {
    label: "Start Dictation...",
    startIcon: AccessibilityNewRounded,
  },
  {
    label: "Services (all unavailable)",
    startIcon: CloudOutlined,
    items: [
      {
        label: "Translate Selection",
        disabled: true,
      },
      {
        label: "Summarize Selection",
        disabled: true,
      },
      {
        label: "Append to Notes",
        disabled: true,
      },
    ],
  },
  {
    label: "Emoji & Symbols",
    startIcon: AccessibilityNewRounded,
    endIcon: (
      <Typography component="span" className="macos-shortcut">
        ⌃⌘Space
      </Typography>
    ),
  },
];

const simpleUsageSnippet = String.raw`const items = [
  { type: 'header', label: 'Actions' },
  { label: 'Cut', onClick: () => console.log('Cut') },
  { label: 'Delete', onClick: () => console.log('Delete') },
  { type: 'divider' },
  { label: 'Other', items: [{...}] }, <-- Nested Menu
]

<Menu
  items={items}
  anchorRef={anchorRef}
  open={Boolean(anchorRef)}
  onClose={handleClose}
/>`;

function App() {
  const [defaultMenuAnchorEl, setDefaultMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [macMenuAnchorEl, setMacMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleDefaultMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDefaultMenuAnchorEl(event.currentTarget);
  };

  const handleDefaultMenuClose = () => {
    setDefaultMenuAnchorEl(null);
  };

  const handleMacMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMacMenuAnchorEl(event.currentTarget);
  };

  const handleMacMenuClose = () => {
    setMacMenuAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack p={4} maxWidth={1200} gap={2} margin="0 auto">
        <Box>
          <Typography variant="h5" gutterBottom>
            better-mui-menu
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            A data-driven MUI Menu implementation with submenu, keyboard
            navigation. Created accessibility in mind.
          </Typography>

          <Stack direction="row" alignItems="center" gap={1}>
            <Typography
              variant="caption"
              sx={{
                p: 1,
                backgroundColor: blueGrey[100],
                color: blueGrey[800],
                borderRadius: 1,
              }}
            >
              npm i better-mui-menu
            </Typography>
            {/* Add a copy text button with a copy icon in MUI icon button */}
            <IconButton
              size="small"
              aria-label="copy"
              onClick={() => {
                navigator.clipboard.writeText("npm install better-mui-menu");
              }}
            >
              <ContentCopy />
            </IconButton>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Try it out
          </Typography>
          <Stack sx={{ borderRadius: 1, p: 2, backgroundColor: blueGrey[100] }} gap={2}>
            <Stack direction={{ xs: "column", md: "row" }} flexWrap="wrap" gap={2}>
              <Box sx={{ flex: 1, borderRadius: 1, p: 2, backgroundColor: "common.white" }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Default Theme
                </Typography>
                <Box
                  sx={{ width: "100%", display: "flex", justifyContent: "center" }}
                >
                  <Button
                    id="default-menu-button"
                    aria-controls={defaultMenuAnchorEl ? "default-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={defaultMenuAnchorEl ? "true" : undefined}
                    onClick={handleDefaultMenuOpen}
                    variant="contained"
                    startIcon={<AccessibilityNewRounded />}
                    color="inherit"
                  >
                    Menu
                  </Button>

                  <Menu
                    items={menuItems}
                    anchorEl={defaultMenuAnchorEl}
                    onClose={handleDefaultMenuClose}
                    open={Boolean(defaultMenuAnchorEl)}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <ThemeProvider theme={macOSMenuTheme}>
                <Box
                  sx={{
                    flex: 1,
                    minWidth: { md: 330 },
                    borderRadius: 2,
                    p: 2,
                    border: "1px solid rgba(194, 214, 228, 0.45)",
                    backgroundImage:
                      "linear-gradient(180deg, rgba(195, 212, 226, 0.48) 0%, rgba(114, 141, 165, 0.52) 50%, rgba(73, 102, 124, 0.62) 100%)",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Customizability through style overrides - macOS style dropdown menu
                  </Typography>
                  <Box
                    sx={{ width: "100%", display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      id="mac-menu-button"
                      aria-controls={macMenuAnchorEl ? "mac-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={macMenuAnchorEl ? "true" : undefined}
                      onClick={handleMacMenuOpen}
                      variant="contained"
                      color="inherit"
                    >
                      Edit
                    </Button>

                    <Menu
                      items={macOSMenuItems}
                      anchorEl={macMenuAnchorEl}
                      onClose={handleMacMenuClose}
                      open={Boolean(macMenuAnchorEl)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </ThemeProvider>
            </Stack>
          </Stack>

          <Typography variant="body2" gutterBottom alignSelf="flex-end">
            View demo source for items data structure{" "}
            <Link
              href="https://github.com/eggei/better-mui-menu/blob/main/app/demo/src/App.tsx"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Simple Usage
          </Typography>
          <Box
            component="pre"
            sx={{
              fontFamily: "Monospace",
              backgroundColor: blueGrey[100],
              color: blueGrey[800],
              borderRadius: 1,
              p: 1,
              mt: 1,
              fontSize: "0.85rem",
              lineHeight: 1.5,
              overflow: "auto",
            }}
          >
            {simpleUsageSnippet}
          </Box>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
