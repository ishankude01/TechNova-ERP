import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

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
  Business,
  Delete,
  Edit,
  LocationOn,
  Phone,
  Search,
  EmailOutlined,
} from "@mui/icons-material";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] =
    useState(false);

  const [editingSupplier, setEditingSupplier] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const [deleteDialog, setDeleteDialog] =
    useState(false);

  const [supplierToDelete, setSupplierToDelete] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/suppliers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuppliers(
        response.data.suppliers || []
      );
    } catch (error) {
      console.error(
        "Error fetching suppliers:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to fetch suppliers",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const searchText =
      search.toLowerCase();

    return suppliers.filter(
      (supplier) =>
        supplier.name
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.email
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.phone
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.address
          ?.toLowerCase()
          .includes(searchText)
    );
  }, [suppliers, search]);

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setErrors({});
    setOpenDialog(true);
  };

  const handleEditSupplier = (
    supplier
  ) => {
    setEditingSupplier(supplier);

    setFormData({
      name: supplier.name || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });

    setErrors({});
    setOpenDialog(true);
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Supplier name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/\S+@\S+\.\S+/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Address is required";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      if (editingSupplier) {
        await api.put(
          `/suppliers/${editingSupplier._id}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showSnackbar(
          "Supplier updated successfully!"
        );
      } else {
        await api.post(
          "/suppliers",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showSnackbar(
          "Supplier added successfully!"
        );
      }

      setOpenDialog(false);
      setEditingSupplier(null);

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setErrors({});

      await fetchSuppliers();
    } catch (error) {
      console.error(
        "Error saving supplier:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to save supplier",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setEditingSupplier(null);
    setErrors({});
  };

  const handleDeleteClick = (
    supplier
  ) => {
    setSupplierToDelete(supplier);
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    if (saving) return;

    setDeleteDialog(false);
    setSupplierToDelete(null);
  };

  const handleDeleteConfirm =
    async () => {
      if (!supplierToDelete) {
        return;
      }

      try {
        setSaving(true);

        const token =
          localStorage.getItem("token");

        await api.delete(
          `/suppliers/${supplierToDelete._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showSnackbar(
          "Supplier deleted successfully!"
        );

        setDeleteDialog(false);
        setSupplierToDelete(null);

        await fetchSuppliers();
      } catch (error) {
        console.error(
          "Error deleting supplier:",
          error
        );

        showSnackbar(
          error.response?.data?.message ||
            "Failed to delete supplier",
          "error"
        );
      } finally {
        setSaving(false);
      }
    };

  const totalSuppliers =
    suppliers.length;

  const uniqueLocations = new Set(
    suppliers
      .map((supplier) =>
        supplier.address?.toLowerCase()
      )
      .filter(Boolean)
  ).size;

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
              }}
            >
              Suppliers
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 12.5,
                mt: 0.6,
              }}
            >
              Manage supplier information and contacts
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={
              handleAddSupplier
            }
            sx={primaryButtonStyles}
          >
            Add Supplier
          </Button>
        </Box>

        {/* SUMMARY */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <SummaryCard
            title="Total suppliers"
            value={totalSuppliers}
            subtitle="Suppliers in directory"
            icon={<Business />}
            iconColor="#60a5fa"
            iconBg="rgba(59,130,246,0.12)"
          />

          <SummaryCard
            title="Supplier locations"
            value={uniqueLocations}
            subtitle="Unique addresses"
            icon={<LocationOn />}
            iconColor="#4ade80"
            iconBg="rgba(34,197,94,0.12)"
          />

          <SummaryCard
            title="Showing results"
            value={
              filteredSuppliers.length
            }
            subtitle={
              search
                ? "Matching current search"
                : "Currently displayed"
            }
            icon={<Business />}
            iconColor="#a78bfa"
            iconBg="rgba(168,85,247,0.12)"
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
          }}
        >
          <TextField
            fullWidth
            placeholder="Search suppliers by name, email, phone or address..."
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
          }}
        >
          <Box
            sx={{
              display: {
                xs: "none",
                lg: "grid",
              },
              gridTemplateColumns:
                "1.5fr 1.55fr 1.1fr 1.45fr 100px",
              gap: 1,
              px: 2,
              py: 1.5,
              background:
                "linear-gradient(90deg, #131b2a, #17243b)",
            }}
          >
            <TableHeader>
              SUPPLIER
            </TableHeader>

            <TableHeader>
              EMAIL
            </TableHeader>

            <TableHeader>
              PHONE
            </TableHeader>

            <TableHeader>
              ADDRESS
            </TableHeader>

            <TableHeader align="right">
              ACTIONS
            </TableHeader>
          </Box>

          {loading ? (
            <Box
              sx={{
                minHeight: 320,
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
          ) : filteredSuppliers.length ===
            0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <Business
                sx={{
                  fontSize: 48,
                  color: "#334155",
                }}
              />

              <Typography
                sx={{
                  color: "#94a3b8",
                  mt: 1,
                }}
              >
                No suppliers found
              </Typography>
            </Box>
          ) : (
            filteredSuppliers.map(
              (supplier) => (
                <Box
                  key={supplier._id}
                  sx={{
                    display: {
                      xs: "block",
                      lg: "grid",
                    },
                    gridTemplateColumns:
                      "1.5fr 1.55fr 1.1fr 1.45fr 100px",
                    gap: 1,
                    alignItems:
                      "center",
                    px: 2,
                    py: 1.5,
                    borderBottom:
                      "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Box
                    sx={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 1.2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius:
                          1.3,
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        color:
                          "#60a5fa",
                        backgroundColor:
                          "rgba(59,130,246,0.10)",
                      }}
                    >
                      <Business
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
                          supplier.name
                        }
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#475569",
                          fontSize:
                            9.5,
                        }}
                      >
                        Supplier ID:{" "}
                        {supplier._id?.slice(
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
                      supplier.email
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
                      supplier.phone
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
                      supplier.address
                    }
                  </Typography>

                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "flex-end",
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEditSupplier(
                          supplier
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
                        handleDeleteClick(
                          supplier
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

      {/* ADD / EDIT */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: dialogPaperStyles,
        }}
      >
        <DialogTitle
          sx={dialogTitleStyles}
        >
          {editingSupplier
            ? "Edit supplier"
            : "Add new supplier"}
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
            {editingSupplier
              ? "Update supplier information below."
              : "Add supplier information to your ERP directory."}
          </Typography>

          <DarkTextField
            label="Supplier name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={
              !!errors.name
            }
            helperText={
              errors.name
            }
          />

          <DarkTextField
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={
              !!errors.email
            }
            helperText={
              errors.email
            }
          />

          <DarkTextField
            label="Phone number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={
              !!errors.phone
            }
            helperText={
              errors.phone
            }
          />

          <DarkTextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={
              !!errors.address
            }
            helperText={
              errors.address
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
              handleCloseDialog
            }
            disabled={saving}
            sx={cancelButtonStyles}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            sx={primaryButtonStyles}
          >
            {saving
              ? editingSupplier
                ? "Updating..."
                : "Adding..."
              : editingSupplier
              ? "Update Supplier"
              : "Add Supplier"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE */}

      <Dialog
        open={deleteDialog}
        onClose={
          handleCloseDeleteDialog
        }
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: dialogPaperStyles,
        }}
      >
        <DialogTitle
          sx={dialogTitleStyles}
        >
          Delete supplier?
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#cbd5e1",
              fontSize: 13,
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
                supplierToDelete?.name
              }
            </Box>
            ?
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
              handleDeleteConfirm
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
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={
          handleCloseSnackbar
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={
            handleCloseSnackbar
          }
          severity={
            snackbar.severity
          }
          variant="filled"
          sx={{
            borderRadius: 1.5,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

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
            alignItems:
              "center",
            justifyContent:
              "center",
            color: iconColor,
            backgroundColor:
              iconBg,
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
  error = false,
  helperText = "",
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
      error={error}
      helperText={helperText}
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

    "&.Mui-error fieldset": {
      borderColor: "#ef4444",
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

  "& .MuiFormHelperText-root": {
    color: "#f87171",
    fontSize: 10,
    ml: 0,
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
};

const editIconButtonStyles = {
  width: 32,
  height: 32,
  color: "#60a5fa",
  backgroundColor:
    "rgba(59,130,246,0.06)",
};

const deleteIconButtonStyles = {
  width: 32,
  height: 32,
  color: "#f87171",
  backgroundColor:
    "rgba(239,68,68,0.06)",
};

export default Suppliers;