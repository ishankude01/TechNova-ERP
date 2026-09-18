import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  LinearProgress,
  Snackbar,
  Typography,
} from "@mui/material";

import {
  Assessment,
  Inventory2,
  ReceiptLong,
  ShoppingCart,
  Storefront,
} from "@mui/icons-material";

import api from "../services/api";

function Reports() {
  // ============================================================
  // STATE
  // ============================================================

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ============================================================
  // AUTH
  // ============================================================

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

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

  const closeSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  // ============================================================
  // FETCH REPORTS
  // ============================================================

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await api.get("/reports", {
        headers,
      });

      setReport(response.data);
    } catch (error) {
      console.error(
        "Error fetching reports:",
        error
      );

      showSnackbar(
        error.response?.data?.message ||
          "Failed to fetch reports",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchReports();
  }, []);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <Box
        sx={{
          position: "relative",
          minHeight:
            "calc(100vh - 76px)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AtmosphericGlow />

        <CircularProgress
          size={32}
          sx={{
            color: "#3b82f6",
          }}
        />
      </Box>
    );
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!report) {
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
            xs: 3.5,
            md: 4,
          },
        }}
      >
        <AtmosphericGlow />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: {
                xs: 25,
                md: 29,
              },
              fontWeight: 750,
            }}
          >
            Reports
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              mt: 0.7,
              fontSize: 12.5,
            }}
          >
            No report data available.
          </Typography>
        </Box>
      </Box>
    );
  }

  // ============================================================
  // REPORT DATA
  // ============================================================

  const salesSummary =
    report.salesSummary || {};

  const purchaseSummary =
    report.purchaseSummary || {};

  const invoiceSummary =
    report.invoiceSummary || {};

  const inventorySummary =
    report.inventorySummary || {};

  const totalSalesOrders =
    salesSummary.totalSalesOrders || 0;

  const totalSalesQuantity =
    salesSummary.totalSalesQuantity || 0;

  const totalPurchaseOrders =
    purchaseSummary.totalPurchaseOrders || 0;

  const totalPurchaseQuantity =
    purchaseSummary.totalPurchaseQuantity || 0;

  const totalInvoices =
    invoiceSummary.totalInvoices || 0;

  const totalInvoiceAmount =
    invoiceSummary.totalInvoiceAmount || 0;

  const totalProducts =
    inventorySummary.totalProducts || 0;

  const totalStock =
    inventorySummary.totalStock || 0;

  // ============================================================
  // HELPERS
  // ============================================================

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN"
    );
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

        // Increased top padding to prevent
        // heading from going underneath navbar
        px: {
          xs: 1.8,
          sm: 2.3,
          md: 3,
        },
        py: {
          xs: 3.5,
          md: 4,
        },
      }}
    >
      {/* ========================================================
          BLUE ATMOSPHERIC GLOW
      ========================================================= */}

      <AtmosphericGlow />

      {/* ========================================================
          MAIN CONTENT
      ========================================================= */}

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
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            gap: 1.5,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#60a5fa",
              background:
                "linear-gradient(145deg, rgba(59,130,246,0.16), rgba(37,99,235,0.07))",
              border:
                "1px solid rgba(59,130,246,0.10)",
            }}
          >
            <Assessment
              sx={{
                fontSize: 22,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#f8fafc",
                fontSize: {
                  xs: 25,
                  md: 29,
                },
                fontWeight: 750,
                lineHeight: 1.1,
                letterSpacing:
                  "-0.6px",
              }}
            >
              Reports
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 12.5,
                mt: 0.6,
              }}
            >
              Overview of your ERP business operations
            </Typography>
          </Box>
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
            title="Sales orders"
            value={formatNumber(
              totalSalesOrders
            )}
            subtitle={`Quantity sold: ${formatNumber(
              totalSalesQuantity
            )}`}
            icon={<ShoppingCart />}
            iconColor="#60a5fa"
            iconBg="rgba(59,130,246,0.12)"
          />

          <SummaryCard
            title="Purchase orders"
            value={formatNumber(
              totalPurchaseOrders
            )}
            subtitle={`Quantity purchased: ${formatNumber(
              totalPurchaseQuantity
            )}`}
            icon={<Storefront />}
            iconColor="#a78bfa"
            iconBg="rgba(168,85,247,0.11)"
          />

          <SummaryCard
            title="Invoices"
            value={formatNumber(
              totalInvoices
            )}
            subtitle={`Invoice value: ₹${formatNumber(
              totalInvoiceAmount
            )}`}
            icon={<ReceiptLong />}
            iconColor="#34d399"
            iconBg="rgba(52,211,153,0.10)"
          />

          <SummaryCard
            title="Products"
            value={formatNumber(
              totalProducts
            )}
            subtitle={`Total stock: ${formatNumber(
              totalStock
            )}`}
            icon={<Inventory2 />}
            iconColor="#fbbf24"
            iconBg="rgba(251,191,36,0.10)"
          />
        </Box>

        {/* ======================================================
            DETAILED REPORTS
        ======================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          {/* SALES */}

          <ReportCard
            title="Sales Summary"
            icon={<ShoppingCart />}
            iconColor="#60a5fa"
          >
            <ReportMetric
              label="Total Sales Orders"
              value={formatNumber(
                totalSalesOrders
              )}
              progress={
                totalSalesOrders > 0
                  ? 100
                  : 0
              }
            />

            <ReportMetric
              label="Total Sales Quantity"
              value={formatNumber(
                totalSalesQuantity
              )}
              progress={
                totalSalesQuantity > 0
                  ? 100
                  : 0
              }
            />
          </ReportCard>

          {/* PURCHASE */}

          <ReportCard
            title="Purchase Summary"
            icon={<Storefront />}
            iconColor="#a78bfa"
          >
            <ReportMetric
              label="Total Purchase Orders"
              value={formatNumber(
                totalPurchaseOrders
              )}
              progress={
                totalPurchaseOrders > 0
                  ? 100
                  : 0
              }
            />

            <ReportMetric
              label="Total Purchase Quantity"
              value={formatNumber(
                totalPurchaseQuantity
              )}
              progress={
                totalPurchaseQuantity > 0
                  ? 100
                  : 0
              }
            />
          </ReportCard>

          {/* INVOICE */}

          <ReportCard
            title="Invoice Summary"
            icon={<ReceiptLong />}
            iconColor="#34d399"
          >
            <ReportMetric
              label="Total Invoices"
              value={formatNumber(
                totalInvoices
              )}
              progress={
                totalInvoices > 0
                  ? 100
                  : 0
              }
            />

            <ReportMetric
              label="Total Invoice Amount"
              value={`₹${formatNumber(
                totalInvoiceAmount
              )}`}
              progress={
                totalInvoiceAmount > 0
                  ? 100
                  : 0
              }
            />
          </ReportCard>

          {/* INVENTORY */}

          <ReportCard
            title="Inventory Summary"
            icon={<Inventory2 />}
            iconColor="#fbbf24"
          >
            <ReportMetric
              label="Total Products"
              value={formatNumber(
                totalProducts
              )}
              progress={
                totalProducts > 0
                  ? 100
                  : 0
              }
            />

            <ReportMetric
              label="Total Stock"
              value={formatNumber(
                totalStock
              )}
              progress={
                totalStock > 0
                  ? 100
                  : 0
              }
            />
          </ReportCard>
        </Box>
      </Box>

      {/* ========================================================
          SNACKBAR
      ========================================================= */}

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
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 1.5,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ============================================================
// ATMOSPHERIC GLOW
// ============================================================

