import React, { useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import {fetchAll, Delete ,} from '../../actions/report';
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import FormRendererModal from "components/Admin/FormRendererModal";
import { ToastContainer, toast } from "react-toastify";
import {Menu, MenuButton, MenuItem, MenuList} from '@reach/menu-button';
import {Link} from 'react-router-dom';
import {MdDeleteForever, MdModeEdit } from "react-icons/md";
import "./ReportTable.css";
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

Moment.locale("en");
momentLocalizer();

function ReportSearch(props) {
    const [loading, setLoading] = useState(false);
    const [showCurrentForm, setShowCurrentForm] = useState(false);
    const [currentForm, setCurrentForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);
    const [deleting, setDeleting] = React.useState(false);

    const onSuccess = () => {
        toast.success("Form saved successfully!", {appearance: "success"});
        setShowCurrentForm(false);
    };

    const onError = () => {
        toast.error("Something went wrong, request failed.");
        setShowCurrentForm(false);
    };

    React.useEffect(() => {
        setLoading(true);
        const onSuccess = () => {
            setLoading(false);
        };
        const onError = () => {
            setLoading(false);
        };
        props.fetchAll(onSuccess, onError);
    }, []);

    const onDelete = (id) => {
        setDeleting(true);
        const onSuccess = () => {
            setDeleting(false);
            toast.success("report deleted successfully!");
            fetchAll();
        };
        const onError = () => {
            setDeleting(false);
            toast.error("Something went wrong, please contact administration");
        };
        props.Delete(id, onSuccess, onError);
    }


    return (
        <React.Fragment>
            <div>
                <ToastContainer autoClose={3000} hideProgressBar />
                <MaterialTable
                icons={tableIcons}
                    title="Find By Report Name"
                    columns={[
                        {title: "Program Area", field: "programName"},
                        { title: "Report Name", field: "name" },
                        { title: "Report Description", field: "description" },
                        {title: "Action", field: "actions", filtering: false,},
                    ]}
                    isLoading={loading}
                    data={!props.reportList && !props.reportList.length ? [] : props.reportList.map((row) => ({
                        programName: row.programName,
                        name: row.name,
                        description: row.description,
                        resourceObject: row.resourceObject,
                        actions:
                            <div>
                                <Menu>
                                    <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                        Actions <span aria-hidden>▾</span>
                                    </MenuButton>
                                    <MenuList style={{ color:"#000 !important"}} >
                                        <MenuItem style={{ color:"#000 !important"}}>
                                            <Link
                                                to={{pathname: "/template-update", row: row}}>
                                                <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit Report</span>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem style={{ color:"#000 !important"}}>
                                            <Link
                                                onClick={() => onDelete(row.id)}>
                                                <MdDeleteForever size="15" color="blue" />{" "}
                                                <span style={{color: '#000'}}>Delete Report</span>
                                            </Link>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>
                    }))}
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

                    }}
                />
            </div>
            {/*);*/}
            {/*}*/}
            <ToastContainer />
            <FormRendererModal
                programCode={currentForm.programCode}
                formCode={currentForm.formCode}
                showModal={showCurrentForm}
                setShowModal={setShowCurrentForm}
                currentForm={currentForm}
                onSuccess={onSuccess}
                onError={onError}
                options={currentForm.options}
            />
        </React.Fragment>
    );
}
const mapStateToProps =  (state = { reportList:[], form:{}}) => {
    return {
        reportList: state.reportReducer.reportList,
    }}

const mapActionToProps = {
    fetchAll: fetchAll,
    Delete: Delete,
};

export default connect(mapStateToProps, mapActionToProps)(ReportSearch);
