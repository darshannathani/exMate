import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Paper,
} from '@mui/material';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { isDarkMode } = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setError('Login failed, Invalid email or password');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    backgroundColor: isDarkMode ? 'grey.800' : 'background.paper',
                    color: isDarkMode ? 'common.white' : 'text.primary',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            InputProps={{
                                style: {
                                    backgroundColor: isDarkMode ? '#424242' : 'inherit',
                                    color: isDarkMode ? 'white' : 'inherit',
                                },
                            }}
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            InputProps={{
                                style: {
                                    backgroundColor: isDarkMode ? '#424242' : 'inherit',
                                    color: isDarkMode ? 'white' : 'inherit',
                                },
                            }}
                        />
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            ':hover': {
                                backgroundColor: isDarkMode ? 'primary.dark' : 'primary.light',
                            },
                        }}
                    >
                        Login
                    </Button>
                </form>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Paper>
        </Container>
    );
};

export default LoginForm;
