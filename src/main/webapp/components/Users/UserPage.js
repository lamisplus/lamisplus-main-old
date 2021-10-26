import Page from "components/Page";
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Card, CardContent } from "@material-ui/core";
import { FaTasks, FaUserPlus } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";
import Title from "components/Title/CardTitle";
import UserList from "./UserList";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const UserPage = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.cardBottom}>
        <CardContent>
          <Title>
          <Link to="/roles">
              <Button
                variant="contained"
                color="primary"
                className=" float-right mr-1"
                startIcon={<FaTasks />}
              >
                <span style={{ textTransform: "capitalize" }}>Manage Roles and Privileges</span>
              </Button>
            </Link>
            <Link to="/user-registration">
              <Button
                variant="contained"
                color="primary"
                className=" float-right mr-1"
                startIcon={<FaUserPlus />}
              >
                <span style={{ textTransform: "capitalize" }}>Add User</span>
              </Button>
            </Link>
            <br />
          </Title>
          <br />
          <UserList />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
