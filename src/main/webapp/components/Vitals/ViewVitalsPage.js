import Page from 'components/Page';
import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import {Button,Alert} from 'reactstrap';
import {
    Card,
    CardContent,
    Typography,
}
    from '@material-ui/core';
import { TiWarningOutline } from "react-icons/ti";

import { makeStyles } from '@material-ui/core/styles';
// import SearchInput from 'components/SearchBox/SearchInput';
import Title from 'components/Title/CardTitle';
import ViewVitalsSearch from 'components/Vitals/ViewVitalsSearch'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {MdKeyboardBackspace} from 'react-icons/md';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';
import AddVitalsPage from 'components/Vitals/AddVitalsPage';

const useStyles = makeStyles(theme => ({

    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

}));

const PatientPage = () => {
    const classes = useStyles();
    const classes2 = useStyles();

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [patientrow, setpatientValue] = useState();
    const getUsermodal = (patientrow)=> {
      // setuservalue(user);
      setModal(!modal);
    
    }
    return (
        <Page title="Patient Vitals" >
            <Alert color="primary">
                <TiWarningOutline
                    size="30"
                    className=" text-dark"/>  { '  '}
                Note : All Available Vitals for a Patients can be search here
            </Alert>
            <div className={classes2.inforoot} >
                <ExpansionPanel defaultExpanded style={{ backgroundColor: '#F5F5F5'}}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1c-content"
                        id="panel1c-header">
                        <div className={classes2.column}>
                            <Typography className={classes.heading}>
                                Name: Dorcas Essien
                                <br/>
                                Gender : Female
                            </Typography>
                        </div>
                        <div className={classes2.column}>
                            <Typography className={classes2.secondaryHeading}>
                                Birthday : June, 14 1990 (20 years)
                                <br/>
                                phone Number : +234567890
                            </Typography>
                        </div>
                        <div className={classes2.column}>
                            <Typography className={classes2.secondaryHeading}>
                                Email Address : essiendorcas530@gmail.com

                            </Typography>
                        </div>
                    </ExpansionPanelSummary>
                </ExpansionPanel>
            </div>
            <br />
            <Card className={classes.cardBottom}>
                <CardContent>
                    <Title>
                        <Link to="/vital-signs">
                            <Button color="primary" className=" float-right mr-1" >
                                <MdKeyboardBackspace/> Go Back
                            </Button>
                        </Link>
                        <Link to="/view-vitals">
                            <Button
                                variant="contained"
                                color="primary" className=" float-right mr-1" 
                                onClick={() => {
                                    getUsermodal(setpatientValue('mathew'));

                                    }}>
                                Add Vital Signs
                            </Button>
                        </Link>
                        <br />
                    </Title>
                    <br/>
                    {/* Search Form Input Field */}
                    {/* <Form>
                        <SearchInput />
                    </Form> */}
                    <br/>
                    <ViewVitalsSearch />
                </CardContent>
            </Card>
            <Modal isOpen={modal} toggle={toggle} size='lg' zIndex={"9999"} >
                <ModalHeader toggle={toggle}>Add New Vitals</ModalHeader>
                <ModalBody>
                    <AddVitalsPage patient={patientrow}/>
                </ModalBody>
            </Modal>
        </Page>
    );
};

export default PatientPage;
