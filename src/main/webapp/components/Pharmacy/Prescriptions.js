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
import DispenseUpdateModal from './DrugDispenseUpdateFormIo'
import DispenseModal from './DrugDispenseFormIo';
import ViewModal from './ViewModalForm';
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { Spinner } from 'reactstrap';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from "reactstrap";
import {authentication} from '../../_services/authentication';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";


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
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleModalUpdate = () => setModalUpdate(!modalUpdate)
  const [formData, setFormData] = useState(prescriptionOrder);
  const [drugDetails, setDrugDetails] = useState()

const updateFormData = (data) =>{
      console.log('in update form data')
    setLoading(true);
      const index = formData.findIndex(x => x.id == data.id);
      console.log('index is '+index)

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
    setDrugDetails({ ...drugDetails, ...form });
    setModal1(!modal1)
  }

  const toggleUpdate = (form) => {
    setDrugDetails({ ...drugDetails, ...form });
    setModalUpdate(!modalUpdate)
  }


  
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
         {form.data.prescription_status === 0 ? (

           <MenuItem onSelect={() => 
            toggle(form)
          }
                     hidden={!authentication.userHasRole(["pharmacy_write"])}
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
         {form.data.prescription_status !=0 ? (
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
    <div>
      <ToastContainer autoClose={2000} />
      <Card body>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to={{pathname: "/pharmacy"}} >
                Pharmacy
            </Link>
            <Link color="inherit" to={{pathname: "prescriptions"}} >
                Drug Prescription    
            </Link>
            <Typography color="textPrimary">{} </Typography>
            </Breadcrumbs>
            <br/>
      <Row>
        <Col>
          <div>
            {formData ? (
              <Fragment>
                {!loading ?
                        <PatientDetailCard getpatientdetails={ props.location.state }/>  
                    :
                        <p> <Spinner color="primary" /> Loading Please Wait..</p>
                    }
                
                <br />
                <Card className="mb-12">
                  <CardHeader>
                    DRUG ORDER DETAILS
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
                                  <th>Duration</th>
                                  <th>Date Prescribed</th>
                                  <th>Date Dispensed</th>
                                  <th></th>
                                </tr>
                              </thead>
                              
                              
                                <tbody >
                                {!loading ? formData.map((form) => (
                                  form.data!==null?
                                  <tr key={form.id}>
                                    <td>
                                      <b>{form.data && form.data.type!=0 ? form.data.drug.name :  form.data.regimen.name}</b>
                                    </td>
                                    <td>{form.data.duration && form.data.duration ? form.data.duration + form.data.duration_unit : ''}</td>
                                    <td>{Moment(form.data.date_prescribed).format("DD-MM-YYYY")}</td>
                                    <td>{ form.data.date_dispensed ? Moment(form.data.date_dispensed).format("DD-MM-YYYY") : '' }</td>
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
              <p>
                {" "}
                {/* <Spinner color="primary" /> Loading Please Wait.. */}
                No Prescription details
              </p>
            )}
          </div>
        </Col>
      </Row>
      </Card>
     <DispenseModal  modalstatus={modal} togglestatus={toggleModal} datasample={drugDetails} updateFormData={updateFormData}/>
     <DispenseUpdateModal  modalstatus={modalUpdate} togglestatus={toggleModalUpdate} datasample={drugDetails}/>
     <ViewModal modalstatus={modal1} togglestatus={toggleModal1} datasample={drugDetails}/> 
    </div>
  );
}

export default Prescriptions
