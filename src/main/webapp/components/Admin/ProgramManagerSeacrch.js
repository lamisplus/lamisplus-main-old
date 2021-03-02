import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAll, deleteProgram, updateProgram, } from "actions/programManager";

import {
    Card,
    CardBody, Modal, ModalBody, ModalFooter, ModalHeader, Spinner
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";
import NewProgramManager from "./NewProgramManager";
import {toast} from "react-toastify";
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import "@reach/menu-button/styles.css";
import {Menu, MenuButton, MenuItem, MenuList} from '@reach/menu-button';
import {MdDeleteForever, MdModeEdit } from "react-icons/md";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const ProgramManagerSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [deactiavte, setDeactiavte] = React.useState(false);
    const [currentProgramManager, setCurrentProgramManager] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
    const toggleDeactivateModal = () => setShowDeleteModal(!deactiavte)
    
    const toggleModal = () => setShowModal(!showModal)
    const classes = useStyles()

    const loadProgramManager = () => {
        const onSuccess = () => {
            setLoading(false);
        };
        const onError = () => {
            setLoading(false);
        };
        props.fetchAll(onSuccess, onError);
    }
    useEffect(() => {
        loadProgramManager()
    }, []); //componentDidMount


    const openProgram = (row) => {
        setCurrentProgramManager(row);
        toggleModal();
    }
    const updatePrograms = (row) =>{
        setCurrentProgramManager(row);
        toggleModal();

    }
    const deactiavtePrograms = (row) =>{
        console.log(row)
        setDeleting(true);
        const onSuccess = () => {
            setDeleting(false);
            toggleDeleteModal();
            toast.success("Program deactivated successfully!");
            loadProgramManager();
        };
        const onError = () => {
            setDeleting(false);
            toast.error("Something went wrong, please contact administration");
        };
        row['archived'] =1;
        props.updateProgram(row.id, row)

    }

    const deleteProgram = (e) => {
        console.log(e.name)
        console.log(e.id)
        setCurrentProgramManager(e);
        toggleDeleteModal();
    }

    const deActivateProgram = (e) => {
        setCurrentProgramManager(e);
        toggleDeleteModal();
    }

    // const activateAndDeactavitePrograms = (row)  => {
    //     props.updateProgram(row.id, row)
    // }

    const processDelete = (id) => {
        setDeleting(true);
        const onSuccess = () => {
            setDeleting(false);
            toggleDeleteModal();
            toast.success("Program deleted successfully!");
            loadProgramManager();
        };
        const onError = () => {
            setDeleting(false);
            toast.error("Something went wrong, please contact administration");
        };
        props.deleteProgram(id, onSuccess, onError);
    }

    console.log(props.list)
    const actionButton = (e,status) =>{
        
    
        return (
            <Menu>
                <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px"}}>
                    Action <span aria-hidden>▾</span>
                </MenuButton>
                    <MenuList style={{hover:"#eee"}}>
                                { status ===0 ?
                                    <MenuItem onSelect={() => deActivateProgram(e)}><MdModeEdit size="15" style={{color: '#3F51B5'}}/>{" "}Deactivate</MenuItem>
                                    :
                                    <MenuItem onSelect={() => openProgram(e)}><MdModeEdit size="15" style={{color: '#3F51B5'}}/>{" "}Activate</MenuItem>
                                }                   
                                <MenuItem onSelect={() => updatePrograms(e)}><MdModeEdit size="15" style={{color: '#000'}}/>{" "} Update</MenuItem>
                                <MenuItem onSelect={() => deleteProgram(e)}><MdDeleteForever size="15" style={{color: '#000'}}/>{" "}Delete</MenuItem>
                    </MenuList>
            </Menu>
          )
  }
    return (
        <Card>
            <CardBody>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to={{pathname: "/admin"}} >
                        Admin
                    </Link>
                    <Typography color="textPrimary">Program Manager</Typography>
                </Breadcrumbs>
                <br/>
                <div className={"d-flex justify-content-end pb-2"}>
                    <Button variant="contained"
                            color="primary"
                            startIcon={<FaPlus />}
                            onClick={() => openProgram(null)}>
                        <span style={{textTransform: 'capitalize'}}>Add New Program</span>
                    </Button>

                </div>
                {console.log(props.list)}
                <MaterialTable
                    title="Find By Program Area"
                    columns={[
                        { title: "Module Name", field: "moduleId" },
                        {title: "Program Area", field: "name"},
                        {title: "Status", field: "status"},
                        {title: "Action", field: "actions"},
                    ]}
                    isLoading={loading}
                    data={props.list.map((row) => ({
                    moduleId: row.archived,
                    name: row.name,
                    status:  <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>{row.archived===0 ? "Active": "Inactive"}</Grid>
                    </Grid>,
                    actions:<div>{actionButton(row, row.archived)} </div>
                         
                }))}
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
            <NewProgramManager toggleModal={toggleModal} showModal={showModal} loadProgramManager={loadProgramManager} formData={currentProgramManager}/>
            <Modal isOpen={showDeleteModal} toggle={toggleDeleteModal} >
                <ModalHeader toggle={toggleDeleteModal}> Deactivate Program - {currentProgramManager && currentProgramManager.name ? currentProgramManager.name : ""} </ModalHeader>
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
                        onClick={() => processDelete(currentProgramManager.id)}>
                        Delete  {deleting ? <Spinner /> : ""}
                    </Button>
                    <Button
                        variant='contained'
                        color='default'
                        onClick={toggleDeleteModal}
                        startIcon={<CancelIcon />}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={showDeleteModal} toggle={toggleDeactivateModal} >
                <ModalHeader toggle={toggleDeactivateModal}> Deactivate Program - {currentProgramManager && currentProgramManager.name ? currentProgramManager.name : ""} </ModalHeader>
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
                        onClick={() => deactiavtePrograms(currentProgramManager)}>
                        Deactiavte  {deleting ? <Spinner /> : ""}
                    </Button>
                    <Button
                        variant='contained'
                        color='default'
                        onClick={toggleDeactivateModal}
                        startIcon={<CancelIcon />}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </Card>
    );
}

const mapStateToProps = state => {

    return {
        list: state.programManager.list
    };
};

const mapActionToProps = {
    fetchAll: fetchAll,
    deleteProgram: deleteProgram,
    updateProgram: updateProgram
};

export default connect(mapStateToProps, mapActionToProps)(ProgramManagerSearch);