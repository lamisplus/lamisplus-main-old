import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import { Card, CardContent } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

import { makeStyles } from "@material-ui/core/styles";
import Title from "components/Title/CardTitle";
import ReportSearch from "./ReportSearch";

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
                        <Link to="/jasper">
                            <Button
                                variant="contained"
                                color="primary"
                                className=" float-right mr-1"
                                startIcon={<AddIcon />}>
                                <span style={{textTransform: 'capitalize'}}>New</span>
                                &nbsp;&nbsp;
                                <span style={{textTransform: 'lowercase'}}>Report</span>
                            </Button>
                        </Link>
                        <br/>
                    </Title>
                    <br />
                    <ReportSearch/>
                </CardContent>
            </Card>
        </div>
    );
};

export default GeneralReportSearch;
