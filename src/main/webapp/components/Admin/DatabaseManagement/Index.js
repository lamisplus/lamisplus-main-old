import React from 'react'
import {Card, CardBody,Col,Row} from 'reactstrap'
import { useState} from 'react'
import Buttons from '@material-ui/core/Button'
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
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Search,
  Segment,
} from 'semantic-ui-react'


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
                  
                    <br/><br/>
                    <Col sm={12}>
                      <Segment placeholder>
                      <Grid columns={3} stackable textAlign='center'>
                        

                        <Grid.Row >
                          <Grid.Column>
                            <Header icon>
                            <FcDataBackup size="50" color="dark" />
                            <br/>
                              Back Up Database
                            </Header>
                            <Button primary onClick={() => backupModule('')}>Back Up</Button>
                          </Grid.Column>
                          
                          <Grid.Column verticalAlign='middle'>
                            <Header icon>
                            <MdRestore size="50" color="dark" />
                            <br/>
                              Restore Database 
                            </Header> 
                            <Button primary onClick={() => restoreModule('')}>Restore</Button>
                          </Grid.Column>
                          <Grid.Column>
                            <Header icon>
                            <MdSync size="50" color="dark" />
                            <br/> 
                              Sync Database
                            </Header>
                              <Link
                                  to={{
                                    pathname: "/admin-database-sync",
                                    currentId: {}
                                  }}
                              >
                              <Button primary >Sync</Button>
                            </Link>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                                
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