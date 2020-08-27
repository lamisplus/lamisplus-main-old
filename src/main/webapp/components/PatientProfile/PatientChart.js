import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardDeck } from "reactstrap";
import { Line } from "react-chartjs-2";
import * as actions from "actions/patients";
import { connect } from "react-redux";
import { getColor } from "utils/colors";

function PatientChart(props) {
  const [errorMsg, setErrorMsg] = React.useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const onDismiss = () => setShowErrorMsg(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    const onSuccess = () => {
      setData(props.vitalSignsList);
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
      setErrorMsg("Could not fetch vital signs, try again later");
    };
    props.fetchPatientVitalSigns(props.patientId, onSuccess, onError);
  }, [props.patientId]);

  React.useEffect(() => {
    setData(props.vitalSigns ? props.vitalSigns : []);
  }, [props.vitalSigns]);

  const BloodPressure = (
    labels = [],
    systolic = [],
    diastolic = [],
    systolicOptions = {},
    diastolicOptions = {}
  ) => {
    return {
      labels: labels,
      datasets: [
        {
          label: "Systolic(mmHg)",
          backgroundColor: getColor("primary"),
          borderColor: getColor("primary"),
          borderWidth: 1,
          data: systolic,
          ...systolicOptions,
        },
        {
          label: "Diastolic(mmHg)",
          backgroundColor: getColor("secondary"),
          borderColor: getColor("secondary"),
          borderWidth: 1,
          data: diastolic,
          ...diastolicOptions,
        },
      ],
    };
  };

  const Weight = (labels, data, otherOptions) => {
    return {
      labels: labels,
      datasets: [
        {
          label: "Weight(kg)",
          backgroundColor: getColor("primary"),
          borderColor: getColor("primary"),
          borderWidth: 1,
          data: data,
          ...otherOptions,
        },
      ],
    };
  };

  const ViralLoad = (label = [], data = [], otherOptions = {}) => {
    return {
      labels: label,
      datasets: [
        {
          label: "Viral Load",
          backgroundColor: getColor("primary"),
          borderColor: getColor("primary"),
          borderWidth: 1,
          data: data,
          ...otherOptions,
        },
      ],
    };
  };
  return (
    <CardDeck>
      <Card>
        <CardHeader> Blood Pressure</CardHeader>
        <CardBody>
          <Line
            data={BloodPressure(
              data.filter((x) => x.systolic !== "").map((x) => x.dateEncounter),
              data.filter((x) => x.systolic !== "").map((x) => x.systolic),
              data.filter((x) => x.diastolic !== "").map((x) => x.diastolic),
              { fill: false },
              { fill: false }
            )}
            height={70}
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader> Weight</CardHeader>
        <CardBody>
          <Line
            data={Weight(
              data
                .filter((x) => x.bodyWeight !== "")
                .map((x) => x.dateEncounter),
              data.filter((x) => x.bodyWeight !== "").map((x) => x.bodyWeight),
              { fill: false }
            )}
            height={70}
          />
        </CardBody>
      </Card>
      {/* <Card >
                    <CardHeader> Viral Load</CardHeader>
                        <CardBody>
                        <Line data={ViralLoad({ fill: false }, { fill: false })} height={100} />                      
                        </CardBody>                      
                </Card> */}
    </CardDeck>
  );
}

const mapStateToProps = (state) => {
  return {
    vitalSigns: state.patients.vitalSignsList,
    patient: state.patients.patient,
  };
};

const mapActionToProps = {
  fetchPatientVitalSigns: actions.fetchPatientVitalSigns,
};

export default connect(mapStateToProps, mapActionToProps)(PatientChart);
