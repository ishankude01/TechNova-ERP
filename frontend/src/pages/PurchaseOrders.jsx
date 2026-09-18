import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import api from "../services/api";

/* =========================================================
   COMMON STYLES
========================================================= */

const dialogPaperStyles = {
  background:
    "radial-gradient(circle at 100% 0%, rgba(59,130,246,0.14), transparent 40%), linear-gradient(145deg, #171d29 0%, #101722 100%)",
  color: "#f8fafc",
  border: "1px solid rgba(59,130,246,0.16)",
  borderRadius: 2,
  boxShadow: "0 25px 70px rgba(0,0,0,0.50)",
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
      borderColor: "rgba(148,163,184,0.12)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(96,165,250,0.30)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 2px rgba(59,130,246,0.08)",
    },

    "& input": {
      color: "#f8fafc",
    },

    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #111827 inset",
      WebkitTextFillColor: "#f8fafc",
      caretColor: "#f8fafc",
    },
  },

  "& .MuiFormHelperText-root": {
    color: "#f87171",
    fontSize: 10,
    ml: 0,
  },
};

const selectStyles = {
  minHeight: 48,
  color: "#f8fafc",
  fontSize: 12.5,
  borderRadius: 1.4,
  backgroundColor: "#111827",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(148,163,184,0.12)",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(96,165,250,0.30)",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3b82f6",
  },

  "& .MuiSelect-icon": {
    color: "#64748b",
  },
};

const darkMenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: "#111827",
      color: "#f8fafc",
      border: "1px solid rgba(59,130,246,0.16)",
      boxShadow: "0 15px 35px rgba(0,0,0,0.45)",

      "& .MuiMenuItem-root": {
        color: "#f8fafc",
        fontSize: 12.5,
      },

      "& .MuiMenuItem-root:hover": {
        backgroundColor: "rgba(59,130,246,0.14)",
      },

      "& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: "rgba(59,130,246,0.20)",
        color: "#ffffff",
      },

      "& .MuiMenuItem-root.Mui-selected:hover": {
        backgroundColor: "rgba(59,130,246,0.28)",
      },
    },
  },
};

const autocompletePaperStyles = {
  backgroundColor: "#111827",
  color: "#f8fafc",
  border: "1px solid rgba(59,130,246,0.16)",
  boxShadow: "0 15px 35px rgba(0,0,0,0.45)",

  "& .MuiAutocomplete-option": {
    color: "#f8fafc",
    fontSize: 12.5,
  },

  "& .MuiAutocomplete-option:hover": {
    backgroundColor: "rgba(59,130,246,0.14)",
  },

  "& .MuiAutocomplete-option[aria-selected='true']": {
    backgroundColor: "rgba(59,130,246,0.20)",
    color: "#ffffff",
  },
};

const tableHeaderStyles = {
  background:
    "linear-gradient(90deg, rgba(37,99,235,0.85), rgba(59,130,246,0.70))",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 12,
  whiteSpace: "nowrap",
};

const emptyForm = {
  productId: "",
  quantity: "",
  supplierName: "",
  orderDate: "",
  status: "Pending",
};

/* =========================================================
   HELPERS
========================================================= */

const extractArray = (data, possibleKeys = []) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  for (const key of possibleKeys) {
    if (Array.isArray(data[key])) {
      return data[key];
    }
  }

  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }

  if (
    data.data &&
    typeof data.data === "object"
  ) {
    for (const key of possibleKeys) {
      if (Array.isArray(data.data[key])) {
        return data.data[key];
      }
    }
  }

  return [];
};

const getProductId = (productId) => {
  if (!productId) return "";

  if (typeof productId === "string") {
    return productId;
  }

  if (typeof productId === "object") {
    return productId._id || "";
  }

  return "";
};

const getProductNameFromOrder = (order, products) => {
  if (order?.productId?.name) {
    return order.productId.name;
  }

  const productId = getProductId(order?.productId);

  const product = products.find(
    (item) => item._id === productId
  );

  return product?.name || "Unknown Product";
};

