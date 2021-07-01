import axios from "axios";
import { url as baseUrl } from "../../api";
import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchRoles, deleteRole, updateRole } from "../../actions/role";
import { makeStyles } from "@material-ui/core/styles";
import "./RolesList.css";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import MatButton from "@material-ui/core/Button";
import useForm from "../Functions/UseForm";
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
import { ToastContainer, toast } from "react-toastify";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));
let roleId = 0;
const RoleList = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setselectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);
  const { values, setValues, handleInputChange, resetForm } = useForm({
    roleId: roleId,
    permissions: [],
  });
  

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
          setPermissions(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.description,
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

  const toggleEditPermissions = (id) => {
    roleId = id;
    setModal(!modal);
    if (!modal) {
      axios
        .get(`${baseUrl}roles/${id}`)
        .then((response) => {
          const c = response.data.permission.map(x => (x.name));
          setselectedPermissions(c);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    let permissions = [];
    selectedPermissions.map((p) => {
      const permission = { name: null };
      permission.name = p;
      permissions.push(permission);
    });
    values["permissions"] = permissions;
    setSaving(true);
    const onSuccess = () => {
      setSaving(false);
      toast.success("Role Updated Successfully");
      resetForm();
    };
    const onError = () => {
      setSaving(false);
      toast.error("Something went wrong");
    };
    props.updateRole(roleId, values, onSuccess, onError);
  };

  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <MaterialTable
      icons={tableIcons}
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
                      onClick={() => toggleEditPermissions(row.id)}
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

      <Modal isOpen={modal} backdrop={true} size={"lg"}>
        <Form onSubmit={handleEdit}>
          <ModalHeader>Edit Permissions</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="permissions">Permissions</Label>
              <DualListBox
                  canFilter
                  options={permissions}
                onChange={onPermissionSelect}
                selected={selectedPermissions}
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
              onClick={() => toggleEditPermissions(roleId)}
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
              onClick={() => toggleEditPermissions(roleId)}
            >
              <span style={{ textTransform: "capitalize" }}>Cancel</span>
            </MatButton>
          </ModalFooter>
        </Form>
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
  updateRole: updateRole
};

export default connect(mapStateToProps, mapActionToProps)(RoleList);
