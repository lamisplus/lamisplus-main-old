import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import {url} from './../api';
import axios from "axios";
import { authentication } from "./../_services/authentication";
import { Link } from 'react-router-dom';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { CardBody, Card} from 'reactstrap';
import { Alert, AlertTitle } from '@material-ui/lab';
import {GiFiles} from 'react-icons/gi'; 
import Button from "@material-ui/core/Button";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));




export default function CheckboxListSecondary() {
  const classes = useStyles();
  const [facilities, setFacilities] = useState( [])
  const [checked, setChecked] = React.useState([]);
  const currentUser = authentication.getCurrentUser();
  const [user, setUser] = useState(null);
  
  

async function fetchMe() {
  if( authentication.currentUserValue != null ) {
    axios
        .get(`${url}account`)
        .then((response) => {
          setUser(response.data);
          console.log(response.data.applicationUserOrganisationUnits);
          setFacilities(response.data.applicationUserOrganisationUnits);
          // set user permissions in local storage for easy retrieval, when user logs out it will be removed from the local storage
          localStorage.setItem('currentUser_Permission', JSON.stringify(response.data.permissions));
        })
        .catch((error) => {

        });
  }
}

useEffect(() => {
  fetchMe()
}, []);


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  console.log(checked)
  return (

    <div >
     
      <Card>
        <CardBody>

        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to={{pathname: "/plug-in"}} >
              Plugins
          </Link>          
         <Typography color="textPrimary">NDR </Typography> 
        </Breadcrumbs>
        <br/>
        <br/>
        <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
          Please check the Facilities you want  — <strong>List of Facilities!</strong>
        </Alert>
        <br/><br/>
          <Button
              color="primary"
              variant="contained"
              className=" float-right mr-1"
              size="large"
            >
              {<GiFiles />} &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}>Download  </span>
                         
            </Button>
            <Button
              color="primary"
              variant="contained"
              className=" float-right mr-1"
              size="large"
            >
              {<GiFiles />} &nbsp;&nbsp;
              <span style={{textTransform: 'capitalize'}}> Generate </span>
              
            </Button>

     <List dense >
     
      <br/>
      {facilities.map((value) => {
        //console.log(value)
        const labelId = `checkbox-list-secondary-label-${value.id}`;
        return (
          <ListItem key={value.id} button>
            <ListItemAvatar>
              <AccountBalanceIcon />
            </ListItemAvatar>
            <ListItemText id={labelId} primary={`${value.organisationUnitName }`} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
    </CardBody>
    </Card>
    </div>
  );
}
