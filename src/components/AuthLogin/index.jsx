import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useContext } from "react";
import { AuthAccount } from "../../components/AuthAccount";
import { AuthLoginForm } from "../../components/AuthLoginForm";
import { UserContext } from "../../context/UserContext";

const Wrapper = styled(Box)(({ theme }) => ({
    minHeight: "80dvh",
    display: "grid",
    placeItems: "center",
    padding: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
    },
}));

export function AuthLogin() {
    const { user, attributes } = useContext(UserContext);

    return (
        <Wrapper>
            {(!user || !attributes) ? (
                <AuthLoginForm />
            ) : (
                <AuthAccount />
            )}
        </Wrapper>
    );
}
