import React, { useState } from "react";
import MatButton from "@material-ui/core/Button";
import { connect } from "react-redux";
import {
    Row,
    Col,
    FormGroup,
    Input,
    Label,
    Alert} from "reactstrap";
import moment from "moment";
import Select from "react-select";
import * as actions from "actions/laboratory";
import { fetchApplicationCodeSet } from "actions/applicationCodeset";
import {
    APPLICATION_CODESET_PRIORITIES,
    APPLICATION_CODESET_VL_INDICATION,
} from "actions/types";
import CheckedInValidation from "components/Utils/CheckedInValidation";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";

import Moment from "moment";
import momentLocalizer from "react-widgets-moment";

//Dtate Picker package
Moment.locale("en");
momentLocalizer();

function RadiologyTestOrderPage(props) {
    const [tests, setTests] = React.useState([]);
    const defaultFormValue = {
        test: {},
        priority: {},
        testGroup: {},
        vlIndication: "",
        sampleOrderedBy: "",
        sample_order_date: moment(new Date()).format("DD-MM-YYYY"),
        sample_order_time: moment(new Date()).format("LT")
    };
    const [testOrder, setTestOrder] = React.useState(defaultFormValue);
    const [errorMessage, setErrorMessage] = useState("");
    const onInputChange = (e) => {
        e.persist();
        setTestOrder({ ...testOrder, [e.target.name]: e.target.value });
    };

    const getTestByTestGroup = (testGroup) => {
        setTestOrder({ ...testOrder, testGroup: testGroup });
        async function fetchTests() {
            setErrorMessage("");
            const onSuccess = () => {
                setTests(props.tests);
            };
            const onError = (errstatus) => {
                setErrorMessage("Could not fetch test list, please try again later");
                setTests([]);
            };
            props.fetchTestByTestGroup(testGroup.value.id, onSuccess, onError);
        }
        fetchTests();
    };

    React.useEffect(() => {
        if (props.priorities.length === 0) {
            props.fetchApplicationCodeSet("TEST_ORDER_PRIORITY", APPLICATION_CODESET_PRIORITIES);
        }
        if (props.vlIndications.length === 0) {
            props.fetchApplicationCodeSet(
                "VIRAL_LOAD_INDICATION",
                APPLICATION_CODESET_VL_INDICATION
            );
        }
        if (props.testGroupList.length === 0) {
            setErrorMessage();
            const onSuccess = () => {};
            const onError = (errstatus) => {
                setErrorMessage(
                    "Could not fetch test groups at the moment, try again later"
                );
            };
            props.fetchTestGroup(onSuccess, onError);
        }
    }, []);


    React.useEffect(() => {
        setTests(props.tests);
    }, [props.tests]);

    const isViralLoad = () => {
        let value =
            testOrder &&
            testOrder.test &&
            testOrder.test.value &&
            testOrder.test.value.name === "Viral Load";
        return value;
    };


    const addNewTest = (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!testOrder) return;
        //
        if (
            !(
                testOrder.sample_order_date &&
                testOrder.sample_order_time &&
                testOrder.test.value &&
                testOrder.priority.value &&
                testOrder.sampleOrderedBy
            )
        ) {
            window.scrollTo(0, 0);
            setErrorMessage("Fill all required fields");
            return;
        }

        if (isViralLoad() && !testOrder.vlIndication.value) {
            window.scrollTo(0, 0);
            setErrorMessage("Fill all required fields");
            return;
        }
        props.addNewTest(testOrder);
        setTestOrder(defaultFormValue);
    };

    return <form onSubmit={addNewTest}>
        {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : ""}
        <br />
        <Row>
            <Col md={12}>
                <FormGroup>
                    <Label for="encounterDate">Encounter Date & Time*</Label>
                    <DateTimePicker
                        name="encounterDate"
                        id="encounterDate"
                        defaultValue={new Date()}
                        max={new Date()}
                        required
                        onChange={(e) =>
                            setTestOrder({
                                ...testOrder,
                                ...{
                                    sample_order_date: e ? Moment(e).format(
                                        "DD-MM-YYYY"
                                    ) : null,
                                    sample_order_time: e ? Moment(e).format("LT") : null,
                                },
                            })
                        }

                    />
                </FormGroup>
            </Col>
            <Col md={12}>
                <FormGroup>
                    <Label for="testGroup">Select Test Area*</Label>
                    <Select
                        required
                        isMulti={false}
                        value={testOrder.testGroup}
                        onChange={getTestByTestGroup}
                        options={props.testGroupList.map((x) => ({
                            label: x.name,
                            value: x,
                        }))}
                    />
                </FormGroup>
            </Col>
            <Col md={12}>
                <FormGroup>
                    <Label for="testGroup">Select Test*</Label>

                    <Select
                        isMulti={false}
                        required
                        value={testOrder.test}
                        onChange={(e) => setTestOrder({ ...testOrder, test: e })}
                        options={tests.map((x) => ({
                            label: x.name,
                            value: x,
                        }))}
                    />
                </FormGroup>
            </Col>
            <Col md={12}>
                <FormGroup>
                    <Label for="priority">Select Priority*</Label>
                    <Select
                        isMulti={false}
                        required
                        value={testOrder.priority}
                        onChange={(e) =>
                            setTestOrder({ ...testOrder, priority: e })
                        }
                        options={props.priorities.map((x) => ({
                            label: x.display,
                            value: x,
                        }))}
                    />
                </FormGroup>
            </Col>

            <Col md={12}>
                <FormGroup>
                    <Label for="sampleOrderedBy">Test Ordered By*</Label>
                    <Input
                        required
                        name="sampleOrderedBy"
                        id="sampleOrderedBy"
                        value={testOrder.sampleOrderedBy}
                        onChange={onInputChange}
                    />
                </FormGroup>
            </Col>

            <Col md={12}>
                <CheckedInValidation
                    actionButton={
                        <MatButton
                            className="btn btn-primary"
                            type="button"
                            onClick={addNewTest}
                        >
                            Add Test
                        </MatButton>
                    }
                    visitId={props.patient.visitId}
                />
            </Col>
        </Row>
    </form>
}

const mapStateToProps = (state) => {
    return {
        patient: state.patients.patient,
        testGroupList: state.laboratory.radiologyTestGroup,
        tests: state.laboratory.radiologyTestTypes,
        priorities: state.applicationCodesets.priorities,
        vlIndications: state.applicationCodesets.vlIndications,
    };
};

const mapActionToProps = {
    fetchTestGroup: actions.fetchAllRadiologyTestGroup,
    fetchTestByTestGroup: actions.fetchAllRadiologyTestsByTestGroup,
    fetchApplicationCodeSet: fetchApplicationCodeSet,
};

export default connect(mapStateToProps, mapActionToProps)(RadiologyTestOrderPage);
