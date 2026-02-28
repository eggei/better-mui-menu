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

const menuItems: MenuItem[] = [
  {
    type: "header",
    label: "Clipboard",
  },
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
    type: "divider",
  },
  {
    type: "header",
    label: "Advanced",
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack p={4} maxWidth={640} gap={2} margin="0 auto">
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
          <Stack sx={{ borderRadius: 1, p: 2, backgroundColor: blueGrey[100] }}>
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Button
                id="icon-menu-button"
                aria-controls={anchorEl ? "icon-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={anchorEl ? "true" : undefined}
                onClick={handleClick}
                variant="contained"
                startIcon={<AccessibilityNewRounded />}
                color="inherit"
              >
                Menu
              </Button>

              <Menu
                items={menuItems}
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}
                sx={{ mt: 1 }}
              />
            </Box>
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
