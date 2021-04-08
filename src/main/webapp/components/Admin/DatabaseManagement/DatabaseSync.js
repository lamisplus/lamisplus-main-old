import React from 'react'
import {Card, CardBody,CardHeader,Col,Row} from 'reactstrap'
import { useState} from 'react'
import { TiPlus } from 'react-icons/ti'
import Button from '@material-ui/core/Button'
import MatButton from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import 'react-widgets/dist/css/react-widgets.css'

import "@reach/menu-button/styles.css";
import { TiArrowBack} from 'react-icons/ti';
import MaterialTable from 'material-table';
import {MdSync} from 'react-icons/md';
import DatabaseSyncModal from "./DatabaseSyncModal";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})

    const DatabaseSync = (props) => {
    const [collectModal, setcollectModal] = useState([])
    const [modal2, setModal2] = useState(false) //Modal  
    const toggleModal2 = () => setModal2(!modal2)
    const classes = useStyles()

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
           <Typography color="textPrimary"><Link color="inherit" to={{pathname: "/admin-database-management"}} >Database Management</Link></Typography>
          <Typography color="textPrimary">DataBase Syncronnization</Typography>
      </Breadcrumbs>
      <br/>
      <div className={"d-flex justify-content-end pb-2"}>
         
      </div>
      
        <Row>
            <Col>
              <h3>Database Sync Manager : LamisPlus</h3>
                </Col>
              </Row>
              <Row>
              <Col>
                    <MatButton
                        type='submit'
                        variant='contained'
                        color='primary'
                        className={classes.button}                        
                        className=" float-right mr-1"
                        onClick={() => backupModule('module to delete')}
                      >
                        <MdSync/>{" "} Sync Database
                      </MatButton>
                      </Col>
              </Row>
              <Row>
                
                <CardBody>
                  
                    <Card body>
                  
                            <MaterialTable
                              title=""
                              columns={[
                                { title: 'Sync Date Time', field: 'date' },
                                { title: 'Server', field: 'server' },
                                { title: 'Total Obj Synced', field: 'totalsync' },
                                { title: 'Sync Status', field: 'status' },
                                
                              ]}
                              data={[
                                  { 
                                    date: '18, Aug 2020', 
                                    server: 'LamisPlus Server 1' , 
                                    totalsync: 'Lamis240Plus', 
                                    status: 'completed'       
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
                 
                </CardBody>
            
        </Row>
          <DatabaseSyncModal modalstatus={modal2} togglestatus={toggleModal2} datasample={collectModal} />
    </CardBody>
    </Card>
  )
  
}


export default DatabaseSync