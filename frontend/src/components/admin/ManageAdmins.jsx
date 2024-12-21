import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { adminService } from '../../api/services/adminService';

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState({ name: '', email: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const data = await adminService.getAllAdmins();
            setAdmins(data);
        } catch (error) {
            console.error('Failed to fetch admins', error);
        }
    };

    const handleOpenDialog = (admin = null) => {
        if (admin) {
            setCurrentAdmin(admin);
            setIsEditing(true);
        } else {
            setCurrentAdmin({ name: '', email: '', password: '' });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentAdmin({ name: '', email: '', password: '' });
    };

    const handleSaveAdmin = async () => {
        try {
            if (isEditing) {
                await adminService.updateAdmin(currentAdmin.a_id,currentAdmin);
            } else {
                await adminService.registerAdmin(currentAdmin);
            }
            fetchAdmins();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save admin', error);
        }
    };

    const handleDeleteAdmin = async (a_id) => {
        try {
            await adminService.deleteAdmin(a_id);
            fetchAdmins();
        } catch (error) {
            console.error('Failed to delete admin', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Manage Admins
            
            
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add New Admin
                </Button>
            </Box>
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.a_id}>
                                <TableCell>{admin.name}</TableCell>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell>{admin.phone}</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => handleOpenDialog(admin)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => handleDeleteAdmin(admin.a_id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={currentAdmin.name}
                        onChange={(e) => setCurrentAdmin({...currentAdmin, name: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={currentAdmin.email}
                        onChange={(e) => setCurrentAdmin({...currentAdmin, email: e.target.value})}
                    />
                    <TextField
                    margin='dense'
                    label='phone'
                    type='number'
                    fullWidth
                    value={currentAdmin.phone}
                    onChange={(e) => setCurrentAdmin({...currentAdmin, phone: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        onChange={(e) => setCurrentAdmin({...currentAdmin, password: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveAdmin} color="primary">
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageAdmins;