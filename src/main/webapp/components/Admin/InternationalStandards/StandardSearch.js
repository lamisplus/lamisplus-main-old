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