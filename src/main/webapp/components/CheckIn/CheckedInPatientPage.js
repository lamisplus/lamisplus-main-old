import Page from 'components/Page';
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Form,
    Alert
} from 'reactstrap';
import {
    Card,
    CardContent,
}

    from '@material-ui/core';
import { TiWarningOutline } from "react-icons/ti";

import { makeStyles } from '@material-ui/core/styles';
import Title from 'components/Title/CardTitle';
import CheckedInPatientList from 'components/CheckIn/CheckedInPatientList';

import {
    TiArrowBack,
} from 'react-icons/ti';

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
    return (
        <Page title="Checked In" >
            <Alert color="primary">
                <TiWarningOutline
                    size="30"
                    className=" text-dark"/>  { '  '}
                Note : All Available Patients in the system can be search here
            </Alert>
            <Card className={classes.cardBottom}>
                <CardContent>
                    <Title >All CheckedIn Patient
                        <Link to="/checkin">
                            <Button color="primary" className=" float-right mr-1" >
                                <TiArrowBack/> Go Back
                            </Button>
                            
                        </Link>
                    </Title>
                    <br/>
                    <br/>
                    {/* Search Form Input Field */}
                    <Form>
                    </Form>
                    <br/>
                    <CheckedInPatientList />
                </CardContent>
            </Card>
        </Page>
    );
};

export default PatientPage;
