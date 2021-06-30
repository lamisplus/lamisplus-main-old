import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAllIcd} from "actions/internationalStandards";
import {
    Card,
    CardBody
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";
import NewStandard from "./NewStandard";
import NewStandardCodeset from "./NewStandardCodeset";
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const InternationalStandardSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [showNewStandardModal, setShowNewStandardModal] = React.useState(false);
    const [showNewCodesetModal, setShowNewCodesetModal] = React.useState(false);
    const toggleNewStandardModal = () => setShowNewStandardModal(!showNewStandardModal)
    const toggleNewCodesetModal = () => setShowNewCodesetModal(!showNewCodesetModal)

    useEffect(() => {
        const onSuccess = () => {
            setLoading(false);
        };
        const onError = () => {
            setLoading(false);
        };
        props.fetchAll(onSuccess, onError);
    }, []); //componentDidMount


    return (
        <Card>

            <CardBody>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to={{pathname: "/admin"}} >
                        Admin
                    </Link>
                    <Typography color="textPrimary">International Standard Setup</Typography>
                </Breadcrumbs>
<br/>
<div className={"d-flex justify-content-end pb-2"}>
    {/*<Button*/}
    {/*    variant="contained"*/}
    {/*    color="primary"*/}
    {/*    startIcon={<FaPlus />}*/}
    {/*    onClick={() => toggleNewStandardModal()}*/}
    {/*    className={"pr-2"}*/}
    {/*>*/}
    {/*    <span style={{textTransform: 'capitalize'}}>Add ICD Standard</span>*/}
    {/*</Button>*/}
<Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        onClick={() => toggleNewCodesetModal()}
                    >
                        <span style={{textTransform: 'capitalize'}}>Add ICD Codeset</span>
                    </Button>

</div>
            <MaterialTable
            icons={tableIcons}
                title="Find ICD Standards"
                columns={[
                    { title: "Category Name", field: "categoryTitle"},
                    { title: "Category Code", field: "categoryCode" },
                    { title: "Description", field: "fullDescription" },
                    { title: "Diagnosis Code", field: "diagnosisCode" },
                ]}
                isLoading={loading}
                data={props.list}

                actions= {[
                    {
                        icon: 'edit',
                        iconProps: {color: 'primary'},
                        tooltip: 'Edit Standard'},
                    {
                        icon: 'delete',
                        iconProps: {color: 'primary'},
                        tooltip: 'Delete Standard'}
                        ]}
                //overriding action menu with props.actions
                components={props.actions}
                options={{
                    headerStyle: {
                        backgroundColor: "#9F9FA5",
                        color: "#000",
                    },
                    searchFieldStyle: {
                        width : '300%',
                        margingLeft: '250px',
                    },
                    filtering: true,
                    exportButton: false,
                    searchFieldAlignment: 'left',
                    actionsColumnIndex: -1
                }}
            />
            </CardBody>

            <NewStandard toggleModal={toggleNewStandardModal} showModal={showNewStandardModal}/>
            <NewStandardCodeset toggleModal={toggleNewCodesetModal} showModal={showNewCodesetModal}/>
        </Card>
    );
}

const mapStateToProps = state => {

    return {
        list: state.standards.icdList
    };
};

const mapActionToProps = {
    fetchAll: fetchAllIcd
};

export default connect(mapStateToProps, mapActionToProps)(InternationalStandardSearch);