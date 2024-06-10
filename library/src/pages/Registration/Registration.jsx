import React, { useState } from 'react';
import { TextField, Button, Typography, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    showPassword: false // Add showPassword state
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear validation error when user starts typing
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
    setServerError('');
  };


  const validate = async () => {
    const errors = {};

    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
      errors.username = 'Username can only contain alphanumeric characters, dots, and underscores';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)){
      errors.password = 'Password must be at least 4 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
    }

    setErrors(errors);

    if (Object.keys(errors).length !== 0) {
      return false; // Return false if there are validation errors
    }

    try {
      // Check if email already exists
      const emailResponse = await axios.post('/api/check-email', { email: formData.email });
      if (emailResponse.data.exists) {
        errors.email = 'Email is already registered';
      }

      // Check if username already exists
      const usernameResponse = await axios.post('/api/check-username', { username: formData.username });
      if (usernameResponse.data.exists) {
        errors.username = 'Username is already taken';
      }

      setErrors(errors);

      return Object.keys(errors).length === 0; // Return true if there are no errors
    } catch (error) {
      console.error(error);
      setServerError('Error validating data. Please try again.');
      return false; // Return false if an error occurs during validation
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (await validate()) {
      try {
        const response = await axios.post('/api/register', formData);
        console.log(response.data); // Handle success
        toast.success('Registration Successful'); // 2. Show success toast
        setFormData({
          username: '',
          email: '',
          password: '',
          showPassword: false // Add showPassword state
        })
      } catch (error) {
        console.error(error.response.data); // Handle error
        toast.error('Registration Unsuccessful'); // 2. Show error toast
      }
    }
  };

   // Toggle the visibility of Password Input 
   const handleShowPassword = () => {
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  return (
        <>
        
          <form onSubmit={handleSubmit}>

            <Stack direction='row' justifyContent="center"  alignItems="center" spacing={2} sx={{margin: '2rem 0 1rem 0'}}>
                <Avatar sx={{backgroundColor: '#E34234', marginLeft:'45%', marginTop:1, marginBottom:1}}>
                    <LockOutlinedIcon  />
                </Avatar>
                <Typography variant="h5" align="center" gutterBottom>
                    SIGN UP
                </Typography>
            </Stack>
            <div>

                <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoFocus
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    />
                    {errors.email && <span>{errors.email}</span>}
                    </div>
                    <div>
            <TextField 
                    fullWidth 
                    label="Username" 
                    variant="outlined" 
                    margin="normal"
                    id="username"
                    name="username"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
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
                    autoComplete="new-password"
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
             <div>
             {serverError && <span>{serverError}</span>}
             </div>
            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{backgroundColor: '#94090D', '&:hover': {background: '#FF1D23'}, marginTop: '1rem'}}
              type='submit'
              >
                Sign Up
            </Button>
          </form>
            
        </>
        
    )
}

export default Registration;
