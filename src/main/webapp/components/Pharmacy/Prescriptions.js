import React, { useState, useEffect, Fragment} from "react";
import Page from "components/Page";
import { TiArrowBack } from "react-icons/ti";
import MatButton from '@material-ui/core/Button';
import { Table } from 'reactstrap'
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import momentLocalizer from "react-widgets-moment";
import Moment from "moment";
import PatientDetailCard from 'components/PatientProfile/PatientDetailCard';
import { Link } from "react-router-dom";
//import DispenseModal from './DispenseModal'
import DispenseModal from './DrugDispenseFormIo';
import DispenseModalUpdate from './DrugDispenseUpdateFormIo';
import ViewModal from './ViewModalForm';
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { Spinner } from 'reactstrap';
import { connect } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from "reactstrap";
import {authentication} from '../../_services/authentication';
import { fetchPatientPrescriptionsByEncounter } from "../../actions/pharmacy";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import  CapitalizedText from './../CapitalizedText'


//
Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles((theme) => ({

  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cardBottom: {
    marginBottom: 20,
  },
  Select: {
    height: 45,
    width: 350,
  },
  button: {
    margin: theme.spacing(1),
  },

  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },

  input: {
    display: "none",
  },
}));

const Prescriptions = (props) => {
 const prescriptionOrder  = props.location.state  && props.location.state.formDataObj  ? props.location.state.formDataObj : {}
  console.log(prescriptionOrder)
  const classes = useStyles();
  const [loading, setLoading] = useState('')
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal)
  const [modal1, setModal1] = useState(false);
  const toggleModal1 = () => setModal1(!modal1)
  const [modal2, setModal2] = useState(false);
  const toggleModal2 = () => setModal2(!modal2)
  const [formData, setFormData] = useState(prescriptionOrder);
  const [drugDetails, setDrugDetails] = useState()
  console.log(formData)
