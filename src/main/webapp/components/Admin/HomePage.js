import React, {useEffect, useState} from "react";
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
import { authentication } from '_services/authentication';
import BootstrapConfigurationHome from './BootstrapConfiguration/Index';

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const urlIndex = null; //getQueryParams("tab", props.location.search);
    const urlTabs = urlIndex !== null ? urlIndex : props.location.state ;
    useEffect ( () => {
        switch(urlTabs){
            case "form-builder": return setValue(1)
            case "users": return setValue(2)
            case "report-builder": return setValue(3)
            case "bootstrap-configuration": return setValue(4)

            default: return setValue(0)
        }
    }, [urlIndex]);

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
                        disabled={!authentication.userHasRole(["admin_read","form_builder_read", "form_builder_write", "form_builder_delete"])}
                        icon={<GiTestTubes />}
                        {...a11yProps(1)}
                    />
                    <Tab
                        className={classes.title}
                        label="User Setup"
                        disabled={!authentication.userHasRole(["user_read", "user_write", "user_delete", "admin_read"])}
                        icon={<FaBriefcaseMedical />}
                        {...a11yProps(2)}
                    />{" "}

                    <Tab
                        className={classes.title}
                        label="Report Builder"
                        disabled={!authentication.userHasRole(["admin_read", "report_builder_read", "report_builder_write", "report_builder_delete"])}
                        icon={<GiFiles />}
                        {...a11yProps(3)}/>

                    {/*<Tab*/}
                    {/*    className={classes.title}*/}
                    {/*    label="Boostrap Configuration"*/}
                    {/*    //disabled={!authentication.userHasRole(["bootstrap_read", "bootstrap_write", "bootstrap_delete"])}*/}
                    {/*    icon={<GiFiles />}*/}
                    {/*    {...a11yProps(4)}*/}
                    {/*/>4*/}
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
                {/*<TabPanel value={value} index={3}>*/}
                {/*    <DatabaseManagement/>*/}
                {/*</TabPanel>*/}
                {/* db manager */}

                {/* service forms */}
                <TabPanel value={value} index={3}>
                    <ReportHome/>
                </TabPanel>

                {/* service forms */}
                <TabPanel value={value} index={4}>
                    <BootstrapConfigurationHome/>
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
};

export default connect(mapStateToProps, mapActionToProps)(HomePage);
