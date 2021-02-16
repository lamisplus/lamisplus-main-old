import React from "react";
import { useHistory } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ScriptTag from 'react-script-tag';

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

export default function ExternalModules(props) {
  const classes = useStyles();
  let history = useHistory();
  const src = props.location.state;
  var myRequest = new Request(src);

  // fetch(myRequest).then(function(response) {
  //   console.log(response.status); // returns 200
  // }).catch(function(error) {
  //   console.log(error)
  //   alert('Could not load external module, please contact support');
  // });
  if(!src){
    return (
        <>
          <span>Incorrect url</span>
          </>
    )
  }
  return (

      <>
      <ScriptTag
          type="text/javascript"
          src="https://unpkg.com/@ungap/custom-elements-builtin"
      />
      <ScriptTag
  type="module"
  src="https://unpkg.com/x-frame-bypass"
      />

      <iframe  style={{width:"100%", height:"100%", border:"none", margin:0, padding:0}} src={src} is="x-frame-bypass"></iframe>
</>
  );
}
