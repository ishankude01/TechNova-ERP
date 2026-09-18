import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";

import {
    AdminPanelSettings,
    People,
    Search,
} from "@mui/icons-material";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // ============================================================
    // CHECK CURRENT USER ROLE
    // ============================================================

    const getCurrentRole = () => {
        const token = localStorage.getItem("token");

        if (!token) return "user";

        try {
            const tokenPart = token.split(".")[1];

            const base64 = tokenPart
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const paddedBase64 =
                base64 +
                "=".repeat((4 - (base64.length % 4)) % 4);

            const payload = JSON.parse(atob(paddedBase64));

            return (payload.role || "user").toLowerCase();
        } catch (error) {
            return "user";
        }
    };

    const currentRole = getCurrentRole();

    // ============================================================
    // FETCH USERS
    // ============================================================

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/users");
            console.log("USERS API RESPONSE:", response.data);

            const userList = Array.isArray(response.data)
                ? response.data
                : response.data.users ||
                response.data.usersList ||
                response.data.data ||
                [];

            setUsers(Array.isArray(userList) ? userList : []);
        } catch (error) {
            console.error("Error fetching users:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentRole === "admin") {
            fetchUsers();
        } else {
            setLoading(false);
            setError("Admin access required.");
        }
    }, []);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredUsers = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        if (!searchText) {
            return users;
        }

        return users.filter((user) => {
            return (
                user.name
                    ?.toLowerCase()
                    .includes(searchText) ||
                user.email
                    ?.toLowerCase()
                    .includes(searchText) ||
                user.role
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });
    }, [users, search]);

    // ============================================================
    // NOT ADMIN
    // ============================================================

    if (currentRole !== "admin") {
        return (
            <Box>
                <Typography
                    sx={{
                        fontSize: { xs: 26, md: 32 },
                        fontWeight: 700,
                        color: "#f8fafc",
                        mb: 1,
                    }}
                >
                    User Management
                </Typography>

                <Alert severity="error">
                    Admin access required.
                </Alert>
            </Box>
        );
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <Box>
            {/* HEADER */}

            <Box sx={{ mb: 3 }}>
                <Typography
                    sx={{
                        fontSize: { xs: 26, md: 32 },
                        fontWeight: 700,
                        color: "#f8fafc",
                        letterSpacing: "-0.5px",
                    }}
                >
                    User Management
                </Typography>

                <Typography
                    sx={{
                        mt: 0.7,
                        fontSize: 13,
                        color: "#94a3b8",
                    }}
                >
                    Manage and view registered ERP users
                </Typography>
            </Box>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        backgroundColor: "rgba(239,68,68,0.10)",
                        color: "#fca5a5",
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* SEARCH + COUNT */}

            <Card
                sx={{
                    mb: 3,
                    background:
                        "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(15,23,42,0.96))",
                    border:
                        "1px solid rgba(96,165,250,0.14)",
                    borderRadius: 2,
                    boxShadow:
                        "0 15px 45px rgba(0,0,0,0.20)",
                }}
            >
                <CardContent
                    sx={{
                        p: { xs: 2, md: 2.5 },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: { xs: "stretch", md: "center" },
                            flexDirection: { xs: "column", md: "row" },
                            gap: 2,
                        }}
                    >
                        <TextField
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search users..."
                            size="small"
                            fullWidth
                            sx={{
                                maxWidth: { md: 400 },

                                "& .MuiOutlinedInput-root": {
                                    color: "#f8fafc",
                                    backgroundColor: "#111827",
                                    borderRadius: 1.5,

                                    "& fieldset": {
                                        borderColor:
                                            "rgba(148,163,184,0.16)",
                                    },

                                    "&:hover fieldset": {
                                        borderColor:
                                            "rgba(96,165,250,0.35)",
                                    },

                                    "&.Mui-focused fieldset": {
                                        borderColor: "#3b82f6",
                                    },

                                    "& input::placeholder": {
                                        color: "#64748b",
                                        opacity: 1,
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search
                                            sx={{ color: "#64748b" }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <People
                                sx={{
                                    color: "#60a5fa",
                                    fontSize: 22,
                                }}
                            />

                            <Typography
                                sx={{
                                    color: "#cbd5e1",
                                    fontSize: 13,
                                }}
                            >
                                {filteredUsers.length} user
                                {filteredUsers.length !== 1
                                    ? "s"
                                    : ""}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* USER CARDS */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, 1fr)",
                        xl: "repeat(3, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {filteredUsers.map((user) => {
                    const isAdmin =
                        user.role?.toLowerCase() === "admin";

                    return (
                        <Card
                            key={user._id}
                            sx={{
                                background:
                                    "linear-gradient(145deg, rgba(23,29,41,0.96), rgba(15,23,42,0.96))",
                                border:
                                    "1px solid rgba(96,165,250,0.12)",
                                borderRadius: 2,
                                boxShadow:
                                    "0 15px 45px rgba(0,0,0,0.18)",
                            }}
                        >
                            <CardContent sx={{ p: 2.5 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor:
                                                isAdmin
                                                    ? "#2563eb"
                                                    : "#334155",
                                            color: "#ffffff",
                                            fontWeight: 700,
                                            fontSize: 18,
                                        }}
                                    >
                                        {user.name
                                            ? user.name
                                                .charAt(0)
                                                .toUpperCase()
                                            : "U"}
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography
                                            sx={{
                                                color: "#f8fafc",
                                                fontSize: 15,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {user.name || "Unknown User"}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "#94a3b8",
                                                fontSize: 12,
                                                mt: 0.3,
                                            }}
                                        >
                                            {user.email || "No email"}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Chip
                                        icon={
                                            <AdminPanelSettings
                                                sx={{
                                                    fontSize: 16,
                                                }}
                                            />
                                        }
                                        label={
                                            isAdmin
                                                ? "Administrator"
                                                : "Standard User"
                                        }
                                        size="small"
                                        sx={{
                                            color: isAdmin
                                                ? "#93c5fd"
                                                : "#cbd5e1",
                                            backgroundColor: isAdmin
                                                ? "rgba(37,99,235,0.14)"
                                                : "rgba(148,163,184,0.10)",
                                            border:
                                                "1px solid rgba(148,163,184,0.12)",
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: 11,
                                            color: "#64748b",
                                        }}
                                    >
                                        ID: {user._id?.slice(-6) || "------"}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* EMPTY */}

            {filteredUsers.length === 0 && !error && (
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
                            mb: 1,
                        }}
                    />

                    <Typography
                        sx={{
                            color: "#94a3b8",
                            fontSize: 14,
                        }}
                    >
                        No users found.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default UserManagement;