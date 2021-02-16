import React, { useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import {fetchAll, Delete as Del,} from '../../actions/report';
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import FormRendererModal from "components/Admin/FormRendererModal";
import { ToastContainer, toast } from "react-toastify";
import {Link} from 'react-router-dom';
import "./ReportTable.css";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FilterIcon from '@material-ui/icons/Filter';

//Dtate Picker package
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
                        actions:  (
                            <Link
                                to={{
                                    pathname: "/report-view",
                                    state: row
                                }}
                                style={{ cursor: "pointer", color: "blue", fontStyle: "bold" }}>
                                <Tooltip title="Generate Report">
                                    <IconButton aria-label="Generate Report">
                                        <FilterIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                    ),
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
