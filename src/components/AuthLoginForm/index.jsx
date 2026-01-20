import React, { useState, useEffect, useContext } from "react";
import AppleIcon from "@mui/icons-material/Apple";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Link as MUILink,
    Stack,
    SvgIcon,
    TextField,
    Typography
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { signIn, confirmSignIn } from '@aws-amplify/auth';
import { startEmailOtpSignIn } from "../../utils/functions";
import { UserContext } from "../../context/UserContext";

const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
    // 🔗 Add your Google OAuth logic here
};
const handleAppleSignIn = () => {
    console.log("Apple sign-in clicked");
    // 🔗 Add your Apple OAuth logic here
};


export function AuthLoginForm({
    onContinue,             // (email) => void
    onGoogle,               // () => void
    onApple,                // () => void
}) {
        const { user, attributes } = useContext(UserContext);
        const [email, setEmail] = React.useState("");
        const [touched, setTouched] = React.useState(false);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");
        const navigate = useNavigate();
    
        const isValidEmail = (val) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    
        const hasError = touched && !isValidEmail(email);
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            setTouched(true);
            setError("");
    
            if (!isValidEmail(email)) return;

            try {
                setLoading(true);
                const result = await startEmailOtpSignIn(email);
                localStorage.setItem("email", email);

                if (onContinue) {
                    onContinue(email);
                } else {
                    navigate("/verify");
                }
            } catch (err) {
                console.error(err);
                setError("Something went wrong sending your code.");
            } finally {
                setLoading(false);
            }
        };

        

    return (
        <Card
            elevation={6}
            sx={{
                boxShadow: { xs: 'none', sm: 'var(--Paper-shadow)' }
            }}
        >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2.5} alignItems="stretch">
                    <Box textAlign="center" sx={{ mb: 1 }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Welcome
                        </Typography>
                        <Typography color="text.secondary">
                            Enter your email to continue
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Stack spacing={0}>
                            <TextField
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouched(true)}
                                error={hasError}
                                helperText={hasError ? "Enter a valid email address" : " "}
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disableElevation
                                disabled={loading}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2.5,
                                    py: 1.2,
                                    fontWeight: 600,
                                }}
                            >
                                {loading ? <CircularProgress size={22} sx={{ color: "inherit", mr: 1 }} /> : null}
                                {loading ? "Loading..." : "Continue"}
                            </Button>
                        </Stack>
                    </form>

                    {/* <Divider>
                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", px: 1 }}
                        >
                            OR CONTINUE WITH
                        </Typography>
                    </Divider>

                    <Stack spacing={1.2}>
                        <Button
                            variant="outlined"
                            onClick={handleGoogleSignIn}
                            fullWidth
                            disableElevation
                            sx={{
                                textTransform: "none",
                                borderRadius: 1,
                                justifyContent: "center",
                                color: "#3c4043",
                                backgroundColor: "#fff",
                                borderColor: "#dadce0",
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                py: 1,
                                "&:hover": {
                                    backgroundColor: "#f7f8f8",
                                    borderColor: "#c6c6c6",
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google logo"
                                sx={{ width: 20, height: 20, mr: 1 }}
                            />
                            Continue with Google
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleAppleSignIn}
                            fullWidth
                            disableElevation
                            startIcon={<AppleIcon />}
                            sx={{
                                textTransform: "none",
                                borderRadius: 1,
                                justifyContent: "center",
                                color: "#000",
                                backgroundColor: "#fff",
                                borderColor: "#dadce0",
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                py: 1,
                                "&:hover": {
                                    backgroundColor: "#f7f8f8",
                                    borderColor: "#c6c6c6",
                                },
                            }}
                        >
                            Continue with Apple
                        </Button>
                    </Stack> */}

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, textAlign: "center" }}
                    >
                        By signing in, you agree to our{" "}
                        <MUILink component={Link} to="/terms" underline="hover">
                            Terms
                        </MUILink>{" "}
                        and{" "}
                        <MUILink component={Link} to="/privacy" underline="hover">
                            Privacy Policy
                        </MUILink>.
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    )
}