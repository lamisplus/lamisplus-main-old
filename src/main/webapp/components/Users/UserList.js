import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUsers } from "../../actions/user";
import "./UserList.css";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";

const UserList = (props) => {
  const [loading, setLoading] = useState("");
  const [users, setUsers] = useState();

  useEffect(() => {
    console.log(props.usersList);
    setLoading("true");
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
    };
    props.fetchAllUsers(onSuccess, onError);
  }, []);

  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <MaterialTable
        title="User List"
        columns={[
          { title: "Name", field: "name" },
          { title: "Username", field: "username", filtering: false },
          { title: "Gender", field: "gender", filtering: false },
          { title: "Designation", field: "designation", filtering: false },
          { title: "", field: "actions", filtering: false },
        ]}
        isLoading={loading}
        data={props.usersList.map((row) => ({
          name: row.firstName + " " + row.lastName,
          username: row.username,
          gender: row.gender,
          designation: row.designation,
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    usersList: state.users.list,
  };
};

const mapActionToProps = {
  fetchAllUsers: fetchUsers
};

export default connect(mapStateToProps, mapActionToProps)(UserList);
