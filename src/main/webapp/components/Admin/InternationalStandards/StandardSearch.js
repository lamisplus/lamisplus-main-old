import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAll} from "actions/patients";
import {
    Card,
    CardBody
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from '@material-ui/core/Link';
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
        props.fetchAllPatients(onSuccess, onError);
    }, []); //componentDidMount


    return (
        <Card>

            <CardBody>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/admin" >
                        Admin
                    </Link>
                    <Typography color="textPrimary">International Standard Setup</Typography>
                </Breadcrumbs>
<br/>
<div className={"d-flex justify-content-end pb-2"}>
    <Button
        variant="contained"
        color="primary"
        startIcon={<FaPlus />}
        onClick={() => toggleNewStandardModal()}
        className={"pr-2"}
    >
        <span style={{textTransform: 'capitalize'}}>Add Standard</span>
    </Button>
<Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        onClick={() => toggleNewCodesetModal()}
                    >
                        <span style={{textTransform: 'capitalize'}}>Add Standard Codeset</span>
                    </Button>

</div>
            <MaterialTable
                title="Find International Standards"
                columns={[
                    {
                        title: "Name",
                        field: "name",
                    },
                    { title: "Description", field: "id" }
                ]}
                isLoading={loading}
                data={props.patientsList.map((row) => ({
                    name: row.firstName +  ' ' + row.lastName,
                    id: row.hospitalNumber
                }))}

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
        patientsList: state.patients.list
    };
};

const mapActionToProps = {
    fetchAllPatients: fetchAll
};

export default connect(mapStateToProps, mapActionToProps)(InternationalStandardSearch);