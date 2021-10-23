import React, {useState, useEffect} from 'react';
import Avatar from "components/Avatar";
import { UserCard } from "components/Card";
import Notifications from "components/Notifications";
import { notificationsData } from "demos/header";
import { authentication } from "../../_services/authentication";
import axios from "axios";
import Select from "react-select";
// import withBadge from 'hocs/withBadge';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import {
  MdClearAll,
  MdExitToApp,
  MdHelp,
  // MdNotificationsActive,
  MdPersonPin,
} from "react-icons/md";
import {
  ListGroup,
  ListGroupItem,
  // NavbarToggler,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
  Modal, ModalHeader, Card, CardBody, Row, Col, ModalBody, Label, FormGroup
} from "reactstrap";
import bn from "utils/bemnames";
import {url as baseUrl} from "../../api";
import MatButton from "@material-ui/core/Button";
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as ACTION_TYPES from "../../actions/types";
import store from "../../store";
import AssignFacilityModal from './../../components/Users/AssignFacilityModalFirst'


const bem = bn.create("header");
const { dispatch } = store;

// const MdNotificationsActiveWithBadge = withBadge({
//   size: 'md',
//   color: 'primary',
//   style: {
//     top: -10,
//     right: -10,
//     display: 'inline-flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   children: <small>2</small>,
// })(MdNotificationsActive);

