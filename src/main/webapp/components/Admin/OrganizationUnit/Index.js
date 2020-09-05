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
import {  MdDelete, MdModeEdit, MdRemoveRedEye } from "react-icons/md";
import DeleteModule from "./DeleteModule";
import CreateOrganizationUnit from "./CreateOrganizationUnit";


const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})





  const OrganizationUnit = (props) => {
    const [collectModal, setcollectModal] = useState([])
    const [modal, setModal] = useState(false) // 
    const toggleModal = () => setModal(!modal)
    const [modal2, setModal2] = useState(false) //
    const toggleModal2 = () => setModal2(!modal2)
    const classes = useStyles()

    const deleteModule = (row) => {  
      setcollectModal({...collectModal, ...row});
      setModal(!modal) 
    }

    const createOrgUnit = () => {  
      setModal2(!modal2) 
    }


    

return (
    <Page >
      
        <Row>
            <Col>
              <h1>Organization Unit Manager
                <MatButton
                  type='submit'
                  variant='contained'
                  color='primary'
                  className={classes.button}                        
                  className=" float-right mr-1"
                  onClick={() => createOrgUnit()}
                >
                  <TiPlus/>{" "} New 
                </MatButton>
                </h1>
                <Card className="mb-12">
                
                <CardBody>

                <br />
                    <Row>
                        <Col>
                            <Card body>
                            
                               
                            <MaterialTable
                              title="Parent Org. Unit"
                              columns={[
                                { title: 'Parent Name', field: 'name' },
                                { title: 'Total Children', field: 'children' },
                                
                                { title: 'Action', field: 'actions'},
                              ]}
                              data={[
                                  { 
                                    name: 'Countries', 
                                    children: 30, 
                                    
                                    actions: 
                                      <div>
                                        <Menu>
                                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                              Actions <span aria-hidden>▾</span>
                                            </MenuButton>
                                                <MenuList style={{ color:"#000 !important"}} >
                                                    <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule('module to delete')}>                      
                                                      
                                                            <MdRemoveRedEye size="15" color="blue" />{" "}<span style={{color: '#000'}}>View Organ. Unit</span>
                                                                                
                                                      </MenuItem>
                                                      
                                                      <MenuItem style={{ color:"#000 !important"}}>
                                                            <Link
                                                                to={{
                                                                  pathname: "/updated-module",
                                                                  currentId: {}
                                                                }}
                                                            >
                                                              <MdModeEdit size="15" color="blue" />{" "}<span style={{color: '#000'}}>Edit Org. Unit  </span>                   
                                                            </Link>
                                                      </MenuItem> 
                                                      <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule('module to delete')}>                      
                                                      
                                                            <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Delete Org. Unit</span>
                                                                                
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
       <CreateOrganizationUnit modalstatus={modal2} togglestatus={toggleModal2}  />

       
    </Page>
  )
  
}


export default OrganizationUnit