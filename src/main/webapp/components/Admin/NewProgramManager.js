import React, {useState, useEffect} from 'react';
import {  Modal, ModalHeader, ModalBody, FormFeedback,Form,Row,Col,FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import axios from "axios";
import {url} from '../../api'
import {createProgram, updateProgram } from 'actions/programManager';
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
    const defaultValues = {name:"",moduleId:"" }
    const [formData, setFormData] = useState(defaultValues)
    const [errors, setErrors] = useState({});
    const [pcrOptions, setOptionPcr] = useState([]);
    const classes = useStyles()

    useEffect(() => {
        //for application codeset edit, load form data
        setFormData(props.formData ? props.formData : defaultValues);
    }, [props.formData]);

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios(
                    url + "modules/1"
                );
                const body = response.data && response.data !==null ? response.data : {};
                
                setOptionPcr(
                     body.map(({ name, id }) => ({ title: name, value: id }))
                 );
            } catch (error) {
            }
        }
        getCharacters();
    }, []);

    const handleInputChange = e => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    }

    const handleNameInputChange = e => {

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

    const createNewProgram = e => {
        e.preventDefault()
        setLoading(true);

        const onSuccess = () => {
            setLoading(false);
            toast.success("New Program saved successfully!")
            props.createProgram();
            props.toggleModal()
        }
        const onError = () => {
            setLoading(false);
            toast.error("Something went wrong, please contact administration");
        }

        if(formData.id){
            props.updateProgram(formData.id, formData, onSuccess, onError)
            return
        }
        props.createProgram(formData, onSuccess,onError)

    }
    return (

        <div >
            <ToastContainer />
            <Modal isOpen={props.showModal} toggle={props.toggleModal} size="lg">
                <Form onSubmit={createNewProgram}>
                    <ModalHeader toggle={props.toggleModal}>New Program</ModalHeader>
                    <ModalBody>
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label>Program Name</Label>
                                            <Input
                                                type='text'
                                                name='name'
                                                id='name'
                                                placeholder=' '
                                                value={formData.name}
                                                onChange={handleNameInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                       
                                        <FormGroup>
                                              <Label for="">Module ID</Label>
                                                  <Input type="select" name="moduleId" id="moduleId" 
                                                    vaule={formData.moduleId}
                                                    onChange={handleInputChange}
                                                    
                                                  >
                                                        <option> </option>
                                                        {pcrOptions.map(({ title, value }) => (
                                                            
                                                            <option key={value} value={value}>
                                                                {title}
                                                            </option>
                                                        ))}
                                                  </Input>
                                                      <FormFeedback>{errors.receivingLabName}</FormFeedback>
                                          </FormGroup>
                                    </Col>
                                </Row>
                                <MatButton
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    disabled={loading}>
                                    Save  {loading ? <Spinner /> : ""}
                                </MatButton>
                                <MatButton
                                    variant='contained'
                                    color='default'
                                    onClick={props.toggleModal}
                                    startIcon={<CancelIcon />}>
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

export default connect(null, {createProgram, updateProgram })(ModalSample);
