import React from 'react'
import {Card, CardBody,CardHeader,Col,Row} from 'reactstrap'
import { useState} from 'react'
import { TiPlus } from 'react-icons/ti'
import MatButton from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { TiArrowBack} from 'react-icons/ti';
import 'react-widgets/dist/css/react-widgets.css'
//Date Picker
import Page from '../../Page'
//import { Spinner } from 'reactstrap';
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import MaterialTable from 'material-table';
import {  MdDelete, MdModeEdit } from "react-icons/md";
import DeleteModule from "./DeleteModule";


const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})





  const BootstrapConfiguration = (props) => {
    const [collectModal, setcollectModal] = useState([])
    const [modal, setModal] = useState(false) //Modal to collect sample 
    const toggleModal = () => setModal(!modal)
    const classes = useStyles()

    const deleteModule = (row) => {  
      setcollectModal({...collectModal, ...row});
      setModal(!modal) 
  }


    

return (
    <Page >
      
        <Row>
            <Col>
              <h1>Bootstrap Configuration
              < MatButton
                    type='submit'
                    variant='contained'
                    //variant="outlined"
                    color="default"
                    className={classes.button}                        
                    className=" float-right mr-1"
                >
                    <TiArrowBack/>{" "} Back
                </MatButton>
                </h1>
                <Card className="mb-12">
                
                <CardBody>

                <br />
                    <Row>
                        <Col>
                            <Card body>
                            <Link 
                                to ={{ 
                                pathname: "/create-module",  
                                activetab: 1
                                }} 
                              >
                                <MatButton
                                  type='submit'
                                  variant='contained'
                                  color='primary'
                                  className={classes.button}                        
                                  className=" float-right mr-1"
                                >
                                  <TiPlus/>{" "} New Module
                                </MatButton>
                            </Link>
                            <MaterialTable
                              title="List Of Bootstrap Module"
                              columns={[
                                { title: 'Module Name', field: 'name' },
                                { title: 'Description', field: 'description' },
                                { title: 'Author', field: 'author', type: 'numeric' },
                                {title: 'Version',field: 'version', type: 'numeric'},
                                { title: 'Date Updated', field: 'birthYear', type: 'date' },
                                { title: 'Status', field: 'status'},
                                { title: 'Action', field: 'actions'},
                              ]}
                              data={[
                                  { 
                                    name: 'General Service', 
                                    description: 'General Service', 
                                    author: 'Lamisplus Team', 
                                    date: '04-08-2020', 
                                    status:'completed',
                                    actions: 
                                      <div>
                                        <Menu>
                                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                              Actions <span aria-hidden>▾</span>
                                            </MenuButton>
                                                <MenuList style={{ color:"#000 !important"}} >
                                                    <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule('module to delete')}>                      
                                                      
                                                            <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Deactivate</span>
                                                                                
                                                      </MenuItem>
                                                      
                                                      <MenuItem style={{ color:"#000 !important"}}>
                                                            <Link
                                                                to={{
                                                                  pathname: "/updated-module",
                                                                  currentId: {}
                                                                }}
                                                            >
                                                              <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Update  </span>                   
                                                            </Link>
                                                      </MenuItem> 
                                                      <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule('module to delete')}>                      
                                                      
                                                            <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Delete</span>
                                                                                
                                                      </MenuItem>                                    
                                                      
                                              </MenuList>
                                        </Menu>
                                  </div>        
                                  },
                                
                              ]}        
                              options={{
                                headerStyle: {
                                  backgroundColor: "#9F9FA5",
                                  color: "#000",
                                  margin: "auto"
                                  },
                                filtering: true
                              }}
                            />
                            </Card>
                        </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
        </Row>
       <DeleteModule modalstatus={modal} togglestatus={toggleModal} datasample={collectModal} />
      
    </Page>
  )
  
}


export default BootstrapConfiguration