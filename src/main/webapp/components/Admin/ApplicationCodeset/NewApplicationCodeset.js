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


import { createApplicationCodeset, updateApplicationCodeset } from 'actions/applicationCodeset';
import { Spinner } from 'reactstrap';
import Select from "react-select/creatable";


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const ModalSample = (props) => {
    const [loading, setLoading] = useState(false)
    const defaultValues = {display:"", language:"", version:"", codesetGroup:""};
    const [formData, setFormData] = useState( defaultValues)
    const classes = useStyles()

    useEffect(() => {
        //for application codeset edit, load form data
        setFormData(props.formData ? props.formData : defaultValues);
    }, [props.formData]);

    const handleInputChange = e => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    }

    const handleCodesetGroupChange = (newValue) => {
        setFormData ({ ...formData, codesetGroup: newValue.value});
    };


    const createGlobalVariable = e => {
        e.preventDefault()
            setLoading(true);

            const onSuccess = () => {
                setLoading(false);
                toast.success("Application codeset saved successfully!")
                props.loadApplicationCodeset();
                props.toggleModal()
            }
            const onError = () => {
                setLoading(false);
                toast.error("Something went wrong, please contact administration");
                //props.toggleModal()
            }
            if(formData.id){
                props.updateApplicationCodeset(formData.id, formData, onSuccess, onError)
                return
            }
            props.createApplicationCodeset(formData, onSuccess,onError)

    }
    return (

        <div >
            <ToastContainer />
            <Modal isOpen={props.showModal} toggle={props.toggleModal} size="lg">

                <Form onSubmit={createGlobalVariable}>
                    <ModalHeader toggle={props.toggleModal}> {props.formData && props.formData.id ? 'Edit' : 'New'} Global Variable </ModalHeader>
                    <ModalBody>
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label>Codeset Group</Label>
                                            <Select
                                                required
                                                name="cg"
                                                id="cg"
                                                isOptionDisabled={option => formData.id ? option.value !== formData.codesetGroup : false}
                                                isMulti={false}
                                                onChange={handleCodesetGroupChange}
                                                options={props.applicationCodesetList ? Array.from(new Set(props.applicationCodesetList.map(x => x.codesetGroup))).sort().map (codesetGroup => ({value: codesetGroup, label: codesetGroup})) : []}
                                                value={formData.codesetGroup ? {value: formData.codesetGroup, label: formData.codesetGroup} : ""}
                                                isLoading={false}
                                            />

                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label>Name</Label>
                                            <Input
                                                type='text'
                                                name='display'
                                                id='display'
                                                placeholder=' '
                                                value={formData.display}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={12}>
                                        <FormGroup>
                                            <Label>Language</Label>
                                            <Input
                                                type='text'
                                                name='language'
                                                id='language'
                                                placeholder=' '
                                                value={formData.language}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={12}>
                                        <FormGroup>
                                            <Label>Version</Label>
                                            <Input
                                                type='text'
                                                name='version'
                                                id='version'
                                                placeholder=' '
                                                value={formData.version}
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

const mapStateToProps = (state) => {
    return {
        applicationCodesetList: state.applicationCodesets.applicationCodesetList
    };
};

export default connect(mapStateToProps, { createApplicationCodeset , updateApplicationCodeset})(ModalSample);
