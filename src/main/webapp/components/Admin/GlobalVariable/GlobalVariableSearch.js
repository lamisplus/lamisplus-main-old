import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAll, deleteGlobalVariable} from "actions/globalVariable";
import {
    Card,
    CardBody, Modal, ModalBody, ModalFooter, ModalHeader, Spinner
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";
import NewGlobalVariable from "./NewGlobalVariable";
import {toast} from "react-toastify";
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))
const GlobalVariableSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentGlobalVariable, setCurrentGlobalVariable] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
    const toggleModal = () => setShowModal(!showModal)
    const classes = useStyles()
    const loadGlobalVariable = () => {
        const onSuccess = () => {
            setLoading(false);
        };
        const onError = () => {
            setLoading(false);
        };
        props.fetchAll(onSuccess, onError);
    }
    useEffect(() => {
       loadGlobalVariable()
    }, []); //componentDidMount

    const openGlobalVariable = (row) => {
        setCurrentGlobalVariable(row);
        toggleModal();
    }

    const deleteGlobalVariable = (row) => {
        setCurrentGlobalVariable(row);
        toggleDeleteModal();
    }

    const processDelete = (id) => {
        setDeleting(true);
        const onSuccess = () => {
            setDeleting(false);
            toggleDeleteModal();
            toast.success("Global variable deleted successfully!");
            loadGlobalVariable();
        };
        const onError = () => {
            setDeleting(false);
            toast.error("Something went wrong, please contact administration");
        };
        props.delete(id, onSuccess, onError);
    }
    return (
        <Card>
            <CardBody>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to={{pathname: "/admin"}} >
                        Admin
                    </Link>
                    <Typography color="textPrimary">Global Variable</Typography>
                </Breadcrumbs>
                <br/>
                <div className={"d-flex justify-content-end pb-2"}>
                    <Button variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        onClick={() => openGlobalVariable(null)}>
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
                    { title: "Description", field: "description" },
                    { title: "Value", field: "format", filtering: false }
                ]}
                isLoading={loading}
                data={props.list}

                actions= {[
                    {
                        icon: 'edit',
                        iconProps: {color: 'primary'},
                        tooltip: 'Edit Global Variable',
                        onClick: (event, rowData) => openGlobalVariable(rowData)
                    },
                    {
                        icon: 'delete',
                        iconProps: {color: 'primary'},
                        tooltip: 'Delete Global Variable',
                        onClick: (event, rowData) => deleteGlobalVariable(rowData)
                    }
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

            <NewGlobalVariable toggleModal={toggleModal} showModal={showModal} loadGlobalVariable={loadGlobalVariable} formData={currentGlobalVariable}/>
            <Modal isOpen={showDeleteModal} toggle={toggleDeleteModal} >
                <ModalHeader toggle={toggleDeleteModal}> Delete Global Variable - {currentGlobalVariable && currentGlobalVariable.name ? currentGlobalVariable.name : ""} </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to proceed ?</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        type='button'
                        variant='contained'
                        color='primary'
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        disabled={deleting}
                        onClick={() => processDelete(currentGlobalVariable.id)}
                    >
                        Delete  {deleting ? <Spinner /> : ""}
                    </Button>
                    <Button
                        variant='contained'
                        color='default'
                        onClick={toggleDeleteModal}
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </Card>
    );
}

const mapStateToProps = state => {

    return {
        list: state.globalVariables.list
    };
};

const mapActionToProps = {
    fetchAll: fetchAll,
    delete: deleteGlobalVariable
};

export default connect(mapStateToProps, mapActionToProps)(GlobalVariableSearch);