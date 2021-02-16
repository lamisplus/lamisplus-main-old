import axios from "axios";
import { url as baseUrl } from "../../api";
import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { fetchUsers, updateUserRole } from "../../actions/user";
import "./UserList.css";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { ToastContainer, toast } from "react-toastify";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import MatButton from "@material-ui/core/Button";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { MdModeEdit } from "react-icons/md";
import useForm from "../Functions/UseForm";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import AssignFacilityModal from "./AssignFacilityModal";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

let userId = 0;
let currentUser = {};

const UserList = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [assignFacilityModal, setAssignFacilityModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setselectedRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  
  let { values, setValues, handleInputChange, resetForm } = useForm({});

  useEffect(() => {
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
    };
    props.fetchAllUsers(onSuccess, onError);
  }, []);

  /* Get list of Roles from the server */
  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}roles`)
        .then((response) => {
          setRoles(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.name,
              value: value.name,
            }))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getCharacters();
  }, []);

  const onRoleSelect = (selectedValues) => {
    setselectedRoles(selectedValues);
  };

  const toggleAssignModal = (user) => {
    console.log(user);
    currentUser = user;
    setAssignFacilityModal(!assignFacilityModal);
    console.log(assignFacilityModal);
    console.log("Modal should open")
  }

  const toggleEditRoles = (id) => {
    userId = id;
    setModal(!modal);
    if (!modal) {
      axios
        .get(`${baseUrl}users/${id}`)
        .then((response) => {
          setselectedRoles(
            Object.entries(response.data.roles).map(
              ([key, value]) => value
            )
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    let roles = [];
    selectedRoles.map((p) => {
      const role = { name: null };
      role.name = p;
      roles.push(role);
    });
    values = roles;
    setSaving(true);
    const onSuccess = () => {
      setSaving(false);
      toast.success("User roles Updated Successfully");
      resetForm();
    };
    const onError = () => {
      setSaving(false);
      toast.error("Something went wrong");
    };
    props.updateUserRole(userId, values, onSuccess, onError);
  };

  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <MaterialTable
        title="User List"
        columns={[
          { title: "Name", field: "name" },
          { title: "Username", field: "userName", filtering: false },
          { title: "Gender", field: "gender", filtering: false },
          { title: "Roles", field: "roles", filtering: false },
          { title: "", field: "actions", filtering: false },
        ]}
        isLoading={loading}
        data={props.usersList.map((row) => ({
          name: row.firstName + " " + row.lastName,
          userName: row.userName,
          gender: row.gender,
          roles: row.roles.toString(),
          actions: (
            <div>
              <Menu>
                <MenuButton
                  style={{
                    backgroundColor: "#3F51B5",
                    color: "#fff",
                    border: "2px solid #3F51B5",
                    borderRadius: "4px",
                  }}
                >
                  Actions <span aria-hidden>▾</span>
                </MenuButton>
                <MenuList style={{ color: "#000 !important" }}>
                  <MenuItem style={{ color: "#000 !important" }} >
                    <Button
                      size="sm"
                      color="link"
                      onClick={() => toggleEditRoles(row.id)}
                    >
                      <MdModeEdit size="15" />{" "}
                      <span style={{ color: "#000" }}>Edit Roles </span>
                    </Button>
                  </MenuItem>
                  <MenuItem style={{ color: "#000 !important" }}>
                    <Button
                        size="sm"
                        color="link"
                        onClick={() => toggleAssignModal(row)}
                    >
                      <MdModeEdit size="15" />{" "}
                      <span style={{ color: "#000" }}>Assign Facilities </span>
                    </Button>
                  </MenuItem>
                </MenuList>
              </Menu>
              <Modal isOpen={modal} backdrop={true}>
                <Form onSubmit={handleEdit}>
                  <ModalHeader>Edit Roles</ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label for="roles">Roles</Label>
                      <DualListBox
                          canFilter
                        options={roles}
                        onChange={onRoleSelect}
                        selected={selectedRoles}
                      />
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <MatButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<SaveIcon />}
                      disabled={saving}
                      onClick={() => toggleEditRoles(userId)}
                    >
                      {!saving ? (
                        <span style={{ textTransform: "capitalize" }}>
                          Save
                        </span>
                      ) : (
                        <span style={{ textTransform: "capitalize" }}>
                          Saving...
                        </span>
                      )}
                    </MatButton>
                    <MatButton
                      variant="contained"
                      className={classes.button}
                      startIcon={<CancelIcon />}
                      onClick={() => toggleEditRoles(userId)}
                    >
                      <span style={{ textTransform: "capitalize" }}>
                        Cancel
                      </span>
                    </MatButton>
                  </ModalFooter>
                </Form>
              </Modal>
            </div>

          ),
        }))}
        options={{
          headerStyle: {
            backgroundColor: "#9F9FA5",
            color: "#000",
          },
          searchFieldStyle: {
            width: "300%",
            margingLeft: "250px",
          },
          filtering: true,
          exportButton: false,
          searchFieldAlignment: "left",
        }}
      />
      <AssignFacilityModal
          showModal={assignFacilityModal} toggleModal={() => setAssignFacilityModal(!assignFacilityModal)} user={currentUser}/>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    usersList: state.users.list,
  };
};

const mapActionToProps = {
  fetchAllUsers: fetchUsers,
  updateUserRole: updateUserRole,
};

export default connect(mapStateToProps, mapActionToProps)(UserList);
