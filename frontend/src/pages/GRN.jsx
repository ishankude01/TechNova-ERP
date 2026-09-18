import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";

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

const autocompletePaperStyles = {
  backgroundColor: "#111827",
  color: "#f8fafc",
  border: "1px solid rgba(59,130,246,0.16)",
  boxShadow: "0 15px 35px rgba(0,0,0,0.45)",

  "& .MuiAutocomplete-option": {
    color: "#f8fafc",
    fontSize: 12.5,
    minHeight: 42,
  },

  "& .MuiAutocomplete-option:hover": {
    backgroundColor: "rgba(59,130,246,0.14)",
  },

  "& .MuiAutocomplete-option[aria-selected='true']": {
    backgroundColor: "rgba(59,130,246,0.20)",
    color: "#ffffff",
  },
};

const selectFieldStyles = {
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    fontSize: 12.5,
    backgroundColor: "#171d29",
    px: 0.5,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
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

    "& .MuiSelect-select": {
      color: "#f8fafc",
    },

    "& .MuiSelect-icon": {
      color: "#64748b",
    },
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

/* =========================================================
   HELPERS
========================================================= */

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return value._id || "";
  }

  return "";
};

const getProductName = (product, products) => {
  if (!product) {
    return "Unknown Product";
  }

  if (typeof product === "object") {
    return product.name || "Unknown Product";
  }

  const found = products.find(
    (item) => item._id === product
  );

  return found?.name || "Unknown Product";
};

const getPurchaseOrderLabel = (order, products) => {
  if (!order) return "";

  const productName = getProductName(
    order.productId,
    products
  );

  return `${productName} • PO #${
    order._id?.slice(-6) || "N/A"
  }`;
};

