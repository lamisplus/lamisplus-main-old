import React from 'react'
import {Card, CardBody,Col,Row} from 'reactstrap'
import { useState} from 'react'
import { TiPlus } from 'react-icons/ti'
import Button from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import 'react-widgets/dist/css/react-widgets.css'

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
//import { Spinner } from 'reactstrap';
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import MaterialTable from 'material-table';
import {   MdSync, MdRestore } from "react-icons/md";
import {FcDataBackup} from 'react-icons/fc';
import RestoreDatabase from "./RestoreDatabase";
import BackupDatabase from "./BackupDatabase";


const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})





  const DatabaseManagement = (props) => {
    const [collectModal, setcollectModal] = useState([])
    const [modal, setModal] = useState(false) //Modal  
    const toggleModal = () => setModal(!modal)
    const [modal2, setModal2] = useState(false) //Modal  
    const toggleModal2 = () => setModal2(!modal2)
    const classes = useStyles()

    const restoreModule = (row) => {  
      setcollectModal({...collectModal, ...row});
      setModal(!modal) 
    }

    const backupModule = (row) => {  
      setcollectModal({...collectModal, ...row});
      setModal2(!modal2) 
    }

    

return (
  <Card>
  <CardBody>
      <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to={{pathname: "/admin"}} >
              Admin
          </Link>
          <Typography color="textPrimary">Database Management</Typography>
      </Breadcrumbs>
      <br/>
      <div className={"d-flex justify-content-end pb-2"}>
          {/* <Button variant="contained"
                  color="primary"
                  startIcon={<TiPlus />}
                 // onClick={() => openProgram(null)}
                 >
              <span style={{textTransform: 'capitalize'}}>Add New Program</span>
          </Button> */}

      </div>
    <div>
                    <Row>
                        <Col>

                            <MaterialTable
                              title="Database Management"
                              columns={[
                                { title: 'Database Name', field: 'name' },
                                { title: 'Action', field: 'actions'},
                              ]}
                              data={[
                                  { 
                                    name: 'LamisPlus', 
                                    
                                    actions: 
                                      <div>
                                        <Menu>
                                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                              Actions <span aria-hidden>▾</span>
                                            </MenuButton>
                                                <MenuList style={{ color:"#000 !important"}} >
                                                    <MenuItem  style={{ color:"#000 !important"}} onSelect={() => backupModule('module to delete')}>                      
                                                      
                                                            <FcDataBackup size="15" color="blue" />{" "}<span style={{color: '#000'}}>Backup Database</span>
                                                                                
                                                      </MenuItem>
                                                      <MenuItem  style={{ color:"#000 !important"}} onSelect={() => restoreModule('module to delete')}>                      
                                                      
                                                            <MdRestore size="15" color="blue" />{" "}<span style={{color: '#000'}}>Restore Database</span>
                                                                                
                                                      </MenuItem>
                                                     
                                                      <MenuItem style={{ color:"#000 !important"}}>
                                                            <Link
                                                                to={{
                                                                  pathname: "/admin-database-sync",
                                                                  currentId: {}
                                                                }}
                                                            >
                                                            <MdSync size="15" color="blue" />{" "}<span style={{color: '#000'}}>Sync Database  </span>                   
                                                          </Link>
                                                      </MenuItem> 
                                                      <MenuItem  style={{ color:"#000 !important"}} onSelect={() => restoreModule('module to delete')}>                      
                                                      
                                                      <MdRestore size="15" color="blue" />{" "}<span style={{color: '#000'}}>Reverse Database Restore</span>
                                                                          
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
                                filtering: false
                              }}
                            />
                            
                        </Col>
                  </Row>
                 
       <RestoreDatabase modalstatus={modal} togglestatus={toggleModal} datasample={collectModal} />
       <BackupDatabase modalstatus={modal2} togglestatus={toggleModal2} datasample={collectModal} />
    </div>
    </CardBody>
    </Card>
  )
  
}


export default DatabaseManagement