const updateFormData = (data) =>{

    setLoading(true);
      const index = formData.findIndex(x => x.id == data.id);

      formData[index] = data;
      setFormData(formData);
    setLoading(false);
    }

  const toggle = (form) => {
    console.log(form)
    setDrugDetails({ ...drugDetails, ...form });
    setModal(!modal);
    
  } 
  const toggle1 = (form) => {
    console.log(form)
    setDrugDetails({ ...drugDetails, ...form });
    setModal1(!modal1)
  }

  const toggle2 = (form) => {
    console.log(form)
    setDrugDetails({ ...drugDetails, ...form });
    setModal2(!modal2)
  }
  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );

   const closeBtn1 = (
     <button className="close" onClick={toggle1}>
       &times;
     </button>
   );

  
 const Actions = (form) => {
   return (
     <Menu>
       <MenuButton
         style={{
           backgroundColor: "#3F51B5",
           color: "#fff",
           border: "2px solid #3F51B5",
           borderRadius: "4px",
         }}
       >
         Action <span aria-hidden>▾</span>
       </MenuButton>
       <MenuList style={{ hover: "#eee" }}>
         {form.data && form.data.prescription_status === 0 ? (

           <MenuItem onSelect={() => 
            toggle(form)
          }
                     hidden={!authentication.userHasRole(["pharmacy_write"]) }
           >
             <i
               className="fa fa-pencil"
               aria-hidden="true"
               size="15"
               style={{ cursor: "pointer", color: "#000" }}
             >
               &nbsp; {""} Dispense drugs
             </i>
           </MenuItem>

        
         ) : (
           <MenuItem onSelect={() => toggle(form)} hidden={!authentication.userHasRole(["pharmacy_write"])}>
             <i
               className="fa fa-pencil"
               aria-hidden="true"
               size="15"
               style={{ cursor: "pointer", color: "#000" }}
             >
               &nbsp; {""} Update details
             </i>
           </MenuItem>
         )}
         {form.data && form.data.prescription_status !=0  ? (
            <MenuItem onSelect={() => toggle1(form)}>
              <i
                className="fa fa-eye"
                aria-hidden="true"
                size="15"
                style={{ cursor: "pointer", color: "#000" }}
              >
                &nbsp; {""}View details
              </i>
            </MenuItem>
         )
         :
         ""
      }
       </MenuList>
     </Menu>
   );
 };
  return (
    <React.Fragment>
      <Card><CardBody>
        <br/>
      <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" 
                to={{pathname: "/pharmacy",
                state: 'prescriptions-detail'
                }} 
            >
                    Pharmacy
            </Link>
           
            <Typography color="textPrimary">Prescription  </Typography>
            
         </Breadcrumbs>
        <br/>    
        <br/>
      <Row>
        <Col>
          <div>
            {formData.length >= 0 ? (
              <Fragment>
                {!loading ?
                        <PatientDetailCard getpatientdetails={ props.location.state }/>  
                    :
                        <p> <Spinner color="primary" /> Loading Please Wait..</p>
                    }
                
                <br />
                <Card className="mb-12">
                  <CardHeader>
                    <span ><CapitalizedText  text="Drug Order Details" /></span>
                    <Link 
                      to ={{ 
                        pathname: "/pharmacy",  
                        state: 'prescription'
                      }}
                    >
                      <MatButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        className=" float-right mr-1">
                        <TiArrowBack /> &nbsp; back
                      </MatButton>
                    </Link>
                  </CardHeader>
                  <CardBody>
                    <br />
                    <Row>
                      <Col>
                        <Card body>
                            <Table striped responsive >
                              <thead style={{backgroundColor: "#9F9FA5",color: "#000",}}>
                                <tr>
                                  <th>Name</th>
                                  <th>Dosage</th>
                                  <th>Date Prescribed</th>
                                  <th>Date Dispensed</th>
                                  <th></th>
                                </tr>
                              </thead>
                              
                              
                                <tbody >
                                {!loading  ?  formData.map((form) => (
                                  
                                  form.data!==null?
                                  <tr key={form.id}>
                                    <td>
                                        {form.data.regimen && form.data.regimen.name ? form.data.regimen.name + ' - ': ''}
                                      <b> {form.data.drugs && form.data.drugs.length > 0 ? form.data.drugs.map(x=>x.drug.name).toString() : ''}</b>
                                          {/*{form.data && form.data.type!=0 ? form.data.drug.name :  form.data.regimen.name}*/}
                                    </td>
                                    <td>{form.data.duration && form.data.duration ? form.data.duration + ' ' + form.data.duration_unit : ''}</td>
                                    <td>{Moment(form.data.date_prescribed).format("YYYY-MM-DD")}</td>
                                    <td>{ form.data.date_dispensed ? Moment(form.data.date_dispensed).format("YYYY-MM-DD") : '' }</td>
                                    <td>{Actions(form)}</td>
                                  </tr>
                                  :
                                   <tr></tr>
                                  ))
                                  :<p> <Spinner color="primary" /> Loading Please Wait</p>
                                } 
                                </tbody>
                               
                            </Table>
                            <br />
                        </Card>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Fragment>
            ) : (
              <div style={{height:'300px'}}>
                <p>
                  {" "}
                  {/* <Spinner color="primary" /> Loading Please Wait.. */}
                  No Prescription details. Please try again...
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>
      </CardBody></Card>
      {modal || modal1 ? 
      (
        <>
        <DispenseModal  modalstatus={modal} togglestatus={toggleModal} datasample={drugDetails} updateFormData={updateFormData}/>
        <ViewModal modalstatus={modal1} togglestatus={toggleModal1} datasample={drugDetails}/>
       </>
      ) 
      : ""
      } 
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
      prescriptionList: state.pharmacy.list
  };
};    

const mapActionToProps = {
  fetchPatientPrescriptionsByEncounter
};
  
export default connect(mapStateToProps, mapActionToProps)(Prescriptions);

