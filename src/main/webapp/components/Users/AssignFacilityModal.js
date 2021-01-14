import React, {useState, useEffect} from 'react';
import {  Modal, ModalHeader, ModalBody, Form,Row,Col,FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { createWard, updateWard } from 'actions/applicationCodeset';
import { Spinner } from 'reactstrap';
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import axios from "axios";
import {url as baseUrl} from "../../api";
import Select from "react-select";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const AssignFacilityModal = (props) => {
    const [loading, setLoading] = useState(false)
    const defaultValues = {name:""};
    const currentUser = props.user;
    const [formData, setFormData] = useState( defaultValues)
    const [facilities, setFacilities] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState(props.user && props.user.applicationUserOrganisationUnitsById ? props.user.applicationUserOrganisationUnitsById : [] );
    const classes = useStyles()

    const onFacilitySelect = (selectedValues) => {
        setSelectedFacilities(selectedValues);
    };

    useEffect(() => {
        //for application codeset edit, load form data
        setFormData(props.formData ? props.formData : defaultValues);
    }, [props.formData]);

    /* Get list of Facilities from the server - id is 4*/
    useEffect(() => {
        async function getCharacters() {
            axios
                .get(`${baseUrl}organisation-units/organisation-unit-level/4`)
                .then((response) => {
                    setFacilities(
                        Object.entries(response.data).map(([key, value]) => ({
                            label: value.name,
                            value: value.id,
                        }))
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        getCharacters();
    }, []);

    const handleInputChange = e => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    }

    const create = e => {
        e.preventDefault()
        setLoading(true);

        const data = selectedFacilities.map(x =>
        {
            return {applicationUserId: currentUser.id , organisationUnitId : x} });
        console.log(data);
        const onSuccess = () => {
            setLoading(false);
            toast.success("Facility assigned successfully!")

            props.toggleModal()
        }
        const onError = () => {
            setLoading(false);
            toast.error("Something went wrong, please contact administration");
            //props.toggleModal()
        }

        axios
            .post(`${baseUrl}application_user_organisation_unit`, data)
            .then((response) => {
                onSuccess();
            })
            .catch((error) => {
                onError();
            });


    }

    let getFacilities;
    let getLgaByState;
    let countries = [];
    let getStateByCountry;
    return (

        <div >
            <ToastContainer />
            <Modal isOpen={props.showModal} toggle={props.toggleModal} size="lg">

                <Form onSubmit={create}>
                    <ModalHeader toggle={props.toggleModal}> {props.formData && props.formData.id ? 'Reassign' : 'Assign'} user to a facility </ModalHeader>
                    <ModalBody>
                        <Card >
                            <CardBody>
                                <Row >

                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>Country</Label>
                                            <Select
                                                required
                                                isMulti={false}
                                                onChange={getStateByCountry}
                                                options={countries.map((x) => ({
                                                    label: x.name,
                                                    value: x,
                                                }))}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>State</Label>
                                            <Select
                                                required
                                                isMulti={false}
                                                onChange={getLgaByState}
                                                options={countries.map((x) => ({
                                                    label: x.name,
                                                    value: x,
                                                }))}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>LGA</Label>
                                            <Select
                                                required
                                                isMulti={false}
                                                onChange={getFacilities}
                                                options={countries.map((x) => ({
                                                    label: x.name,
                                                    value: x,
                                                }))}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label for="Facility">Assign Facilities</Label>
                                            <DualListBox
                                                options={facilities}
                                                onChange={onFacilitySelect}
                                                selected={selectedFacilities}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <MatButton
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    Save  {loading ? <Spinner /> : ""}
                                </MatButton>
                                <MatButton
                                    variant='contained'
                                    color='default'
                                    onClick={props.toggleModal}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancel
                                </MatButton>

                            </CardBody>
                        </Card>
                    </ModalBody>

                </Form>
            </Modal>
        </div>
    );
}



export default connect(null, { createWard , updateWard})(AssignFacilityModal);
