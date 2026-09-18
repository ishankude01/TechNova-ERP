import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

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
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Inventory2Outlined,
  Search,
  ShoppingCartOutlined,
} from "@mui/icons-material";

function SalesOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] =
    useState(false);

  const [editingOrder, setEditingOrder] =
    useState(null);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    customerName: "",
    orderDate: new Date().toISOString().split("T")[0],
    status: "Pending",
  });

  const [errors, setErrors] = useState({});

  const [deleteDialog, setDeleteDialog] =
    useState(false);

  const [orderToDelete, setOrderToDelete] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  // ============================================================
  // SNACKBAR
  // ============================================================

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

  // ============================================================
  // FETCH SALES ORDERS
  // ============================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/sales-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(
        response.data.salesOrders || []
      );
    } catch (error) {
      console.error(
        "Error fetching sales orders:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to fetch sales orders",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  const fetchProducts = async () => {
    try {
      const response = await api.get(
        "/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(
        response.data.products || []
      );
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to fetch products",
        "error"
      );
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredOrders = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return orders.filter((order) => {
      const productName =
        order.productId?.name ||
        order.product?.name ||
        order.productName ||
        "";

      return (
        productName
          .toLowerCase()
          .includes(searchText) ||
        order.customerName
          ?.toLowerCase()
          .includes(searchText) ||
        order.status
          ?.toLowerCase()
          .includes(searchText) ||
        order._id
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [orders, search]);

  // ============================================================
  // SUMMARY
  // ============================================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "Delivered"
  ).length;

  const totalQuantity = orders.reduce(
    (total, order) =>
      total +
      Number(order.quantity || 0),
    0
  );

  // ============================================================
  // PRODUCT NAME
  // ============================================================

  const getProductName = (order) => {
    if (order.productId?.name) {
      return order.productId.name;
    }

    if (order.product?.name) {
      return order.product.name;
    }

    if (order.productName) {
      return order.productName;
    }

    const productId =
      typeof order.productId === "string"
        ? order.productId
        : order.productId?._id;

    const product = products.find(
      (item) => item._id === productId
    );

    return (
      product?.name ||
      "Unknown Product"
    );
  };

  // ============================================================
  // PRODUCT ID
  // ============================================================

  const getProductId = (order) => {
    if (
      typeof order.productId ===
      "string"
    ) {
      return order.productId;
    }

    return (
      order.productId?._id || ""
    );
  };

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          color: "#fbbf24",
          backgroundColor:
            "rgba(251,191,36,0.10)",
          borderColor:
            "rgba(251,191,36,0.22)",
        };

      case "Approved":
        return {
          color: "#60a5fa",
          backgroundColor:
            "rgba(96,165,250,0.10)",
          borderColor:
            "rgba(96,165,250,0.22)",
        };

      case "Delivered":
        return {
          color: "#34d399",
          backgroundColor:
            "rgba(52,211,153,0.10)",
          borderColor:
            "rgba(52,211,153,0.22)",
        };

      case "Cancelled":
        return {
          color: "#f87171",
          backgroundColor:
            "rgba(248,113,113,0.10)",
          borderColor:
            "rgba(248,113,113,0.22)",
        };

      default:
        return {
          color: "#cbd5e1",
          backgroundColor:
            "rgba(203,213,225,0.08)",
          borderColor:
            "rgba(203,213,225,0.16)",
        };
    }
  };

  // ============================================================
  // OPEN ADD
  // ============================================================

  const handleAddOrder = () => {
    setEditingOrder(null);
    setSelectedProduct(null);

    setFormData({
      productId: "",
      quantity: "",
      customerName: "",
      orderDate: new Date().toISOString().split("T")[0],
      status: "Pending",
    });

    setErrors({});
    setOpenDialog(true);
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================

  const handleEditOrder = (order) => {
    const productId =
      getProductId(order);

    const product =
      products.find(
        (item) =>
          item._id === productId
      ) || null;

    setEditingOrder(order);
    setSelectedProduct(product);

    setFormData({
      productId:
        productId,

      quantity:
        order.quantity || "",

      customerName:
        order.customerName || "",

      orderDate: order.orderDate
        ? new Date(order.orderDate)
            .toISOString()
            .split("T")[0]
        : new Date()
            .toISOString()
            .split("T")[0],

      status:
        order.status || "Pending",
    });

    setErrors({});
    setOpenDialog(true);
  };

  // ============================================================
  // CHANGE FORM
  // ============================================================

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

  // ============================================================
  // PRODUCT CHANGE
  // ============================================================

  const handleProductChange = (
    event,
    value
  ) => {
    setSelectedProduct(value);

    setFormData((previous) => ({
      ...previous,
      productId:
        value?._id || "",
    }));

    setErrors((previous) => ({
      ...previous,
      productId: "",
    }));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productId) {
      newErrors.productId =
        "Product is required";
    }

    if (!formData.quantity) {
      newErrors.quantity =
        "Quantity is required";
    } else if (
      Number(formData.quantity) <= 0 ||
      !Number.isInteger(
        Number(formData.quantity)
      )
    ) {
      newErrors.quantity =
        "Quantity must be a positive integer";
    }

    if (
      !formData.customerName.trim()
    ) {
      newErrors.customerName =
        "Customer name is required";
    }

    if (!formData.orderDate) {
      newErrors.orderDate =
        "Order date is required";
    }

    if (!formData.status) {
      newErrors.status =
        "Status is required";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const requestData = {
        productId:
          formData.productId,

        quantity: Number(
          formData.quantity
        ),

        customerName:
          formData.customerName.trim(),

        orderDate:
          formData.orderDate,

        status:
          formData.status,
      };

      if (editingOrder) {
        await api.put(
          `/sales-orders/${editingOrder._id}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showSnackbar(
          "Sales order updated successfully!"
        );
      } else {
        await api.post(
          "/sales-orders",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showSnackbar(
          "Sales order created successfully!"
        );
      }

      handleCloseDialog();

      await fetchOrders();
    } catch (error) {
      console.error(
        "Error saving sales order:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to save sales order",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // CLOSE DIALOG
  // ============================================================

  const handleCloseDialog = () => {
    if (saving) {
      return;
    }

    setOpenDialog(false);
    setEditingOrder(null);
    setSelectedProduct(null);

    setFormData({
      productId: "",
      quantity: "",
      customerName: "",
      orderDate: new Date().toISOString().split("T")[0],
      status: "Pending",
    });

    setErrors({});
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    if (saving) {
      return;
    }

    setDeleteDialog(false);
    setOrderToDelete(null);
  };

  const handleDeleteConfirm =
    async () => {
      if (!orderToDelete) {
        return;
      }

      try {
        setSaving(true);

        await api.delete(
          `/sales-orders/${orderToDelete._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showSnackbar(
          "Sales order deleted successfully!"
        );

        setDeleteDialog(false);
        setOrderToDelete(null);

        await fetchOrders();
      } catch (error) {
        console.error(
          "Error deleting sales order:",
          error
        );

        showSnackbar(
          error.response?.data?.message ||
            "Failed to delete sales order",
          "error"
        );
      } finally {
        setSaving(false);
      }
    };

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
        px: {
          xs: 1.8,
          sm: 2.3,
          md: 3,
        },
        py: {
          xs: 2,
          md: 2.5,
        },
      }}
    >
      {/* ========================================================
          BLUE ATMOSPHERIC GLOW
      ========================================================= */}

      <Box
        sx={{
          position: "absolute",
          top: -260,
          right: -160,
          width: 720,
          height: 720,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.20) 0%, rgba(37,99,235,0.11) 32%, transparent 72%)",
          pointerEvents:
            "none",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 80,
          left: -360,
          width: 680,
          height: 680,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(30,64,175,0.14) 0%, rgba(37,99,235,0.07) 38%, transparent 72%)",
          pointerEvents:
            "none",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: -360,
          right: 140,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
          pointerEvents:
            "none",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1600,
          mx: "auto",
        }}
      >
        {/* ======================================================
            HEADER
        ======================================================= */}

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
                color: "#f8fafc",
                fontSize: {
                  xs: 25,
                  md: 29,
                },
                fontWeight: 750,
                letterSpacing:
                  "-0.6px",
              }}
            >
              Sales Orders
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 12.5,
                mt: 0.6,
              }}
            >
              Manage customer orders and track fulfilment
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddOrder}
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },
              minHeight: 44,
              px: 2.2,
              borderRadius: 1.5,
              textTransform:
                "none",
              fontSize: 13,
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              boxShadow:
                "0 10px 30px rgba(37,99,235,0.25)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                boxShadow:
                  "0 12px 35px rgba(37,99,235,0.34)",
              },
            }}
          >
            Create Sales Order
          </Button>
        </Box>

        {/* ======================================================
            SUMMARY CARDS
        ======================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 2.5,
          }}
        >
          <SummaryCard
            title="Total orders"
            value={totalOrders}
            subtitle="All customer orders"
            icon={
              <ShoppingCartOutlined />
            }
            iconColor="#60a5fa"
            iconBg="rgba(59,130,246,0.12)"
          />

          <SummaryCard
            title="Pending"
            value={pendingOrders}
            subtitle="Awaiting processing"
            icon={
              <Inventory2Outlined />
            }
            iconColor="#fbbf24"
            iconBg="rgba(251,191,36,0.10)"
          />

          <SummaryCard
            title="Delivered"
            value={deliveredOrders}
            subtitle="Completed orders"
            icon={
              <ShoppingCartOutlined />
            }
            iconColor="#34d399"
            iconBg="rgba(52,211,153,0.10)"
          />

          <SummaryCard
            title="Total quantity"
            value={totalQuantity}
            subtitle="Units ordered"
            icon={
              <Inventory2Outlined />
            }
            iconColor="#60a5fa"
            iconBg="rgba(59,130,246,0.10)"
          />
        </Box>

        {/* ======================================================
            SEARCH
        ======================================================= */}

        <Box
          sx={{
            mb: 2.5,
          }}
        >
          <TextField
            fullWidth
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by product, customer, status, or order ID..."
            sx={searchFieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "#64748b",
                      fontSize: 20,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* ======================================================
            TABLE
        ======================================================= */}

        <Box
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border:
              "1px solid rgba(59,130,246,0.13)",
            background:
              "linear-gradient(145deg, rgba(23,29,41,0.98), rgba(15,23,42,0.96))",
            boxShadow:
              "0 18px 45px rgba(2,6,23,0.25)",
          }}
        >
          {/* TABLE HEADER */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "grid",
              },
              gridTemplateColumns:
                "1.25fr 2fr 1.5fr 0.75fr 1fr 1fr 100px",
              gap: 1,
              alignItems:
                "center",
              px: 2.3,
              py: 1.7,
              background:
                "linear-gradient(90deg, rgba(30,64,175,0.42), rgba(37,99,235,0.22), rgba(15,23,42,0.10))",
              borderBottom:
                "1px solid rgba(148,163,184,0.10)",
            }}
          >
            <TableHeader>
              ORDER ID
            </TableHeader>

            <TableHeader>
              PRODUCT
            </TableHeader>

            <TableHeader>
              CUSTOMER
            </TableHeader>

            <TableHeader>
              QTY
            </TableHeader>

            <TableHeader>
              ORDER DATE
            </TableHeader>

            <TableHeader>
              STATUS
            </TableHeader>

            <TableHeader align="right">
              ACTIONS
            </TableHeader>
          </Box>

          {/* LOADING */}

          {loading ? (
            <Box
              sx={{
                minHeight: 340,
                display: "flex",
                flexDirection:
                  "column",
                alignItems:
                  "center",
                justifyContent:
                  "center",
              }}
            >
              <CircularProgress
                size={30}
                sx={{
                  color: "#3b82f6",
                  mb: 1.5,
                }}
              />

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                Loading sales orders...
              </Typography>
            </Box>
          ) : filteredOrders.length ===
            0 ? (
            <Box
              sx={{
                minHeight: 320,
                display: "flex",
                flexDirection:
                  "column",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                px: 2,
              }}
            >
              <ShoppingCartOutlined
                sx={{
                  fontSize: 50,
                  color: "#334155",
                  mb: 1.5,
                }}
              />

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 14,
                  fontWeight: 650,
                }}
              >
                No sales orders found
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 11,
                  mt: 0.6,
                }}
              >
                Create a sales order or try a different search.
              </Typography>
            </Box>
          ) : (
            <Box>
              {filteredOrders.map(
                (order) => (
                  <Box
                    key={order._id}
                    sx={{
                      display: {
                        xs: "block",
                        md: "grid",
                      },
                      gridTemplateColumns:
                        "1.25fr 2fr 1.5fr 0.75fr 1fr 1fr 100px",
                      gap: 1,
                      alignItems:
                        "center",
                      px: 2.3,
                      py: {
                        xs: 1.8,
                        md: 1.7,
                      },
                      borderBottom:
                        "1px solid rgba(148,163,184,0.08)",
                      transition:
                        "background-color 0.18s ease",

                      "&:hover": {
                        backgroundColor:
                          "rgba(59,130,246,0.045)",
                      },

                      "&:last-child": {
                        borderBottom:
                          "none",
                      },
                    }}
                  >
                    {/* ORDER ID */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 1.2,
                        mb: {
                          xs: 1.5,
                          md: 0,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          flexShrink: 0,
                          borderRadius:
                            1.4,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          color: "#60a5fa",
                          background:
                            "linear-gradient(145deg, rgba(59,130,246,0.16), rgba(37,99,235,0.07))",
                          border:
                            "1px solid rgba(59,130,246,0.08)",
                        }}
                      >
                        <ShoppingCartOutlined
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color:
                              "#f1f5f9",
                            fontSize:
                              12.5,
                            fontWeight:
                              650,
                          }}
                        >
                          #
                          {order._id
                            ?.slice(
                              -6
                            )
                            .toUpperCase()}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              "#64748b",
                            fontSize:
                              9.5,
                            mt: 0.25,
                          }}
                        >
                          Sales Order
                        </Typography>
                      </Box>
                    </Box>

                    {/* PRODUCT */}

                    <Box
                      sx={{
                        minWidth: 0,
                        mb: {
                          xs: 1.2,
                          md: 0,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            "#f1f5f9",
                          fontSize:
                            12.5,
                          fontWeight:
                            650,
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {getProductName(
                          order
                        )}
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            "#64748b",
                          fontSize:
                            9.5,
                          mt: 0.25,
                        }}
                      >
                        Product
                      </Typography>
                    </Box>

                    {/* CUSTOMER */}

                    <Typography
                      sx={{
                        color:
                          "#cbd5e1",
                        fontSize:
                          11.5,
                        fontWeight:
                          600,
                        mb: {
                          xs: 1.2,
                          md: 0,
                        },
                      }}
                    >
                      {
                        order.customerName
                      }
                    </Typography>

                    {/* QUANTITY */}

                    <Box
                      sx={{
                        mb: {
                          xs: 1.2,
                          md: 0,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            "#f1f5f9",
                          fontSize:
                            12.5,
                          fontWeight:
                            700,
                        }}
                      >
                        {
                          order.quantity
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
                        Units
                      </Typography>
                    </Box>

                    {/* DATE */}

                    <Typography
                      sx={{
                        color:
                          "#94a3b8",
                        fontSize:
                          11.5,
                        mb: {
                          xs: 1.2,
                          md: 0,
                        },
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {formatDate(
                        order.orderDate
                      )}
                    </Typography>

                    {/* STATUS */}

                    <Box
                      sx={{
                        mb: {
                          xs: 1.2,
                          md: 0,
                        },
                      }}
                    >
                      <Chip
                        label={
                          order.status
                        }
                        size="small"
                        sx={{
                          ...getStatusStyle(
                            order.status
                          ),
                          border:
                            "1px solid",
                          fontWeight:
                            700,
                          fontSize:
                            10.5,
                        }}
                      />
                    </Box>

                    {/* ACTIONS */}

                    <Box
                      sx={{
                        display:
                          "flex",
                        justifyContent:
                          {
                            xs: "flex-start",
                            md: "flex-end",
                          },
                        gap: 0.6,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleEditOrder(
                            order
                          )
                        }
                        sx={{
                          width: 34,
                          height: 34,
                          color:
                            "#60a5fa",
                          backgroundColor:
                            "rgba(59,130,246,0.08)",

                          "&:hover": {
                            backgroundColor:
                              "rgba(59,130,246,0.17)",
                          },
                        }}
                      >
                        <Edit
                          sx={{
                            fontSize: 18,
                          }}
                        />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDeleteClick(
                            order
                          )
                        }
                        sx={{
                          width: 34,
                          height: 34,
                          color:
                            "#f87171",
                          backgroundColor:
                            "rgba(248,113,113,0.07)",

                          "&:hover": {
                            backgroundColor:
                              "rgba(248,113,113,0.15)",
                          },
                        }}
                      >
                        <Delete
                          sx={{
                            fontSize: 18,
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* ========================================================
          CREATE / EDIT DIALOG
      ========================================================= */}

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
          {editingOrder
            ? "Edit Sales Order"
            : "Create Sales Order"}
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
            {editingOrder
              ? "Update the sales order information below."
              : "Create a new customer sales order."}
          </Typography>

          {/* ====================================================
              PRODUCT
          ===================================================== */}

          <Autocomplete
            options={products}
            value={
              products.find(
                (product) =>
                  product._id ===
                  formData.productId
              ) || null
            }
            onChange={
              handleProductChange
            }
            disabled={
              Boolean(editingOrder)
            }
            getOptionLabel={(option) =>
              option?.name
                ? `${option.name} — ₹${Number(
                    option.price || 0
                  ).toLocaleString(
                    "en-IN"
                  )}`
                : ""
            }
            isOptionEqualToValue={(
              option,
              value
            ) =>
              option?._id ===
              value?._id
            }
            noOptionsText="No products found"
            ListboxProps={{
              sx: {
                backgroundColor:
                  "#111827",
                color: "#f8fafc",

                "& .MuiAutocomplete-option":
                  {
                    color: "#f8fafc",
                    fontSize: 13,

                    "&:hover": {
                      backgroundColor:
                        "rgba(59,130,246,0.12)",
                    },

                    "&[aria-selected='true']":
                      {
                        backgroundColor:
                          "rgba(59,130,246,0.20)",
                      },
                  },
              },
            }}
            renderOption={(
              props,
              option
            ) => (
              <Box
                component="li"
                {...props}
                key={option._id}
                sx={{
                  backgroundColor:
                    "#111827 !important",
                  color:
                    "#f8fafc !important",
                  minHeight:
                    "52px !important",

                  "&:hover": {
                    backgroundColor:
                      "rgba(59,130,246,0.12) !important",
                  },

                  "&[aria-selected='true']":
                    {
                      backgroundColor:
                        "rgba(59,130,246,0.20) !important",
                    },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color:
                        "#f8fafc",
                      fontSize: 13,
                      fontWeight:
                        600,
                    }}
                  >
                    {option.name}
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        "#64748b",
                      fontSize:
                        10.5,
                      mt: 0.2,
                    }}
                  >
                    ₹
                    {Number(
                      option.price ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}{" "}
                    • Stock:{" "}
                    {option.quantity ??
                      0}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Product"
                placeholder="Search product..."
                required
                error={Boolean(
                  errors.productId
                )}
                helperText={
                  errors.productId
                }
                InputLabelProps={{
                  shrink: true,
                }}
                sx={
                  dialogFieldStyles
                }
              />
            )}
            sx={{
              mt: 1.2,
            }}
          />

          {/* ====================================================
              QUANTITY
          ===================================================== */}

          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={
              formData.quantity
            }
            onChange={handleChange}
            required
            inputProps={{
              min: 1,
              step: 1,
            }}
            error={Boolean(
              errors.quantity
            )}
            helperText={
              errors.quantity
            }
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              ...dialogFieldStyles,
              mt: 1.7,
            }}
          />

          {/* ====================================================
              CUSTOMER NAME
          ===================================================== */}

          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={
              formData.customerName
            }
            onChange={handleChange}
            required
            placeholder="Enter customer name"
            error={Boolean(
              errors.customerName
            )}
            helperText={
              errors.customerName
            }
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              ...dialogFieldStyles,
              mt: 1.7,
            }}
          />

          {/* ====================================================
              ORDER DATE
          ===================================================== */}

          <TextField
            fullWidth
            label="Order Date"
            name="orderDate"
            type="date"
            value={formData.orderDate}
            onChange={handleChange}
            required
            error={Boolean(errors.orderDate)}
            helperText={errors.orderDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              ...dialogFieldStyles,
              mt: 1.7,
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                filter: "invert(1)",
                opacity: 0.75,
                cursor: "pointer",
              },
            }}
          />

          {/* ====================================================
              STATUS
          ===================================================== */}

          <FormControl
            fullWidth
            error={Boolean(
              errors.status
            )}
            sx={{
              mt: 1.7,

              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: 12.5,
                backgroundColor:
                  "#171d29",
                px: 0.5,
              },

              "& .MuiInputLabel-root.Mui-focused":
                {
                  color:
                    "#60a5fa",
                },

              "& .MuiInputLabel-root.MuiInputLabel-shrink":
                {
                  backgroundColor:
                    "#171d29",
                },
            }}
          >
            <InputLabel>
              Status
            </InputLabel>

            <Select
              value={
                formData.status
              }
              label="Status"
              onChange={handleChange}
              name="status"
              sx={{
                minHeight: 48,
                color: "#f8fafc",
                fontSize: 12.5,
                borderRadius: 1.4,
                backgroundColor:
                  "#111827",

                "& .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "rgba(148,163,184,0.12)",
                  },

                "&:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "rgba(96,165,250,0.30)",
                  },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "#3b82f6",
                  },

                "& .MuiSelect-icon": {
                  color:
                    "#64748b",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 0.5,
                    backgroundColor:
                      "#111827",
                    color:
                      "#f8fafc",
                    border:
                      "1px solid rgba(59,130,246,0.18)",
                    borderRadius:
                      "10px",
                    boxShadow:
                      "0 20px 50px rgba(0,0,0,0.45)",
                    overflow:
                      "hidden",

                    "& .MuiMenuItem-root":
                      {
                        color:
                          "#f8fafc",
                        backgroundColor:
                          "#111827",
                        fontSize:
                          13,
                        minHeight:
                          42,
                        px: 2,

                        "&:hover":
                          {
                            backgroundColor:
                              "rgba(59,130,246,0.12)",
                            color:
                              "#ffffff",
                          },

                        "&.Mui-selected":
                          {
                            backgroundColor:
                              "rgba(59,130,246,0.20)",
                            color:
                              "#ffffff",
                          },

                        "&.Mui-selected:hover":
                          {
                            backgroundColor:
                              "rgba(59,130,246,0.26)",
                            color:
                              "#ffffff",
                          },
                      },
                  },
                },
              }}
            >
              <MenuItem value="Pending">
                Pending
              </MenuItem>

              <MenuItem value="Approved">
                Approved
              </MenuItem>

              <MenuItem value="Delivered">
                Delivered
              </MenuItem>

              <MenuItem value="Cancelled">
                Cancelled
              </MenuItem>
            </Select>

            {errors.status && (
              <Typography
                sx={{
                  mt: 0.5,
                  ml: 1.5,
                  color: "#f87171",
                  fontSize: 10,
                }}
              >
                {errors.status}
              </Typography>
            )}
          </FormControl>
        </DialogContent>

        {/* ======================================================
            DIALOG ACTIONS
        ======================================================= */}

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
            startIcon={
              saving ? null : editingOrder ? (
                <Edit />
              ) : (
                <Add />
              )
            }
            sx={primaryButtonStyles}
          >
            {saving ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                }}
              >
                <CircularProgress
                  size={16}
                  sx={{
                    color:
                      "#ffffff",
                  }}
                />

                {editingOrder
                  ? "Updating..."
                  : "Creating..."}
              </Box>
            ) : editingOrder ? (
              "Update Order"
            ) : (
              "Create Order"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================
          DELETE DIALOG
      ========================================================= */}

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
          Delete Sales Order
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
            delete this sales order for{" "}
            <Box
              component="span"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
              }}
            >
              {orderToDelete?.customerName ||
                ""}
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
              handleDeleteConfirm
            }
            disabled={saving}
            startIcon={
              saving ? null : (
                <Delete />
              )
            }
            sx={{
              ...primaryButtonStyles,
              background:
                "#dc2626",

              "&:hover": {
                background:
                  "#b91c1c",
              },
            }}
          >
            {saving ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                }}
              >
                <CircularProgress
                  size={16}
                  sx={{
                    color:
                      "#ffffff",
                  }}
                />

                Deleting...
              </Box>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================
          SNACKBAR
      ========================================================= */}

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={
          3500
        }
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
            width: "100%",
            borderRadius: 1.5,
          }}
        >
          {
            snackbar.message
          }
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

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
          "1px solid rgba(59,130,246,0.13)",
        background:
          "linear-gradient(145deg, rgba(23,29,41,0.97), rgba(15,23,42,0.96))",
        boxShadow:
          "0 12px 30px rgba(2,6,23,0.18)",
        transition:
          "all 0.2s ease",

        "&:hover": {
          transform:
            "translateY(-2px)",
          borderColor:
            "rgba(59,130,246,0.23)",
          boxShadow:
            "0 16px 36px rgba(2,6,23,0.24)",
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
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 11.5,
              fontWeight: 600,
              textTransform:
                "uppercase",
              letterSpacing:
                "0.04em",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.9,
              color: "#f8fafc",
              fontSize: 26,
              lineHeight: 1,
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
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 1.5,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            color: iconColor,
            background:
              `linear-gradient(145deg, ${iconBg}, rgba(15,23,42,0.35))`,
            border:
              `1px solid ${iconBg}`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Box>
  );
}

