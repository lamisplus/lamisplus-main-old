import React, { useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";

import { ToastContainer, toast } from "react-toastify";


//Dtate Picker package
Moment.locale("en");
momentLocalizer();

function FormSearch(props) {
   


    return (
        <React.Fragment>
            <div>
                <ToastContainer autoClose={3000} hideProgressBar />
                <h1> Program Manager</h1>
                </div>
        </React.Fragment>
    );
}
const mapStateToProps =  (state = { form:{}}) => {

    return {
      
    }}

const mapActionToProps = {
    
};

export default connect(mapStateToProps, mapActionToProps)(FormSearch);
