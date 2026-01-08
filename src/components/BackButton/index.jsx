import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
    IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export function BackButton({ text }) {

    const navigate = useNavigate()
    return (
        <IconButton onClick={() => navigate(-1)} sx={{ alignSelf: "flex-start", mb: 1 }}>
            <KeyboardBackspaceIcon /> {text}
        </IconButton>
    )
}