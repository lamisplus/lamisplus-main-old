import React, { useState, useEffect }   from 'react';
import { Modal, ModalHeader, ModalBody,Row,Card,CardBody
} from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAllLabTestOrder, dispatchedManifestSamples, updateFormDataObj } from "./../../../actions/laboratory";
import { useHistory } from 'react-router-dom';
import {url} from './../../../api';
import axios from "axios";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
Moment.locale("en");
momentLocalizer();

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        display: 'none'
    } 
}))



const AddSamplesManifest = (props) => {
    const history = useHistory();
    const classes = useStyles()
    const [loading, setLoading] = useState('');
    const manifestSamples = props.manifestSamples && props.manifestSamples !==null ? props.manifestSamples : {}
    const [samplesManifest, setSamplesManifest] = useState()
    const samplesManifestId = manifestSamples.manifestId ;
    const [sampleManifest, setSampleManifest] = useState({sampleManifests: []})
    const newDatenow = moment(manifestSamples.dateSampleDispatched).format(
      "DD-MM-YYYY"
  );
    //Get the samples in a manifest 
    useEffect(() => {
      async function getCharacters() {
          try {
              const response = await axios(
                  url+"sample-manifests/manifest/"+samplesManifestId
              );
              const body = response.data;
              setSamplesManifest(body);
          } catch (error) {
            setSamplesManifest(null);
          }
      }
      getCharacters(samplesManifest);
  }, []);
  //
    useEffect(() => {
  
      setLoading('true');
    const onSuccess = () => {
       setLoading(false)
    }
    const onError = () => {
        setLoading(false)     
    }
        props.fetchAllLabTestOrderToday(onSuccess, onError);
      }, []); //componentDidMount
     
      const labTestType = [];    
      
      props.testOrder.forEach(function(value, index, array) {
            const getList = value['formDataObj'].find(x => { 
  
              if(x.data && x.data!==null && x.data.lab_test_order_status===2 && x.data.manifest_status==null){
                labTestType.push(x);
              }
            
            })         
       });
  
       function getDispatch (evt, data){
           
          const manifestSampleForUpDateFormDataObj = data
          const modifyFormDataObj= manifestSampleForUpDateFormDataObj.map(formobj => {                                       
            formobj.formDataObj.data['manifest_status']=1;
            return formobj;
          })
          //Forming the object for the sample manifest 
          const modifyManifestSample= data.map(item => {                       

            item['labNumber'] = '67484';
        
            item['clientId'] = item.formDataObj.data['patient_id']
            item['timeSampleTransferred'] = "10:10"//item.formDataObj.data['time_sample_transfered']
            item['dateSampleTransferred'] = item.formDataObj.data['date_sample_transfered']
            item['labOrderPriority'] = item.formDataObj.data.order_priority['display']
            item['sampleTransferredBy'] = item.formDataObj.data['sample_transfered_by']
            item['sampleOrderedBy'] = item.formDataObj.data['sample_ordered_by']
            item['viralLoadIndication'] = item.formDataObj.data.viral_load_indication['display']
            item['dateSampleDispatched'] = newDatenow;
            item['timeSampleOrdered'] = "10:10"; //item.formDataObj.data['time_sample_collected]
            item['timeSampleCollected'] = "10:10"//item.formDataobj.data['time_sample_collected]                
            item['timeSampleDispatched'] = "10:10"//otherfields['timeSampleDispatched'];
            item['courierName'] = manifestSamples.courierName;
            item['courierPhoneNumber'] = manifestSamples.courierPhoneNumber;
            item['sampleDispatchedBy'] = manifestSamples.courierPhoneNumber;
            //item['sampleDispatchedByPhoneNumber'] = otherfields['sampleDispatchedByPhoneNumber'];
            item['manifestId'] = manifestSamples.manifestId;
            item['receivingLabId'] = 'c5ty'
            item['receivingLabName'] = "";
            item['totalSampleShipment'] = manifestSamples.totalSampleShipment+data.length;
            item['sendingFacilityId'] = 'lamis567';
            item['sendingFacilityName'] = 'Lamisplus'
            item['dispatched'] = true
            item['id'] = 0;
            item['visitDate'] = item.formDataObj.data['date_sample_ordered'];
            item['dateResultReported'] = null
            item['dateAssayed'] = null
            item['dateResultDispatched'] = null
            item['sampleStatus'] = null
            item['sampleTestable'] = null
            item['testResult'] = null
            item['dateSampleReceivedLab'] = null
            item['pcrLabSampleNumber'] = null
            //delete item['formDataObj'];
            delete item['tableData'];
            
            return item;
        })
        
          //Updating the FormDataObj informations
            modifyFormDataObj.forEach(function(value, index, array) {
              props.updateFormDataObj(value.formDataObj, value.formDataObj.id)
          });
          
          const modifyFormObj= modifyManifestSample.map(item => { 
              delete item['formDataObj'];
              return item;
          })

          //Process the Samples to be dispatched 
          sampleManifest['sampleManifests'] = modifyManifestSample;
          props.dispatchedManifestSamples(sampleManifest)                            
          //Closing of the modal 
          //props.togglestatus2();
          history.go(-1)
        }


  return (      
      <div >
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                  <ModalHeader toggle={props.togglestatus}>Add Sample To Dispatched Manifest</ModalHeader>
                      <ModalBody>
                                
                                <MaterialTable
                                          title="List of Samples to Dispatch "
                                          columns={[
                                          
                                            { title: "FormDataObj ", 
                                              field: "formDataObj",
                                              hidden: true 
                                            },
                                            
                                            {
                                                title: "Sample Type",
                                                field: "sampleType",
                                            },

                                            {
                                              title: "Date Sample Ordered ",
                                              field: "dateSampleOrdered",
                                            },
                                            { 
                                              title: "Time Sample Ordered", 
                                              field: "timeSampleOrdered"
                                            },
                                            { 
                                              title: "Date Sample Collected", 
                                              field: "dateSampleCollected", 
                                              type: "date" , 
                                              filtering: false
                                            },
                                            {
                                              title: "Time Sample Collected",
                                              field: "timeSampleCollected",
                                            },

                                            { 
                                              title: "Sample Ordered By", 
                                              field: "sampleOrderedBy"
                                            },   
                                            { 
                                              title: "Sample Transferred By", 
                                              field: "sampleTransferredBy",
                                              
                                            },    
                                            { 
                                              title: "Date Sample Transferred", 
                                              field: "dateSampleTransferred",hidden: true 
                                              
                                            },
                                            
                                            {
                                              title: "Date Sample Transfered",
                                              field: "dateSampleTransferred",  hidden: true          
                                            },
                                            {
                                              title: "Sample Collected By",
                                              field: "sampleCollectedBy",  hidden: true 
                                            }, 
                                            {
                                              title: "Sample Transfered By",
                                              field: "sampleTransferredBy",  hidden: true           
                                            },      
                                            {
                                                title: "Viral Load Indication",
                                                field: "viralLoadIndication", hidden: true  
                                            },
                                            
                                            
                                          ]}
                                          isLoading={loading}
                                          data={labTestType.map((row) => ({
                                              formDataObj:row,
                                              sampleType: row.data.sample_type,
                                              dateSampleOrdered: row.data.date_sample_ordered,
                                              timeSampleOrdered: row.data.time_sample_collected,
                                              dateSampleCollected: row.data.date_sample_collected,
                                              timeSampleCollected: row.data.time_sample_collected,
                                              sampleOrderedBy: row.data.sample_ordered_by,
                                              sampleTransferredBy: row.data.sample_transfered_by,
                                              dateSampleTransferred : row.data.date_sample_transfered,
                                              sampleCollectedBy: row.data.sample_collected_by,
                                              }))}
                                          options={{
                                              search: false,
                                              selection: true,
                                              headerStyle: {
                                                  backgroundColor: "#9F9FA5",
                                                  color: "#000",
                                                  margin: "auto"
                                              },
                                          
                                          }}
                                          actions={[         
                                              {
                                                tooltip: 'Dispatch All Selected Sample',
                                                icon: 'add',
                                                onClick: (evt, data) =>
                                                  //alert('You want to dispatch ' + evt + data),
                                                  getDispatch(evt, data)
                                                  
                                              
                                              }
                                          ]}
                                        /> 
                      
          </ModalBody>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
  return {
      testOrder: state.laboratory.list
  };
};

const mapActionToProps = {
    fetchAllLabTestOrderToday: fetchAllLabTestOrder,
    dispatchedManifestSamples: dispatchedManifestSamples,
    updateFormDataObj: updateFormDataObj
};

export default connect(mapStateToProps, mapActionToProps)(AddSamplesManifest);
