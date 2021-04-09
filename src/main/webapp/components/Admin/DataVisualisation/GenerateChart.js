import React, { useState } from "react";
import {Modal,ModalHeader, ModalBody,Form,Alert,Col,Card,CardBody,} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import {
    createCollectedSample,
} from "../../../actions/laboratory";
import * as CODES from "./../../../api/codes";
import FormRenderer from "components/FormManager/FormRenderer";



const GenerateCharts = (props) => {
   // const datasample = datasample.data && datasample.data.order_priority && datasample.data.order_priority.display   ? datasample.data.order_priority.display : null;
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    //This is to get SAMPLE TYPE from application Codeset

    const currentForm = {
          code: CODES.DATA_VISUALIZATION,
          programCode: CODES.GENERAL_SERVICE,
          formName: "Data Visualisation",
          options:{
              hideHeader: true
          },
      };

      const saveSample = (e) => {
        const newData = e.data 

        
    };

  return (
    <div >
        <Card >
         <CardBody>
            
                <FormRenderer
                    formCode={currentForm.code }
                    programCode={currentForm.programCode}
                    //submission={datasample}
                    onSubmit={saveSample}
                />

            </CardBody>
        </Card>
    </div>
  );
}

export default GenerateCharts;


