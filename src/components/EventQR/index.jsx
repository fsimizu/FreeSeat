import FileCopyIcon from '@mui/icons-material/FileCopy';
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Box,
    IconButton,
    Paper,
    Tooltip,
    Typography,
    Collapse,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useState, useRef } from 'react';

export function EventQR({ eventId }) {
    const BASE_URL = window.location.origin + '/';
    const qrRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    // ✅ Start expanded by default
    const [openSmall, setOpenSmall] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(BASE_URL + eventId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'FreeSeatQR.png';
        link.click();
    };

    const handleView = () => {
        window.open(BASE_URL + eventId, '_blank');
    };

    const buttonStyle = {
        width: 40,
        height: 40,
        borderRadius: (theme) => theme.spacing(1),
        backgroundColor: 'grey.200',
        '&:hover': { backgroundColor: 'grey.300' },
    };

    return (
        <Box sx={{ 
            width: { xs: '100%', md: 'auto' }, 
            mx: 'auto' }}>
            {/* Header row: title left, toggle on small */}
            <Box
                onClick={() => setOpenSmall((v) => !v)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                    cursor: isSmall ? 'pointer' : 'default',
                    userSelect: 'none',
                }}
                role={isSmall ? 'button' : undefined}
                aria-expanded={openSmall}
                aria-label="Toggle QR code visibility"
            >
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: 'left',
                        pt: 0.5,
                        mr: 1,
                        flex: '1 1 auto',
                        color: 'text.primary',
                    }}
                >
                    Event QR code
                </Typography>

                {isSmall && (
                    <ExpandMoreIcon
                        sx={{
                            transform: openSmall ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 200ms ease',
                            flexShrink: 0,
                        }}
                    />
                )}
            </Box>


            {/* Collapsible QR section */}
            <Collapse in={isSmall ? openSmall : true}>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Center QR and buttons horizontally
                        justifyContent: 'center',
                        p: 2,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            width: '100%',
                            maxWidth: 300, // keep QR centered
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            mx: 'auto',
                        }}
                        ref={qrRef}
                    >
                        <QRCodeCanvas
                            value={`${BASE_URL}${eventId}`}
                            size={180}
                            level="H"
                            fgColor="#000000"
                            bgColor="transparent"
                        />
                    </Paper>

                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            width: '100%',
                        }}
                    >
                        <Tooltip title={copied ? 'Copied!' : 'Copy Link'}>
                            <IconButton onClick={handleCopy} sx={buttonStyle}>
                                <FileCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Download QR Code">
                            <IconButton onClick={handleDownload} sx={buttonStyle}>
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Site preview">
                            <IconButton onClick={handleView} sx={buttonStyle}>
                                <LanguageIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
}
