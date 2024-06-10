import React, { useState } from 'react';
import { Grid, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/system';
import Login from "../Login/Login";
import Registration from "../Registration/Registration"
import ParticlesBg from "particles-bg";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Custom styled paper with glass morphism effect
const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
  border: '1px solid rgba( 255, 255, 255, 0.18 )',
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
  },
}));

const LoginForm = ({ onSwitch }) => {
  
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={10} sm={6} md={4}>
        <GlassPaper elevation={10}>
          <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
            <ToggleButtonGroup value="login" exclusive onChange={onSwitch}>
              <ToggleButton value="login">Log In</ToggleButton>
              <ToggleButton value="signup">Sign Up</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Login  />
        </GlassPaper>
      </Grid>
    </Grid>
  );
};

const RegisterForm = ({ onSwitch }) => {

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={10} sm={6} md={4}>
        <GlassPaper elevation={10}>
          <Grid container justifyContent="center" style={{ marginTop: '1rem' }}>
            <ToggleButtonGroup value="signup" exclusive onChange={onSwitch}>
              <ToggleButton value="login">Log In</ToggleButton>
              <ToggleButton value="signup">Sign Up</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Registration />
        </GlassPaper>
      </Grid>
    </Grid>
  );
};

const AuthPage = () => {
  
  const [isLoginForm, setIsLoginForm] = useState(true);

  let config = {
    num: [4, 30],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [2, 3],
    tha: [-40, 40],
    alpha: [0.6, 0],
    scale: [.1, 0.4],
    position: "all",
    color: ["random", "#ff0000"],
    cross: "dead",
    random: 15,
  };


  const switchForm = (_, value) => {
    setIsLoginForm(value === 'login');
  };

  return (
    <div>
      <ToastContainer />
      {isLoginForm ? <LoginForm onSwitch={switchForm} /> : <RegisterForm onSwitch={switchForm} />}
      <ParticlesBg type='custom' config={config} bg={true} />
    </div>
  );
};

export default AuthPage;
