import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAll, deleteApplicationCodeset} from "actions/applicationCodeset";
import {
    Card,
    CardBody, Modal, ModalBody, ModalHeader, Spinner, ModalFooter
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom'
import Button from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";
import NewApplicationCodeset from "./NewApplicationCodeset";
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))
const ApplicationCodesetSearch = (props) => {
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
        toast.success("Application codeset deleted successfully!");
        loadApplicationCodeset();
    };
    const onError = () => {
        setDeleting(false);
        toast.error("Something went wrong, please contact administration");
    };
    props.delete(id, onSuccess, onError);
}
    const openApplicationCodeset = (row) => {
        setCurrentCodeset(row);
        toggleModal();
    }

    const deleteApplicationCodeset = (row) => {
        setCurrentCodeset(row);
        toggleDeleteModal();
    }
    return (
        <Card>
<ToastContainer />
            <CardBody>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to ={{
                        pathname: "/admin",
                        activetab: 1
                    }}  >
                        Admin
                    </Link>
                    <Typography color="textPrimary">Application Codeset Manager</Typography>
                </Breadcrumbs>
<br/>
<div className={"d-flex justify-content-end pb-2"}>
<Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        onClick={() => openApplicationCodeset(null)}
                    >
                        <span style={{textTransform: 'capitalize'}}>Add Application Codeset</span>
                    </Button>

</div>
            <MaterialTable
                title="Find Application Codeset"
                columns={[
                    {
                        title: "Codeset Group",
                        field: "codesetGroup",
                    },
                    { title: "Value", field: "display" },
                    { title: "Version", field: "version" },
                    { title: "Language", field: "language" },
                ]}
                isLoading={loading}
                data={props.applicationCodesetList.map((row) => ({
                    codesetGroup: row.codesetGroup,
                    id: row.id,
                    display: row.display,
                    language: row.language,
                    version: row.version
                }))}

                actions= {[
                    {
                        icon: 'edit',
                        iconProps: {color: 'primary'},
                        tooltip: 'Edit Codeset',
                        onClick: (event, rowData) => openApplicationCodeset(rowData)
                    },
                    {
                        icon: 'delete',
                        iconProps: {color: 'primary'},
                        tooltip: 'Delete Codeset',
                        onClick: (event, rowData) => deleteApplicationCodeset(rowData)
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

            <NewApplicationCodeset toggleModal={toggleModal} showModal={showModal} loadApplicationCodeset={loadApplicationCodeset} formData={currentCodeset}/>
            <Modal isOpen={showDeleteModal} toggle={toggleDeleteModal} >
                    <ModalHeader toggle={props.toggleDeleteModal}> Delete Global Variable - {currentCodeset && currentCodeset.display ? currentCodeset.display : ""} </ModalHeader>
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
        applicationCodesetList: state.applicationCodesets.applicationCodesetList
    };
};

const mapActionToProps = {
    fetchAll: fetchAll,
    delete: deleteApplicationCodeset
};

export default connect(mapStateToProps, mapActionToProps)(ApplicationCodesetSearch);