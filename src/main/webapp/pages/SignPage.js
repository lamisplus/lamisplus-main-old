import React, {useState, useEffect} from 'react';
import { useHistory  } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo200Image from 'assets/img/logo/logo_200.png';

import { authentication } from '../_services/authentication';

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

const useStyles = makeStyles((theme) => ({
  
  paper: {
    marginTop: theme.spacing(8),
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

export default function SignIn() {
  const classes = useStyles();
  let history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState('');
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
    authentication.login(username, password, remember).then(
      (user) => {
        //const { from } = this.props.location.state || {
        //  from: { pathname: "/dashboard" },
        //};
        //this.props.history.push(from);
        setError(false);
        setHelperText('Login Successfully');
        history.push("/");
      },
      (error) => {
        setError(true);
        setHelperText('Incorrect username or password');
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleLogin();
    }
  };
  return (
    <div style={{  
      //backgroundImage: `url(${sigInLogo})`,
      backgroundColor: '#fff',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat',
      height: "100%"
    }}>
    <Container component="main" maxWidth="xs" >
      <CssBaseline />
      <div className={classes.paper} >
      <img
              src={logo200Image}
              className="rounded"
              style={{cursor: 'pointer' }}
              alt="logo"              
            />
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
              id="remember"
              onChange={(e)=>setRemember(e.target.value)}
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
     
    </Container>
    </div>
  );
}