import React, { useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import {fetchAll, Delete as Del,} from '../../actions/report';
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import FormRendererModal from "components/Admin/FormRendererModal";
import { ToastContainer, toast } from "react-toastify";
import {Menu, MenuButton, MenuItem, MenuList} from '@reach/menu-button';
import {Link} from 'react-router-dom';
import {MdDeleteForever, MdModeEdit } from "react-icons/md";
import "./ReportTable.css";

Moment.locale("en");
momentLocalizer();

function ReportSearch(props) {
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

    const onDelete = row => {
        const onSuccess = () => {
            toast.success("Report was deleted successfully!");
            props.fetchAll();
        }

        const onError = (error) => {
            if(error.response.data.apierror.message===null || error.response.data.apierror.message===""){
                toast.error("Something went wrong");
            }else{
                toast.error(error.response.data.apierror.message);
            }
        }
        if (window.confirm(`Are you sure you want to archive ${row.name} form ?`))
            props.deleteForm(row.id, onSuccess, onError);
    }

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

    return (
        <React.Fragment>
            <div>
                <ToastContainer autoClose={3000} hideProgressBar />
                <MaterialTable
                    title="Find By Report Name"
                    columns={[
                        {title: "Program Area", field: "programName"},
                        { title: "Report Name", field: "name" },
                        { title: "Report Description", field: "description" },
                        {title: "Action", field: "actions", filtering: false,},
                    ]}
                    isLoading={loading}
                    data={props.reportList.map((row) => ({
                        programName: row.programName,
                        name: row.name,
                        description: row.description,
                        parameterResourceObject: row.parameterResourceObject,
                        actions:
                            <div>
                                <Menu>
                                    <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                        Actions <span aria-hidden>▾</span>
                                    </MenuButton>
                                    <MenuList style={{ color:"#000 !important"}} >
                                        {/*<MenuItem style={{ color:"#000 !important"}}>*/}
                                        {/*    <Link*/}
                                        {/*        to={{*/}
                                        {/*            pathname: "/template-update",*/}
                                        {/*            row: row*/}
                                        {/*        }}>*/}
                                        {/*        <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit Report</span>*/}
                                        {/*    </Link>*/}
                                        {/*</MenuItem>*/}
                                        <MenuItem style={{ color:"#000 !important"}}>
                                            <Link
                                                onClick={() => onDelete(row)}>
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
    deleteForm: Del
};

export default connect(mapStateToProps, mapActionToProps)(ReportSearch);
