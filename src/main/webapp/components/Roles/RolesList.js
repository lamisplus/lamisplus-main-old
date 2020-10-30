import axios from "axios";
import { url as baseUrl } from "../../api";
import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchRoles, deleteRole } from "../../actions/role";
import { makeStyles } from "@material-ui/core/styles";
import "./RolesList.css";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
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
import "@reach/menu-button/styles.css";
import { ToastContainer } from "react-toastify";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const RoleList = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setselectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
    };
    props.fetchAllRoles(onSuccess, onError);
  }, []);

  /* Get list of Permissions from the server */
  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}permissions`)
        .then((response) => {
          console.log(Object.entries(response.data));
          setPermissions(
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

  const onPermissionSelect = (selectedValues) => {
    setselectedPermissions(selectedValues);
  };

  const onDelete = (id) => {
    if (window.confirm(`Are you sure to delete this role? ${id}`))
      props.deleteRole(id);
  };

  const toggleEditPermissions = () => {
    setModal(!modal);
  };

  const editPermissions = () => {
    console.log("edit");
  };

  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <MaterialTable
        title="Role List"
        columns={[
          { title: "Name", field: "name" },
          { title: "Last Updated", field: "dateModified", filtering: false },
          { title: "", field: "actions", filtering: false },
        ]}
        isLoading={loading}
        data={props.rolesList.map((row) => ({
          name: row.name,
          roleName: row.dateModified,
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
                  <MenuItem style={{ color: "#000 !important" }}>
                    <Button
                      size="sm"
                      color="link"
                      onClick={() => toggleEditPermissions()}
                    >
                      <MdModeEdit size="15" />{" "}
                      <span style={{ color: "#000" }}>Edit Permissions </span>
                    </Button>
                  </MenuItem>
                  <MenuItem style={{ color: "#000 !important" }}>
                    <Link onClick={() => onDelete(row.id)}>
                      <MdDeleteForever size="15" />{" "}
                      <span style={{ color: "#000" }}>Delete Role</span>
                    </Link>
                  </MenuItem>
                </MenuList>
              </Menu>
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
      <Modal isOpen={modal} backdrop={true}>
        <ModalHeader>Edit Permissions</ModalHeader>
        <ModalBody>
          <Form onSubmit={editPermissions}>
            <FormGroup>
              <Label for="permissions">Permissions</Label>
              <DualListBox
                options={permissions}
                onChange={onPermissionSelect}
                selected={selectedPermissions}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <MatButton
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
            disabled={saving}
            onClick={() => toggleEditPermissions()}
          >
            {!saving ? (
              <span style={{ textTransform: "capitalize" }}>Save</span>
            ) : (
              <span style={{ textTransform: "capitalize" }}>Saving...</span>
            )}
          </MatButton>
          <MatButton
            variant="contained"
            className={classes.button}
            startIcon={<CancelIcon />}
            onClick={() => toggleEditPermissions()}
          >
            <span style={{ textTransform: "capitalize" }}>Cancel</span>
          </MatButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    rolesList: state.roles.list,
  };
};

const mapActionToProps = {
  fetchAllRoles: fetchRoles,
  deleteRole: deleteRole,
};

export default connect(mapStateToProps, mapActionToProps)(RoleList);
