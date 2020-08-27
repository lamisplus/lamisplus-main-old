import React, { useState, useEffect } from 'react';
import { useHistory  } from "react-router-dom";
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import sigInLogo from 'assets/img/signin.jpg';
import logo200Image from 'assets/img/logo/logo_200.png';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        LAMISPlaus
      </Link>{' '}
      
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${sigInLogo})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  let history = useHistory();
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (username.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [username, password]);

  const handleLogin = () => {
    
    if (username === 'abc@mail.com' && password === '12345') {
      setError(false);
      setHelperText('Login Successfully');
      history.push("/dashboard");
      
      
    } else {
      setError(true);
      setHelperText('Incorrect username or password')
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleLogin();
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={9} className={classes.image} />
      <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          
            <img
              src={logo200Image}
              className="rounded"
              style={{cursor: 'pointer' }}
              alt="logo"              
            />
          <br/>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              error={error}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              type="email"
              label="Username"
              placeholder="Username"
              
              name="email"
              onChange={(e)=>setUsername(e.target.value)}
              onKeyPress={(e)=>handleKeyPress(e)}
            />
            <TextField
            error={error}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              helperText={helperText}
              onChange={(e)=>setPassword(e.target.value)}
              onKeyPress={(e)=>handleKeyPress(e)}
              
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
              <Button
               
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={()=>handleLogin()}
                disabled={isButtonDisabled}
              >
                Sign In
            </Button>
            <Grid container>

              <Grid item>
              </Grid>
            </Grid>
            {/* <Box mt={5}>
              <Copyright />
            </Box> */}
          </form>
        </div>
      </Grid>
    </Grid>
  );
}