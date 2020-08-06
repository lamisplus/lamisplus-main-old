import React, { useState } from "react";
import useForm from "../Functions/UseForm";
import FormRenderer from "components/FormManager/FormRenderer";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MatButton from "@material-ui/core/Button";
import * as actions from "actions/patients";
import { connect } from "react-redux";
import ViewForm from 'components/FormManager/FormRendererView';
import UpdateForm from 'components/FormManager/FormRendererUpdate';

const FormRendererModal = (props) => {
  const [errorMsg, setErrorMsg] = React.useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const onDismiss = () => setShowErrorMsg(false);

  const toggle = () => {
    return props.setShowModal(!props.showModal);
  };

  return (
    <Modal
      isOpen={props.showModal}
      toggle={toggle}
      zIndex={"9999"}
      className={
        props.options && props.options.modalSize ? props.options.modalSize : ""
      }
    >
      <ToastContainer />
      <ModalHeader toggle={toggle}>{props.title || props.currentForm.formName || ""}</ModalHeader>
      <ModalBody>
        <Alert color="danger" isOpen={showErrorMsg} toggle={onDismiss}>
          {errorMsg}
        </Alert>
        { props.currentForm && (!props.currentForm.type || props.currentForm.type === 'NEW') &&
        <FormRenderer
          patientId={props.patientId}
          formCode={props.currentForm.code}
          programCode={props.currentForm.programCode}
          visitId={props.visitId || props.patient.visitId}
          onSuccess={props.onSuccess}
          onSubmit={props.currentForm.onSubmit}
          typePatient={props.currentForm.typePatient}
        />
    }

{ props.currentForm && props.currentForm.type === 'VIEW' &&
<ViewForm
          patientId={props.patientId}
          formCode={props.currentForm.code}
          programCode={props.currentForm.programCode}
          visitId={props.visitId || props.patient.visitId}
          onSuccess={props.onSuccess}
          onSubmit={props.currentForm.onSubmit}
          typePatient={props.currentForm.typePatient}
          encounterId={props.currentForm.encounterId}
        />
  }

{ props.currentForm && props.currentForm.type === 'EDIT' &&
<UpdateForm
          patientId={props.patientId}
          formCode={props.currentForm.code}
          programCode={props.currentForm.programCode}
          visitId={props.visitId || props.patient.visitId}
          onSuccess={props.onSuccess}
          onSubmit={props.currentForm.onSubmit}
          typePatient={props.currentForm.typePatient}
          encounterId={props.currentForm.encounterId}
        />
}
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
  };
};

const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(FormRendererModal);
