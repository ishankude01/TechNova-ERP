import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  People,
  Search,
  EmailOutlined,
  Phone,
  LocationOn,
} from "@mui/icons-material";

import api from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openAddDialog, setOpenAddDialog] =
    useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [openEditDialog, setOpenEditDialog] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);

  const [deletingCustomer, setDeletingCustomer] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [notification, setNotification] =
    useState({
      open: false,
      message: "",
      severity: "success",
    });

  // ============================================================
  // FETCH
  // ============================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(
        response.data.customers || []
      );
    } catch (error) {
      console.error(
        "Error fetching customers:",
        error
      );

      showNotification(
        error.response?.data?.message ||
          "Failed to load customers.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ============================================================
  // NOTIFICATION
  // ============================================================

  const showNotification = (
    message,
    severity = "success"
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const closeNotification = () => {
    setNotification((previous) => ({
      ...previous,
      open: false,
    }));
  };

  // ============================================================
  // ADD
  // ============================================================

  const handleOpenAddDialog = () => {
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    if (!saving) {
      setOpenAddDialog(false);
    }
  };

  const handleNewCustomerChange = (
    event
  ) => {
    setNewCustomer({
      ...newCustomer,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleAddCustomer = async () => {
    if (
      !newCustomer.name.trim() ||
      !newCustomer.email.trim() ||
      !newCustomer.phone.trim() ||
      !newCustomer.address.trim()
    ) {
      showNotification(
        "Please fill in all customer fields.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await api.post(
        "/customers",
        {
          name: newCustomer.name.trim(),
          email: newCustomer.email.trim(),
          phone: newCustomer.phone.trim(),
          address: newCustomer.address.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(
        (currentCustomers) => [
          ...currentCustomers,
          response.data.customer,
        ]
      );

      setOpenAddDialog(false);

      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      showNotification(
        "Customer added successfully!"
      );
    } catch (error) {
      console.error(
        "Error adding customer:",
        error
      );

      showNotification(
        error.response?.data?.message ||
          "Failed to add customer.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleOpenEditDialog = (
    customer
  ) => {
    setEditingCustomer({
      _id: customer._id,
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });

    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    if (!saving) {
      setOpenEditDialog(false);
      setEditingCustomer(null);
    }
  };

  const handleEditingCustomerChange = (
    event
  ) => {
    setEditingCustomer({
      ...editingCustomer,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;

    if (
      !editingCustomer.name.trim() ||
      !editingCustomer.email.trim() ||
      !editingCustomer.phone.trim() ||
      !editingCustomer.address.trim()
    ) {
      showNotification(
        "Please fill in all customer fields.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await api.put(
        `/customers/${editingCustomer._id}`,
        {
          name:
            editingCustomer.name.trim(),
          email:
            editingCustomer.email.trim(),
          phone:
            editingCustomer.phone.trim(),
          address:
            editingCustomer.address.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(
        (currentCustomers) =>
          currentCustomers.map(
            (customer) =>
              customer._id ===
              editingCustomer._id
                ? response.data.customer
                : customer
          )
      );

      setOpenEditDialog(false);
      setEditingCustomer(null);

      showNotification(
        "Customer updated successfully!"
      );
    } catch (error) {
      console.error(
        "Error updating customer:",
        error
      );

      showNotification(
        error.response?.data?.message ||
          "Failed to update customer.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleOpenDeleteDialog = (
    customer
  ) => {
    setDeletingCustomer(customer);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!saving) {
      setOpenDeleteDialog(false);
      setDeletingCustomer(null);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      await api.delete(
        `/customers/${deletingCustomer._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(
        (currentCustomers) =>
          currentCustomers.filter(
            (customer) =>
              customer._id !==
              deletingCustomer._id
          )
      );

      setOpenDeleteDialog(false);
      setDeletingCustomer(null);

      showNotification(
        "Customer deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Error deleting customer:",
        error
      );

      showNotification(
        error.response?.data?.message ||
          "Failed to delete customer.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredCustomers =
    customers.filter((customer) => {
      const searchText =
        search.toLowerCase();

      return (
        (customer.name || "")
          .toLowerCase()
          .includes(searchText) ||
        (customer.email || "")
          .toLowerCase()
          .includes(searchText) ||
        (customer.phone || "")
          .toLowerCase()
          .includes(searchText) ||
        (customer.address || "")
          .toLowerCase()
          .includes(searchText)
      );
    });

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.length;

  // ============================================================
  // UI
  // ============================================================

  return (
    <Box
      sx={{
        position: "relative",
        minHeight:
          "calc(100vh - 76px)",
        overflow: "hidden",
      }}
    >
      <AtmosphericGlow />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 25,
                  md: 29,
                },
                fontWeight: 750,
                color: "#f8fafc",
                letterSpacing:
                  "-0.6px",
              }}
            >
              Customers
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 0.7,
                mt: 0.6,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                Home
              </Typography>

              <Typography
                sx={{
                  color: "#475569",
                  fontSize: 12,
                }}
              >
                ›
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#94a3b8",
                  fontWeight: 600,
                }}
              >
                Customers
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={
              handleOpenAddDialog
            }
            sx={primaryButtonStyles}
          >
            Add Customer
          </Button>
        </Box>

        {/* SUMMARY */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <SummaryCard
            title="Total customers"
            value={totalCustomers}
            subtitle="Customers in directory"
            icon={<People />}
            iconColor="#60a5fa"
            iconBg="rgba(59,130,246,0.12)"
          />

          <SummaryCard
            title="Active customers"
            value={activeCustomers}
            subtitle="Currently registered"
            icon={<People />}
            iconColor="#4ade80"
            iconBg="rgba(34,197,94,0.12)"
          />
        </Box>

        {/* SEARCH */}

        <Box
          sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 2,
            backgroundColor:
              "rgba(23,29,41,0.92)",
            border:
              "1px solid rgba(255,255,255,0.06)",
            backdropFilter:
              "blur(10px)",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search customers by name, email, phone or address..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            sx={searchFieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "#64748b",
                      fontSize: 19,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* TABLE */}

        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border:
              "1px solid rgba(255,255,255,0.06)",
            backgroundColor:
              "rgba(23,29,41,0.96)",
            boxShadow:
              "0 18px 45px rgba(2,6,23,0.18)",
          }}
        >
          <Box
            sx={{
              display: {
                xs: "none",
                lg: "grid",
              },
              gridTemplateColumns:
                "1.4fr 1.6fr 1.1fr 1.4fr 0.8fr 100px",
              gap: 1,
              px: 2,
              py: 1.5,
              background:
                "linear-gradient(90deg, #131b2a, #17243b)",
            }}
          >
            <TableHeader>CUSTOMER</TableHeader>
            <TableHeader>EMAIL</TableHeader>
            <TableHeader>PHONE</TableHeader>
            <TableHeader>ADDRESS</TableHeader>
            <TableHeader>STATUS</TableHeader>
            <TableHeader align="right">
              ACTIONS
            </TableHeader>
          </Box>

          {loading ? (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
              }}
            >
              <CircularProgress
                sx={{
                  color: "#3b82f6",
                }}
              />
            </Box>
          ) : filteredCustomers.length ===
            0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <People
                sx={{
                  fontSize: 48,
                  color: "#334155",
                  mb: 1.5,
                }}
              />

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 14,
                }}
              >
                No customers found
              </Typography>
            </Box>
          ) : (
            filteredCustomers.map(
              (customer) => (
                <Box
                  key={customer._id}
                  sx={{
                    display: {
                      xs: "block",
                      lg: "grid",
                    },
                    gridTemplateColumns:
                      "1.4fr 1.6fr 1.1fr 1.4fr 0.8fr 100px",
                    gap: 1,
                    alignItems:
                      "center",
                    px: 2,
                    py: {
                      xs: 1.8,
                      lg: 1.5,
                    },
                    borderBottom:
                      "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 1.2,
                      mb: {
                        xs: 1.5,
                        lg: 0,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        borderRadius:
                          1.3,
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        color: "#60a5fa",
                        backgroundColor:
                          "rgba(59,130,246,0.10)",
                      }}
                    >
                      <People
                        sx={{
                          fontSize: 18,
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color:
                            "#e2e8f0",
                          fontSize:
                            12.5,
                          fontWeight:
                            650,
                        }}
                      >
                        {
                          customer.name
                        }
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#475569",
                          fontSize:
                            9.5,
                          mt: 0.2,
                        }}
                      >
                        Customer ID:{" "}
                        {customer._id?.slice(
                          -6
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      color:
                        "#94a3b8",
                      fontSize:
                        11.5,
                    }}
                  >
                    {
                      customer.email
                    }
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        "#94a3b8",
                      fontSize:
                        11.5,
                    }}
                  >
                    {
                      customer.phone
                    }
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        "#94a3b8",
                      fontSize:
                        11.5,
                    }}
                  >
                    {
                      customer.address
                    }
                  </Typography>

                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      height: 25,
                      color: "#4ade80",
                      backgroundColor:
                        "rgba(34,197,94,0.10)",
                      border:
                        "1px solid rgba(34,197,94,0.08)",
                      fontSize: 10,
                    }}
                  />

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        {
                          xs: "flex-start",
                          lg: "flex-end",
                        },
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleOpenEditDialog(
                          customer
                        )
                      }
                      sx={editIconButtonStyles}
                    >
                      <Edit
                        sx={{
                          fontSize: 17,
                        }}
                      />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() =>
                        handleOpenDeleteDialog(
                          customer
                        )
                      }
                      sx={deleteIconButtonStyles}
                    >
                      <Delete
                        sx={{
                          fontSize: 17,
                        }}
                      />
                    </IconButton>
                  </Box>
                </Box>
              )
            )
          )}
        </Box>
      </Box>

      {/* ======================================================
          ADD
      ======================================================= */}

      <Dialog
        open={openAddDialog}
        onClose={
          handleCloseAddDialog
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: dialogPaperStyles,
        }}
      >
        <DialogTitle sx={dialogTitleStyles}>
          Add new customer
        </DialogTitle>

        <DialogContent
          sx={{
            pt: "14px !important",
          }}
        >
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 11.5,
              mb: 1.5,
            }}
          >
            Add customer information to
            your ERP directory.
          </Typography>

          <DarkTextField
            label="Customer name"
            name="name"
            value={newCustomer.name}
            onChange={
              handleNewCustomerChange
            }
          />

          <DarkTextField
            label="Email address"
            name="email"
            type="email"
            value={newCustomer.email}
            onChange={
              handleNewCustomerChange
            }
          />

          <DarkTextField
            label="Phone number"
            name="phone"
            value={newCustomer.phone}
            onChange={
              handleNewCustomerChange
            }
          />

          <DarkTextField
            label="Address"
            name="address"
            value={
              newCustomer.address
            }
            onChange={
              handleNewCustomerChange
            }
            multiline
            rows={3}
          />
        </DialogContent>

        <DialogActions
          sx={dialogActionsStyles}
        >
          <Button
            onClick={
              handleCloseAddDialog
            }
            disabled={saving}
            sx={cancelButtonStyles}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddCustomer}
            disabled={saving}
            sx={primaryButtonStyles}
          >
            {saving
              ? "Adding..."
              : "Add Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================
          EDIT
      ======================================================= */}

      <Dialog
        open={openEditDialog}
        onClose={
          handleCloseEditDialog
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: dialogPaperStyles,
        }}
      >
        <DialogTitle sx={dialogTitleStyles}>
          Edit customer
        </DialogTitle>

        <DialogContent
          sx={{
            pt: "14px !important",
          }}
        >
          {editingCustomer && (
            <>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 11.5,
                  mb: 1.5,
                }}
              >
                Update customer
                information below.
              </Typography>

              <DarkTextField
                label="Customer name"
                name="name"
                value={
                  editingCustomer.name
                }
                onChange={
                  handleEditingCustomerChange
                }
              />

              <DarkTextField
                label="Email address"
                name="email"
                type="email"
                value={
                  editingCustomer.email
                }
                onChange={
                  handleEditingCustomerChange
                }
              />

              <DarkTextField
                label="Phone number"
                name="phone"
                value={
                  editingCustomer.phone
                }
                onChange={
                  handleEditingCustomerChange
                }
              />

              <DarkTextField
                label="Address"
                name="address"
                value={
                  editingCustomer.address
                }
                onChange={
                  handleEditingCustomerChange
                }
                multiline
                rows={3}
              />
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={dialogActionsStyles}
        >
          <Button
            onClick={
              handleCloseEditDialog
            }
            disabled={saving}
            sx={cancelButtonStyles}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleUpdateCustomer
            }
            disabled={saving}
            sx={primaryButtonStyles}
          >
            {saving
              ? "Updating..."
              : "Update Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE */}

      <Dialog
        open={openDeleteDialog}
        onClose={
          handleCloseDeleteDialog
        }
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: dialogPaperStyles,
        }}
      >
        <DialogTitle sx={dialogTitleStyles}>
          Delete customer?
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#cbd5e1",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            Are you sure you want to
            delete{" "}
            <Box
              component="span"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
              }}
            >
              {
                deletingCustomer?.name
              }
            </Box>
            ?
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 11,
              mt: 1,
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={dialogActionsStyles}
        >
          <Button
            onClick={
              handleCloseDeleteDialog
            }
            disabled={saving}
            sx={cancelButtonStyles}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleDeleteCustomer
            }
            disabled={saving}
            sx={{
              ...primaryButtonStyles,
              backgroundColor:
                "#dc2626",

              "&:hover": {
                backgroundColor:
                  "#b91c1c",
              },
            }}
          >
            {saving
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={
          notification.open
        }
        autoHideDuration={3000}
        onClose={
          closeNotification
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={
            closeNotification
          }
          severity={
            notification.severity
          }
          variant="filled"
          sx={{
            borderRadius: 1.5,
          }}
        >
          {
            notification.message
          }
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ============================================================
// COMMON COMPONENTS / STYLES
// ============================================================

function AtmosphericGlow() {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: -240,
          right: -170,
          width: 650,
          height: 650,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(37,99,235,0.10) 35%, transparent 72%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 100,
          left: -330,
          width: 650,
          height: 650,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(30,64,175,0.12) 0%, rgba(37,99,235,0.06) 40%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  iconBg,
}) {
  return (
    <Box
      sx={{
        minHeight: 125,
        p: 2,
        borderRadius: 2,
        border:
          "1px solid rgba(255,255,255,0.06)",
        backgroundColor:
          "rgba(23,29,41,0.96)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 11.5,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.9,
              color: "#f8fafc",
              fontSize: 25,
              fontWeight: 750,
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#475569",
              fontSize: 10,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            backgroundColor: iconBg,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Box>
  );
}

function TableHeader({
  children,
  align = "left",
}) {
  return (
    <Typography
      sx={{
        color: "#475569",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "1px",
        textAlign: align,
      }}
    >
      {children}
    </Typography>
  );
}

function DarkTextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  multiline = false,
  rows,
}) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={rows}
      autoComplete="off"
      InputLabelProps={{
        shrink: true,
      }}
      sx={{
        ...dialogFieldStyles,
        mt: 1.2,
      }}
    />
  );
}

const searchFieldStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 46,
    color: "#f8fafc",
    fontSize: 12.5,
    borderRadius: 1.4,
    backgroundColor: "#111827",

    "& fieldset": {
      borderColor:
        "rgba(255,255,255,0.06)",
    },

    "&:hover fieldset": {
      borderColor:
        "rgba(255,255,255,0.12)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },

    "& input": {
      color: "#f8fafc",
    },
  },
};

const dialogPaperStyles = {
  background:
    "linear-gradient(145deg, #171d29 0%, #101722 100%)",
  backgroundImage:
    "radial-gradient(circle at 100% 0%, rgba(59,130,246,0.14), transparent 40%), linear-gradient(145deg, #171d29 0%, #101722 100%)",
  color: "#f8fafc",
  border:
    "1px solid rgba(59,130,246,0.16)",
  borderRadius: 2,
  boxShadow:
    "0 25px 70px rgba(0,0,0,0.50)",
};

const dialogTitleStyles = {
  color: "#f8fafc",
  fontSize: 18,
  fontWeight: 700,
};

const dialogActionsStyles = {
  px: 3,
  py: 2,
  borderTop:
    "1px solid rgba(148,163,184,0.08)",
};

const dialogFieldStyles = {
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    fontSize: 12.5,
    backgroundColor: "#171d29",
    px: 0.5,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
  },

  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    backgroundColor: "#171d29",
  },

  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    color: "#f8fafc",
    fontSize: 12.5,
    borderRadius: 1.4,
    backgroundColor: "#111827",

    "& fieldset": {
      borderColor:
        "rgba(148,163,184,0.12)",
    },

    "&:hover fieldset": {
      borderColor:
        "rgba(96,165,250,0.30)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },

    "& input": {
      color: "#f8fafc",
    },

    "& textarea": {
      color: "#f8fafc",
    },

    "& input:-webkit-autofill": {
      WebkitBoxShadow:
        "0 0 0 1000px #111827 inset",
      WebkitTextFillColor:
        "#f8fafc",
    },
  },
};

const primaryButtonStyles = {
  minHeight: 40,
  px: 2,
  borderRadius: 1.3,
  textTransform: "none",
  background:
    "linear-gradient(135deg, #2563eb, #3b82f6)",
  fontSize: 12.5,
  fontWeight: 650,

  "&:hover": {
    background:
      "linear-gradient(135deg, #1d4ed8, #2563eb)",
  },
};

const cancelButtonStyles = {
  color: "#94a3b8",
  textTransform: "none",
  fontSize: 12.5,

  "&:hover": {
    backgroundColor:
      "rgba(255,255,255,0.04)",
  },
};

const editIconButtonStyles = {
  width: 32,
  height: 32,
  color: "#60a5fa",
  backgroundColor:
    "rgba(59,130,246,0.06)",

  "&:hover": {
    backgroundColor:
      "rgba(59,130,246,0.12)",
  },
};

const deleteIconButtonStyles = {
  width: 32,
  height: 32,
  color: "#f87171",
  backgroundColor:
    "rgba(239,68,68,0.06)",

  "&:hover": {
    backgroundColor:
      "rgba(239,68,68,0.12)",
  },
};

export default Customers;