const getStatusStyles = (status) => {
  switch (status) {
    case "Received":
      return {
        backgroundColor: "rgba(34,197,94,0.12)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.20)",
      };

    case "Pending":
      return {
        backgroundColor: "rgba(245,158,11,0.12)",
        color: "#fbbf24",
        border: "1px solid rgba(251,191,36,0.20)",
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

function GRN() {
  const [grns, setGrns] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGRN, setEditingGRN] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    productId: null,
    purchaseOrderId: null,
    quantity: "",
    supplierName: "",
    status: "Received",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [grnToDelete, setGrnToDelete] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  /* =========================================================
     SNACKBAR
  ========================================================= */

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

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /* =========================================================
     FETCH GRNs
  ========================================================= */

  const fetchGRNs = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/grn?page=1&limit=100&search=${encodeURIComponent(
          search
        )}`,
        {
          headers,
        }
      );

      const grnList =
        response.data?.grns ||
        response.data?.data ||
        [];

      setGrns(
        Array.isArray(grnList)
          ? grnList
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching GRNs:",
        error
      );

      setGrns([]);

      showSnackbar(
        error.response?.data?.message ||
          "Failed to fetch GRNs",
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
      const response = await api.get(
        "/products?page=1&limit=100",
        {
          headers,
        }
      );

      const productList =
        response.data?.products ||
        response.data?.productsList ||
        response.data?.data ||
        [];

      const safeProducts = Array.isArray(
        productList
      )
        ? productList
        : [];

      /*
        Remove duplicate product IDs.
        This also prevents React duplicate-key
        warnings in the Autocomplete dropdown.
      */
      const uniqueProducts = Array.from(
        new Map(
          safeProducts.map((product) => [
            product._id,
            product,
          ])
        ).values()
      );

      setProducts(uniqueProducts);
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

  /* =========================================================
     FETCH PURCHASE ORDERS
  ========================================================= */

  const fetchPurchaseOrders = async () => {
    try {
      const response = await api.get(
        "/purchase-orders?page=1&limit=100",
        {
          headers,
        }
      );

      const orderList =
        response.data?.purchaseOrders ||
        response.data?.orders ||
        response.data?.purchaseOrder ||
        response.data?.data ||
        [];

      setPurchaseOrders(
        Array.isArray(orderList)
          ? orderList
          : []
      );
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
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchGRNs();
    fetchProducts();
    fetchPurchaseOrders();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGRNs();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================================================
     OPEN ADD
  ========================================================= */

  const handleOpenAdd = () => {
    setEditingGRN(null);

    setFormData({
      productId: null,
      purchaseOrderId: null,
      quantity: "",
      supplierName: "",
      status: "Received",
    });

    setDialogOpen(true);
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const handleOpenEdit = (grn) => {
    setEditingGRN(grn);

    const selectedProduct =
      grn.productId &&
      typeof grn.productId === "object"
        ? grn.productId
        : products.find(
            (product) =>
              product._id ===
              grn.productId
          );

    const selectedPurchaseOrder =
      grn.purchaseOrderId &&
      typeof grn.purchaseOrderId ===
        "object"
        ? grn.purchaseOrderId
        : purchaseOrders.find(
            (order) =>
              order._id ===
              grn.purchaseOrderId
          );

    setFormData({
      productId:
        selectedProduct || null,

      purchaseOrderId:
        selectedPurchaseOrder || null,

      quantity:
        grn.quantity || "",

      supplierName:
        grn.supplierName || "",

      status:
        grn.status || "Received",
    });

    setDialogOpen(true);
  };

  /* =========================================================
     CLOSE DIALOG
  ========================================================= */

  const handleCloseDialog = () => {
    if (saving) return;

    setDialogOpen(false);
    setEditingGRN(null);
  };

  /* =========================================================
     FILTER PURCHASE ORDERS
  ========================================================= */

  const selectedProductId = getId(
    formData.productId
  );

  const filteredPurchaseOrders =
    useMemo(() => {
      if (!selectedProductId) {
        return purchaseOrders;
      }

      return purchaseOrders.filter(
        (order) => {
          const orderProductId =
            getId(order.productId);

          return (
            !orderProductId ||
            orderProductId ===
              selectedProductId
          );
        }
      );
    }, [
      selectedProductId,
      purchaseOrders,
    ]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async () => {
    if (
      !formData.productId ||
      !formData.purchaseOrderId ||
      !formData.quantity ||
      !formData.supplierName.trim()
    ) {
      showSnackbar(
        "Please fill all required fields",
        "error"
      );
      return;
    }

    if (
      Number(formData.quantity) <= 0
    ) {
      showSnackbar(
        "Quantity must be greater than 0",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const requestData = {
        productId:
          getId(formData.productId),

        purchaseOrderId:
          getId(
            formData.purchaseOrderId
          ),

        quantity: Number(
          formData.quantity
        ),

        supplierName:
          formData.supplierName.trim(),
      };

      /* =====================================================
         UPDATE
      ===================================================== */

      if (editingGRN) {
        await api.put(
          `/grn/${editingGRN._id}`,
          {
            ...requestData,
            status: formData.status,
          },
          {
            headers,
          }
        );

        showSnackbar(
          "GRN updated successfully!"
        );
      }

      /* =====================================================
         CREATE
      ===================================================== */

      else {
        await api.post(
          "/grn",
          requestData,
          {
            headers,
          }
        );

        showSnackbar(
          "GRN created successfully!"
        );
      }

      handleCloseDialog();

      await fetchGRNs();
      await fetchPurchaseOrders();
    } catch (error) {
      console.error(
        "GRN save error:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to save GRN",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleOpenDelete = (grn) => {
    setGrnToDelete(grn);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    if (saving) return;

    setDeleteDialogOpen(false);
    setGrnToDelete(null);
  };

  const handleDelete = async () => {
    if (!grnToDelete) return;

    try {
      setSaving(true);

      await api.delete(
        `/grn/${grnToDelete._id}`,
        {
          headers,
        }
      );

      showSnackbar(
        "GRN deleted successfully!"
      );

      setDeleteDialogOpen(false);
      setGrnToDelete(null);

      await fetchGRNs();
    } catch (error) {
      console.error(
        "Delete GRN error:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to delete GRN",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalGRNs = grns.length;

  const totalQuantity =
    grns.reduce(
      (total, grn) =>
        total +
        Number(grn.quantity || 0),
      0
    );

  const receivedCount =
    grns.filter(
      (grn) =>
        grn.status === "Received"
    ).length;

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
          justifyContent:
            "space-between",
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
            <Inventory2Icon
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
                letterSpacing:
                  "-0.5px",
              }}
            >
              Goods Received Notes
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12.5,
            }}
          >
            Manage received goods
            against purchase orders.
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
          Create GRN
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
            sm: "repeat(3, 1fr)",
          },
          gap: 1.8,
          mb: 2.4,
        }}
      >
        {/* TOTAL */}

        <Card
          sx={{
            background:
              "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(16,23,34,0.94))",
            color: "#f8fafc",
            border:
              "1px solid rgba(59,130,246,0.12)",
            borderRadius: 2,
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.20)",
          }}
        >
          <CardContent>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              Total GRNs
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {totalGRNs}
            </Typography>
          </CardContent>
        </Card>

        {/* RECEIVED */}

        <Card
          sx={{
            background:
              "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(16,23,34,0.94))",
            color: "#f8fafc",
            border:
              "1px solid rgba(59,130,246,0.12)",
            borderRadius: 2,
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.20)",
          }}
        >
          <CardContent>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              Received GRNs
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 24,
                fontWeight: 800,
                color: "#4ade80",
              }}
            >
              {receivedCount}
            </Typography>
          </CardContent>
        </Card>

        {/* QUANTITY */}

        <Card
          sx={{
            background:
              "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(16,23,34,0.94))",
            color: "#f8fafc",
            border:
              "1px solid rgba(59,130,246,0.12)",
            borderRadius: 2,
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.20)",
          }}
        >
          <CardContent>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              Total Quantity Received
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {totalQuantity}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <Box
        sx={{
          maxWidth: 495,
          mb: 2.2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by supplier or status..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          autoComplete="off"
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
                borderColor:
                  "#3b82f6",
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
          GRN LIST
      ===================================================== */}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress
            sx={{
              color: "#3b82f6",
            }}
          />
        </Box>
      ) : grns.length === 0 ? (
        <Box
          sx={{
            background:
              "linear-gradient(145deg, rgba(17,24,39,0.95), rgba(10,15,24,0.96))",
            border:
              "1px solid rgba(59,130,246,0.12)",
            borderRadius: 2,
            textAlign: "center",
            py: 8,
            boxShadow:
              "0 18px 45px rgba(0,0,0,0.25)",
          }}
        >
          <Inventory2Icon
            sx={{
              fontSize: 55,
              color: "#334155",
              mb: 1,
            }}
          />

          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            No GRNs found
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 12,
              mt: 1,
            }}
          >
            Create a GRN to record
            received goods.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {grns.map((grn) => (
            <Box
              key={grn._id}
              sx={{
                background:
                  "linear-gradient(145deg, rgba(17,24,39,0.95), rgba(10,15,24,0.96))",
                border:
                  "1px solid rgba(59,130,246,0.12)",
                borderRadius: 2,
                p: 2.2,
                transition: "0.2s",

                "&:hover": {
                  borderColor:
                    "rgba(59,130,246,0.25)",
                  transform:
                    "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 10,
                    }}
                  >
                    GRN ID
                  </Typography>

                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontSize: 12.5,
                      fontWeight: 700,
                      mt: 0.3,
                    }}
                  >
                    #
                    {grn._id?.slice(-8)}
                  </Typography>
                </Box>

                <Chip
                  label={
                    grn.status ||
                    "Received"
                  }
                  size="small"
                  sx={{
                    ...getStatusStyles(
                      grn.status
                    ),
                    height: 26,
                    fontSize: 10.5,
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: 1.3,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 10,
                    }}
                  >
                    Product
                  </Typography>

                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontSize: 12.5,
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    {getProductName(
                      grn.productId,
                      products
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 10,
                    }}
                  >
                    Purchase Order
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    {getPurchaseOrderLabel(
                      grn.purchaseOrderId,
                      products
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 10,
                    }}
                  >
                    Supplier
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    {grn.supplierName}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 10,
                    }}
                  >
                    Quantity
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    {grn.quantity}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 10,
                    }}
                  >
                    Received Date
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    {grn.receivedDate
                      ? new Date(
                          grn.receivedDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  mt: 2,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    handleOpenEdit(
                      grn
                    )
                  }
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
                  size="small"
                  onClick={() =>
                    handleOpenDelete(
                      grn
                    )
                  }
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
          ))}
        </Box>
      )}

      {/* =====================================================
          CREATE / EDIT DIALOG
      ===================================================== */}

      <Dialog
        open={dialogOpen}
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
          {editingGRN
            ? "Edit GRN"
            : "Create GRN"}
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
                value={
                  formData.productId
                }
                disabled={
                  Boolean(editingGRN) ||
                  products.length === 0
                }
                isOptionEqualToValue={(
                  option,
                  value
                ) =>
                  option?._id ===
                  value?._id
                }
                getOptionLabel={(
                  option
                ) =>
                  option?.name || ""
                }
                onChange={(
                  event,
                  value
                ) => {
                  setFormData(
                    (prev) => ({
                      ...prev,
                      productId:
                        value,
                      purchaseOrderId:
                        null,
                      supplierName:
                        "",
                    })
                  );
                }}
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
                renderInput={(
                  params
                ) => (
                  <TextField
                    {...params}
                    label="Product"
                    placeholder="Search product..."
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

            {/* PURCHASE ORDER */}

            <Box
              sx={{
                gridColumn: {
                  xs: "span 1",
                  sm: "span 2",
                },
              }}
            >
              <Autocomplete
                options={
                  filteredPurchaseOrders
                }
                value={
                  formData.purchaseOrderId
                }
                disabled={
                  Boolean(editingGRN) ||
                  !formData.productId
                }
                isOptionEqualToValue={(
                  option,
                  value
                ) =>
                  option?._id ===
                  value?._id
                }
                getOptionLabel={(
                  option
                ) =>
                  getPurchaseOrderLabel(
                    option,
                    products
                  )
                }
                onChange={(
                  event,
                  value
                ) => {
                  setFormData(
                    (prev) => ({
                      ...prev,
                      purchaseOrderId:
                        value,
                      supplierName:
                        value?.supplierName ||
                        "",
                    })
                  );
                }}
                noOptionsText={
                  formData.productId
                    ? "No purchase orders found"
                    : "Select product first"
                }
                disablePortal
                slotProps={{
                  paper: {
                    sx:
                      autocompletePaperStyles,
                  },
                }}
                renderInput={(
                  params
                ) => (
                  <TextField
                    {...params}
                    label="Purchase Order"
                    placeholder={
                      formData.productId
                        ? "Search purchase order..."
                        : "Select product first"
                    }
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
              value={
                formData.quantity
              }
              onChange={(event) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    quantity:
                      event.target
                        .value,
                  })
                )
              }
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: 1,
              }}
              sx={
                dialogFieldStyles
              }
            />

            {/* SUPPLIER */}

            <TextField
              fullWidth
              label="Supplier Name"
              name="supplierName"
              value={
                formData.supplierName
              }
              onChange={(event) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    supplierName:
                      event.target
                        .value,
                  })
                )
              }
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              sx={
                dialogFieldStyles
              }
            />

            {/* STATUS */}

            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={
                formData.status ||
                "Received"
              }
              onChange={(event) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    status:
                      event.target
                        .value,
                  })
                )
              }
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                MenuProps:
                  darkMenuProps,
              }}
              sx={
                selectFieldStyles
              }
            >
              <Box
                component="span"
                sx={{
                  display: "none",
                }}
              />

              <MenuItem value="Received">
                Received
              </MenuItem>

              <MenuItem value="Pending">
                Pending
              </MenuItem>

              <MenuItem value="Cancelled">
                Cancelled
              </MenuItem>
            </TextField>
          </Box>

          {editingGRN && (
            <Typography
              sx={{
                mt: 1.8,
                color: "#64748b",
                fontSize: 10.5,
              }}
            >
              Product and Purchase Order
              cannot be changed while
              editing a GRN.
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
            onClick={
              handleCloseDialog
            }
            disabled={saving}
            sx={{
              textTransform:
                "none",
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            sx={{
              minWidth: 110,
              textTransform:
                "none",
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
            {saving ? (
              <CircularProgress
                size={18}
                sx={{
                  color:
                    "#ffffff",
                }}
              />
            ) : editingGRN ? (
              "Update GRN"
            ) : (
              "Create GRN"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          DELETE DIALOG
      ===================================================== */}

      <Dialog
        open={
          deleteDialogOpen
        }
        onClose={
          handleCloseDelete
        }
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: dialogPaperStyles,
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            pt: 2.5,
            pb: 1,
            fontSize: 17,
            fontWeight: 800,
            color: "#f8fafc",
          }}
        >
          Delete GRN?
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
            Are you sure you want to
            delete this GRN? This action
            cannot be undone.
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
            onClick={
              handleCloseDelete
            }
            disabled={saving}
            sx={{
              textTransform:
                "none",
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
            disabled={saving}
            sx={{
              textTransform:
                "none",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 1.3,
              backgroundColor:
                "#dc2626",

              "&:hover": {
                backgroundColor:
                  "#b91c1c",
              },
            }}
          >
            {saving ? (
              <CircularProgress
                size={18}
                sx={{
                  color:
                    "#ffffff",
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
        autoHideDuration={3500}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={
            snackbar.severity
          }
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
}

export default GRN;