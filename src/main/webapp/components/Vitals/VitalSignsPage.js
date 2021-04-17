import Page from 'components/Page';
import React from 'react';
import {
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
import VitalSignsSearch from 'components/Vitals/VitalSignsSearch'

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
        <Page title="Vital Signs" >
            <Alert color="primary">
                <TiWarningOutline
                    size="30"
                    className=" text-dark"/>  { '  '}
                Note : All Checked In Patient can be search here
            </Alert>
            <Card className={classes.cardBottom}>
                <CardContent>
                    {/* Search Form Input Field */}
                    <Form>
                    </Form>
                    <br/>
                    <VitalSignsSearch />
                </CardContent>
            </Card>
        </Page>
    );
};

export default PatientPage;
