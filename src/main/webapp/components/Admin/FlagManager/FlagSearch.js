import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAllFlag, deleteFlag} from "actions/flag";
import {
    Card,
    CardBody, Modal, ModalBody, ModalHeader, Spinner, ModalFooter
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";
import NewWard from "./NewFlag";
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))
const FlagSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [deleting, setDeleting] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [currentCodeset, setCurrentCodeset] = React.useState(null);
    const toggleModal = () => setShowModal(!showModal)
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
    const classes = useStyles()

    useEffect(() => {
        loadApplicationCodeset()
    }, []); //componentDidMount

 const loadApplicationCodeset = () => {
     const onSuccess = () => {
         setLoading(false);
     };
     const onError = () => {
         setLoading(false);
     };
     props.fetchAll(onSuccess, onError);
    }

const processDelete = (id) => {
     setDeleting(true);
    const onSuccess = () => {
        setDeleting(false);
        toggleDeleteModal();
        toast.success("Flag deleted successfully!");
        loadApplicationCodeset();
    };
    const onError = () => {
        setDeleting(false);
        toast.error("Something went wrong, please contact administration");
    };
    props.delete(id, onSuccess, onError);
}
    const openWard = (row) => {
        setCurrentCodeset(row);
        toggleModal();
    }

    const deleteWard = (row) => {
        setCurrentCodeset(row);
        toggleDeleteModal();
    }
    return (
        <Card>
<ToastContainer />
            <CardBody>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to={{pathname: "/admin"}} >
                        Admin
                    </Link>
                    <Typography color="textPrimary">Flags Manager</Typography>
                </Breadcrumbs>
<br/>
<div className={"d-flex justify-content-end pb-2"}>
<Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        onClick={() => openWard(null)}
                    >
                        <span style={{textTransform: 'capitalize'}}>Add New Flag</span>
                    </Button>

</div>
            <MaterialTable
                title="Find Flags"
                columns={[
                    {
                        title: "Flag Name",
                        field: "name",
                    },
                    { title: "Form", field: "display" },
                    { title: "Form Field", field: "display" },
                    { title: "Operand", field: "display" },
                    { title: "Value", field: "display" },
                    { title: "Created By", field: "createdBy" }
                ]}
                isLoading={loading}
                data={props.list}

                actions= {[
                    {
                        icon: EditIcon,
                        iconProps: {color: 'primary'},
                        tooltip: 'Edit Flag',
                        onClick: (event, rowData) => openWard(rowData)
                    },
                    {
                        icon: DeleteIcon,
                        iconProps: {color: 'primary'},
                        tooltip: 'Delete Flag',
                        onClick: (event, rowData) => deleteWard(rowData)
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

            <NewWard toggleModal={toggleModal} showModal={showModal} loadApplicationCodeset={loadApplicationCodeset} formData={currentCodeset}/>
            <Modal isOpen={showDeleteModal} toggle={toggleDeleteModal} >
                    <ModalHeader toggle={props.toggleDeleteModal}> Delete Flag - {currentCodeset && currentCodeset.name ? currentCodeset.name : ""} </ModalHeader>
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
                        onClick={() => processDelete(currentCodeset.id)}
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
        list: state.flags.flagList
    };
};

const mapActionToProps = {
    fetchAll: fetchAllFlag,
    delete: deleteFlag
};

export default connect(mapStateToProps, mapActionToProps)(FlagSearch);