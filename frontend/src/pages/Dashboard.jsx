import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  Inventory2,
  ShoppingCart,
  PendingActions,
  CheckCircle,
  ArrowForward,
  LocalShipping,
} from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalPurchaseOrders: 0,
    totalGRN: 0,
    totalInvoices: 0,
    totalStock: 0,
  });

  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [period, setPeriod] = useState("9M");
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH DASHBOARD + ORDER DATA
  // ============================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          dashboardResponse,
          salesResponse,
          purchaseResponse,
        ] = await Promise.all([
          api.get("/dashboard", {
            headers,
          }),

          api.get(
            "/sales-orders?page=1&limit=1000",
            {
              headers,
            }
          ),

          api.get(
            "/purchase-orders?page=1&limit=1000",
            {
              headers,
            }
          ),
        ]);

        setDashboardData((previous) => ({
          ...previous,
          ...dashboardResponse.data,
        }));

        const salesList =
          salesResponse.data.salesOrders ||
          salesResponse.data.orders ||
          salesResponse.data.salesOrder ||
          salesResponse.data.data ||
          [];

        const purchaseList =
          purchaseResponse.data.purchaseOrders ||
          purchaseResponse.data.orders ||
          purchaseResponse.data.purchaseOrder ||
          purchaseResponse.data.data ||
          [];

        setSalesOrders(
          Array.isArray(salesList)
            ? salesList
            : []
        );

        setPurchaseOrders(
          Array.isArray(purchaseList)
            ? purchaseList
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ============================================================
  // SALES ORDER STATUS COUNTS
  // ============================================================

  const pendingSalesOrders =
    salesOrders.filter(
      (order) => order.status === "Pending"
    ).length;

  const approvedSalesOrders =
    salesOrders.filter(
      (order) => order.status === "Approved"
    ).length;

  const deliveredSalesOrders =
    salesOrders.filter(
      (order) => order.status === "Delivered"
    ).length;

  const cancelledSalesOrders =
    salesOrders.filter(
      (order) => order.status === "Cancelled"
    ).length;

  // Pending + Approved = currently open/in fulfilment
  const openSalesOrders =
    pendingSalesOrders +
    approvedSalesOrders;

  // ============================================================
  // TOTAL VALID ORDERS FOR FULFILMENT
  // ============================================================

  const activeSalesOrders =
    pendingSalesOrders +
    approvedSalesOrders +
    deliveredSalesOrders;

  const fulfilledPercentage =
    activeSalesOrders > 0
      ? (deliveredSalesOrders /
          activeSalesOrders) *
        100
      : 0;

  const pendingPercentage =
    activeSalesOrders > 0
      ? (openSalesOrders /
          activeSalesOrders) *
        100
      : 0;

  // ============================================================
  // MONTH DATA
  // ============================================================

  const chartData = useMemo(() => {
    const monthCount =
      period === "9M" ? 9 : 12;

    const months = [];

    const today = new Date();

    for (
      let i = monthCount - 1;
      i >= 0;
      i--
    ) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );

      months.push({
        key: `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`,
        label: date.toLocaleString(
          "en-US",
          {
            month: "short",
          }
        ),
        salesQuantity: 0,
        purchaseQuantity: 0,
      });
    }

    const monthMap = new Map(
      months.map((month) => [
        month.key,
        month,
      ])
    );

    // ----------------------------------------------------------
    // SALES
    // ----------------------------------------------------------

    salesOrders.forEach((order) => {
      if (!order.orderDate) {
        return;
      }

      const date = new Date(
        order.orderDate
      );

      if (
        Number.isNaN(date.getTime())
      ) {
        return;
      }

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const month = monthMap.get(key);

      if (month) {
        month.salesQuantity +=
          Number(order.quantity) || 0;
      }
    });

    // ----------------------------------------------------------
    // PURCHASES
    // ----------------------------------------------------------

    purchaseOrders.forEach((order) => {
      if (!order.orderDate) {
        return;
      }

      const date = new Date(
        order.orderDate
      );

      if (
        Number.isNaN(date.getTime())
      ) {
        return;
      }

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const month = monthMap.get(key);

      if (month) {
        month.purchaseQuantity +=
          Number(order.quantity) || 0;
      }
    });

    return months;
  }, [
    period,
    salesOrders,
    purchaseOrders,
  ]);

  // ============================================================
  // CHART MAX
  // ============================================================

  const chartMax = useMemo(() => {
    const values = chartData.flatMap(
      (month) => [
        month.salesQuantity,
        month.purchaseQuantity,
      ]
    );

    const maxValue =
      values.length > 0
        ? Math.max(...values)
        : 0;

    return maxValue > 0
      ? maxValue
      : 1;
  }, [chartData]);

  // ============================================================
  // STAT CARDS
  // ============================================================

  const statCards = [
    {
      title: "Sales orders",
      value:
        salesOrders.length ||
        dashboardData.totalOrders ||
        0,
      subtitle: "Total sales orders",
      icon: <ShoppingCart />,
      iconColor: "#60a5fa",
      iconBg: "rgba(59,130,246,0.12)",
      path: "/sales-orders",
    },

    {
      title: "Purchase orders",
      value:
        purchaseOrders.length ||
        dashboardData.totalPurchaseOrders ||
        0,
      subtitle: "Total purchase orders",
      icon: <Inventory2 />,
      iconColor: "#a78bfa",
      iconBg: "rgba(168,85,247,0.12)",
      path: "/purchase-orders",
    },

    {
      title: "Goods received",
      value:
        dashboardData.totalGRN ||
        0,
      subtitle: "GRN / received",
      icon: <LocalShipping />,
      iconColor: "#4ade80",
      iconBg: "rgba(34,197,94,0.12)",
      path: "/grn",
    },

    {
      title: "Invoices",
      value:
        dashboardData.totalInvoices ||
        0,
      subtitle: "Invoices generated",
      icon: <CheckCircle />,
      iconColor: "#fbbf24",
      iconBg: "rgba(245,158,11,0.12)",
      path: "/invoices",
    },
  ];

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight:
            "calc(100vh - 76px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 75% 20%, rgba(59,130,246,0.16), transparent 32%), radial-gradient(circle at 10% 55%, rgba(30,64,175,0.10), transparent 35%)",
        }}
      >
        <CircularProgress
          sx={{
            color: "#3b82f6",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight:
          "calc(100vh - 76px)",
        overflow: "hidden",
      }}
    >
      {/* ======================================================
          BLUE ATMOSPHERIC BACKGROUND
      ======================================================= */}

      <Box
        sx={{
          position: "absolute",
          top: -260,
          right: -180,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(37,99,235,0.10) 35%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 120,
          left: -360,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(30,64,175,0.13) 0%, rgba(37,99,235,0.06) 42%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: -350,
          right: 180,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ====================================================
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
                  xs: 27,
                  md: 31,
                },
                fontWeight: 750,
                color: "#f8fafc",
                letterSpacing:
                  "-0.7px",
              }}
            >
              Dashboard
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
                Dashboard
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            endIcon={
              <ArrowForward />
            }
            onClick={() =>
              navigate(
                "/sales-orders"
              )
            }
            sx={{
              minHeight: 44,
              px: 2.3,
              borderRadius: 1.5,
              textTransform:
                "none",
              fontSize: 13,
              fontWeight: 650,
              background:
                "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow:
                "0 10px 30px rgba(37,99,235,0.24)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #1d4ed8, #2563eb)",
                boxShadow:
                  "0 12px 35px rgba(37,99,235,0.32)",
              },
            }}
          >
            View Orders
          </Button>
        </Box>

        {/* ====================================================
            STAT CARDS
        ===================================================== */}

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
          {statCards.map(
            (card) => (
              <Box
                key={card.title}
                onClick={() =>
                  navigate(
                    card.path
                  )
                }
                sx={{
                  minHeight: 135,
                  p: 2,
                  borderRadius: 2,
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  backgroundColor:
                    "rgba(23,29,41,0.96)",
                  boxShadow:
                    "0 14px 35px rgba(2,6,23,0.14)",
                  cursor: "pointer",
                  transition:
                    "all 0.2s ease",

                  "&:hover": {
                    transform:
                      "translateY(-3px)",
                    borderColor:
                      "rgba(59,130,246,0.18)",
                    backgroundColor:
                      "#1a2130",
                    boxShadow:
                      "0 18px 40px rgba(2,6,23,0.20)",
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
                        color:
                          "#64748b",
                        fontSize: 11.5,
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1,
                        color:
                          "#f8fafc",
                        fontSize: 27,
                        lineHeight: 1,
                        fontWeight: 750,
                      }}
                    >
                      {card.value}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1.2,
                        color:
                          "#475569",
                        fontSize: 10,
                      }}
                    >
                      {card.subtitle}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      color:
                        card.iconColor,
                      backgroundColor:
                        card.iconBg,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </Box>
            )
          )}
        </Box>

        {/* ====================================================
            MAIN DASHBOARD GRID
        ===================================================== */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "0.95fr 1.7fr 0.95fr",
            },
            gap: 2,
            alignItems:
              "stretch",
          }}
        >
          {/* ==================================================
              ORDER FULFILMENT
          =================================================== */}

          <Card
            sx={{
              minHeight: 380,
              borderRadius: 2,
              backgroundColor:
                "rgba(23,29,41,0.96)",
              border:
                "1px solid rgba(255,255,255,0.06)",
              boxShadow:
                "0 18px 45px rgba(2,6,23,0.18)",
              backgroundImage:
                "none",
            }}
          >
            <CardContent
              sx={{
                p: 2.5,
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
                      color:
                        "#f8fafc",
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    Order fulfilment
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      color:
                        "#64748b",
                      fontSize: 11,
                    }}
                  >
                    Current order status
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color:
                      "#64748b",
                    fontSize: 19,
                    letterSpacing:
                      "2px",
                  }}
                >
                  •••
                </Typography>
              </Box>

              {/* Donut */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "center",
                  mt: 4,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 190,
                    height: 190,
                    borderRadius:
                      "50%",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    background: `conic-gradient(#3b82f6 ${fulfilledPercentage}%, #26364f ${fulfilledPercentage}% 100%)`,
                    position:
                      "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 142,
                      height: 142,
                      borderRadius:
                        "50%",
                      backgroundColor:
                        "#171d29",
                      display: "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          "#f8fafc",
                        fontSize: 24,
                        fontWeight: 750,
                      }}
                    >
                      {Math.round(
                        fulfilledPercentage
                      )}
                      %
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "#64748b",
                        fontSize: 10.5,
                        mt: 0.2,
                      }}
                    >
                      Fulfilled
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Legend */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 2,
                }}
              >
                <LegendItem
                  color="#3b82f6"
                  label="Fulfilled"
                  value={
                    deliveredSalesOrders
                  }
                />

                <LegendItem
                  color="#22c55e"
                  label="Pending"
                  value={
                    openSalesOrders
                  }
                />
              </Box>
            </CardContent>
          </Card>

          {/* ==================================================
              SALES & PURCHASES OVERVIEW
          =================================================== */}

          <Card
            sx={{
              minHeight: 380,
              borderRadius: 2,
              backgroundColor:
                "rgba(23,29,41,0.96)",
              border:
                "1px solid rgba(255,255,255,0.06)",
              boxShadow:
                "0 18px 45px rgba(2,6,23,0.18)",
              backgroundImage:
                "none",
            }}
          >
            <CardContent
              sx={{
                p: 2.5,
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
                      color:
                        "#f8fafc",
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    Sales & purchases overview
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      color:
                        "#64748b",
                      fontSize: 11,
                    }}
                  >
                    Quantity movement
                  </Typography>
                </Box>

                {/* Period Selector */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 0.6,
                  }}
                >
                  <Box
                    onClick={() =>
                      setPeriod("9M")
                    }
                    sx={{
                      px: 1,
                      py: 0.7,
                      borderRadius:
                        1,
                      backgroundColor:
                        period === "9M"
                          ? "#3b82f6"
                          : "#1e2634",
                      color:
                        period === "9M"
                          ? "#ffffff"
                          : "#64748b",
                      fontSize: 9.5,
                      fontWeight: 700,
                      cursor:
                        "pointer",
                      userSelect:
                        "none",
                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    9M
                  </Box>

                  <Box
                    onClick={() =>
                      setPeriod("1Y")
                    }
                    sx={{
                      px: 1,
                      py: 0.7,
                      borderRadius:
                        1,
                      backgroundColor:
                        period === "1Y"
                          ? "#3b82f6"
                          : "#1e2634",
                      color:
                        period === "1Y"
                          ? "#ffffff"
                          : "#64748b",
                      fontSize: 9.5,
                      fontWeight: 700,
                      cursor:
                        "pointer",
                      userSelect:
                        "none",
                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    1Y
                  </Box>
                </Box>
              </Box>

              {/* Chart area */}

              <Box
                sx={{
                  height: 250,
                  display:
                    "flex",
                  alignItems:
                    "flex-end",
                  justifyContent:
                    "space-between",
                  gap: 1.1,
                  px: 1,
                  mt: 3,
                  pb: 1,
                  borderBottom:
                    "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {chartData.map(
                  (month) => {
                    const salesHeight =
                      month.salesQuantity >
                      0
                        ? Math.max(
                            3,
                            (month.salesQuantity /
                              chartMax) *
                              100
                          )
                        : 0;

                    return (
                      <Box
                        key={
                          month.key
                        }
                        sx={{
                          flex: 1,
                          display:
                            "flex",
                          alignItems:
                            "flex-end",
                          justifyContent:
                            "center",
                          height:
                            "100%",
                          gap: {
                            xs: 0.3,
                            sm: 0.5,
                          },
                        }}
                      >
                        {/* Sales */}

                        <Box
                          sx={{
                            width: {
                              xs: 9,
                              sm: 14,
                            },
                            height: `${salesHeight}%`,
                            minHeight:
                              month.salesQuantity >
                              0
                                ? 4
                                : 0,
                            borderRadius:
                              "5px 5px 0 0",
                            background:
                              "linear-gradient(180deg, #3b82f6, #2563eb)",
                            boxShadow:
                              "0 6px 18px rgba(59,130,246,0.12)",
                            transition:
                              "height 0.35s ease",
                          }}
                        />
                      </Box>
                    );
                  }
                )}
              </Box>

              {/* Purchase overlay chart */}

              <Box
                sx={{
                  position:
                    "relative",
                  height: 0,
                }}
              >
                {chartData.map(
                  (month) => {
                    const purchaseHeight =
                      month.purchaseQuantity >
                      0
                        ? Math.max(
                            3,
                            (month.purchaseQuantity /
                              chartMax) *
                              100
                          )
                        : 0;

                    return (
                      <Box
                        key={`purchase-${month.key}`}
                        sx={{
                          display:
                            "none",
                        }}
                      >
                        {purchaseHeight}
                      </Box>
                    );
                  }
                )}
              </Box>

              {/* Purchase bars */}

              <Box
                sx={{
                  position:
                    "relative",
                  height: 0,
                }}
              />

              {/* Months */}

              <Box
                sx={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    `repeat(${chartData.length}, 1fr)`,
                  gap: 1,
                  mt: 1,
                }}
              >
                {chartData.map(
                  (month) => (
                    <Typography
                      key={
                        `label-${month.key}`
                      }
                      sx={{
                        color:
                          "#64748b",
                        fontSize: 9.5,
                        textAlign:
                          "center",
                      }}
                    >
                      {month.label}
                    </Typography>
                  )
                )}
              </Box>

              {/* Legend */}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                }}
              >
                <ChartLegend
                  color="#3b82f6"
                  label="Sales quantity"
                />

                <ChartLegend
                  color="#334155"
                  label="Purchase quantity"
                />
              </Box>

              {/* Actual purchase values shown subtly */}

              <Box
                sx={{
                  display: "none",
                }}
              >
                {chartData.map(
                  (month) => (
                    <span
                      key={`purchase-value-${month.key}`}
                    >
                      {
                        month.purchaseQuantity
                      }
                    </span>
                  )
                )}
              </Box>
            </CardContent>
          </Card>

          {/* ==================================================
              ORDER SUMMARY
          =================================================== */}

          <Card
            sx={{
              minHeight: 380,
              borderRadius: 2,
              backgroundColor:
                "rgba(23,29,41,0.96)",
              border:
                "1px solid rgba(255,255,255,0.06)",
              boxShadow:
                "0 18px 45px rgba(2,6,23,0.18)",
              backgroundImage:
                "none",
            }}
          >
            <CardContent
              sx={{
                p: 2.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                }}
              >
                <Typography
                  sx={{
                    color:
                      "#f8fafc",
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  Order summary
                </Typography>

                <Typography
                  sx={{
                    color:
                      "#64748b",
                    fontSize: 19,
                    letterSpacing:
                      "2px",
                  }}
                >
                  •••
                </Typography>
              </Box>

              {/* Open orders */}

              <Box
                sx={{
                  mt: 2.2,
                  p: 1.5,
                  borderRadius:
                    1.5,
                  backgroundColor:
                    "rgba(245,158,11,0.12)",
                  border:
                    "1px solid rgba(245,158,11,0.08)",
                }}
              >
                <Typography
                  sx={{
                    color:
                      "#fbbf24",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  📄{" "}
                  {openSalesOrders}{" "}
                  total open orders
                </Typography>
              </Box>

              {/* Summary rows */}

              <Box sx={{ mt: 2 }}>
                <SummaryRow
                  icon={
                    <ShoppingCart />
                  }
                  iconColor="#60a5fa"
                  iconBg="rgba(59,130,246,0.12)"
                  title="New orders"
                  value={
                    pendingSalesOrders
                  }
                  unit="orders"
                  onClick={() =>
                    navigate(
                      "/sales-orders"
                    )
                  }
                />

                <SummaryRow
                  icon={
                    <PendingActions />
                  }
                  iconColor="#fbbf24"
                  iconBg="rgba(245,158,11,0.12)"
                  title="In fulfilment"
                  value={
                    approvedSalesOrders
                  }
                  unit="orders"
                  onClick={() =>
                    navigate(
                      "/sales-orders"
                    )
                  }
                />

                <SummaryRow
                  icon={
                    <CheckCircle />
                  }
                  iconColor="#4ade80"
                  iconBg="rgba(34,197,94,0.12)"
                  title="Completed"
                  value={
                    deliveredSalesOrders
                  }
                  unit="orders"
                  onClick={() =>
                    navigate(
                      "/sales-orders"
                    )
                  }
                />

                <SummaryRow
                  icon={
                    <LocalShipping />
                  }
                  iconColor="#22d3ee"
                  iconBg="rgba(34,211,238,0.10)"
                  title="Inventory stock"
                  value={
                    dashboardData.totalStock ||
                    0
                  }
                  unit="items"
                  onClick={() =>
                    navigate(
                      "/products"
                    )
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

/* ============================================================
   LEGEND ITEM
============================================================ */

function LegendItem({
  color,
  label,
  value,
}) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems:
            "center",
          gap: 0.7,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius:
              "50%",
            backgroundColor:
              color,
          }}
        />

        <Typography
          sx={{
            color:
              "#94a3b8",
            fontSize: 10.5,
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          mt: 0.3,
          ml: 1.8,
          color:
            "#64748b",
          fontSize: 10,
        }}
      >
        {value} orders
      </Typography>
    </Box>
  );
}

/* ============================================================
   CHART LEGEND
============================================================ */

function ChartLegend({
  color,
  label,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems:
          "center",
        gap: 0.7,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius:
            "50%",
          backgroundColor:
            color,
        }}
      />

      <Typography
        sx={{
          color:
            "#64748b",
          fontSize: 10,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  icon,
  iconColor,
  iconBg,
  title,
  value,
  unit = "orders",
  onClick,
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        py: 1.3,
        borderBottom:
          "1px solid rgba(255,255,255,0.05)",

        cursor: onClick
          ? "pointer"
          : "default",

        transition:
          "all 0.2s ease",

        "&:hover": onClick
          ? {
              backgroundColor:
                "rgba(59,130,246,0.05)",
              transform:
                "translateX(2px)",
            }
          : {},
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius:
            1.4,
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          color: iconColor,
          backgroundColor:
            iconBg,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography
          sx={{
            color:
              "#e2e8f0",
            fontSize: 11.5,
            fontWeight: 650,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            color:
              "#64748b",
            fontSize: 10,
          }}
        >
          {value} {unit}
        </Typography>
      </Box>

      <Typography
        sx={{
          color:
            "#475569",
          fontSize: 19,
          transition:
            "transform 0.2s ease",
        }}
      >
        →
      </Typography>
    </Box>
  );
}

export default Dashboard;