function AtmosphericGlow() {
  return (
    <>
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
          pointerEvents: "none",
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
          pointerEvents: "none",
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
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
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
        <Box
          sx={{
            minWidth: 0,
          }}
        >
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
              fontSize:
                title === "Invoices"
                  ? 24
                  : 26,
              lineHeight: 1.1,
              fontWeight: 750,
              whiteSpace:
                "nowrap",
              overflow:
                "hidden",
              textOverflow:
                "ellipsis",
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
// REPORT CARD
// ============================================================

function ReportCard({
  title,
  icon,
  iconColor,
  children,
}) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border:
          "1px solid rgba(59,130,246,0.13)",
        background:
          "linear-gradient(145deg, rgba(23,29,41,0.98), rgba(15,23,42,0.96))",
        boxShadow:
          "0 18px 45px rgba(2,6,23,0.20)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          px: 2.3,
          py: 1.8,
          background:
            "linear-gradient(90deg, rgba(30,64,175,0.20), rgba(37,99,235,0.08), transparent)",
          borderBottom:
            "1px solid rgba(148,163,184,0.08)",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            backgroundColor:
              "rgba(59,130,246,0.08)",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            color: "#f1f5f9",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          p: {
            xs: 2,
            md: 2.3,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

// ============================================================
// REPORT METRIC
// ============================================================

function ReportMetric({
  label,
  value,
  progress,
}) {
  return (
    <Box sx={{ mb: 2.4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 2,
          mb: 0.9,
        }}
      >
        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: 12,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            color: "#f1f5f9",
            fontSize: 12.5,
            fontWeight: 700,
            whiteSpace:
              "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 7,
          borderRadius: 10,
          backgroundColor:
            "rgba(59,130,246,0.08)",

          "& .MuiLinearProgress-bar": {
            borderRadius: 10,
            background:
              "linear-gradient(90deg, #2563eb, #60a5fa)",
          },
        }}
      />
    </Box>
  );
}

export default Reports;