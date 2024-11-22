import { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    LinearProgress,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { adminService } from '../../api/services/adminService';

const UploadCandidates = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file before uploading.");
            return;
        }

        setIsUploading(true);
        try {
            await adminService.uploadCandidates(selectedFile);
            setUploadSuccess(true);
            alert("Candidates uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload candidates", error);
            alert("Failed to upload candidates. Please try again.");
        } finally {
            setIsUploading(false);
            setOpenDialog(false);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFile(null);
        setUploadSuccess(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Upload Candidates
            </Typography>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Upload an Excel file containing candidate details to add them to the system.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<UploadIcon />}
                        onClick={handleOpenDialog}
                    >
                        Upload File
                    </Button>
                </Box>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Upload Candidates</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                style={{ display: 'block', margin: '16px 0' }}
                            />
                        </Grid>
                        {isUploading && (
                            <Grid item xs={12}>
                                <LinearProgress />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        color="primary"
                        disabled={isUploading || !selectedFile}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UploadCandidates;
