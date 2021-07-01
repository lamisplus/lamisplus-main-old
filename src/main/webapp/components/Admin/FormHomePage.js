import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import {fetchAllForms, Delete as Del,} from '../../actions/formBuilder';
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import FormRendererModal from "components/Admin/FormRendererModal";
import { ToastContainer, toast } from "react-toastify";
import {Menu, MenuButton, MenuItem, MenuList} from '@reach/menu-button';
import {Link} from 'react-router-dom';
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import DownloadLink  from "react-download-link";

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
//Dtate Picker package
Moment.locale("en");
momentLocalizer();

function FormSearch(props) {
    const [loading, setLoading] = useState(false);
    const [showCurrentForm, setShowCurrentForm] = useState(false);
    const [currentForm, setCurrentForm] = useState(false);

    useEffect(() => {
        setLoading(true);
        const onSuccess = () => {
            setLoading(false);
        };
        const onError = () => {
            setLoading(false);
        };
        props.fetchAllForms(onSuccess, onError);
    }, []);

    const onSuccess = () => {
        toast.success("Form saved successfully!", { appearance: "success" });
        setShowCurrentForm(false);
    };

    const onError = () => {
        toast.error("Something went wrong, request failed.");
        setShowCurrentForm(false);
    };

    const viewForm = (row) => {
        setCurrentForm({
            programCode: row.programCode,
            formName: "VIEW FORM",
            formCode: row.code,
            type: "VIEW",
            options: {
                modalSize: "modal-lg",
            },
        });
        setShowCurrentForm(true);
    };

    const onDelete = row => {
        if (window.confirm(`Are you sure you want to archive ${row.name} form ?`))
            props.deleteForm(row.id)
    }

    return (
        <React.Fragment>
            <div>
                <ToastContainer autoClose={3000} hideProgressBar />
                <MaterialTable
                icons={tableIcons}
                    title="Find By Program Area and Form Name"
                    columns={[
                        {title: "Program Area", field: "programName"},
                        { title: "Form Name", field: "name" },
                        { title: "Form Version", field: "number" },
                        {title: "Action", field: "actions", filtering: false,},
                    ]}
                    isLoading={loading}
                    data={!props.formList && props.formList.length <= 0 ? [] : props.formList.map((row) => ({
                        programName: row.programName,
                        name: row.name,
                        number: row.version,
                        actions:
                            <div>
                                <Menu>
                                    <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                        Actions <span aria-hidden>▾</span>
                                    </MenuButton>
                                    <MenuList style={{ color:"#000 !important"}} >
                                        <MenuItem onSelect={() => viewForm (row)}>
                                            <i
                                                className="fa fa-eye"
                                                aria-hidden="true"
                                                size="15"
                                                style={{ cursor: "pointer", color: "#blue" }}>
                                                &nbsp; {""} View Form
                                            </i>
                                        </MenuItem>
                                        <MenuItem style={{ color:"#000 !important"}}>
                                            <Link
                                                to={{pathname: "/view-form", state: {row:row}}}>
                                                <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit Form </span>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem style={{ color:"#000 !important"}}>
                                            <Link
                                                onClick={() => onDelete(row)}>
                                                <MdDeleteForever size="15" color="blue" />{" "}
                                                <span style={{color: '#000'}}>Delete Form</span>
                                            </Link>
                                        </MenuItem>
                                        {/*<MenuItem style={{ color:"#000 !important"}}>
                                            <DownloadLink
                                                label="Export as a json file"
                                                filename={row ? row.name+".json" : "lamisplus-form.json"}
                                                exportFile={() => {
                                                    delete row.id;
                                                   return JSON.stringify(row)
                                                }}
                                            />
                                        </MenuItem>*/}
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
const mapStateToProps =  (state = { form:[]}) => {

    return {
        formList: state.formReducers.formList !==null ? state.formReducers.formList : [],
    }}

const mapActionToProps = {
    fetchAllForms: fetchAllForms,
    deleteForm: Del
};

export default connect(mapStateToProps, mapActionToProps)(FormSearch);
