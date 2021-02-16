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


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const ModalSample = (props) => {
    const [loading, setLoading] = useState(false)
    const defaultValues = {name:""};
    const [formData, setFormData] = useState( defaultValues)
    const classes = useStyles()

    useEffect(() => {
        //for application codeset edit, load form data
        setFormData(props.formData ? props.formData : defaultValues);
    }, [props.formData]);

    const handleInputChange = e => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    }




    const create = e => {
        e.preventDefault()
            setLoading(true);

            const onSuccess = () => {
                setLoading(false);
                toast.success("Ward saved successfully!")
                props.loadApplicationCodeset();
                props.toggleModal()
            }
            const onError = () => {
                setLoading(false);
                toast.error("Something went wrong, please contact administration");
                //props.toggleModal()
            }
            if(formData.id){
                props.updateWard(formData.id, formData, onSuccess, onError)
                return
            }
            props.createWard(formData, onSuccess,onError)

    }
    return (

        <div >
            <ToastContainer />
            <Modal isOpen={props.showModal} toggle={props.toggleModal} size="lg">

                <Form onSubmit={create}>
                    <ModalHeader toggle={props.toggleModal}> {props.formData && props.formData.id ? 'Edit' : 'New'} Ward </ModalHeader>
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



export default connect(null, { createWard , updateWard})(ModalSample);
