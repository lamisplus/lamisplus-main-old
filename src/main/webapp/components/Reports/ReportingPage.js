import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {GiFiles} from 'react-icons/gi';
import AdminSubMenu from "components/Reports/AdminSubMenu";
import GeneralReport from "components/Reports/GeneralReport";


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
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root2: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        margin:theme.spacing(7),
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 12,

        },
        pos: {
            fontSize: 11,
        },
        cardContent:{
            padding: 2,
        },
        cardroot:{
            margin:theme.spacing(1),
            height: 250 + 'px !important' ,
        }

    },
    alertmsge:{
        marginTop: theme.spacing(2),
    },
    rootaccordia: {
        width: '100%',
    },
    accordiaheading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    allergiesroot: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },

    checkboxroot: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },

    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },

    },

    formroot: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    inforoot: {
        width: '95%',
        margin: 20,
        backgroundColor: '#eee',
    },
}));

const cardHeight = {
    height: 200,
    position: 'relative',
    overflow: 'auto',
};

export default function ScrollableTabsButtonForce(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <div className={classes.inforoot} >
                {/* <PatientDetailCard getpatientdetails={props.location.state }/>    */}
            </div>

            <AppBar position="static" >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="white"
                    aria-label="scrollable force tabs example">
                    <Tab className={classes.title} label="Reports" icon={<GiFiles />} {...a11yProps(2)} />
                    {/*<Tab className={classes.title} label="Reports" icon={<GiFiles />} {...a11yProps(4)} />*/}
                    {/*<Tab className={classes.title} label="Service Report" icon={<GiFiles />} {...a11yProps(3)} />*/}
                </Tabs>
                <div>
                </div>
            </AppBar>
            <div>
                <AdminSubMenu />
            </div>

            {/* The DashBoad Tab  */}
            <TabPanel value={value} index={0}>
                <GeneralReport/>
            </TabPanel>
            <TabPanel value={value} index={2}>

            </TabPanel>
            <TabPanel value={value} index={3}>
            </TabPanel>
            <TabPanel value={value} index={5}>
            </TabPanel>
        </div>
    );
}

