import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  InputBase,
  Badge,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Inventory2 as ProductsIcon,
  People as CustomersIcon,
  LocalShipping as SuppliersIcon,
  ShoppingCart as SalesIcon,
  ReceiptLong as PurchaseIcon,
  MoveToInbox as GrnIcon,
  Description as InvoiceIcon,
  BarChart as ReportsIcon,
   AdminPanelSettings,
  Logout as LogoutIcon,
  Search as SearchIcon,
  NotificationsNone as NotificationIcon,
} from "@mui/icons-material";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 250;

// ============================================================
// GET LOGGED-IN USER FROM JWT
// ============================================================

const getLoggedInUser = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      name: "User",
      roleLabel: "Standard User",
      avatar: "U",
    };
  }

  try {
    const tokenPart = token.split(".")[1];

    const base64 = tokenPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 =
      base64 +
      "=".repeat((4 - (base64.length % 4)) % 4);

    const payload = JSON.parse(atob(paddedBase64));

    const role = (payload.role || "user").toLowerCase();

    if (role === "admin") {
      return {
        name: "Admin",
        roleLabel: "Administrator",
        avatar: "A",
      };
    }

    return {
      name: "User",
      roleLabel: "Standard User",
      avatar: "U",
    };
  } catch (error) {
    console.error("Error reading user information:", error);

    return {
      name: "User",
      roleLabel: "Standard User",
      avatar: "U",
    };
  }
};

// ============================================================
// LAYOUT
// ============================================================

function Layout() {
  const navigate = useNavigate();

  const [currentUser] = useState(getLoggedInUser());

  // ============================================================
  // MENU SECTIONS
  // ============================================================

  const menuSections = [
    {
      title: "OVERVIEW",
      items: [
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          path: "/dashboard",
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          text: "Products",
          icon: <ProductsIcon />,
          path: "/products",
        },
        {
          text: "Customers",
          icon: <CustomersIcon />,
          path: "/customers",
        },
        {
          text: "Suppliers",
          icon: <SuppliersIcon />,
          path: "/suppliers",
        },
      ],
    },
    {
      title: "TRANSACTIONS",
      items: [
        {
          text: "Sales Orders",
          icon: <SalesIcon />,
          path: "/sales-orders",
        },
        {
          text: "Purchase Orders",
          icon: <PurchaseIcon />,
          path: "/purchase-orders",
        },
        {
          text: "GRN",
          icon: <GrnIcon />,
          path: "/grn",
        },
        {
          text: "Invoices",
          icon: <InvoiceIcon />,
          path: "/invoices",
        },
      ],
    },
    {
      title: "REPORTING",
      items: [
        {
          text: "Reports",
          icon: <ReportsIcon />,
          path: "/reports",
        },
      ],
    },
  
  
 {
  title: "ADMINISTRATION",
  items: [
    {
      text: "User Management",
      icon: <AdminPanelSettings />,
      path: "/user-management",
    },
  ],
},
];


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ================= NAVBAR ================= */}

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background:
            "linear-gradient(135deg, #0b1220 0%, #0f172a 100%)",
          color: "#f8fafc",
          borderBottom: "1px solid rgba(96,165,250,0.12)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "72px !important",
            px: { xs: 2, md: 3 },
          }}
        >
          {/* Search */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#111827",
              borderRadius: 2,
              px: 1.5,
              width: { xs: 180, sm: 280, md: 360 },
              height: 42,
            }}
          >

            <InputBase
              placeholder="Search..."
              sx={{
                fontSize: 14,
                width: "100%",
                color: "#f8fafc",

                "& input::placeholder": {
                  color: "#94a3b8",
                  opacity: 1,
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications */}

          <IconButton
            sx={{
              mr: 1,
              color: "#475569",
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>

          {/* Profile */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              ml: 1,
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                backgroundColor: "#2563eb",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {currentUser.avatar}
            </Avatar>

            <Box
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#f8fafc",
                  lineHeight: 1.3,
                }}
              >
                {currentUser.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#94a3b8",
                }}
              >
                {currentUser.roleLabel}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            borderRight: "none",
          },
        }}
      >
        {/* Logo */}

        <Box
          sx={{
            height: 72,
            display: "flex",
            alignItems: "center",
            px: 3,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              TechNova
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                color: "#94a3b8",
                letterSpacing: "1.5px",
                mt: 0.2,
              }}
            >
              ERP MANAGEMENT
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}

        <Box
          sx={{
            px: 1.5,
            py: 2,
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          {menuSections.map((section) => (
            <Box
              key={section.title}
              sx={{ mb: 2.5 }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "1.2px",
                  px: 1.5,
                  mb: 0.8,
                }}
              >
                {section.title}
              </Typography>

              <List sx={{ p: 0 }}>
                {section.items.map((item) => (
                  <ListItem
                    key={item.text}
                    disablePadding
                    sx={{ mb: 0.4 }}
                  >
                    <ListItemButton
                      component={NavLink}
                      to={item.path}
                      sx={{
                        minHeight: 44,
                        borderRadius: 2,
                        color: "#cbd5e1",
                        px: 1.5,

                        "& .MuiListItemIcon-root": {
                          color: "#94a3b8",
                          minWidth: 38,
                        },

                        "& .MuiListItemText-primary": {
                          fontSize: 14,
                          fontWeight: 500,
                        },

                        "&.active": {
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          boxShadow:
                            "0 4px 12px rgba(37,99,235,0.25)",
                        },

                        "&.active .MuiListItemIcon-root": {
                          color: "#ffffff",
                        },

                        "&.active .MuiListItemText-primary": {
                          fontWeight: 600,
                        },

                        "&:hover": {
                          backgroundColor:
                            "rgba(255,255,255,0.07)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.text}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Logout */}

        <Box
          sx={{
            px: 1.5,
            pb: 2,
          }}
        >
          <Divider
            sx={{
              borderColor:
                "rgba(255,255,255,0.08)",
              mb: 1,
            }}
          />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 44,
              borderRadius: 2,
              color: "#f87171",
              px: 1.5,

              "& .MuiListItemIcon-root": {
                color: "#f87171",
                minWidth: 38,
              },

              "& .MuiListItemText-primary": {
                fontSize: 14,
                fontWeight: 500,
              },

              "&:hover": {
                backgroundColor:
                  "rgba(239,68,68,0.10)",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>

            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* ================= MAIN CONTENT ================= */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 85% 8%, rgba(59,130,246,0.22), transparent 30%), radial-gradient(circle at 25% 45%, rgba(37,99,235,0.08), transparent 35%), linear-gradient(135deg, #0b1220 0%, #0f172a 50%, #111827 100%)",
          color: "#f8fafc",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "72px !important",
          }}
        />

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;