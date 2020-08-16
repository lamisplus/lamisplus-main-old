import { EmptyLayout, LayoutRoute, MainLayout } from "components/Layout";
import PageSpinner from "components/PageSpinner";

// import AuthPage from 'pages/AuthPage';
import React, {Component} from "react";
// React Toast Notification 
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import "./styles/reduction.scss";
import SignIn from "pages/SignPage";
import { Register } from "pages/Register";
import { history } from "./history";
import { PrivateRoute } from "./PrivateRoute"

const DashboardPage = React.lazy(() => import("pages/DashboardPage"));
const AdministrativeDashboard = React.lazy(() => import("components/Admin/AdministrativeDashBoard"));
/* New Page loading using easy loading */
const PateintRegistationPage = React.lazy(() =>
  import("components/Patient/PateintRegistationPage")
);
const PateintUpdate= React.lazy(() => import("components/Patient/EditPatient"));
const CheckInPage = React.lazy(() => import("components/CheckIn/CheckInPage"));
const VitalSignsPage = React.lazy(() => import("components/Vitals/VitalSignsPage"));

/* Consultation page loading */
const ConsultationPage = React.lazy(() => import("pages/ConsultationPage"));
const ConsultationDashboardPage = React.lazy(() =>
  import("components/Consultation/Dashboard")
);

/* Laboratory page loading */
const LaboratoryPage = React.lazy(() => import("components/Laboratory/HomePage"));
const CollectSample = React.lazy(() =>import("components/Laboratory/Testorders/CollectSample"));
const LaboratorySampleResultPage = React.lazy(() =>import("components/Laboratory/TestResult/CollectResult"));
const SampleVerification = React.lazy(() => import("components/Laboratory/Sampleverifications/SampleVerification"));

const DispatchedSamples = React.lazy(() => import("components/Laboratory/DispatchedManifest/DispatchedSamplesList"))
const PatientsPage = React.lazy(() => import("components/PatientSearch/HomePage"));
const PrintSamples = React.lazy(() => import("components/Laboratory/DispatchedManifest/PrintSample"));


const formDashboard = React.lazy(() => import('components/formBuilder/formDashboard'));
const FormBuilder = React.lazy(() => import('components/formBuilder/FormBuilder'));
const ViewForm = React.lazy(() => import('components/formBuilder/ViewForm'));

/* Pharmacy page loading */
const PharmacyDashboard = React.lazy(() => import("./components/Pharmacy/PharmacyDashboard"))

const CheckInPatientPage = React.lazy(() => import("components/CheckIn/CheckedInPatientPage"));
const ViewVitalsPage = React.lazy(() => import("components/Vitals/ViewVitalsPage"));

// const CheckInModal = React.lazy(() => import('components/CheckIn/CheckInModal'));
const EnrolledPatientsDashboard = React.lazy(() => import("components/PatientProfile/HomePage"));

/* Sample table i design */
const TestPage = React.lazy(() => import("pages/TestPage"));
const FormRendererPage = React.lazy(() => import("components/FormManager/FormRendererPage"));
//Reporting components
const ReportPage = React.lazy(() => import("components/Reports/ReportingPage"));
const getBasename = () => {return `/${process.env.PUBLIC_URL.split("/").pop()}`;};

const Prescription = React.lazy(() => import("components/Pharmacy/Prescriptions"))

//Appointment
const AppointmentPage = React.lazy(() => import("components/Appointments/HomePage"));
// const getBasename = () => {
//   return `/${process.env.PUBLIC_URL.split("/").pop()}`;
// };

// const Prescription = React.lazy(() => import("components/Pharmacy/prescriptions"))

const UsersPage = React.lazy(() => import("components/Users/UserPage"))
const UserRegistration = React.lazy(() => import("components/Users/UserRegistration"))

class Routes extends Component {
  render() {
    return (
      <BrowserRouter basename={getBasename()} history={history}>
        <Switch>
          {/* <LayoutRoute exact path="/register" layout={EmptyLayout} component={Register} /> */}
        <LayoutRoute exact path="/login" layout={EmptyLayout} component={SignIn} />
        <LayoutRoute exact path="/print-sample" layout={EmptyLayout} component={PrintSamples} />
          <MainLayout breakpoint={this.props.breakpoint}>
            <React.Suspense fallback={<PageSpinner />}>
              {/* The new routes are here  */}
              <PrivateRoute exact path="/" component={DashboardPage} />
              <PrivateRoute exact path="/dashboard" component={DashboardPage} />
              <PrivateRoute
                exact
                path="/patient-registration"
                component={PateintRegistationPage}/>
              <PrivateRoute
                exact
                path="/patient-update"
                component={PateintUpdate}/>
              <PrivateRoute exact path="/checkin" component={CheckInPage} />
              <PrivateRoute exact path="/vital-signs" component={VitalSignsPage} />
              <PrivateRoute exact path="/checkin" component={CheckInPage} />
              <PrivateRoute exact path="/vital-signs" component={VitalSignsPage} />
              {/* Consultation Links */}
              <PrivateRoute exact path="/consultation" component={ConsultationPage} />
              
              <PrivateRoute
                exact
                path="/consultation-dashbaord"
                component={ConsultationDashboardPage}/>
              {/* Laboratory Links */}
             <PrivateRoute exact path="/collect-result" component={LaboratorySampleResultPage} />
              <PrivateRoute exact path="/laboratory" component={LaboratoryPage} />
              <PrivateRoute exact path="/sample-verification" component={SampleVerification} />
              <PrivateRoute exact path="/collect-sample" component={CollectSample} />
              <PrivateRoute exact path="/dispatched-sample" component={DispatchedSamples} />
              <PrivateRoute exact path="/patients" component={PatientsPage} />

              <PrivateRoute exact path="/print-sample" component={PrintSamples} />
              {/* Pharmacy Links */}
              <PrivateRoute exact path="/pharmacy" component={PharmacyDashboard} />
              
              <PrivateRoute exact path="/prescriptions" component={Prescription}/>
              <PrivateRoute exact path="/appointment" component={AppointmentPage} />
              <PrivateRoute
                exact
                path="/checkedin-patients"
                component={CheckInPatientPage}
              />

              <PrivateRoute exact path="/view-vitals" component={ViewVitalsPage} />
              {/* <PrivateRoute exact path="/add-vitals" component={AddVitalsPage} /> */}
              {/* <PrivateRoute exact path="/checkin-modal" component={CheckInModal} /> */}

              {/* The rout to Hiv Module */}
              <PrivateRoute
                exact
                path="/patient-dashboard"
                component={EnrolledPatientsDashboard}
              />
              <PrivateRoute exact path="/form-dashboard" component={formDashboard} />
              <PrivateRoute exact path="/form-builder" component={FormBuilder} />
              <PrivateRoute exact path="/view-form" component={ViewForm} />
              
                {/* The rout to that DataTabel */}
              <PrivateRoute exact path="/testpage" component={TestPage} />
              <PrivateRoute exact path="/form-renderer" component={FormRendererPage} />
              {/* The rout to Report*/}
              <PrivateRoute exact path="/report" component={ReportPage} />

              <PrivateRoute exact path="/users" component={UsersPage} />

              <PrivateRoute exact path="/user-registration" component={UserRegistration} />

              <PrivateRoute exact path="/appointments" component={AppointmentPage} />
              {/* The route to Appointment*/}
              
            </React.Suspense>
          </MainLayout>
          
          <Redirect to="/" />
        </Switch>       
      </BrowserRouter>
    );
  }
}

export default Routes;