const getStatusStyles = (status) => {
  switch (status) {
    case "Approved":
      return {
        backgroundColor: "rgba(59,130,246,0.15)",
        color: "#60a5fa",
        border: "1px solid rgba(96,165,250,0.25)",
      };

    case "Received":
      return {
        backgroundColor: "rgba(34,197,94,0.12)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.20)",
      };

    case "Cancelled":
      return {
        backgroundColor: "rgba(239,68,68,0.12)",
        color: "#f87171",
        border: "1px solid rgba(248,113,113,0.20)",
      };

    default:
      return {
        backgroundColor: "rgba(148,163,184,0.10)",
        color: "#cbd5e1",
        border: "1px solid rgba(148,163,184,0.18)",
      };
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingSafe, setLoadingSafe] = useState(false);

  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================================================
     SNACKBAR
  ========================================================= */

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /* =========================================================
     FETCH PURCHASE ORDERS
  ========================================================= */

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/purchase-orders");

      const orderList = extractArray(
        response.data,
        ["purchaseOrders", "orders"]
      );

      setPurchaseOrders(orderList);
    } catch (error) {
      console.error(
        "Error fetching purchase orders:",
        error
      );

      setPurchaseOrders([]);

      showSnackbar(
        error.response?.data?.message ||
        "Failed to fetch purchase orders",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");

      const productList = extractArray(
        response.data,
        ["products", "items"]
      );

      setProducts(productList);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );

      setProducts([]);

      showSnackbar(
        error.response?.data?.message ||
        "Failed to fetch products",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
    fetchProducts();
  }, []);

  /* =========================================================
     FORM HANDLERS
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectedProduct = useMemo(() => {
    return (
      products.find(
        (product) => product._id === form.productId
      ) || null
    );
  }, [products, form.productId]);

  const handleProductChange = (_, value) => {
    setForm((prev) => ({
      ...prev,
      productId: value?._id || "",
    }));
  };

  /* =========================================================
     OPEN / CLOSE ADD DIALOG
  ========================================================= */

  const handleOpenAdd = () => {
    setEditingOrder(null);

    setForm({
      ...emptyForm,
      orderDate: new Date()
        .toISOString()
        .split("T")[0],
    });

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (loadingSafe) return;

    setOpenDialog(false);
    setEditingOrder(null);
    setForm(emptyForm);
  };

  /* =========================================================
     OPEN EDIT DIALOG
  ========================================================= */

  const handleOpenEdit = (order) => {
    setEditingOrder(order);

    setForm({
      productId: getProductId(order.productId),
      quantity: order.quantity ?? "",
      supplierName: order.supplierName ?? "",
      orderDate: order.orderDate
        ? new Date(order.orderDate)
          .toISOString()
          .split("T")[0]
        : "",
      status: order.status || "Pending",
    });

    setOpenDialog(true);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async () => {
    if (!form.productId) {
      showSnackbar(
        "Please select a product",
        "error"
      );
      return;
    }

    if (
      !form.quantity ||
      Number(form.quantity) <= 0
    ) {
      showSnackbar(
        "Please enter a valid quantity",
        "error"
      );
      return;
    }

    if (!form.supplierName.trim()) {
      showSnackbar(
        "Please enter supplier name",
        "error"
      );
      return;
    }

    if (!form.orderDate) {
      showSnackbar(
        "Please select order date",
        "error"
      );
      return;
    }

    try {
      setLoadingSafe(true);

      const payload = {
        productId: form.productId,
        quantity: Number(form.quantity),
        supplierName: form.supplierName.trim(),
        status: form.status,
      };

      if (editingOrder) {
        await api.put(
          `/purchase-orders/${editingOrder._id}`,
          payload
        );

        showSnackbar(
          "Purchase order updated successfully"
        );
      } else {
        await api.post(
          "/purchase-orders",
          payload
        );

        showSnackbar(
          "Purchase order created successfully"
        );
      }

      await fetchPurchaseOrders();

      setOpenDialog(false);
      setEditingOrder(null);
      setForm(emptyForm);
    } catch (error) {
      console.error(
        "Error saving purchase order:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
        "Failed to save purchase order",
        "error"
      );
    } finally {
      setLoadingSafe(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    if (loadingSafe) return;

    setDeleteDialog(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoadingSafe(true);

      await api.delete(
        `/purchase-orders/${deleteId}`
      );

      showSnackbar(
        "Purchase order deleted successfully"
      );

      await fetchPurchaseOrders();

      setDeleteDialog(false);
      setDeleteId(null);
    } catch (error) {
      console.error(
        "Error deleting purchase order:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
        "Failed to delete purchase order",
        "error"
      );
    } finally {
      setLoadingSafe(false);
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredOrders = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return purchaseOrders;
    }

    return purchaseOrders.filter((order) => {
      const productName =
        getProductNameFromOrder(
          order,
          products
        );

      const orderDate = order.orderDate
        ? new Date(
          order.orderDate
        ).toLocaleDateString()
        : "";

      const searchableText = [
        productName,
        order.supplierName,
        order.status,
        order.quantity,
        orderDate,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [purchaseOrders, products, search]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalOrders = purchaseOrders.length;

  const pendingOrders =
    purchaseOrders.filter(
      (order) =>
        order.status === "Pending"
    ).length;

  const approvedOrders =
    purchaseOrders.filter(
      (order) =>
        order.status === "Approved"
    ).length;

  const receivedOrders =
    purchaseOrders.filter(
      (order) =>
        order.status === "Received"
    ).length;

  const totalQuantity =
    purchaseOrders.reduce(
      (total, order) =>
        total +
        Number(order.quantity || 0),
      0
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box
      sx={{
        minHeight: "100%",
        color: "#f8fafc",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: 2,
          mb: 3,
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.6,
            }}
          >
            <ShoppingCartIcon
              sx={{
                color: "#60a5fa",
                fontSize: 28,
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 25,
                  md: 28,
                },
                fontWeight: 800,
                color: "#f8fafc",
                letterSpacing: "-0.5px",
              }}
            >
              Purchase Orders
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12.5,
            }}
          >
            Manage supplier purchase orders and
            track their status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            textTransform: "none",
            fontSize: 12.5,
            fontWeight: 700,
            borderRadius: 1.5,
            px: 2.2,
            py: 1.1,
            background:
              "linear-gradient(135deg, #2563eb, #3b82f6)",
            boxShadow:
              "0 8px 24px rgba(37,99,235,0.22)",

            "&:hover": {
              background:
                "linear-gradient(135deg, #1d4ed8, #2563eb)",
            },
          }}
        >
          Add Purchase Order
        </Button>
      </Box>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 1.8,
          mb: 2.4,
        }}
      >
        {/* Total Orders */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background:
              "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(16,23,34,0.94))",
            border:
              "1px solid rgba(59,130,246,0.12)",
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.20)",
          }}
        >
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 11,
              mb: 0.6,
            }}
          >
            Total Orders
          </Typography>

          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            {totalOrders}
          </Typography>
        </Box>

        {/* Pending */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background:
              "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(16,23,34,0.94))",
            border:
              "1px solid rgba(59,130,246,0.12)",
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.20)",
          }}
        >
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 11,
              mb: 0.6,
            }}
          >
            Pending
          </Typography>

          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            {pendingOrders}
          </Typography>
        </Box>

        {/* Approved */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background:
              "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(16,23,34,0.94))",
            border:
              "1px solid rgba(59,130,246,0.12)",
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.20)",
          }}
        >
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 11,
              mb: 0.6,
            }}
          >
            Approved
          </Typography>

          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: "#60a5fa",
            }}
          >
            {approvedOrders}
          </Typography>
        </Box>

        {/* Total Quantity */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background:
              "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(16,23,34,0.94))",
            border:
              "1px solid rgba(59,130,246,0.12)",
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.20)",
          }}
        >
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 11,
              mb: 0.6,
            }}
          >
            Total Quantity
          </Typography>

          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            {totalQuantity}
          </Typography>
        </Box>
      </Box>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <Box
        sx={{
          mb: 2.2,
          maxWidth: 495,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search purchase orders..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          autoComplete="off"
          size="small"
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  color: "#64748b",
                  mr: 1,
                  fontSize: 20,
                }}
              />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              minHeight: 42,
              backgroundColor:
                "rgba(17,24,39,0.78)",
              color: "#f8fafc",
              borderRadius: 1.5,
              fontSize: 12.5,

              "& fieldset": {
                borderColor:
                  "rgba(148,163,184,0.12)",
              },

              "&:hover fieldset": {
                borderColor:
                  "rgba(96,165,250,0.25)",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#3b82f6",
              },

              "& input": {
                color: "#f8fafc",
              },

              "& input::placeholder": {
                color: "#64748b",
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <Box
        sx={{
          background:
            "linear-gradient(145deg, rgba(17,24,39,0.95), rgba(10,15,24,0.96))",
          border:
            "1px solid rgba(59,130,246,0.12)",
          borderRadius: 2,
          overflowX: "auto",
          boxShadow:
            "0 18px 45px rgba(0,0,0,0.25)",
        }}
      >
        <Box
          component="table"
          sx={{
            width: "100%",
            minWidth: 880,
            borderCollapse: "collapse",
          }}
        >
          <Box component="thead">
            <Box component="tr">
              <Box
                component="th"
                sx={{
                  ...tableHeaderStyles,
                  textAlign: "left",
                  px: 2,
                  py: 1.6,
                }}
              >
                #
              </Box>

              <Box
                component="th"
                sx={{
                  ...tableHeaderStyles,
                  textAlign: "left",
                  px: 2,
                  py: 1.6,
                }}
              >
                Product
              </Box>

              <Box
                component="th"
                sx={{
                  ...tableHeaderStyles,
                  textAlign: "left",
                  px: 2,
                  py: 1.6,
                }}
              >
                Quantity
              </Box>

              <Box
                component="th"
                sx={{
                  ...tableHeaderStyles,
                  textAlign: "left",
                  px: 2,
                  py: 1.6,
                }}
              >
                Supplier
              </Box>

              <Box
                component="th"
                sx={{
                  ...tableHeaderStyles,
                  textAlign: "left",
                  px: 2,
                  py: 1.6,
                }}
              >
                Order Date
              </Box>

              <Box
                component="th"
                sx={{
                  ...tableHeaderStyles,
                  textAlign: "left",
                  px: 2,
                  py: 1.6,
                }}
              >
                Status
              </Box>

              <Box
                component="th"
                sx={{
                  ...tableHeaderStyles,
                  textAlign: "center",
                  px: 2,
                  py: 1.6,
                }}
              >
                Actions
              </Box>
            </Box>
          </Box>

          <Box component="tbody">
            {loading ? (
              <Box component="tr">
                <Box
                  component="td"
                  colSpan={7}
                  sx={{
                    textAlign: "center",
                    py: 6,
                    borderBottom: "none",
                  }}
                >
                  <CircularProgress
                    size={28}
                    sx={{
                      color: "#3b82f6",
                    }}
                  />
                </Box>
              </Box>
            ) : filteredOrders.length === 0 ? (
              <Box component="tr">
                <Box
                  component="td"
                  colSpan={7}
                  sx={{
                    textAlign: "center",
                    py: 6,
                    color: "#64748b",
                    fontSize: 12.5,
                    borderBottom: "none",
                  }}
                >
                  No purchase orders found.
                </Box>
              </Box>
            ) : (
              filteredOrders.map(
                (order, index) => {
                  const productName =
                    getProductNameFromOrder(
                      order,
                      products
                    );

                  return (
                    <Box
                      component="tr"
                      key={order._id}
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            "rgba(59,130,246,0.035)",
                        },

                        "& td": {
                          borderBottom:
                            "1px solid rgba(148,163,184,0.07)",
                        },
                      }}
                    >
                      <Box
                        component="td"
                        sx={{
                          color: "#64748b",
                          fontSize: 12,
                          px: 2,
                          py: 1.6,
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          color: "#f8fafc",
                          fontSize: 12.5,
                          fontWeight: 600,
                          px: 2,
                          py: 1.6,
                        }}
                      >
                        {productName}
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          color: "#cbd5e1",
                          fontSize: 12.5,
                          px: 2,
                          py: 1.6,
                        }}
                      >
                        {order.quantity}
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          color: "#cbd5e1",
                          fontSize: 12.5,
                          px: 2,
                          py: 1.6,
                        }}
                      >
                        {order.supplierName}
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          color: "#94a3b8",
                          fontSize: 12,
                          px: 2,
                          py: 1.6,
                        }}
                      >
                        {order.orderDate
                          ? new Date(
                            order.orderDate
                          ).toLocaleDateString()
                          : "-"}
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          px: 2,
                          py: 1.6,
                        }}
                      >
                        <Chip
                          label={
                            order.status ||
                            "Pending"
                          }
                          size="small"
                          sx={{
                            ...getStatusStyles(
                              order.status
                            ),
                            fontSize: 10.5,
                            fontWeight: 600,
                            height: 26,
                            borderRadius: 1,
                          }}
                        />
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          px: 2,
                          py: 1.6,
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          onClick={() =>
                            handleOpenEdit(
                              order
                            )
                          }
                          size="small"
                          sx={{
                            color: "#60a5fa",
                            mr: 0.5,

                            "&:hover": {
                              backgroundColor:
                                "rgba(59,130,246,0.12)",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          onClick={() =>
                            handleOpenDelete(
                              order._id
                            )
                          }
                          size="small"
                          sx={{
                            color: "#f87171",

                            "&:hover": {
                              backgroundColor:
                                "rgba(239,68,68,0.12)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                }
              )
            )}
          </Box>
        </Box>
      </Box>

      {/* =====================================================
          ADD / EDIT DIALOG
      ===================================================== */}

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
          sx={{
            px: 3,
            pt: 2.5,
            pb: 1,
            fontSize: 18,
            fontWeight: 800,
            color: "#f8fafc",
          }}
        >
          {editingOrder
            ? "Edit Purchase Order"
            : "Add Purchase Order"}
        </DialogTitle>

        <DialogContent
          sx={{
            pt: "14px !important",
            px: 3,
            pb: 2,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {/* PRODUCT */}

            <Box
              sx={{
                gridColumn: {
                  xs: "span 1",
                  sm: "span 2",
                },
              }}
            >
              <Autocomplete
                options={products}
                value={selectedProduct}
                onChange={
                  handleProductChange
                }
                disabled={
                  Boolean(editingOrder) ||
                  products.length === 0
                }
                isOptionEqualToValue={(
                  option,
                  value
                ) =>
                  option?._id ===
                  value?._id
                }
                getOptionLabel={(option) =>
                  option?.name || ""
                }
                noOptionsText={
                  "No products found"
                }
                disablePortal
                slotProps={{
                  paper: {
                    sx:
                      autocompletePaperStyles,
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    autoComplete="off"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={
                      dialogFieldStyles
                    }
                  />
                )}
              />
            </Box>

            {/* QUANTITY */}

            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: 1,
              }}
              sx={dialogFieldStyles}
            />

            {/* SUPPLIER */}

            <TextField
              fullWidth
              label="Supplier Name"
              name="supplierName"
              value={form.supplierName}
              onChange={handleChange}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              sx={dialogFieldStyles}
            />

            {/* ORDER DATE */}

            <TextField
              fullWidth
              label="Order Date"
              name="orderDate"
              type="date"
              value={form.orderDate}
              onChange={handleChange}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              sx={dialogFieldStyles}
            />

            {/* STATUS */}

            <Box
              sx={{
                position: "relative",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  position: "absolute",
                  top: -7,
                  left: 10,
                  zIndex: 1,
                  px: 0.5,
                  fontSize: 12.5,
                  color: "#94a3b8",
                  backgroundColor: "#171d29",
                  lineHeight: 1,
                }}
              >
                Status
              </Typography>

              <Select
                fullWidth
                name="status"
                value={
                  form.status ||
                  "Pending"
                }
                onChange={handleChange}
                MenuProps={
                  darkMenuProps
                }
                sx={selectStyles}
              >
                <MenuItem value="Pending">
                  Pending
                </MenuItem>

                <MenuItem value="Approved">
                  Approved
                </MenuItem>

                <MenuItem value="Received">
                  Received
                </MenuItem>

                <MenuItem value="Cancelled">
                  Cancelled
                </MenuItem>
              </Select>
            </Box>
          </Box>

          {editingOrder && (
            <Typography
              sx={{
                mt: 1.8,
                color: "#64748b",
                fontSize: 10.5,
              }}
            >
              Product cannot be changed while
              editing a purchase order.
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            pt: 1,
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            disabled={loadingSafe}
            sx={{
              textTransform: "none",
              color: "#94a3b8",
              fontSize: 12,

              "&:hover": {
                backgroundColor:
                  "rgba(148,163,184,0.07)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loadingSafe}
            sx={{
              minWidth: 100,
              textTransform: "none",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 1.3,

              background:
                "linear-gradient(135deg, #2563eb, #3b82f6)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #1d4ed8, #2563eb)",
              },
            }}
          >
            {loadingSafe ? (
              <CircularProgress
                size={18}
                sx={{
                  color: "#ffffff",
                }}
              />
            ) : editingOrder ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          DELETE DIALOG
      ===================================================== */}

      <Dialog
        open={deleteDialog}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: dialogPaperStyles,
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 17,
            fontWeight: 800,
            color: "#f8fafc",
            pb: 1,
          }}
        >
          Delete Purchase Order?
        </DialogTitle>

        <DialogContent
          sx={{
            pt: "10px !important",
          }}
        >
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12.5,
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete this
            purchase order? This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseDelete}
            disabled={loadingSafe}
            sx={{
              textTransform: "none",
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loadingSafe}
            sx={{
              textTransform: "none",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 1.3,
              backgroundColor: "#dc2626",

              "&:hover": {
                backgroundColor: "#b91c1c",
              },
            }}
          >
            {loadingSafe ? (
              <CircularProgress
                size={18}
                sx={{
                  color: "#ffffff",
                }}
              />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          SNACKBAR
      ===================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            fontSize: 12,
            borderRadius: 1.5,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PurchaseOrders;