// ============================================================
// TABLE HEADER
// ============================================================

function TableHeader({
  children,
  align = "left",
}) {
  return (
    <Typography
      sx={{
        color: "#cbd5e1",
        fontSize: 9.5,
        fontWeight: 800,
        letterSpacing:
          "0.9px",
        textAlign: align,
      }}
    >
      {children}
    </Typography>
  );
}

// ============================================================
// SEARCH
// ============================================================

const searchFieldStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    color: "#f8fafc",
    fontSize: 12.5,
    borderRadius: 1.5,
    background:
      "rgba(23,29,41,0.94)",
    backdropFilter:
      "blur(10px)",

    "& fieldset": {
      borderColor:
        "rgba(59,130,246,0.13)",
    },

    "&:hover fieldset": {
      borderColor:
        "rgba(59,130,246,0.24)",
    },

    "&.Mui-focused fieldset": {
      borderColor:
        "#3b82f6",
      boxShadow:
        "0 0 0 2px rgba(59,130,246,0.08)",
    },

    "& input": {
      color: "#f8fafc",
    },

    "& input::placeholder": {
      color: "#64748b",
      opacity: 1,
    },
  },
};

// ============================================================
// DIALOG
// ============================================================

const dialogPaperStyles = {
  background:
    "linear-gradient(145deg, #171d29 0%, #101722 100%)",

  backgroundImage:
    "radial-gradient(circle at 100% 0%, rgba(59,130,246,0.14), transparent 40%), linear-gradient(145deg, #171d29 0%, #101722 100%)",

  color: "#f8fafc",

  border:
    "1px solid rgba(59,130,246,0.16)",

  borderRadius: "18px",

  boxShadow:
    "0 25px 70px rgba(0,0,0,0.50)",
};

