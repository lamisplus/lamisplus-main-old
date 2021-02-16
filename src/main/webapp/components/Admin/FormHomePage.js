import React, { useState } from "react";
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
import {CardContent} from "@material-ui/core";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();

function FormSearch(props) {
    const [loading, setLoading] = useState(false);
    const [showCurrentForm, setShowCurrentForm] = useState(false);
    const [currentForm, setCurrentForm] = useState(false);

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

    React.useEffect(() => {
        setLoading(true);
        const onSuccess = () => {
            setLoading(false);
        };
        const onError = () => {
            setLoading(false);
        };
        props.fetchAllForms(onSuccess, onError);
    }, []);


    return (
        <React.Fragment>
            <div>
                <ToastContainer autoClose={3000} hideProgressBar />
                <MaterialTable
                    title="Find By Program Area and Form Name"
                    columns={[
                        {title: "Program Area", field: "programName"},
                        { title: "Form Name", field: "name" },
                        { title: "Form Version", field: "number" },
                        {title: "Action", field: "actions", filtering: false,},
                    ]}
                    isLoading={loading}
                    data={props.formList.map((row) => ({
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
                                                to={{
                                                    pathname: "/view-form",
                                                    state: {row:row}
                                                }}

                                            >
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
                                        <MenuItem style={{ color:"#000 !important"}}>
                                            <DownloadLink
                                                label="Export as a json file"
                                                filename={row ? row.name+".json" : "lamisplus-form.json"}
                                                exportFile={() => {
                                                    delete row.id;
                                                   return JSON.stringify(row)
                                                }}
                                            />

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
const mapStateToProps =  (state = { form:{}}) => {
    // console.log(state.forms)
    return {
        formList: state.formReducers.form !==null ? state.formReducers.form : {},
    }}

const mapActionToProps = {
    fetchAllForms: fetchAllForms,
    deleteForm: Del
};

export default connect(mapStateToProps, mapActionToProps)(FormSearch);
