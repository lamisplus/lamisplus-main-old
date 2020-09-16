import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "components/Admin/AdminDashboard";
import FormPage from "components/Admin/FormPage";
import ReportHome from "components/Reports/ReportHome";



// {/* Auto textfield complete */}
import { MdDashboard, MdContacts } from "react-icons/md";
import { GiFiles, GiTestTubes } from "react-icons/gi";
import { FaBriefcaseMedical } from "react-icons/fa";
//{/*  Check box list */}

import AdminSubMenu from "components/Admin/AdminSubMenu";
import * as actions from "actions/patients";
import { connect } from "react-redux";
import UserPage from "../Users/UserPage";
import DatabaseManagement from "../Admin/DatabaseManagement/Index";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={5}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        "aria-controls": `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: 200,
        },
    },
    inforoot: {
        width: "100%",
        margin: 0,
        backgroundColor: "#eee",
    },
}));

function HomePage(props) {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [fetchingPatient, setFetchingPatient] = useState(false);
    const getQueryParams = (params, url) => {
        let href = url;
        //this expression is to get the query strings
        let reg = new RegExp("[?&]" + params + "=([^&#]*)", "i");
        let queryString = reg.exec(href);
        return queryString ? queryString[1] : null;
    };

    const hospitalNumber =
        getQueryParams("hospitalNumber", props.location.search) ||
        props.patient.hospitalNumber ||
        "";

    const isEmpty = (value) => {
        if (JSON.stringify(value) === "{}") {
            return true;
        }
        return false;
    };

    React.useEffect(() => {
        setFetchingPatient(true);
        const onSuccess = () => {
            setFetchingPatient(false);
        };
        const onError = () => {
            setFetchingPatient(false);
        };
        props.fetchPatientByHospitalNumber(hospitalNumber, onSuccess, onError);
    }, [hospitalNumber]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <ToastContainer />
            <div className={classes.inforoot}>

            </div>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    aria-label="scrollable force tabs example"
                >
                    <Tab
                        className={classes.title}
                        label="Dashboard"
                        icon={<MdDashboard />}
                        {...a11yProps(0)}
                    />

                    <Tab
                        className={classes.title}
                        label="Form Builder"
                        icon={<GiTestTubes />}
                        {...a11yProps(1)}
                    />
                    <Tab
                        className={classes.title}
                        label="User Setup"
                        icon={<FaBriefcaseMedical />}
                        {...a11yProps(2)}
                    />{" "}
                    <Tab
                        className={classes.title}
                        label="Database Management"
                        icon={<GiFiles />}
                        {...a11yProps(3)}
                    />


                    <Tab
                        className={classes.title}
                        label="Report Builder"
                        icon={<GiFiles />}
                        {...a11yProps(4)}
                    />
                </Tabs>

                <div></div>
            </AppBar>

            <div>
                <AdminSubMenu />

                {/* The DashBoard Tab
        */}

                <TabPanel value={value} index={0}>
                    <AdminDashboard  />
                </TabPanel>
                {/* End of dashboard */}

                {/* Begining of bootstrap  */}
                <TabPanel value={value} index={1}>
                    <FormPage/>
                </TabPanel>
                {/* End of boostrap */}

                {/* user setup */}
                <TabPanel value={value} index={2}>
                    <UserPage/>
                </TabPanel>
                {/* user setup */}

                {/* db manager */}
                <TabPanel value={value} index={3}>
                    <DatabaseManagement/>
                </TabPanel>
                {/* db manager */}

                {/* service forms */}
                <TabPanel value={value} index={4}>
                    <ReportHome/>
                </TabPanel>


                {/* advance config */}

            </div>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        patient: state.patients.patient,
        // hospitalNumber: this.props.location.query.hospitalNumber,
    };
};

const mapActionToProps = {
    fetchPatientByHospitalNumber: actions.fetchByHospitalNumber,
};

export default connect(mapStateToProps, mapActionToProps)(HomePage);
