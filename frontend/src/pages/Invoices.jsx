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
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
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

    "& textarea": {
      color: "#f8fafc",
    },

    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #111827 inset",
      WebkitTextFillColor: "#f8fafc",
      caretColor: "#f8fafc",
    },
  },

  "& .MuiFormHelperText-root": {
    color: "#94a3b8",
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
    boxShadow: "0 0 0 2px rgba(59,130,246,0.08)",
  },

  "& .MuiSelect-select": {
    color: "#f8fafc",
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

const pageCardStyles = {
  background:
    "linear-gradient(145deg, rgba(17,24,39,0.95), rgba(10,15,24,0.96))",
  color: "#f8fafc",
  border: "1px solid rgba(59,130,246,0.12)",
  borderRadius: 2,
  boxShadow: "0 12px 30px rgba(0,0,0,0.20)",
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

const getSalesOrderLabel = (order, products) => {
  if (!order) return "";

  const orderId = order._id?.slice(-6) || "N/A";
  const productName = getProductName(
    order.productId,
    products
  );

  const customerName =
    order.customerName || "Customer";

  return `${customerName} • ${productName} • SO #${orderId}`;
};

const getStatusStyles = (status) => {
  switch (status) {
    case "Paid":
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
        backgroundColor: "rgba(245,158,11,0.12)",
        color: "#fbbf24",
        border: "1px solid rgba(251,191,36,0.20)",
      };
  }
};

/* =========================================================
   COMPONENT
========================================================= */

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    salesOrderId: null,
    productId: null,
    quantity: "",
    customerName: "",
    status: "Unpaid",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [invoiceToDelete, setInvoiceToDelete] =
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
     FETCH INVOICES
  ========================================================= */

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/invoices?page=1&limit=100&search=${encodeURIComponent(
          search
        )}`,
        {
          headers,
        }
      );

      const invoiceList =
        response.data?.invoices ||
        response.data?.data ||
        [];

      setInvoices(
        Array.isArray(invoiceList)
          ? invoiceList
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching invoices:",
        error
      );

      setInvoices([]);

      showSnackbar(
        error.response?.data?.message ||
          "Failed to fetch invoices",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH SALES ORDERS
  ========================================================= */

  const fetchSalesOrders = async () => {
    try {
      const response = await api.get(
        "/sales-orders?page=1&limit=100",
        {
          headers,
        }
      );

      const orderList =
        response.data?.salesOrders ||
        response.data?.orders ||
        response.data?.salesOrder ||
        response.data?.data ||
        [];

      const safeOrders = Array.isArray(
        orderList
      )
        ? orderList
        : [];

      const uniqueOrders = Array.from(
        new Map(
          safeOrders.map((order) => [
            order._id,
            order,
          ])
        ).values()
      );

      setSalesOrders(uniqueOrders);
    } catch (error) {
      console.error(
        "Error fetching sales orders:",
        error
      );

      setSalesOrders([]);

      showSnackbar(
        error.response?.data?.message ||
          "Failed to fetch sales orders",
        "error"
      );
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
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchInvoices();
    fetchSalesOrders();
    fetchProducts();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoices();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================================================
     OPEN ADD
  ========================================================= */

  const handleOpenAdd = () => {
    setEditingInvoice(null);

    setFormData({
      salesOrderId: null,
      productId: null,
      quantity: "",
      customerName: "",
      status: "Unpaid",
    });

    setDialogOpen(true);
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const handleOpenEdit = (invoice) => {
    setEditingInvoice(invoice);

    const selectedSalesOrder =
      invoice.salesOrderId &&
      typeof invoice.salesOrderId ===
        "object"
        ? invoice.salesOrderId
        : salesOrders.find(
            (order) =>
              order._id ===
              invoice.salesOrderId
          );

    const selectedProduct =
      invoice.productId &&
      typeof invoice.productId ===
        "object"
        ? invoice.productId
        : products.find(
            (product) =>
              product._id ===
              invoice.productId
          );

    setFormData({
      salesOrderId:
        selectedSalesOrder || null,

      productId:
        selectedProduct || null,

      quantity:
        invoice.quantity || "",

      customerName:
        invoice.customerName || "",

      status:
        invoice.status || "Unpaid",
    });

    setDialogOpen(true);
  };

  /* =========================================================
     CLOSE DIALOG
  ========================================================= */

  const handleCloseDialog = () => {
    if (saving) return;

    setDialogOpen(false);
    setEditingInvoice(null);
  };

  /* =========================================================
     CALCULATED AMOUNT
  ========================================================= */

  const calculatedAmount =
    formData.productId?.price &&
    formData.quantity
      ? Number(formData.productId.price) *
        Number(formData.quantity)
      : 0;

  /* =========================================================
     FILTER SALES ORDERS
  ========================================================= */

  const selectedProductId =
    getId(formData.productId);

  const filteredSalesOrders =
    useMemo(() => {
      if (!selectedProductId) {
        return salesOrders;
      }

      return salesOrders.filter(
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
      salesOrders,
    ]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async () => {
    if (
      !formData.salesOrderId ||
      !formData.productId ||
      !formData.quantity ||
      !formData.customerName.trim()
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

    if (calculatedAmount <= 0) {
      showSnackbar(
        "Amount must be greater than 0",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const invoiceData = {
        salesOrderId:
          getId(
            formData.salesOrderId
          ),

        productId:
          getId(
            formData.productId
          ),

        quantity: Number(
          formData.quantity
        ),

        customerName:
          formData.customerName.trim(),

        amount:
          calculatedAmount,

        status:
          formData.status,
      };

      /* UPDATE */

      if (editingInvoice) {
        await api.put(
          `/invoices/${editingInvoice._id}`,
          invoiceData,
          {
            headers,
          }
        );

        showSnackbar(
          "Invoice updated successfully!"
        );
      }

      /* CREATE */

      else {
        await api.post(
          "/invoices",
          invoiceData,
          {
            headers,
          }
        );

        showSnackbar(
          "Invoice created successfully!"
        );
      }

      setDialogOpen(false);
      setEditingInvoice(null);

      await fetchInvoices();
    } catch (error) {
      console.error(
        "Invoice save error:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to save invoice",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleOpenDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    if (saving) return;

    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      setSaving(true);

      await api.delete(
        `/invoices/${invoiceToDelete._id}`,
        {
          headers,
        }
      );

      showSnackbar(
        "Invoice deleted successfully!"
      );

      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);

      await fetchInvoices();
    } catch (error) {
      console.error(
        "Delete invoice error:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to delete invoice",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     PDF
  ========================================================= */

  const handleViewPDF = async (invoice) => {
    try {
      const response = await api.get(
        `/invoices/${invoice._id}/pdf`,
        {
          headers,
          responseType: "blob",
        }
      );

      const file = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const fileURL =
        URL.createObjectURL(file);

      window.open(
        fileURL,
        "_blank"
      );

      showSnackbar(
        "Invoice PDF generated successfully!"
      );
    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      showSnackbar(
        "Failed to generate invoice PDF",
        "error"
      );
    }
  };

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalInvoices =
    invoices.length;

  const paidInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "Paid"
    ).length;

  const unpaidInvoices =
    invoices.filter(
      (invoice) =>
        invoice.status === "Unpaid"
    ).length;

  const totalAmount =
    invoices.reduce(
      (total, invoice) =>
        total +
        Number(
          invoice.amount || 0
        ),
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
            <ReceiptLongIcon
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
              Invoices
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12.5,
            }}
          >
            Manage customer invoices
            and payment status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            textTransform:
              "none",
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
          Create Invoice
        </Button>
      </Box>

      {/* =====================================================
          SUMMARY
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
        <Box sx={pageCardStyles}>
          <CardContent>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              Total Invoices
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {totalInvoices}
            </Typography>
          </CardContent>
        </Box>

        <Box sx={pageCardStyles}>
          <CardContent>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              Paid
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 24,
                fontWeight: 800,
                color: "#4ade80",
              }}
            >
              {paidInvoices}
            </Typography>
          </CardContent>
        </Box>

        <Box sx={pageCardStyles}>
          <CardContent>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              Unpaid
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 24,
                fontWeight: 800,
                color: "#fbbf24",
              }}
            >
              {unpaidInvoices}
            </Typography>
          </CardContent>
        </Box>

        <Box sx={pageCardStyles}>
          <CardContent>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              Total Amount
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 21,
                fontWeight: 800,
                color: "#60a5fa",
              }}
            >
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </Typography>
          </CardContent>
        </Box>
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
          placeholder="Search by customer or payment status..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: "#64748b",
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
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
          INVOICE LIST
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
      ) : invoices.length === 0 ? (
        <Box
          sx={{
            ...pageCardStyles,
            textAlign: "center",
            py: 8,
          }}
        >
          <ReceiptLongIcon
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
            No invoices found
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 12,
              mt: 1,
            }}
          >
            Create an invoice to
            record a customer sale.
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
          {invoices.map((invoice) => (
            <Box
              key={invoice._id}
              sx={{
                ...pageCardStyles,
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
                  alignItems:
                    "flex-start",
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
                    Invoice ID
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
                    {invoice._id?.slice(
                      -8
                    )}
                  </Typography>
                </Box>

                <Chip
                  label={
                    invoice.status ||
                    "Unpaid"
                  }
                  size="small"
                  sx={{
                    ...getStatusStyles(
                      invoice.status
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
                    Sales Order
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    SO #
                    {invoice.salesOrderId
                      ? getId(
                          invoice.salesOrderId
                        ).slice(-6)
                      : "N/A"}
                  </Typography>
                </Box>

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
                      invoice.productId,
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
                    Customer
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    {
                      invoice.customerName
                    }
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color:
                          "#64748b",
                        fontSize: 10,
                      }}
                    >
                      Quantity
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "#cbd5e1",
                        fontSize: 12,
                        fontWeight: 600,
                        mt: 0.25,
                      }}
                    >
                      {
                        invoice.quantity
                      }
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color:
                          "#64748b",
                        fontSize: 10,
                      }}
                    >
                      Amount
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "#60a5fa",
                        fontSize: 12,
                        fontWeight: 700,
                        mt: 0.25,
                      }}
                    >
                      ₹
                      {Number(
                        invoice.amount ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 10,
                    }}
                  >
                    Invoice Date
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 600,
                      mt: 0.25,
                    }}
                  >
                    {invoice.invoiceDate
                      ? new Date(
                          invoice.invoiceDate
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
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    handleViewPDF(
                      invoice
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
                  <PictureAsPdfIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() =>
                    handleOpenEdit(
                      invoice
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
                      invoice
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
          {editingInvoice
            ? "Edit Invoice"
            : "Create Invoice"}
        </DialogTitle>

        <DialogContent
          sx={{
            pt: "14px !important",
            px: 3,
            pb: 2,
          }}
        >
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12,
              mb: 2,
            }}
          >
            Create an invoice from a
            completed customer sale.
          </Typography>

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
            {/* SALES ORDER */}

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
                  filteredSalesOrders
                }
                value={
                  formData.salesOrderId
                }
                disabled={
                  Boolean(
                    editingInvoice
                  )
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
                  getSalesOrderLabel(
                    option,
                    products
                  )
                }
                onChange={(
                  event,
                  value
                ) => {
                  const orderProductId =
                    getId(
                      value?.productId
                    );

                  const orderProduct =
                    products.find(
                      (product) =>
                        product._id ===
                        orderProductId
                    ) || null;

                  setFormData(
                    (previous) => ({
                      ...previous,

                      salesOrderId:
                        value,

                      productId:
                        orderProduct ||
                        null,

                      customerName:
                        value?.customerName ||
                        "",

                      quantity:
                        value?.quantity ||
                        "",
                    })
                  );
                }}
                noOptionsText="No sales orders found"
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
                    label="Sales Order"
                    placeholder="Search sales order..."
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
                  Boolean(
                    editingInvoice
                  ) ||
                  Boolean(
                    formData.salesOrderId
                  )
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
                  option
                    ? `${option.name} — ₹${Number(
                        option.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    : ""
                }
                onChange={(
                  event,
                  value
                ) => {
                  setFormData(
                    (previous) => ({
                      ...previous,
                      productId:
                        value,
                    })
                  );
                }}
                noOptionsText="No products found"
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

            {/* QUANTITY */}

            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={
                formData.quantity
              }
              onChange={(event) => {
                setFormData(
                  (previous) => ({
                    ...previous,
                    quantity:
                      event.target
                        .value,
                  })
                );
              }}
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

            {/* CUSTOMER */}

            <TextField
              fullWidth
              label="Customer Name"
              name="customerName"
              value={
                formData.customerName
              }
              onChange={(event) => {
                setFormData(
                  (previous) => ({
                    ...previous,
                    customerName:
                      event.target
                        .value,
                  })
                );
              }}
              autoComplete="off"
              InputLabelProps={{
                shrink: true,
              }}
              sx={
                dialogFieldStyles
              }
            />

            {/* AMOUNT */}

            <Box
              sx={{
                gridColumn: {
                  xs: "span 1",
                  sm: "span 2",
                },
              }}
            >
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={
                  calculatedAmount > 0
                    ? calculatedAmount
                    : ""
                }
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography
                        sx={{
                          color:
                            "#94a3b8",
                          fontSize: 13,
                        }}
                      >
                        ₹
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                helperText={
                  formData.productId?.price
                    ? `₹${Number(
                        formData
                          .productId
                          .price
                      ).toLocaleString(
                        "en-IN"
                      )} × ${
                        formData.quantity ||
                        0
                      }`
                    : "Select a product and quantity"
                }
                sx={{
                  ...dialogFieldStyles,

                  "& .MuiFormHelperText-root": {
                    color: "#64748b",
                    fontSize: 10,
                    ml: 0,
                  },
                }}
              />
            </Box>

            {/* PAYMENT STATUS */}

            <Box
              sx={{
                gridColumn: {
                  xs: "span 1",
                  sm: "span 2",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Typography
                  sx={{
                    position:
                      "absolute",
                    top: -7,
                    left: 10,
                    zIndex: 1,
                    px: 0.5,
                    fontSize: 12.5,
                    color: "#94a3b8",
                    backgroundColor:
                      "#171d29",
                    lineHeight: 1,
                  }}
                >
                  Payment Status
                </Typography>

                <Select
                  fullWidth
                  name="status"
                  value={
                    formData.status ||
                    "Unpaid"
                  }
                  onChange={(event) => {
                    setFormData(
                      (previous) => ({
                        ...previous,
                        status:
                          event.target
                            .value,
                      })
                    );
                  }}
                  MenuProps={
                    darkMenuProps
                  }
                  sx={selectStyles}
                >
                  <MenuItem value="Unpaid">
                    Unpaid
                  </MenuItem>

                  <MenuItem value="Paid">
                    Paid
                  </MenuItem>

                  <MenuItem value="Cancelled">
                    Cancelled
                  </MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              px: 1.5,
              py: 1.4,
              borderRadius: 1.5,
              backgroundColor:
                "rgba(59,130,246,0.08)",
              border:
                "1px solid rgba(59,130,246,0.14)",
            }}
          >
            <Typography
              sx={{
                color: "#93c5fd",
                fontSize: 11.5,
              }}
            >
              Invoice amount is
              automatically calculated
              from product price ×
              quantity.
            </Typography>
          </Box>
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
              minWidth: 120,
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
            ) : editingInvoice ? (
              "Update Invoice"
            ) : (
              "Create Invoice"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          DELETE DIALOG
      ===================================================== */}

      <Dialog
        open={deleteDialogOpen}
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
          Delete Invoice?
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
            delete this invoice? This
            action cannot be undone.
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

export default Invoices;