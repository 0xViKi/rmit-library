import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Stack, Paper } from '@mui/material';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import LockResetIcon from '@mui/icons-material/LockReset';
import { ToastContainer, toast } from 'react-toastify'; // Imported React Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Imported React Toastify CSS
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import ParticlesBg from "particles-bg";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

// Custom styled paper with glass morphism effect
const GlassPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    width:'400px',
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
  }));

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP and new password
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/send-otp', { email });
      toast.success(response.data); // Display a success message to the user using React Toastify
      setStep(2); // Move to the next step to enter OTP and new password
    } catch (error) {
      toast.error('An error occurred. Please try again later.'); // Display an error message to the user using React Toastify
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (!passwordRegex.test(newPassword)) {
        toast.error('Password must be at least 4 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.')
      } else {
        const response = await axios.post('/api/reset-password', { email, otp, newPassword });
        toast.success("Password Reset Successful"); // Display a success message to the user using React Toastify
        navigate('/'); // Redirect to the home page
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.'); // Display an error message to the user using React Toastify
    }
  };


  // Toggle the visibility of Password Input 
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={10} sm={6} md={4}>
        <GlassPaper elevation={10}>
          <Stack direction='row' justifyContent="center"  alignItems="center" spacing={2} sx={{margin: '2rem 0 1rem 0'}}>
            <Avatar sx={{backgroundColor: '#E34234', marginLeft:'45%', marginTop:1, marginBottom:1}}>
              <LockResetIcon  />
            </Avatar>
            <Typography variant="h5" align="center" gutterBottom>
              RESET PASSWORD
            </Typography>
          </Stack>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp}>
              <Stack direction='column' justifyContent="center"  alignItems="center" spacing={2} sx={{margin: '2rem 0 1rem 0'}}>
                <TextField
                  type="email"
                  label="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                />
                <Button fullWidth type="submit" variant="contained" size='large' sx={{backgroundColor: '#94090D', '&:hover': {background: '#FF1D23'}, marginTop: '1rem'}}>Request OTP</Button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <Stack direction='column' justifyContent="center"  alignItems="center" spacing={2} sx={{margin: '2rem 0 1rem 0'}}>
                <TextField
                  type="text"
                  label="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  label="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                    <IconButton onClick={handleShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    ),
                  }}
                />
                <Button fullWidth type="submit" variant="contained" size='large' sx={{backgroundColor: '#94090D', '&:hover': {background: '#FF1D23'}, marginTop: '1rem'}}>Reset Password</Button>
              </Stack>
            </form>
          )}
          <ToastContainer /> 
        </GlassPaper>
      </Grid>
      <ParticlesBg type='polygon' bg={true} />
    </Grid>
  );
}

export default ResetPassword;
