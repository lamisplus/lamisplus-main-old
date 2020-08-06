import { connect } from "react-redux";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Icon, Table, Label } from "semantic-ui-react";
import { fetchPatientAllergies } from "actions/patients";
import { ToastContainer, toast } from "react-toastify";
import * as CODES from "api/codes";
import FormRendererModal from "components/FormManager/FormRendererModal";

function PatientAllergies(props) {
  const [loading, setLoading] = React.useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [allergyForm, setAllergyForm] = useState({
    code: CODES.PATIENT_ALLERGY_FORM,
    programCode: CODES.GENERAL_SERVICE,
    formName: "PATIENT ALLERGY",
    options: {
      modalSize: "modal-lg",
    },
  });

  const onSuccess = () => {
    toast.success("Form saved successfully!", { appearance: "success" });
    setShowFormModal(false);
    fetchAllergies();
  };

  const onError = () => {
    toast.error("Something went wrong, request failed.");
    setShowFormModal(false);
  };

  const fetchAllergies = () => {
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
    };
    props.fetchPatientAllergies(props.patientId, onSuccess, onError);
  };
  React.useEffect(() => {
    fetchAllergies();
  }, []);

  const editForm = (id) => {
    setAllergyForm({ ...allergyForm, ...{ type: "EDIT", encounterId: id } });
    setShowFormModal(true);
  };
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <React.Fragment>
      <ToastContainer />
      <Row>
        <Col md={12}>
          <Table striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Allergen</Table.HeaderCell>
                <Table.HeaderCell>Reaction</Table.HeaderCell>
                <Table.HeaderCell>Severity</Table.HeaderCell>
                <Table.HeaderCell>Comment</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            {props.patientAllergies && props.patientAllergies.length === 0 && (
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan="6">
                    No Allergies found for this patient
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            )}

            {props.patientAllergies && props.patientAllergies.length > 0 && (
              <Table.Body>
                {props.patientAllergies.map((allergy) => (
                  <Table.Row>
                    <Table.Cell>{allergy.allergen}</Table.Cell>
                    <Table.Cell>
                      {allergy.reactions && allergy.reactions.join(", ")}
                    </Table.Cell>
                    <Table.Cell>{allergy.severity}</Table.Cell>
                    <Table.Cell>{allergy.comment}</Table.Cell>
                    <Table.Cell>
                      {/* <Icon 
                        name="edit"
                        onClick={() => editForm(allergy.encounterId)}
                      />{" "}
                      <Icon  name="delete" /> */}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            )}
          </Table>
        </Col>
      </Row>

      <FormRendererModal
        patientId={props.patient.patientId}
        showModal={showFormModal}
        setShowModal={setShowFormModal}
        currentForm={allergyForm}
        onSuccess={onSuccess}
        onError={onError}
        options={allergyForm.options}
      />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
    patientAllergies: state.patients.allergies,
  };
};

const mapActionToProps = {
  fetchPatientAllergies: fetchPatientAllergies,
};

export default connect(mapStateToProps, mapActionToProps)(PatientAllergies);