const dialogTitleStyles = {
  color: "#f8fafc",
  fontSize: 18,
  fontWeight: 700,
  pb: 0.8,
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
    backgroundColor:
      "#171d29",
    px: 0.5,
  },

  "& .MuiInputLabel-root.Mui-focused":
    {
      color: "#60a5fa",
    },

  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    color: "#f8fafc",
    fontSize: 12.5,
    borderRadius: 1.4,
    backgroundColor:
      "#111827",

    "& fieldset": {
      borderColor:
        "rgba(148,163,184,0.12)",
    },

    "&:hover fieldset": {
      borderColor:
        "rgba(96,165,250,0.30)",
    },

    "&.Mui-focused fieldset": {
      borderColor:
        "#3b82f6",
    },

    "&.Mui-error fieldset": {
      borderColor:
        "#ef4444",
    },

    "& input": {
      color: "#f8fafc",
    },

    "& input::placeholder": {
      color: "#64748b",
      opacity: 1,
    },
  },

  "& .MuiFormHelperText-root": {
    color: "#f87171",
    fontSize: 10,
  },
};

// ============================================================
// BUTTONS
// ============================================================

const cancelButtonStyles = {
  color: "#94a3b8",
  textTransform:
    "none",
  fontSize: 12.5,
  fontWeight: 600,

  "&:hover": {
    backgroundColor:
      "rgba(255,255,255,0.04)",
  },
};

const primaryButtonStyles = {
  minHeight: 40,
  px: 2,
  borderRadius: 1.3,
  textTransform:
    "none",
  background:
    "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
  fontSize: 12.5,
  fontWeight: 650,
  boxShadow:
    "0 8px 22px rgba(37,99,235,0.22)",

  "&:hover": {
    background:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
  },
};

export default SalesOrders;