function Header() {
  const [isOpenNotificationPopover, setIsOpenNotificationPopover] = useState(false);
  const [isNotificationConfirmed, setIsNotificationConfirmed] = useState(false);
  const [isOpenUserCardPopover, setIsOpenUserCardPopover] = useState(false);
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(false);

  const [assignFacilityModal, setAssignFacilityModal] = useState(false);

  const toggleNotificationPopover = () => {
    setIsOpenNotificationPopover(!isOpenNotificationPopover);

    if (!isNotificationConfirmed) {
      setIsNotificationConfirmed(true);
    }
  };

  const toggleUserCardPopover = () => {
    setIsOpenUserCardPopover(!isOpenUserCardPopover);
  };

  const toggleAssignFacilityModal = () => {
    setModal(!modal);
  };

  const handleSidebarControlButton = (event) => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector(".cr-sidebar").classList.toggle("cr-sidebar--open");
  };

  const logout = () => {
    authentication.logout();
  }

  //TO ASSIGN FACILITIES
  const toggleAssignModal = () => {
    setAssignFacilityModal(!assignFacilityModal);
  }

  const downloadNotice = () => toast.info("Downloading....");
  const downloadComplete = () => toast.success("Downloading Complete");

  //Download the update 
  async function DownloadButton() {
    dismissAll();
    downloadNotice();
    axios
        .gpostet(`${baseUrl}updates`)
        .then((response) => {
            if(response.date=="true"){
              downloadComplete();
            }                    
        })
        .catch((error) => {
          //notify();
        });     
}
  const dismissAll = () =>  toast.dismiss();

  const notify = () => toast.info(< >

  <h3 className="mt-2">Update is available</h3>
  <Button variant="contained" onClick={DownloadButton}>Download Now!</Button>
  </>, {
    className: 'black-background',
    position: "top-right",
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastClassName:"dark-toast"
    });

  async function fetchMe() {
    if( authentication.currentUserValue != null ) {
      axios
          .get(`${baseUrl}account`)
          .then((response) => {
            setUser(response.data);
            // set user permissions in local storage for easy retrieval, when user logs out it will be removed from the local storage
            localStorage.setItem('currentUser_Permission', JSON.stringify(response.data.permissions));
            dispatch({
              type: ACTION_TYPES.FETCH_PERMISSIONS,
              payload: response.data.permissions,
            });
            //notify();
            //console.log(response.data)
            if(response.data && response.data.currentOrganisationUnitId === null ){
              toggleAssignModal()
            }            
            
          })
          .catch((error) => {
            authentication.logout();
           // console.log(error);
          });
    }
  }

  async function switchFacility (facility) {
    console.log(facility)
    await axios.post(`${baseUrl}users/organisationUnit/${facility.value.organisationUnitId}`, {})
        .then(response => {
          toast.success('Facility switched successfully!');
          fetchMe();
          toggleAssignFacilityModal();
        }) .catch((error) => {
         toast.error('An error occurred, could not switch facilty.');
        });

  }

  const currentUser = authentication.getCurrentUser();
  //CHECK FOR ONLINE UPDATE 
  async function checkUpdate() {
        axios
            .get(`${baseUrl}updates/client`)
            .then((response) => {
                if(response.date=="true"){
                  notify();
                }else{
                  //notify();
                }                    
            })
            .catch((error) => {
              //notify();
            });     
  }

  useEffect(() => {
    fetchMe();
    checkUpdate();
  }, []);


    return (
      <Navbar light expand className={bem.b("bg-white")}>
        <ToastContainer />
        <Nav navbar className="mr-2">
          <Button outline onClick={handleSidebarControlButton}>
            <MdClearAll size={25} />
          </Button>
        </Nav>
        <Nav navbar>
          <NavItem className="ml-2 d-inline-flex">
            <h4>Logged In Facility: {user && user.currentOrganisationUnitName ? user.currentOrganisationUnitName : ""}</h4>
          </NavItem>
        </Nav>
        <Nav navbar>{/* <SearchInput /> */}</Nav>

        <Nav navbar className={bem.e("nav-right")}>
          <NavItem className="d-inline-flex">
            <NavLink id="Popover1" className="position-relative"></NavLink>
            <Popover
              placement="bottom"
              isOpen={isOpenNotificationPopover}
              toggle={toggleNotificationPopover}
              target="Popover1"
            >
              <PopoverBody>
                <Notifications notificationsData={notificationsData} />
              </PopoverBody>
            </Popover>
          </NavItem>

          <NavItem>
            <NavLink id="Popover2"  >
              <Avatar
                onMouseOver={toggleUserCardPopover}
                className="can-click"
              />
            </NavLink>
            <Popover
              placement="bottom-end"
              isOpen={isOpenUserCardPopover}
              //toggle={toggleUserCardPopover}              
              target="Popover2"
              //onMouseLeave={toggleUserCardPopover}
              className="p-0 border-0"
              style={{ minWidth: 250, backgroundColor:"#3E51B5" }}
            >
              <PopoverBody
                className="p-0 border-light"
                style={{ backgroundColor: "#000 !important" }}
                onMouseLeave={toggleUserCardPopover}
              >
                <UserCard
                  title={currentUser ? currentUser.name : ""}
                  subtitle2={currentUser && currentUser.role ? currentUser.role : ""}
                  subtitle={currentUser && currentUser.sub ? currentUser.sub : "" }
                  className="border-light"
                  style={{  backgroundColor:"#3E51B5" }}
                >
                  <ListGroup flush>
                    <ListGroupItem tag="button" action className="border-light">
                      <MdPersonPin /> Profile
                    </ListGroupItem>
                    <ListGroupItem tag="button" action className="border-light" onClick={toggleAssignFacilityModal}>
                      <MdHelp /> Switch Facility
                    </ListGroupItem>
                    <ListGroupItem tag="button" action className="border-light">
                      <MdHelp /> Help
                    </ListGroupItem>
                    <ListGroupItem tag="button" action className="border-light"  onClick={DownloadButton}>
                      <MdHelp /> Download Update
                    </ListGroupItem>
                    <ListGroupItem tag="button" action className="border-light">
                      <MdExitToApp />{" "}
                      <Link className="option"  onClick={logout} to="/login">
                        Signout
                      </Link>
                    </ListGroupItem>
                  </ListGroup>
                </UserCard>
              </PopoverBody>
            </Popover>
          </NavItem>
          <Modal isOpen={modal} backdrop={true}  zIndex={"9999"}>
            <ModalHeader toggle={() => setModal(!modal)}> Switch Facility </ModalHeader>
            <ModalBody>
              <Card >
                <CardBody>
                  <Row >
                    <Col md={12}>
                      <FormGroup>
                        <Label>Select Facility</Label>
                        <Select
                            required
                            isMulti={false}
                            onChange={switchFacility}
                            options={user && user.applicationUserOrganisationUnits ? user.applicationUserOrganisationUnits.map((x) => ({
                              label: x.organisationUnitName,
                              value: x,
                            })) : []}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <MatButton
                      variant='contained'
                      color='default'
                      onClick={toggleAssignFacilityModal}
                      startIcon={<CancelIcon />}
                  >
                    Cancel
                  </MatButton>
                </CardBody>
              </Card>
            </ModalBody>
          </Modal>
        </Nav>
          <AssignFacilityModal showModal={assignFacilityModal} toggleModal={() => setAssignFacilityModal(!assignFacilityModal)} user={user}/>
      </Navbar>
    );
}

export default Header;

