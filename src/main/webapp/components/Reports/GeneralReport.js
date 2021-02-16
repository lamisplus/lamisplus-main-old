import React from "react";
import { Card, CardContent } from "@material-ui/core";


import { makeStyles } from "@material-ui/core/styles";
import Title from "components/Title/CardTitle";
import ServiceReportSearch from "./ServiceReportSearch";
// import FormTest from './FormTest';

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
}));

const GeneralReportSearch = props => {
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.cardBottom}>
                <CardContent>
                    <Title>
                        <br/>
                    </Title>
                    <br />
                    <ServiceReportSearch/>
                </CardContent>
            </Card>
        </div>
    );
};

export default GeneralReportSearch;
