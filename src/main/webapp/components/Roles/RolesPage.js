import Page from "components/Page";
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Card, CardContent } from "@material-ui/core";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";
import Title from "components/Title/CardTitle";
import RoleList from "./RolesList";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const RolePage = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.cardBottom}>
        <CardContent>
          <Title>
          <Link to ={{
            pathname: "/admin",
            state: 'users'
          }}>
          <Button
            variant="contained"
            color="primary"
            className=" float-right mr-1"
            startIcon={<FaArrowLeft />}
          >
            <span style={{ textTransform: "capitalize" }}>Back </span>
          </Button>
        </Link>
            <Link to="/add-role">
              <Button
                variant="contained"
                color="primary"
                className=" float-right mr-1"
                startIcon={<FaPlus />}
              >
                <span style={{ textTransform: "capitalize" }}>Add </span>
                &nbsp;&nbsp;
                <span style={{ textTransform: "lowercase" }}>Role </span>
              </Button>
            </Link>
            <br />
          </Title>
          <br />
          <RoleList />
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePage;
