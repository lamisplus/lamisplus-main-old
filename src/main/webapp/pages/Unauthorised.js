import React from "react";
import { useHistory } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo200Image from "assets/img/logo/logo_200.png";
import { FaArrowLeft } from "react-icons/fa";


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Unauthorised() {
  const classes = useStyles();
  let history = useHistory();

  return (
    <div
      style={{
        backgroundColor: "#fff",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        height: "100%",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <div className={classes.paper}>
          <img
            src={logo200Image}
            className="rounded"
            style={{ cursor: "pointer" }}
            alt="logo"
          />
          <br />
          <br />
          <Typography component="h1" variant="h5">
            Unauthorised Access
          </Typography>
          <div>
            <Button  variant="contained" className={"block"}  color="primary" onClick={history.goBack} startIcon={<FaArrowLeft />}>Go Back</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
