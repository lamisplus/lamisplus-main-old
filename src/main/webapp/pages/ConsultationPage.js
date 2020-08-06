import Page from 'components/Page';
import React from 'react';
import {
  Alert
} from 'reactstrap';
import { 
    Card,
    CardContent,   
}
from '@material-ui/core';
import { TiWarningOutline } from "react-icons/ti";
import { makeStyles } from '@material-ui/core/styles';
import TableData from 'components/Consultation/DataTableList';

  const useStyles = makeStyles(theme => ({
    card: {
      margin: theme.spacing(20),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
    },
    
  }));

const ConsultationPage = () => {
    const classes = useStyles();
  return (
    <Page title="Consultation" >
        <Alert color="primary">
            <TiWarningOutline 
                size="30"
                className=" text-dark"/>  { '  '} 
                Note : Only checked in Patients can be search here
            </Alert>
        <Card className={classes.cardBottom}>  
            <CardContent>
                {/* Search Form Input Field */}

                <br/>
                <TableData />
                   
            </CardContent>
        </Card>
        
</Page>
  );
};

export default ConsultationPage;
