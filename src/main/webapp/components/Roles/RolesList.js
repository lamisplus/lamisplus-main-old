import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { fetchRoles } from "../../actions/role";
import "./RolesList.css";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";

const RoleList = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
    };
    props.fetchAllRoles(onSuccess, onError);
  }, []);

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
                <MenuList style={{ color: "#000 !important" }}></MenuList>
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
};

export default connect(mapStateToProps, mapActionToProps)(RoleList);
