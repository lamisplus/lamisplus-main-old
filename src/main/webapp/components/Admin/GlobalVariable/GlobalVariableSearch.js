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
import NewGlobalVariable from "./NewGlobalVariable";

const GlobalVariableSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);

    const toggleModal = () => setShowModal(!showModal)

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
                    <Typography color="textPrimary">Global Variable</Typography>
                </Breadcrumbs>
<br/>
<div className={"d-flex justify-content-end pb-2"}>
<Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        onClick={() => toggleModal()}
                    >
                        <span style={{textTransform: 'capitalize'}}>Add Global Variable</span>
                    </Button>

</div>
            <MaterialTable
                title="Find Global Variable"
                columns={[
                    {
                        title: "Name",
                        field: "name",
                    },
                    { title: "Description", field: "id" },
                    { title: "Value", field: "age", filtering: false }
                ]}
                isLoading={loading}
                data={props.patientsList.map((row) => ({
                    name: row.firstName +  ' ' + row.lastName,
                    id: row.hospitalNumber,
                    age: row.dob
                }))}

                actions= {[
                    {
                        icon: 'edit',
                        iconProps: {color: 'primary'},
                        tooltip: 'Edit Global Variable'},
                    {
                        icon: 'delete',
                        iconProps: {color: 'primary'},
                        tooltip: 'Delete Global Variable'}
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

            <NewGlobalVariable toggleModal={toggleModal} showModal={showModal}/>
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

export default connect(mapStateToProps, mapActionToProps)(GlobalVariableSearch);