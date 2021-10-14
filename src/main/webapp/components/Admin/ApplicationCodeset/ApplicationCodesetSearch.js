import React, {useEffect, forwardRef} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAll, deleteApplicationCodeset, updateApplicationCodeset} from "actions/applicationCodeset";
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
import { Label } from "semantic-ui-react";

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
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {Menu, MenuButton, MenuItem, MenuList} from "@reach/menu-button";

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
const ApplicationCodesetSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [deleting, setDeleting] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [currentCodeset, setCurrentCodeset] = React.useState(null);
    const toggleModal = () => setShowModal(!showModal);
    const [currentAction, setCurrentAction] = React.useState("");
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

const processUpdateStatus = (row) => {
     setDeleting(true);
    const onSuccess = () => {
        setDeleting(false);
        toggleDeleteModal();
        toast.success("Application Codeset " +currentAction+"d Successfully!");
        loadApplicationCodeset();
    };
    const onError = () => {
        setDeleting(false);
        toast.error("Something went wrong, please contact administration");
    };
    if(currentAction == "Delete"){
        props.delete(row.id,onSuccess, onError);
    }
    if(currentAction == "Deactivate"){
        row['archived'] = 2;
        props.update(row.id, row, onSuccess, onError);
    }
    if(currentAction == "Activate"){
        row['archived'] = 0;
        props.update(row.id, row, onSuccess, onError);
    }

}
    const openApplicationCodeset = (row) => {
        setCurrentCodeset(row);
        toggleModal();
    }

    const updateApplicationCodesetStatus = (row, action) => {
        setCurrentAction(action);
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
            icons={tableIcons}
                title="Find Application Codeset"
                columns={[
                    {
                        title: "Codeset Group",
                        field: "codesetGroup",
                    },
                    { title: "Value", field: "display" },
                    { title: "Version", field: "version" },
                    { title: "Language", field: "language" },
                    { title: "Status", field: "archived", render: rowData => <span>{rowData.archived === 0 ?  <Label color={"green"} >Active</Label> : <Label>Inactive</Label>} </span> },
                    { title: "Action", field: "language",
                        render: rowData =>  <div>
                            <Menu>
                                <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                    Actions <span aria-hidden>▾</span>
                                </MenuButton>
                                <MenuList style={{ color:"#000 !important"}} >
                                    <MenuItem  style={{ color:"#000 !important", cursor:"pointer"}} onClick={() => openApplicationCodeset(rowData)}>
                                            <EditIcon size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit Codeset</span>
                                    </MenuItem>
                                    {rowData.archived === 0 &&
                                    <MenuItem style={{color: "#000 !important", cursor: "pointer"}}
                                              onClick={() => updateApplicationCodesetStatus(rowData, 'Deactivate')}>
                                        <CheckCircleIcon size="15" color="blue"/>{" "}
                                        <span style={{color: '#000'}}>Deactivate Codeset </span>
                                    </MenuItem>
                                    }
                                    {rowData.archived === 2 &&
                                    <MenuItem style={{color: "#000 !important", cursor: "pointer"}}
                                              onClick={() => updateApplicationCodesetStatus(rowData, 'Activate')}>
                                        <CheckCircleIcon size="15" color="blue"/>{" "}
                                        <span style={{color: '#000'}}>Activate Codeset </span>
                                    </MenuItem>
                                    }
                                    <MenuItem style={{ color:"#000 !important", cursor:"pointer"}} onClick={() => updateApplicationCodesetStatus(rowData, 'Delete')}>
                                            <DeleteIcon size="15" color="blue" />{" "}
                                            <span style={{color: '#000'}}>Delete Codeset</span>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </div>}
                ]}
                isLoading={loading}
                data={props.applicationCodesetList}
                // actions= {[
                //     {
                //         icon: EditIcon,
                //         iconProps: {color: 'primary'},
                //         tooltip: 'Edit Codeset',
                //         onClick: (event, rowData) => openApplicationCodeset(rowData)
                //     },
                //     rowData => ({
                //         icon: BlockIcon,
                //         iconProps: {color: 'primary'},
                //         tooltip: 'Deactivate Codeset',
                //         onClick: (event, rowData) => updateApplicationCodesetStatus(rowData, 'Deactivate'),
                //         hidden: rowData.archived === 2
                //     }),
                //     rowData => ({
                //         icon: CheckCircleIcon,
                //         iconProps: {color: 'primary'},
                //         tooltip: 'Activate Codeset',
                //         onClick: (event, rowData) => updateApplicationCodesetStatus(rowData, 'Activate'),
                //         hidden: rowData.archived === 0
                //     }),
                //     {
                //         icon: DeleteIcon,
                //         iconProps: {color: 'primary'},
                //         tooltip: 'Delete Codeset',
                //         onClick: (event, rowData) => updateApplicationCodesetStatus(rowData, 'Delete')
                //     }
                //         ]}
                //overriding action menu with props.actions

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
                    <ModalHeader toggle={props.toggleDeleteModal}> {currentAction} Global Variable - {currentCodeset && currentCodeset.display ? currentCodeset.display : ""} </ModalHeader>
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
                        onClick={() => processUpdateStatus(currentCodeset)}
                    >
                        {currentAction}  {deleting ? <Spinner /> : ""}
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
    delete: deleteApplicationCodeset,
    update: updateApplicationCodeset
};

export default connect(mapStateToProps, mapActionToProps)(ApplicationCodesetSearch);