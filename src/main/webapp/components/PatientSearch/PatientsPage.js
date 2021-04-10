import React, {useState} from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import { Card, CardContent } from "@material-ui/core";
import { FaUserPlus } from "react-icons/fa";

import { makeStyles } from "@material-ui/core/styles";
import Title from "components/Title/CardTitle";
import PatientSearch from "./PatientSearch";
import { authentication } from '../../_services/authentication';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import SearchPatientByFingerprint from "../Biometrics/SearchByPatient";

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

const GeneralPatientSearch = props => {
  const classes = useStyles();
  const [showFingerprintModal, setFingerprintModal] = useState(false);
  return (
    <div>
      <Card className={classes.cardBottom}>
        <CardContent>
          <Title>
            {/*<Link to="/patient-registration">*/}
            {/*  <Button*/}
            {/*    variant="contained"*/}
            {/*    color="primary"*/}
            {/*    className=" float-right mr-1"*/}
            {/*    startIcon={<FaUserPlus />}*/}
            {/*  >*/}
            {/*    <span style={{textTransform: 'capitalize'}}>Add </span>*/}
            {/*    &nbsp;&nbsp;*/}
            {/*    <span style={{textTransform: 'lowercase'}}>Patient </span>*/}
            {/*    */}
            {/*  </Button>*/}
            {/*</Link>*/}
            <Link to="/patient-registration-formio">
              <Button
                  variant="contained"
                  color="primary"
                  className=" float-right mr-1"
                  startIcon={<FaUserPlus />}
                  disabled={!authentication.userHasRole(["patient_write"])}
              >
                <span style={{textTransform: 'capitalize'}}>Add Patient</span>
              </Button>
            </Link>

              <Button
                  variant="contained"
                  color="primary"
                  className=" float-right mr-1"
                  startIcon={<FingerprintIcon />}
                  onClick={() => setFingerprintModal(!showFingerprintModal)}
                  disabled={!authentication.userHasRole(["patient_write"])}
              >
                <span style={{textTransform: 'capitalize'}}>Search by Fingerprint</span>
              </Button>


            <br />
          </Title>
          <br />
          <PatientSearch />
        </CardContent>
      </Card>
      <SearchPatientByFingerprint showModal={showFingerprintModal} toggleModal={() => setFingerprintModal(!showFingerprintModal)}/>
    </div>
  );
};

export default GeneralPatientSearch;
