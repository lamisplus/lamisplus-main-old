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
import {  FaSyncAlt } from "react-icons/fa";
import {  GrDocumentUpdate } from "react-icons/gr";

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

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const ProgramManagerSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentProgramManager, setCurrentProgramManager] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showDeactivateModal, setshowDeactivateModal] = React.useState(false);
    const [showActivateProgramModal, setshowActivateProgramModal] = React.useState(false);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
    const toggleDeactivateModal = () => setshowDeactivateModal(!showDeactivateModal)
    const toggleActivateProgramModal = () => setshowActivateProgramModal(!showActivateProgramModal)

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

    const ActivateProgramId = (row) =>{
        console.log(row)

        const onSuccess = () => {

            toggleActivateProgramModal();
            toast.success("Program deactivated successfully!");
            loadProgramManager();
        };
        const onError = () => {

            toast.error("Something went wrong, please contact administration");
        };
        const data = row;
        data['archived'] =0;
        props.updateProgram(row.id, data, onSuccess , onError)

    }


    const deactiavtePrograms = (row) =>{
        console.log(row)
        // setDeleting(true);
        const onSuccess = () => {
            // setDeleting(false);
            toggleDeactivateModal();
            toast.success("Program deactivated successfully!");
            loadProgramManager();
        };
        const onError = () => {
            // setDeleting(false);
            toast.error("Something went wrong, please contact administration");
        };
        const data = row;
        data['archived'] =2;
        props.updateProgram(row.id, data, onSuccess , onError)

    }

    const deleteProgram = (e) => {
        console.log(e.name)
        console.log(e.id)
        setCurrentProgramManager(e);
        toggleDeleteModal();
    }

    const deActivateProgram = (e) => {
        setCurrentProgramManager(e);
        toggleDeactivateModal();
    }

    const ActivateProgram = (e) => {
        setCurrentProgramManager(e);
        toggleActivateProgramModal();
    }

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

    const statusAction = (status)=>{

        if(status===0){
            return "Active";
        }
        else if(status===1){
            return "Archieve";
        }
        else if(status===2){
            return "Deactivated";
        }else{
            return "";
        }

    }
    const actionButton = (e,status) =>{


        return (
            <Menu>
                <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px"}}>
                    Action <span aria-hidden>▾</span>
                </MenuButton>
                <MenuList style={{hover:"#eee"}}>
                    { status ===0 ?
                        <MenuItem onSelect={() => deActivateProgram(e)}><FaSyncAlt size="15" style={{color: '#3F51B5'}}/>{" "}Deactivate</MenuItem>
                        :
                        <MenuItem onSelect={() => ActivateProgram(e)}><FaSyncAlt size="15" style={{color: '#3F51B5'}}/>{" "}Activate</MenuItem>
                    }
                    <MenuItem onSelect={() => updatePrograms(e)}><GrDocumentUpdate size="15" style={{color: '#000'}}/>{" "} Update</MenuItem>
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
                icons={tableIcons}
                    title="Find By Program Area"
                    columns={[
                        {title: "Program Area", field: "name"},
                        {title: "Status", field: "status"},
                        {title: "Action", field: "actions"},
                    ]}
                    isLoading={loading}
                    data={props.list.map((row) => ({
                        name: row.name,
                        status:  <Grid component="label" container alignItems="center" spacing={1}>
                            <Grid item>{statusAction(row.archived)}</Grid>
                        </Grid>,
                        actions:<div>{actionButton(row, row.archived)} </div>

                    }))}
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
            <Modal isOpen={showDeactivateModal} toggle={toggleDeactivateModal} >
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
                        startIcon={<FaSyncAlt />}
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
            <Modal isOpen={showActivateProgramModal} toggle={toggleActivateProgramModal} >
                <ModalHeader toggle={toggleActivateProgramModal}> Activate Program - {currentProgramManager && currentProgramManager.name ? currentProgramManager.name : ""} </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to proceed ?</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        type='button'
                        variant='contained'
                        color='primary'
                        className={classes.button}
                        startIcon={<FaSyncAlt />}
                        disabled={deleting}
                        onClick={() => ActivateProgramId(currentProgramManager)}>
                        activate  {deleting ? <Spinner /> : ""}
                    </Button>
                    <Button
                        variant='contained'
                        color='default'
                        onClick={toggleActivateProgramModal}
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