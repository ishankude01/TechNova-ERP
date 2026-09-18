import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  ArrowForward,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token);

      setMessage(response.data.message || "Login successful!");

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: 4,
        background:
          "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.10), transparent 30%), radial-gradient(circle at 85% 80%, rgba(37,99,235,0.08), transparent 30%), #0b1120",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1050,
          minHeight: {
            xs: "auto",
            md: 620,
          },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "0.9fr 1.1fr",
          },
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: "#111827",
          boxShadow:
            "0 25px 70px rgba(0,0,0,0.35)",
        }}
      >
        {/* =====================================================
            LEFT BRANDING SECTION
        ====================================================== */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            p: 5,
            background:
              "linear-gradient(145deg, #15284c 0%, #0d172b 58%, #0b1220 100%)",
            borderRight:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Decorative glow */}

          <Box
            sx={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              right: -100,
              top: -100,
              background:
                "radial-gradient(circle, rgba(59,130,246,0.22), transparent 68%)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              left: -100,
              bottom: -80,
              background:
                "radial-gradient(circle, rgba(37,99,235,0.18), transparent 70%)",
            }}
          />

          {/* Logo */}

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 1.7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #2563eb, #38bdf8)",
                boxShadow:
                  "0 10px 30px rgba(37,99,235,0.30)",
                mr: 1.4,
              }}
            >
              <Typography
                sx={{
                  fontSize: 21,
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                T
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#f8fafc",
                  fontSize: 18,
                  fontWeight: 750,
                  lineHeight: 1.1,
                  letterSpacing: "-0.4px",
                }}
              >
                TechNova
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "1.8px",
                }}
              >
                ERP SYSTEM
              </Typography>
            </Box>
          </Box>

          {/* Main Branding */}

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              maxWidth: 440,
            }}
          >
            <Typography
              sx={{
                color: "#60a5fa",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.7px",
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              Business Management Platform
            </Typography>

            <Typography
              sx={{
                color: "#f8fafc",
                fontSize: {
                  sm: 38,
                  md: 46,
                },
                fontWeight: 750,
                lineHeight: 1.08,
                letterSpacing: "-1.2px",
              }}
            >
              Manage your business.
              <br />
              All in one place.
            </Typography>

            <Typography
              sx={{
                mt: 2.2,
                color: "#94a3b8",
                fontSize: 14,
                lineHeight: 1.8,
                maxWidth: 420,
              }}
            >
              TechNova ERP helps you manage products,
              customers, suppliers, orders, inventory,
              goods receipts and invoices from one
              centralized platform.
            </Typography>

            {/* Feature boxes */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.2,
                mt: 3.5,
              }}
            >
              <FeatureItem
                title="Products"
                text="Inventory management"
              />

              <FeatureItem
                title="Orders"
                text="Sales & purchases"
              />

              <FeatureItem
                title="Invoices"
                text="Billing management"
              />

              <FeatureItem
                title="Reports"
                text="Business insights"
              />
            </Box>
          </Box>

          {/* Footer */}

          <Typography
            sx={{
              position: "relative",
              zIndex: 1,
              color: "#475569",
              fontSize: 10.5,
            }}
          >
            Secure business management · TechNova ERP
          </Typography>
        </Box>

        {/* =====================================================
            LOGIN SECTION
        ====================================================== */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#111827",
          }}
        >
          {/* Mobile logo */}

          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #2563eb, #38bdf8)",
                mr: 1.2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                T
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#f8fafc",
                  fontWeight: 700,
                  fontSize: 17,
                }}
              >
                TechNova
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 9,
                  letterSpacing: "1.5px",
                }}
              >
                ERP SYSTEM
              </Typography>
            </Box>
          </Box>

          {/* Heading */}

          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                color: "#f8fafc",
                fontSize: {
                  xs: 28,
                  sm: 32,
                },
                fontWeight: 750,
                letterSpacing: "-0.6px",
              }}
            >
              Welcome back
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: "#64748b",
                fontSize: 13.5,
              }}
            >
              Sign in to continue to your ERP dashboard.
            </Typography>
          </Box>

          {/* Email */}

          <TextField
            fullWidth
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={darkTextFieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined
                    sx={{
                      color: "#64748b",
                      fontSize: 19,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* Password */}

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            sx={{
              ...darkTextFieldStyles,
              mt: 2,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    sx={{
                      color: "#64748b",
                      fontSize: 19,
                    }}
                  />
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    edge="end"
                    sx={{
                      color: "#64748b",
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Message */}

          {message && (
            <Box
              sx={{
                mt: 2,
                px: 1.5,
                py: 1.2,
                borderRadius: 1.3,
                backgroundColor:
                  message.toLowerCase().includes("success")
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                border:
                  message.toLowerCase().includes("success")
                    ? "1px solid rgba(34,197,94,0.15)"
                    : "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color:
                    message.toLowerCase().includes("success")
                      ? "#4ade80"
                      : "#f87171",
                }}
              >
                {message}
              </Typography>
            </Box>
          )}

          {/* Login button */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              mt: 3,
              minHeight: 50,
              textTransform: "none",
              borderRadius: 1.5,
              fontSize: 14,
              fontWeight: 650,
              background:
                "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow:
                "0 10px 25px rgba(37,99,235,0.20)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #1d4ed8, #2563eb)",
                boxShadow:
                  "0 12px 30px rgba(37,99,235,0.28)",
              },
            }}
          >
            Sign in
          </Button>

          {/* Register */}

          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              color: "#64748b",
              fontSize: 12.5,
            }}
          >
            Don't have an account?{" "}
            <Link
              href="/register"
              underline="none"
              sx={{
                color: "#60a5fa",
                fontWeight: 600,

                "&:hover": {
                  color: "#93c5fd",
                },
              }}
            >
              Create account
            </Link>
          </Typography>

          {/* Security note */}

          <Box
            sx={{
              mt: 4,
              pt: 2.2,
              borderTop:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                color: "#475569",
                fontSize: 10.5,
              }}
            >
              Your account is protected with secure
              authentication.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ============================================================
   FEATURE ITEM
============================================================ */

function FeatureItem({ title, text }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        border:
          "1px solid rgba(255,255,255,0.06)",
        backgroundColor:
          "rgba(255,255,255,0.025)",
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          mb: 1,
          boxShadow:
            "0 0 10px rgba(59,130,246,0.55)",
        }}
      />

      <Typography
        sx={{
          color: "#e2e8f0",
          fontSize: 11.5,
          fontWeight: 650,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.25,
          color: "#64748b",
          fontSize: 9.5,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

/* ============================================================
   TEXT FIELD STYLES
============================================================ */

const darkTextFieldStyles = {
  "& .MuiInputLabel-root": {
    color: "#64748b",
    fontSize: 13,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#60a5fa",
  },

  "& .MuiOutlinedInput-root": {
    minHeight: 52,
    color: "#f8fafc",
    fontSize: 13,
    borderRadius: 1.5,
    backgroundColor: "#171d29",

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.08)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.16)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
      borderWidth: "1px",
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

export default Login;