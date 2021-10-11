import React, {useState, useEffect} from 'react';
import {  Modal, ModalHeader, ModalBody, FormFeedback,Form,Row,Col,FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import moment from "moment";

import { sampleVerification, fetchFormById } from '../../../actions/laboratory';
import { Alert } from 'reactstrap';
import { Spinner } from 'reactstrap';

Moment.locale('en');
momentLocalizer();

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const ModalSample = (props) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({name:"",description:"",value:"" })
    const [errors, setErrors] = useState({});
    const classes = useStyles()
    const handleInputChange = e => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    }

    const validate = () => {
        let temp = { ...errors }
        temp.name = formData.name ? "" : "Name is required"
        setErrors({
            ...temp
        })
        console.log(temp)
        return Object.values(temp).every(x => x == "")
    }

    const createGlobalVariable = e => {
        e.preventDefault()
        if(validate()){
            setLoading(true);

            const onSuccess = () => {
                setLoading(false);
                props.toggleModal()
            }
            const onError = () => {
                setLoading(false);
                props.toggleModal()
            }

            props.sampleVerification(formData, formData.id,onSuccess,onError)
        }
    }
    return (

        <div >
            <Modal isOpen={props.showModal} toggle={props.toggleModal} size="lg">

                <Form onSubmit={createGlobalVariable}>
                    <ModalHeader toggle={props.toggleModal}>New International Standard </ModalHeader>
                    <ModalBody>
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label>Name</Label>
                                            <Input
                                                type='text'
                                                name='name'
                                                id='name'
                                                placeholder=' '
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />

                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label>Description</Label>
                                            <Input
                                                type='textarea'
                                                name='description'
                                                id='description'
                                                placeholder=' '
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
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

export default connect(null, { sampleVerification, fetchFormById })(ModalSample);
