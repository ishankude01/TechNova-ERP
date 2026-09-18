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
  Inventory2,
  Search,
  Category,
  WarningAmber,
} from "@mui/icons-material";

import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openAddDialog, setOpenAddDialog] =
    useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  const [openEditDialog, setOpenEditDialog] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);

  const [deletingProduct, setDeletingProduct] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [notification, setNotification] =
    useState({
      open: false,
      message: "",
      severity: "success",
    });

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

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

      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to load products.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ============================================================
  // ADD PRODUCT
  // ============================================================

  const handleOpenAddDialog = () => {
    setNewProduct({
      name: "",
      price: "",
      quantity: "",
      category: "",
    });

    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    if (!saving) {
      setOpenAddDialog(false);
    }
  };

  const handleNewProductChange = (event) => {
    setNewProduct({
      ...newProduct,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleAddProduct = async () => {
    if (
      !newProduct.name.trim() ||
      newProduct.price === "" ||
      newProduct.quantity === "" ||
      !newProduct.category.trim()
    ) {
      setNotification({
        open: true,
        message:
          "Please fill in all product fields.",
        severity: "error",
      });

      return;
    }

    if (
      Number(newProduct.price) < 0 ||
      Number(newProduct.quantity) < 0
    ) {
      setNotification({
        open: true,
        message:
          "Price and quantity cannot be negative.",
        severity: "error",
      });

      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await api.post(
        "/products",
        {
          name: newProduct.name.trim(),
          price: Number(
            newProduct.price
          ),
          quantity: Number(
            newProduct.quantity
          ),
          category:
            newProduct.category.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(
        (currentProducts) => [
          ...currentProducts,
          response.data.product,
        ]
      );

      setOpenAddDialog(false);

      setNewProduct({
        name: "",
        price: "",
        quantity: "",
        category: "",
      });

      setNotification({
        open: true,
        message:
          "Product added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(
        "Error adding product:",
        error
      );

      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to add product.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // EDIT PRODUCT
  // ============================================================

  const handleOpenEditDialog = (
    product
  ) => {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });

    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    if (!saving) {
      setOpenEditDialog(false);
      setEditingProduct(null);
    }
  };

  const handleEditingProductChange = (
    event
  ) => {
    setEditingProduct({
      ...editingProduct,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    if (
      !editingProduct.name.trim() ||
      editingProduct.price === "" ||
      editingProduct.quantity === "" ||
      !editingProduct.category.trim()
    ) {
      setNotification({
        open: true,
        message:
          "Please fill in all product fields.",
        severity: "error",
      });

      return;
    }

    if (
      Number(editingProduct.price) < 0 ||
      Number(editingProduct.quantity) < 0
    ) {
      setNotification({
        open: true,
        message:
          "Price and quantity cannot be negative.",
        severity: "error",
      });

      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await api.put(
        `/products/${editingProduct._id}`,
        {
          name:
            editingProduct.name.trim(),
          price: Number(
            editingProduct.price
          ),
          quantity: Number(
            editingProduct.quantity
          ),
          category:
            editingProduct.category.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(
        (currentProducts) =>
          currentProducts.map(
            (product) =>
              product._id ===
              editingProduct._id
                ? response.data.product
                : product
          )
      );

      setOpenEditDialog(false);
      setEditingProduct(null);

      setNotification({
        open: true,
        message:
          "Product updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(
        "Error updating product:",
        error
      );

      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to update product.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const handleOpenDeleteDialog = (
    product
  ) => {
    setDeletingProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!saving) {
      setOpenDeleteDialog(false);
      setDeletingProduct(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      await api.delete(
        `/products/${deletingProduct._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product._id !==
              deletingProduct._id
          )
      );

      setOpenDeleteDialog(false);
      setDeletingProduct(null);

      setNotification({
        open: true,
        message:
          "Product deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to delete product.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredProducts =
    products.filter((product) => {
      const searchText =
        search.toLowerCase();

      return (
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.category
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  // ============================================================
  // SUMMARY
  // ============================================================

  const totalProducts =
    products.length;

  const categories = new Set(
    products.map(
      (product) => product.category
    )
  ).size;

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.quantity) <= 5
    ).length;

  const totalStock =
    products.reduce(
      (total, product) =>
        total +
        (Number(product.quantity) ||
          0),
      0
    );

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString(
      "en-IN"
    );

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
              Products
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
                Products
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
            Add Product
          </Button>
        </Box>

        {/* SUMMARY */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <SummaryCard
            title="Total products"
            value={totalProducts}
            subtitle="Products in catalog"
            icon={<Inventory2 />}
            iconColor="#60a5fa"
            iconBg="rgba(59,130,246,0.12)"
          />

          <SummaryCard
            title="Categories"
            value={categories}
            subtitle="Product categories"
            icon={<Category />}
            iconColor="#a78bfa"
            iconBg="rgba(168,85,247,0.12)"
          />

          <SummaryCard
            title="Total stock"
            value={totalStock}
            subtitle="Units currently available"
            icon={<Inventory2 />}
            iconColor="#4ade80"
            iconBg="rgba(34,197,94,0.12)"
          />

          <SummaryCard
            title="Low stock"
            value={lowStockProducts}
            subtitle="Products with ≤ 5 units"
            icon={<WarningAmber />}
            iconColor="#fbbf24"
            iconBg="rgba(245,158,11,0.12)"
            warning={
              lowStockProducts > 0
            }
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
            placeholder="Search products by name or category..."
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
                md: "grid",
              },
              gridTemplateColumns:
                "2fr 1.3fr 1fr 0.9fr 1fr 100px",
              gap: 1,
              px: 2,
              py: 1.5,
              background:
                "linear-gradient(90deg, #131b2a, #17243b)",
              borderBottom:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <TableHeader>PRODUCT</TableHeader>
            <TableHeader>CATEGORY</TableHeader>
            <TableHeader>PRICE</TableHeader>
            <TableHeader>STOCK</TableHeader>
            <TableHeader>STATUS</TableHeader>
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
          ) : filteredProducts.length ===
            0 ? (
            <Box
              sx={{
                py: 8,
                px: 2,
                textAlign: "center",
              }}
            >
              <Inventory2
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
                  fontWeight: 600,
                }}
              >
                No products found
              </Typography>
            </Box>
          ) : (
            <Box>
              {filteredProducts.map(
                (product) => {
                  const isLowStock =
                    Number(
                      product.quantity
                    ) <= 5;

                  return (
                    <Box
                      key={
                        product._id
                      }
                      sx={{
                        display: {
                          xs: "block",
                          md: "grid",
                        },
                        gridTemplateColumns:
                          "2fr 1.3fr 1fr 0.9fr 1fr 100px",
                        gap: 1,
                        alignItems:
                          "center",
                        px: 2,
                        py: {
                          xs: 1.8,
                          md: 1.5,
                        },
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
                          mb: {
                            xs: 1.5,
                            md: 0,
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
                          <Inventory2
                            sx={{
                              fontSize: 18,
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
                                "#e2e8f0",
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
                            {
                              product.name
                            }
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.2,
                              color:
                                "#475569",
                              fontSize:
                                9.5,
                            }}
                          >
                            Product ID:{" "}
                            {product._id?.slice(
                              -6
                            )}
                          </Typography>
                        </Box>
                      </Box>

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
                            product.category
                          }
                          size="small"
                          sx={{
                            height: 25,
                            borderRadius:
                              1,
                            color:
                              "#60a5fa",
                            backgroundColor:
                              "rgba(59,130,246,0.10)",
                            border:
                              "1px solid rgba(59,130,246,0.08)",
                            fontSize: 10,
                            fontWeight:
                              600,
                          }}
                        />
                      </Box>

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
                              "#e2e8f0",
                            fontSize:
                              12,
                            fontWeight:
                              600,
                          }}
                        >
                          ₹
                          {formatPrice(
                            product.price
                          )}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              "#475569",
                            fontSize:
                              9.5,
                          }}
                        >
                          Per unit
                        </Typography>
                      </Box>

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
                              "#e2e8f0",
                            fontSize:
                              12,
                            fontWeight:
                              650,
                          }}
                        >
                          {
                            product.quantity
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
                            isLowStock
                              ? "Low stock"
                              : "In stock"
                          }
                          size="small"
                          sx={{
                            height: 25,
                            borderRadius:
                              1,
                            color:
                              isLowStock
                                ? "#fbbf24"
                                : "#4ade80",
                            backgroundColor:
                              isLowStock
                                ? "rgba(245,158,11,0.10)"
                                : "rgba(34,197,94,0.10)",
                            fontSize:
                              10,
                            fontWeight:
                              600,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display:
                            "flex",
                          justifyContent:
                            {
                              xs: "flex-start",
                              md: "flex-end",
                            },
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleOpenEditDialog(
                              product
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
                              product
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
                  );
                }
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* ======================================================
          ADD PRODUCT
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
        <DialogTitle
          sx={dialogTitleStyles}
        >
          Add new product
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
            Add a product to your ERP
            inventory.
          </Typography>

          <DarkTextField
            label="Product name"
            name="name"
            value={newProduct.name}
            onChange={
              handleNewProductChange
            }
          />

          <DarkTextField
            label="Price"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={
              handleNewProductChange
            }
          />

          <DarkTextField
            label="Quantity"
            name="quantity"
            type="number"
            value={
              newProduct.quantity
            }
            onChange={
              handleNewProductChange
            }
          />

          <DarkTextField
            label="Category"
            name="category"
            value={
              newProduct.category
            }
            onChange={
              handleNewProductChange
            }
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
            onClick={handleAddProduct}
            disabled={saving}
            sx={primaryButtonStyles}
          >
            {saving
              ? "Adding..."
              : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================
          EDIT PRODUCT
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
        <DialogTitle
          sx={dialogTitleStyles}
        >
          Edit product
        </DialogTitle>

        <DialogContent
          sx={{
            pt: "14px !important",
          }}
        >
          {editingProduct && (
            <>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 11.5,
                  mb: 1.5,
                }}
              >
                Update the product
                information below.
              </Typography>

              <DarkTextField
                label="Product name"
                name="name"
                value={
                  editingProduct.name
                }
                onChange={
                  handleEditingProductChange
                }
              />

              <DarkTextField
                label="Price"
                name="price"
                type="number"
                value={
                  editingProduct.price
                }
                onChange={
                  handleEditingProductChange
                }
              />

              <DarkTextField
                label="Quantity"
                name="quantity"
                type="number"
                value={
                  editingProduct.quantity
                }
                onChange={
                  handleEditingProductChange
                }
              />

              <DarkTextField
                label="Category"
                name="category"
                value={
                  editingProduct.category
                }
                onChange={
                  handleEditingProductChange
                }
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
              handleUpdateProduct
            }
            disabled={saving}
            sx={primaryButtonStyles}
          >
            {saving
              ? "Updating..."
              : "Update Product"}
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
        <DialogTitle
          sx={dialogTitleStyles}
        >
          Delete product?
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
              {deletingProduct?.name}
            </Box>
            ?
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#64748b",
              fontSize: 11,
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
              handleDeleteProduct
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

      {/* SNACKBAR */}

      <Snackbar
        open={
          notification.open
        }
        autoHideDuration={3000}
        onClose={() =>
          setNotification(
            (previous) => ({
              ...previous,
              open: false,
            })
          )
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={
            notification.severity
          }
          variant="filled"
          onClose={() =>
            setNotification(
              (previous) => ({
                ...previous,
                open: false,
              })
            )
          }
          sx={{
            borderRadius: 1.5,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ============================================================
// COMMON COMPONENTS
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
  warning = false,
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
        boxShadow:
          "0 12px 30px rgba(2,6,23,0.12)",
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
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.9,
              color: warning
                ? "#fbbf24"
                : "#f8fafc",
              fontSize: 25,
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
        letterSpacing:
          "1px",
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

// ============================================================
// STYLES
// ============================================================

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

    "& input::placeholder": {
      color: "#64748b",
      opacity: 1,
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
      boxShadow:
        "0 0 0 2px rgba(59,130,246,0.08)",
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

    "& input::placeholder": {
      color: "#64748b",
      opacity: 1,
    },

    "& input:-webkit-autofill": {
      WebkitBoxShadow:
        "0 0 0 1000px #111827 inset",
      WebkitTextFillColor:
        "#f8fafc",
      caretColor: "#f8fafc",
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
  boxShadow:
    "0 8px 22px rgba(37,99,235,0.22)",

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

export default Products;