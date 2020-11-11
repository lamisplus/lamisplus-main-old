import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { sampleDispatched } from "./../../../actions/laboratory";
import "./../laboratory.css";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { TiArrowBack } from 'react-icons/ti';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Page from './../../Page';
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";


const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})

const PatientSearch = (props) => {
    const [loading, setLoading] = useState('')
    const classes = useStyles();

    useEffect(() => {
        setLoading('true');
            const onSuccess = () => {
                setLoading(false)
            }
            const onError = () => {
                setLoading(false)     
            }
                props.fetchAllSampleDispatched(onSuccess, onError);
    }, []); //componentDidMount


    
  return (
    <Page title='Dispatched Samples '>
      
      <div>
      <br/>
      <Link 
        to ={{ 
            pathname: "/laboratory",  
            state: 'dispatched-sample-list'
        }} >

        <MatButton
            type='submit'
            variant='contained'
            color='primary'
            className={classes.button}                        
            className=" float-right mr-1"
        >
            <TiArrowBack/>{" "} Back
        </MatButton>
        
        </Link>
        <br/><br/>
          <MaterialTable
              title="Dispatched samples list"
              columns={[
                  { title: "Manifest ID", field: "manifestId" },
                
                  {
                    title: "Receiving Lab. Name",
                    field: "receivingLabName",
                  },
                  
                  {
                    title: "Sample Dispatched By ",
                    field: "sampleDispatchedBy",
                    filtering: false
                  },
                  { title: "Courier Name", 
                    field: "courierName"
                  },
                  { title: "Courier Phone Number", 
                    field: "courierPhoneNumber"
                  },
                  { title: "Total Sample Shipment", 
                    field: "totalSampleShipment"
                  },
                  {
                    title: "Action",
                    field: "action",
                    filtering: false,
                  },
              ]}
              isLoading={loading}
              data={props.sampleManifest.map((row) => ({
                  manifestId: row.manifestId,
                  receivingLabName: row.receivingLabName,
                  sampleDispatchedBy: row.sampleDispatchedBy,
                  courierName: row.courierName,
                  courierPhoneNumber: row.courierPhoneNumber,
                  totalSampleShipment: row.totalSampleShipment,
                  action : 
                            <div>
                            <Menu>
                                <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                    Actions <span aria-hidden>▾</span>
                                </MenuButton>
                                    <MenuList style={{ color:"#000 !important"}} >
                                        
                                            <MenuItem style={{ color:"#000 !important"}}>
                                                <Link
                                                    to={{
                                                        pathname: "/view-sample-dispatched",
                                                        state: row
                                                    }}
                                                >
                                                <VisibilityIcon size="15" color="blue" />{" "}<span style={{color: '#000'}}>View & Print  </span>                   
                                                </Link>
                                            </MenuItem>                                      
                                            
                                    </MenuList>
                            </Menu>
                        </div>                    
                  
              }))}
              options={{
                  headerStyle: {
                  backgroundColor: "#9F9FA5",
                  color: "#000",
                  margin: "auto"
                  },
                  
                  filtering: true,
                  searchFieldStyle: {
                      width : '300%',
                      margingLeft: '250px',
                  },
                  exportButton: true,
                  searchFieldAlignment: 'left',          
              }}

          />
    </div>
    
  </Page>
  );
}

const mapStateToProps = state => {
    return {
        sampleManifest: state.laboratory.manifest
    };
};

const mapActionToProps = {
    fetchAllSampleDispatched: sampleDispatched
};
  
export default connect(mapStateToProps, mapActionToProps)(PatientSearch);