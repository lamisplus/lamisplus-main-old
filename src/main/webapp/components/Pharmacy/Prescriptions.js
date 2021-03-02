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
import DispenseModal from './DrugDispenseFormIo'
import ViewModal from './ViewModalForm'
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { Spinner } from 'reactstrap';
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import {  fetchPatientPrescriptionsByEncounter } from './../../actions/pharmacy'
import {authentication} from '../../_services/authentication';


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
  const dispatch = useDispatch();
  const prescriptionOrder = useSelector(state => state.pharmacy.list);
 
  useEffect(() => {
        
    if(props.location.state.encounterId !="" ){         
            setLoading(true);
                const onSuccess = () => {
                    setLoading(false) 

                }
                const onError = () => {
                    setLoading(false)     
                }
        dispatch(fetchPatientPrescriptionsByEncounter(props.location.state.encounterId,onSuccess,onError ));
    }
}, [props.location.state.encounterId]); //componentDidMount 
  const classes = useStyles();
  const { buttonLabel, className } = props;
  const [loading, setLoading] = useState('')
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modalRegimen, setModalRegimen] = useState(false);
  const [drugDetails, setDrugDetails] = useState({})
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleAction = () => setDropdownOpen((prevState) => !prevState);

  const toggle = (form) => {
    setDrugDetails({ ...drugDetails, ...form });
    setModal(!modal);
    
  } 
  const toggle1 = (form) => {
    setDrugDetails({ ...drugDetails, ...form });
    setModal1(!modal1)
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

  const formData = props.location.state ? prescriptionOrder : null 
  console.log(formData)

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

           <MenuItem onSelect={() => toggle(form)}
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
    <Page title="Dispense Drugs">
      <ToastContainer autoClose={2000} />
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
                                  <th>Dosage</th>
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
                                    <td>{form.data.duration && form.data.duration ? form.data.duration : ''}</td>
                                    <td>{Moment(form.data.date_prescribed).format("DD-MM-YYYY")}</td>
                                    <td>{ Moment(form.data.date_dispensed).format("DD-MM-YYYY")}</td>
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
      {modal ? (
        <DispenseModal
          isOpen={modal}
          toggle={toggle}
          close={closeBtn}
          formData={drugDetails}
        ></DispenseModal>
      ) : (
        <div></div>
      )}

      {modal1 ? (
        <ViewModal
          isOpen={modal1}
          toggle={toggle1}
          close={closeBtn1}
          formData={drugDetails}
        ></ViewModal>
      ) : (
        <div></div>
      )}
    </Page>
  );
}

export default Prescriptions
