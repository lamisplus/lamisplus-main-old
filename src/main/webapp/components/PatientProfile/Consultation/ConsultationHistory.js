import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Alert } from "reactstrap";
import * as actions from "actions/patients";
import { connect } from "react-redux";
import { Label, List } from "semantic-ui-react";
import moment from "moment";
import * as CODES from "api/codes";
import FormRendererModal from "components/FormManager/FormRendererModal";
import { ToastContainer, toast } from "react-toastify";
import IconButton from '@material-ui/core/IconButton'
import { Edit, ViewList  } from '@material-ui/icons'

const columns = (editConsultation, viewConsultation) => [
  {
    name: "Encounter Date/Time",
    selector: "encounterDateTime",
    sortable: false,
    Display: true,
    format: (row) => moment(row.encounterDateTime).format("ll"),
  },
  {
    name: "Visit Notes",
    selector: "visitNote",
    sortable: false,
    grow: 2,
    wrap: true,
    cell: (row) => 
    <div>
    <span>{(row.visitNote && row.visitNote.length > 100) ? row.visitNote.slice(0, 100) + '...' : row.visitNote}</span>
    <span>{(row.consulationNotes && row.consulationNotes.length > 100) ? row.consulationNotes.slice(0, 100) + '...' : row.consulationNotes}</span>
    </div>
  },
  {
    name: "Complaints",
    selector: "presentingComplaints",
    sortable: false,
    wrap: true,
    cell: (row) => (
      <span>
        <Label.Group size="mini" color="pink">
          {row.presentingComplaints.map((presentingComplaint) => (
            <span>
              {presentingComplaint.complaint} {", "}
            </span>
          ))}
        </Label.Group>
      </span>
    ),
  },
  {
    name: "Clinical Diagnosis",
    selector: "diagnosis",
    sortable: false,
    wrap: true,
    cell: (row) => (
        <List selection>
          {row.diagnosis && row.diagnosis.map((x) => (
            <List.Item>
            <Label size="mini" color="blue">
              {x.condition || x.condition1} 
              <Label.Detail> {x.certainty}</Label.Detail>
            </Label>
            </List.Item>
          ))}
        </List>
   
    ),
  },
  {
    name: 'Actions',
    cell: (row) => (
      <div>
        <IconButton
          color='primary'
          onClick={() => editConsultation(row)}
          aria-label='Edit Consultation'
          title='Edit Consultation'
        >
          {' '}
          <Edit />
        </IconButton>
        <IconButton
          color='primary'
          onClick={() => viewConsultation(row)}
          aria-label='View Consultation'
          title='View Consultation'
        >
          {' '}
          <ViewList />
        </IconButton>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true
  }
];
function DataTableList(props) {
  const [errorMsg, setErrorMsg] = React.useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const onDismiss = () => setShowErrorMsg(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [form, setForm] = useState({
    code: CODES.CONSULTATION_FORM,
    programCode: CODES.GENERAL_SERVICE,
    formName: "PATIENT CONSULATION",
    options: {
      modalSize: "modal-lg",
    },
  });

  const onSuccess = () => {
    toast.success("Form saved successfully!", { appearance: "success" });
    setShowFormModal(false);
    fetchConsultations();
  };

  const onError = () => {
    toast.error("Something went wrong, request failed.");
    setShowFormModal(false);
  };

  const fetchConsultations = () => {
    setLoading(true);
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
      setErrorMsg("Could not fetch consultation history, try again later");
    };
    props.fetchPatientConsultationHistory(props.patientId, onSuccess, onError);
  };

  React.useEffect(() => {
    fetchConsultations();
  }, [props.patientId]);

  React.useEffect(() => {
    setData(props.consultationHistoryList);
  }, [props.consultationHistoryList]);

  const editForm = (row) => {
    setForm({ ...form, ...{ type: "EDIT", encounterId: row.encounterId } });
    setShowFormModal(true);
  };

  const viewForm = (row) => {
    setForm({ ...form, ...{ type: "VIEW", encounterId: row.encounterId } });
    setShowFormModal(true);
  };
  return (
    <div>
      <ToastContainer />
      <Alert color="danger" isOpen={showErrorMsg} toggle={onDismiss}>
        {errorMsg}
      </Alert>
      <DataTable
        columns={columns(editForm, viewForm)}
        data={data}
        pagination
        highlightOnHover={true}
        striped={true}
        subHeaderAlign={"left"}
        progressPending={loading}
        // noHeader={false}
        fixedHeader={true}
        persistTableHead
      />
      <FormRendererModal
        patientId={props.patientId}
        showModal={showFormModal}
        setShowModal={setShowFormModal}
        currentForm={form}
        onSuccess={onSuccess}
        onError={onError}
        options={form.options}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    consultationHistoryList: state.patients.consultationHistory,
  };
};

const mapActionToProps = {
  fetchPatientConsultationHistory: actions.fetchPatientConsultationHistory,
};

export default connect(mapStateToProps, mapActionToProps)(DataTableList);
