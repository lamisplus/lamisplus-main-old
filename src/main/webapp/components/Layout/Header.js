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

import {
  MdClearAll,
  MdExitToApp,
  MdHelp,
  // MdNotificationsActive,
  MdPersonPin,
} from "react-icons/md";
import {
  Button,
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

const bem = bn.create("header");

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

  const currentUser = authentication.getCurrentUser();

  useEffect(() => {
    async function getCharacters() {
      axios
          .get(`${baseUrl}account`)
          .then((response) => {
            setUser(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    getCharacters();
  }, []);

  const me = authentication.fetchMe();

    return (
      <Navbar light expand className={bem.b("bg-white")}>
        <Nav navbar className="mr-2">
          <Button outline onClick={handleSidebarControlButton}>
            <MdClearAll size={25} />
          </Button>
        </Nav>
        <Nav navbar>
          <NavItem className="ml-2 d-inline-flex">
            <h4>Logged In Facility: {user ? user.currentOrganisationUnitId : ""}</h4>
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
            <NavLink id="Popover2">
              <Avatar
                onClick={toggleUserCardPopover}
                className="can-click"
              />
            </NavLink>
            <Popover
              placement="bottom-end"
              isOpen={isOpenUserCardPopover}
              toggle={toggleUserCardPopover}
              target="Popover2"
              className="p-0 border-0"
              style={{ minWidth: 250 }}
            >
              <PopoverBody
                className="p-0 border-light"
                style={{ backgroundColor: "#000 !important" }}
              >
                <UserCard
                  title={currentUser ? currentUser.name : ""}
                  subtitle2={currentUser && currentUser.role ? currentUser.role : ""}
                  subtitle={currentUser && currentUser.sub ? currentUser.sub : "" }
                  className="border-light"
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
          <Modal isOpen={modal} backdrop={true}>
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
                            onChange={() => {}}
                            options={user ? user.applicationUserOrganisationUnitsById.map((x) => ({
                              label: x.organisationUnitId,
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

      </Navbar>
    );
}

export default Header;

