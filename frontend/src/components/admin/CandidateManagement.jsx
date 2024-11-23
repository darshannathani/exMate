import { useState, useEffect } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    LinearProgress,
} from '@mui/material';
import { Upload as UploadIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { candidateService } from '../../api/services/candidateService';
import { format } from 'date-fns';
import { adminService } from '../../api/services/adminService';

const CandidateManagement = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const emptyCandidate = {
        name: '',
        college: '',
        email: '',
        phone: '',
        birthdate: '',
    };
    const [newCandidate, setNewCandidate] = useState(emptyCandidate);
    const [editingCandidate, setEditingCandidate] = useState(null);

    const fetchCandidates = async () => {
        try {
            const response = await candidateService.getAllCandidates();
            setCandidates(response);
        } catch (error) {
            console.error('Failed to fetch candidates', error);
            alert('Failed to fetch candidates.');
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [candidates, editingCandidate, newCandidate, selectedFile, isUploading, uploadDialogOpen, editDialogOpen, tabIndex]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        try {
            await adminService.uploadCandidates(selectedFile);
            alert('Candidates uploaded successfully!');
            await fetchCandidates();
        } catch (error) {
            console.error('Error uploading candidates:', error);
            alert('Failed to upload candidates.');
        } finally {
            setIsUploading(false);
            setUploadDialogOpen(false);
        }
    };

    const handleAddCandidate = async () => {
        try {
            console.log(newCandidate);
            const response = await candidateService.addCandidate(newCandidate);
            setCandidates((prev) => [...prev, response]);
            alert('Candidate added successfully!');
            setNewCandidate(emptyCandidate);
            setUploadDialogOpen(false);
        } catch (error) {
            console.error('Error adding candidate:', error);
            alert('Failed to add candidate.');
        }
    };

    const handleEditClick = (candidate) => {
        setEditingCandidate({
            ...candidate,
            birthdate: format(new Date(candidate.birthdate), 'yyyy-MM-dd'),
        });
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        try {
            console.log(editingCandidate);
            await candidateService.updateCandidate(editingCandidate.c_id, editingCandidate);
            alert('Candidate updated successfully!');
            await fetchCandidates();
            setEditDialogOpen(false);
            setEditingCandidate(null);
        } catch (error) {
            console.error('Error updating candidate:', error);
            alert('Failed to update candidate.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this candidate?')) {
            try {
                await candidateService.deleteCandidate(id);
                alert('Candidate deleted successfully!');
                await fetchCandidates();
            } catch (error) {
                console.error('Error deleting candidate:', error);
                alert('Failed to delete candidate.');
            }
        }
    };

    const handleTabChange = (_, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Candidate Management
            </Typography>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Candidate List</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<UploadIcon />}
                        onClick={() => setUploadDialogOpen(true)}
                    >
                        Add Candidates
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>College</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Birth Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {candidates.map((candidate) => (
                                <TableRow key={candidate.c_id}>
                                    <TableCell>{candidate.c_id}</TableCell>
                                    <TableCell>{candidate.name}</TableCell>
                                    <TableCell>{candidate.college}</TableCell>
                                    <TableCell>{candidate.email}</TableCell>
                                    <TableCell>{candidate.phone}</TableCell>
                                    <TableCell>{candidate.birthdate}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton 
                                                onClick={() => handleEditClick(candidate)}
                                                sx={{ color: '#FFD700' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => handleDelete(candidate.c_id)}
                                                sx={{ color: '#FF0000' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} fullWidth>
                <DialogTitle>Add Candidates</DialogTitle>
                <Tabs value={tabIndex} onChange={handleTabChange} centered>
                    <Tab label="Add Single Candidate" />
                    <Tab label="Upload Excel File" />
                </Tabs>
                <DialogContent>
                    {tabIndex === 0 && (
                        <Box>
                            {['name', 'college', 'email', 'phone'].map((field) => (
                                <TextField
                                    key={field}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    fullWidth
                                    margin="normal"
                                    value={newCandidate[field]}
                                    onChange={(e) =>
                                        setNewCandidate((prev) => ({
                                            ...prev,
                                            [field]: e.target.value,
                                        }))
                                    }
                                />
                            ))}
                            <TextField
                                label="Birth Date"
                                fullWidth
                                margin="normal"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={newCandidate.birthdate}
                                onChange={(e) =>
                                    setNewCandidate((prev) => ({
                                        ...prev,
                                        birthdate: e.target.value,
                                    }))
                                }
                            />
                        </Box>
                    )}
                    {tabIndex === 1 && (
                        <Box>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                style={{ display: 'block', margin: '16px 0' }}
                            />
                            {isUploading && <LinearProgress />}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    {tabIndex === 0 ? (
                        <Button onClick={handleAddCandidate} color="primary">
                            Add Candidate
                        </Button>
                    ) : (
                        <Button
                            onClick={handleUpload}
                            color="primary"
                            disabled={isUploading || !selectedFile}
                        >
                            Upload
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
                <DialogTitle>Edit Candidate</DialogTitle>
                <DialogContent>
                    {editingCandidate && (
                        <Box>
                            {['name', 'college', 'email', 'phone'].map((field) => (
                                <TextField
                                    key={field}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    fullWidth
                                    margin="normal"
                                    value={editingCandidate[field]}
                                    onChange={(e) =>
                                        setEditingCandidate((prev) => ({
                                            ...prev,
                                            [field]: e.target.value,
                                        }))
                                    }
                                />
                            ))}
                            <TextField
                                label="Birth Date"
                                fullWidth
                                margin="normal"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={editingCandidate.birthdate}
                                onChange={(e) =>
                                    setEditingCandidate((prev) => ({
                                        ...prev,
                                        birthdate: e.target.value,
                                    }))
                                }
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CandidateManagement;