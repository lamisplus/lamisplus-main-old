import React, { useState, useEffect } from 'react';
import { useHistory  } from "react-router-dom";
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import MatButton from '@material-ui/core/Button'
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import sigInLogo from 'assets/img/signin.jpg';
import logo200Image from 'assets/img/logo/logo_200.png';
import limslogo from 'assets/img/logo/Coat_of_arms_of_Nigeria.svg';
import {Card, CardBody,CardHeader,Col,Row,Alert,Table, Form,FormGroup,Label,Input} from 'reactstrap'
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector, useDispatch } from 'react-redux';
import {  samplesManifestById, sampleDispatchedByManifestID } from '../actions/laboratory'
import { Spinner } from 'reactstrap';
import { Badge } from 'reactstrap';
import { TiPrinter,TiArrowBack} from 'react-icons/ti';
import {getQueryParams} from "components/Utils/PageUtils";
import LabManifestDetails from 'components/Functions/LabManifestDetails';



const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  root2: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    fontSize: 13,
    margin: "0px -2px",
    padding: "0px -2px",
  },
  image: {
    backgroundImage: `url(${sigInLogo})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
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
const convertArrayToObject = (array) => 
array.reduce((acc, curr) => {
  acc = curr;
  return acc;
}, {});


const PrintManifest = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const manifestId = getQueryParams("maniFest", props.location.search);
  const [error, setError] = useState(false);
  //const manifestId = manifestDetail.manifestId
  if(manifestId ===null || manifestId ===''){
    history.go(-1)
  }
  const sampleManifestList = useSelector(state => state.laboratory.samplesmanifest);
  const manifestDetailByID = useSelector(state => state.laboratory.manifestDetail);
  console.log(manifestDetailByID)
  const modifyManifestDetail = convertArrayToObject(manifestDetailByID)
  console.log(modifyManifestDetail);
  const manifestDetail = manifestDetailByID && manifestDetailByID!==null ? modifyManifestDetail : {};
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [collectManifest, setcollectManifest] = useState([])


    useEffect(() => {
        
        if(manifestId){         
                setLoading(true);
                    const onSuccess = () => {
                        setLoading(false)                       
                    }
                    const onError = () => {
                        setLoading(false)     
                    }
                dispatch(samplesManifestById(manifestId,onSuccess,onError));
                dispatch(sampleDispatchedByManifestID(manifestId, onSuccess,onError));
           
        }
    }, []); //componentDidMount 
  
    const sampleStatus = e =>{
      if(e===null || e===""){
         return <p><Badge  color="light">Pending </Badge></p>
        }else if(e==="3"){
        return <p><Badge  color="light">{e}</Badge></p>
        }else{
            return <p>{" "}</p>
      }
    }

  return (

      <Grid 
      item xs={12} sm={12} md={12} 
      component={Paper} 
      elevation={0} 
      square
      container
      direction="row"
      justify="center"
      alignItems="center"
      >
        <div className={classes.paper}>
          
            <img
              src={limslogo}
              className="rounded"
              style={{cursor: 'pointer' }}
              alt="logo" 
              height={200}  
              width={200}           
            />
          <br/>
          <Typography component="h1" variant="h5">
            LIMS- PCR Detail
          </Typography>

          <br/><br/>
          <div className={classes.root2}>
          {!loading ?
                        <LabManifestDetails manifestDetail={ manifestDetail }/>  
                    :
                        <p> <Spinner color="primary" /> Loading Please Wait..</p>
           }
            
          </div>

          <form className={classes.form} noValidate>

            <Grid container>

              <Grid item xs={12} sm={12} md={12}>
                <Table  striped responsive>
                    <thead style={{  backgroundColor:'#9F9FA5' }}>
                        <tr>
                            <th>Sample Manifest</th>
                            <th>Patient ID </th>
                            <th>Date Collected</th>
                            <th>Sample Type</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        
                        {!loading ? sampleManifestList.map((row) => (
                            row!==null?
                            <tr key={row.id} style={{ borderBottomColor: '#fff' }}>
                              <th className={classes.td}>{row.id !==null && row.id !=='' ? row.id : ''}</th>
                              <td className={classes.td}> {row.clientId!==null || row.clientId=="" ? row.clientId : ""} </td>
                              <td className={classes.td}>{row.dateSampleCollected==="" ? " ":row.dateSampleCollected}</td>
                              <td className={classes.td}> {row.sampleType} </td>
                             
                            </tr>
                            :
                            <tr></tr>
                          ))
                          :<p> <Spinner color="primary" /> Loading Please Wait</p>
                        } 
                    </tbody>
                </Table>
                <MatButton
                  type='submit'
                  variant='contained'
                  color='primary'
                  className={classes.button}                        
                  className=" float-right mr-1"
                  onClick={() => window.print()}
                  >
                    <TiPrinter/>{" "} Print
                </MatButton>
              </Grid>
            </Grid>
           
          </form>
        </div>
     
    </Grid>
  );
}
export default PrintManifest;