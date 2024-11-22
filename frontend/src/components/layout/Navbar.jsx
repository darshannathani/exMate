import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
import image from '/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const { isAuthenticated, userRole, updateAuthState } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await authService.logout();
            updateAuthState(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const getNavLinks = () => {
        const commonLinks = [{ path: '/', label: 'Home' }];
        const adminLinks = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/admins', label: 'Admins' },
            { path: '/upload', label: 'Upload Candidates' },
        ];
        const candidateLinks = [{ path: '/dashboard', label: 'Dashboard' }];

        if (userRole === 'ROLE_ADMIN') return [...commonLinks, ...adminLinks];
        if (userRole === 'ROLE_CANDIDATE') return [...commonLinks, ...candidateLinks];

        return commonLinks;
    };

    return (
        <AppBar position="static" color={isDarkMode ? 'default' : 'primary'}>
            <Toolbar>
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <img src={image} alt="ExMate logo" style={{ height: 32, marginRight: 16 }} />
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ color: 'inherit', textDecoration: 'none', flexShrink: 0 }}
                    >
                        ExMate
                    </Typography>
                </Box>

                <Box display={{ xs: 'none', md: 'flex' }} alignItems="center">
                    {getNavLinks().map((link) => (
                        <Button
                            key={link.path}
                            component={Link}
                            to={link.path}
                            color="inherit"
                            sx={{
                                backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                },
                            }}
                        >
                            {link.label}
                        </Button>
                    ))}
                    <Button
                        color="inherit"
                        onClick={isAuthenticated ? handleLogout : () => navigate('/login')}
                    >
                        {isAuthenticated ? 'Logout' : 'Login'}
                    </Button>
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Box>

                <Box display={{ xs: 'flex', md: 'none' }}>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {getNavLinks().map((link) => (
                            <MenuItem
                                key={link.path}
                                component={Link}
                                to={link.path}
                                onClick={handleMenuClose}
                                selected={location.pathname === link.path}
                            >
                                {link.label}
                            </MenuItem>
                        ))}
                        <MenuItem onClick={isAuthenticated ? handleLogout : () => navigate('/login')}>
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </MenuItem>
                        <MenuItem onClick={toggleTheme}>
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
