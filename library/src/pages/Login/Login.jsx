import React, { useState } from 'react';
import { TextField, Button, Typography, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        showPassword: false
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const validate = () => {
        const errors = {};

        if (!formData.username) {
            errors.username = 'Username is required';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Invalid username or password');
                }

                const data = await response.json();
                toast.success(data.message);
                if (data.dashboard === 'admin'){
                    navigate(`/admin-dashboard/${formData.username}`);
                } else {
                    navigate(`/dashboard/${formData.username}`);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleShowPassword = () => {
        setFormData(prevState => ({
            ...prevState,
            showPassword: !prevState.showPassword
        }));
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ margin: '2rem 0 1rem 0' }}>
                    <Avatar sx={{ backgroundColor: '#E34234', marginLeft: '45%', marginTop: 1, marginBottom: 1 }}>
                        <LoginIcon />
                    </Avatar>
                    <Typography variant="h5" align="center" gutterBottom>
                        SIGN IN
                    </Typography>
                </Stack>
                <div>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        autoFocus
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        type="text"
                    />
                    {errors.username && <span>{errors.username}</span>}
                </div>
                <div>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={formData.showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleShowPassword}>
                                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    {errors.password && <span>{errors.password}</span>}
                </div>
                <Typography variant="caption" align="left" gutterBottom>
                    <Link to="/reset-password">Forgot Password?</Link>
                </Typography>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ backgroundColor: '#94090D', '&:hover': { background: '#FF1D23' }, marginTop: '1rem' }}
                    type="submit"
                >
                    Sign In
                </Button>
            </form>
        </>
    );
};

export default Login;
