import { EmptyLayout, LayoutRoute, MainLayout } from "components/Layout";
import PageSpinner from "components/PageSpinner";
import React, {Component} from "react";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import "./styles/reduction.scss";
import SignIn from "pages/SignPage";

import PrintDispatchedManifest from "pages/PrintManifest";

import { history } from "./history";
import { PrivateRoute } from "./PrivateRoute"

const DashboardPage = React.lazy(() => import("pages/DashboardPage"));
const AdministrativeDashboard = React.lazy(() => import("components/Admin/HomePage"));
/* New Page loading using easy loading */
const PateintRegistationPage = React.lazy(() =>
    import("components/Patient/PateintRegistationPage")
);
const PatientRegistrationFormio = React.lazy(() =>
    import("components/Patient/PatientRegistrationFormio")
);
const EditPatientFormio = React.lazy(() =>
    import("components/Patient/EditPatientFormio")
);
const PateintUpdate= React.lazy(() => import("components/Patient/EditPatient"));

/* Laboratory page loading */
const LaboratoryPage = React.lazy(() => import("components/Laboratory/HomePage"));
const CollectSample = React.lazy(() =>import("components/Laboratory/Testorders/CollectSample"));
const LaboratorySampleResultPage = React.lazy(() =>import("components/Laboratory/TestResult/CollectResult"));
const SampleVerification = React.lazy(() => import("components/Laboratory/Sampleverifications/SampleVerification"));
const GridLayout = React.lazy(() => import("pages/GridLayout"));

const PatientsPage = React.lazy(() => import("components/PatientSearch/HomePage"));
const PrintSamples = React.lazy(() => import("components/Laboratory/DispatchedManifest/PrintSample"));
const PrintManifest = React.lazy(() => import("components/Laboratory/DispatchedManifest/PrintManifest"));

//Lamis
const SampleList = React.lazy(() => import("plugins/Lims/SampleList"))
const DispatchedSamples = React.lazy(() => import("plugins/Lims/DispatchedSamplesList"))
const DispatchedSamplesLims = React.lazy(() => import("plugins/Lims/DispatchedSamplesList"))
const ViewSampleDispatched = React.lazy(() => import("plugins/Lims/ViewPrintManifest"));
//NIMS
const NimsSampleList = React.lazy(() => import("plugins/Nims/SampleList"))
const ViewOrderStatusNims = React.lazy(() => import("plugins/Nims/DispatchedSamplesList"))

//NDR 
//NIMS
const Ndr = React.lazy(() => import("plugins/Ndr/Index"))

const Dashboard2 = React.lazy(() => import("pages/DashboardPage2"))
/* Radiology */
const RadiologyPage = React.lazy(() => import("components/Radiology/HomePage"));
/* Bootstrap configuration */
const BootStrapConfiguration = React.lazy(() => import("components/Admin/BootstrapConfiguration/Index"));
const CreateModule = React.lazy(() => import("components/Admin/BootstrapConfiguration/CreateModule"));
const UpdateModule = React.lazy(() => import("components/Admin/BootstrapConfiguration/UpdateModule"));
const UpdatedModule = React.lazy(() => import("components/Admin/BootstrapConfiguration/UpdatedModule"));

/* Datasase Management configuration */
const DataBaseManagement = React.lazy(() => import("components/Admin/DatabaseManagement/Index"));
const DataBaseSync = React.lazy(() => import("components/Admin/DatabaseManagement/DatabaseSync"));
/* Organization Unit Manager configuration */
const OrganizationUnit = React.lazy(() => import("components/Admin/OrganizationUnit/Index"));
const ParentOrganizationUnit = React.lazy(() => import("components/Admin/OrganizationUnit/ParentOrganizationalUnit"));
const ParentOrganizationUnitLevel = React.lazy(() => import("components/Admin/OrganizationUnit/ParentOrganizationalUnitLevel"));
//admin/parent-organization-unit-level
/* End of Bootstrap configuration */
const FormBuilder = React.lazy(() => import('components/formBuilder/FormBuilder'));
const ReactSelect = React.lazy(() => import('components/formBuilder/ReactSelect'));
const ViewForm = React.lazy(() => import('components/formBuilder/ViewForm'));
const PivotTable = React.lazy(() => import('components/PivotTable/PivotTable'));
const ReactPivot = React.lazy(() => import('components/PivotTable/ReactPivot'));
const FormPage = React.lazy(() => import('components/Admin/FormPage'));
const NewProgramManager = React.lazy(() => import('components/Admin/NewProgramManager'));

const ProgramManagerSeacrch = React.lazy(() => import('components/Admin/ProgramManagerSeacrch'));

/* Pharmacy page loading */
const PharmacyDashboard = React.lazy(() => import("./components/Pharmacy/PharmacyDashboard"))


const Plugins = React.lazy(() => import("pages/Plugins"));
// const ViewVitalsPage = React.lazy(() => import("components/Vitals/ViewVitalsPage"));

// const CheckInModal = React.lazy(() => import('components/CheckIn/CheckInModal'));

const EnrolledPatientsDashboard = React.lazy(() => import("components/PatientProfile/HomePage"));
/* Data Visualisation */ 
const AnalyticsDashboards = React.lazy(() => import("components/Admin/DashboardAnalytics/Index"));
const TestPageForVisualisation = React.lazy(() => import("pages/TestPageForVisualisation"));
const SyncVisualisation = React.lazy(() => import("components/Admin/Sync/SyncVisualisation"));
const MonitoringForVisualisation = React.lazy(() => import("components/Admin/DashboardAnalytics/Monitoring/Index"));
const QualityCareForVisualisation = React.lazy(() => import("components/Admin/DashboardAnalytics/QualityCare/Index"));
const CaseBaseSurvillance = React.lazy(() => import("components/Admin/DashboardAnalytics/CaseBaseSurvillance/Index"));
const BiometericTracker = React.lazy(() => import("components/Admin/DashboardAnalytics/BiometericTracker/Index"));
const ClinicalCascade = React.lazy(() => import("components/Admin/DashboardAnalytics/ClinicalCascade/Index"));
const CommodityManagement = React.lazy(() => import("components/Admin/DashboardAnalytics/CommodityManagement/Index"));
const MortalitySurvillance = React.lazy(() => import("components/Admin/DashboardAnalytics/MortalitySurvillance/Index"));
const RecencyTesting = React.lazy(() => import("components/Admin/DashboardAnalytics/RecencyTesting/Index"));
const ApplicationUpdates = React.lazy(() => import("components/Admin/ApplicationUpdate/UpdateList"));
const DataVisualizationDashboard = React.lazy(() => import("components/Admin/DataVisualisation/Index"));
/* Sample table i design */
const TestPage = React.lazy(() => import("components/Patient/PateintRegistationPage"));
const TabMenu = React.lazy(() => import("pages/TabMenu"));
const FormRendererPage = React.lazy(() => import("components/FormManager/FormRendererPage"));
//Reporting components
const ReportPage = React.lazy(() => import("components/Reports/ReportingPage"));
const JasperTemplate = React.lazy(() => import("components/Reports/JasperTemplate"));
const ReportView = React.lazy(() => import("components/Reports/ReportView"));
const JasperTemplateUpdate = React.lazy(() => import("components/Reports/JasperTemplateUpdate"));
const getBasename = () => {return `/${process.env.PUBLIC_URL.split("/").pop()}`;};
//const getBasename = () => {return window.SOURCE_URL;};
//SOURCE_URL
const Prescription = React.lazy(() => import("components/Pharmacy/Prescriptions"))

//Appointment
const AppointmentPage = React.lazy(() => import("components/Appointments/HomePage"));
//Case Management
const CaseManagerPage = React.lazy(() => import("components/Admin/CaseManagers/CaseManagerList"));
const CaseManagerPatientsPage = React.lazy(() => import("components/Admin/CaseManagers/CaseManagerPatients/CaseManagerPatientList"));
const CaseManagerPatientsList = React.lazy(() => import("components/Admin/CaseManagers/CaseManagerPatients/ManagePatients"));
const CaseManagerSwitchPatients = React.lazy(() => import("components/Admin/CaseManagers/CaseManagerPatients/ReAssignPatients"));

//Admin
const GlobalVariableSearchPage = React.lazy(() => import("components/Admin/GlobalVariable/GlobalVariableSearch"));
const StandardSearchPage = React.lazy(() => import("components/Admin/InternationalStandards/StandardSearch"));
const ApplicationCodesetPage = React.lazy(() => import("components/Admin/ApplicationCodeset/ApplicationCodesetSearch"));
const WardManagerPage = React.lazy(() => import("components/Admin/WardManager/WardSearch"));

//Radiology
const RadiologyTestDetailPage = React.lazy(() => import("components/Laboratory/Radiology/TestDetail"));

const UsersPage = React.lazy(() => import("components/Users/UserPage"))
const UserRegistration = React.lazy(() => import("components/Users/UserRegistration"))

const roles = React.lazy(() => import("components/Roles/RolesPage"))
const addRole = React.lazy(() => import("components/Roles/AddRole"))
const UnauthorisedPage = React.lazy(() => import("pages/Unauthorised"));
const BootstrapPage = React.lazy(() => import("pages/bootstrap"));
const BootstrapPage2 = React.lazy(() => import("pages/bootstrap2"))
/* Case Management page loading */
const CaseManagement = React.lazy(() => import("./components/CaseManagement/Dashboard"))
const CaseManagerPatients = React.lazy(() => import("./components/CaseManagement/CaseManagerPatientsList"))
const FingerPrintPage = React.lazy(() => import("components/Biometrics/CaptureBiometrics"));
class Routes extends Component {
  render() {
    return (
      <BrowserRouter basename={getBasename()} history={history}>
        <Switch>
          {/* <LayoutRoute exact path="/register" layout={EmptyLayout} component={Register} /> */}
        <LayoutRoute exact path="/login" layout={EmptyLayout} component={SignIn} />
        <LayoutRoute exact path="/print-dispatched-manifest" layout={EmptyLayout} component={PrintDispatchedManifest} />
          <MainLayout breakpoint={this.props.breakpoint}>
            <React.Suspense fallback={<PageSpinner />}>
              {/* The new routes are here  */}
              <PrivateRoute exact path="/" component={DashboardPage} />
              <PrivateRoute exact path="/dashboard" component={DashboardPage} />
              <PrivateRoute
                exact
                path="/patient-registration"
                component={PateintRegistationPage}/>
                <PrivateRoute exact path="/patient-registration-formio" component={PatientRegistrationFormio} roles={["patient_write", "patient_delete"]}/>
                <PrivateRoute exact path="/patient-update" component={PateintUpdate}/>
                <PrivateRoute exact path="/patient-update-formio" component={EditPatientFormio}/>
              {/* Laboratory Links */}
             <PrivateRoute exact path="/collect-result" component={LaboratorySampleResultPage} />
              <PrivateRoute exact path="/laboratory" component={LaboratoryPage} />
              <PrivateRoute exact path="/sample-verification" component={SampleVerification} />
              <PrivateRoute exact path="/collect-sample" component={CollectSample} />
              <PrivateRoute exact path="/dispatched-sample" component={DispatchedSamples} />
              <PrivateRoute exact path="/print-sample"  component={PrintSamples}  />
              <PrivateRoute exact path="/print-manifest"  component={PrintManifest}  />
              <PrivateRoute exact path="/patients" component={PatientsPage} />
                <PrivateRoute exact path="/patients/biometrics" component={FingerPrintPage} />
              <PrivateRoute exact path="/print-sample" component={PrintSamples} />
              <PrivateRoute exact path="/view-sample-dispatched" component={ViewSampleDispatched} />
              {/* LIMS Link*/}
              <PrivateRoute exact path="/sample-list" component={SampleList} />
               {/* NIMS Link*/}
              <PrivateRoute exact path="/nims-sample-list" component={NimsSampleList} />
              {/* NDR Link*/}
              <PrivateRoute exact path="/ndr" component={Ndr} />
              <PrivateRoute exact path="/view-order-status-nims" component={ViewOrderStatusNims} />
              {/* Radiology Link*/}
              <PrivateRoute exact path="/radiology-home" component={RadiologyPage} />
              {/* BootstrapConfiguration Link */}
              <PrivateRoute exact path="/admin-bootstrap-configuration" component={BootStrapConfiguration} />
              <PrivateRoute exact path="/admin-bootstrap-configuration-create-module" component={CreateModule} />
              <PrivateRoute exact path="/admin-bootstrap-configuration-update-module" component={UpdateModule} />
              <PrivateRoute exact path="/updated-module" component={UpdatedModule} />
              {/* DataBaseManagement Link */}
              <PrivateRoute exact path="/admin-database-management" component={DataBaseManagement} />
              <PrivateRoute exact path="/admin-database-sync" component={DataBaseSync} />
              {/* OrganizationUnit */}
              <PrivateRoute exact path="/admin-organization-unit" component={OrganizationUnit} />
              <PrivateRoute exact path="/admin-parent-organization-unit" component={ParentOrganizationUnit} />
              <PrivateRoute exact path="/admin-parent-organization-unit-level" component={ParentOrganizationUnitLevel} />
             
              {/* Pharmacy Links */}
              <PrivateRoute exact path="/pharmacy" component={PharmacyDashboard} />
              
              <PrivateRoute exact path="/prescriptions" component={Prescription}/>
              <PrivateRoute exact path="/appointment" component={AppointmentPage} />

              {/*<PrivateRoute exact path="/checkedin-patients" component={CheckInPatientPage}/>*/}


              <PrivateRoute exact path="/case-managers" component={CaseManagerPage} />
              <PrivateRoute exact path="/case-manager" component={CaseManagerPatientsPage} />
              <PrivateRoute exact path="/patients-managed-case" component={CaseManagerPatientsList} /> 
              <PrivateRoute exact path="/switch-patients" component={CaseManagerSwitchPatients} /> 
              
              {/* <PrivateRoute exact path="/checkin-modal" component={CheckInModal} /> */}


              {/* The rout to Hiv Module */}
              <PrivateRoute
                exact
                path="/patient-dashboard"

                component={EnrolledPatientsDashboard}/>
              {/*<PrivateRoute exact path="/form-dashboard" component={formDashboard} />*/}

              {/*  component={EnrolledPatientsDashboard}*/}
              {/*/>*/}

              <PrivateRoute exact path="/form-builder" component={FormBuilder} />
              <PrivateRoute exact path="/select" component={ReactSelect} />
              <PrivateRoute exact path="/view-form" component={ViewForm} />
              <PrivateRoute exact path="/pivot" component={PivotTable} />
                <PrivateRoute exact path="/react-pivot" component={ReactPivot} />
                <PrivateRoute exact path="/form-home" component={FormPage} />
                <PrivateRoute exact path="/new-program" component={NewProgramManager} />
                <PrivateRoute exact path="/admin-program-manager-home" component={ProgramManagerSeacrch}/>

                {/* The rout to that DataTabel */}
              <PrivateRoute exact path="/test-page" component={TestPage} />
              <PrivateRoute exact path="/form-renderer" component={FormRendererPage} />
              {/* The rout to Report*/}
              <PrivateRoute exact path="/report" component={ReportPage} />
                <PrivateRoute exact path="/jasper" component={JasperTemplate} />
                <PrivateRoute exact path="/report-view" component={ReportView} />
                <PrivateRoute exact path="/template-update" component={JasperTemplateUpdate} />

              <PrivateRoute exact path="/users" component={UsersPage} />

              <PrivateRoute exact path="/user-registration" component={UserRegistration} />

              <PrivateRoute exact path="/roles" component={roles} />

              <PrivateRoute exact path="/add-role" component={addRole} />

              <PrivateRoute exact path="/appointments" component={AppointmentPage} />
              <PrivateRoute exact path="/admin" component={AdministrativeDashboard}
                              roles={["user_write", "user_delete", "user_read", "admin_read"]}
                />
                <PrivateRoute exact path={"/admin-global-variable"} component={GlobalVariableSearchPage} />
                <PrivateRoute exact path={"/admin-standards"} component={StandardSearchPage} />
                <PrivateRoute exact path={"/admin-application-codesets"} component={ApplicationCodesetPage} />
                <PrivateRoute exact path={"/admin-wards"} component={WardManagerPage} />
                <PrivateRoute exact path={"/radiology"} component={RadiologyTestDetailPage} />
                <PrivateRoute exact path={"/plug-in"} component={Plugins} />
              {/* The route to Appointment*/}
              {/* The route to Visualization*/} 
                <PrivateRoute exact path={"/data-analytics"} component={AnalyticsDashboards} />
                <PrivateRoute exact path={"/visual"} component={TestPageForVisualisation} />
                <PrivateRoute exact path={"/sync-visualisation"} component={SyncVisualisation} />
                <PrivateRoute exact path={"/monitoring"} component={MonitoringForVisualisation} />
                <PrivateRoute exact path={"/quality-care"} component={QualityCareForVisualisation} />
                <PrivateRoute exact path={"/case-base-survillance"} component={CaseBaseSurvillance} />
                <PrivateRoute exact path={"/biometric-tracker"} component={BiometericTracker} />
                <PrivateRoute exact path={"/clinical-cascade"} component={ClinicalCascade} />
                <PrivateRoute exact path={"/commodity-management"} component={CommodityManagement} />
                <PrivateRoute exact path={"/mortality-surveillance"} component={MortalitySurvillance} />
                <PrivateRoute exact path={"/recency-testing"} component={RecencyTesting} />
                
                                
                <PrivateRoute exact path={"/data-visualisation"} component={DataVisualizationDashboard} />
                <PrivateRoute exact path={"/gridlayout"} component={GridLayout} />
                
               {/* The route to Visualization*/}
                <PrivateRoute exact path={"/unauthorised"} component={UnauthorisedPage} />
                <PrivateRoute  path="/external-modules" component={BootstrapPage2} />

                <PrivateRoute exact path={"/tabmenu"} component={TabMenu} />
                <PrivateRoute exact path={"/dashboard2"} component={Dashboard2} />
                {/* The route to Case management*/}
                
                <PrivateRoute  path="/case-management" component={CaseManagement} />
                <PrivateRoute  path="/case-manager-patients" component={CaseManagerPatients} />
                <PrivateRoute  path="/application-update" component={ApplicationUpdates} />
                
            </React.Suspense>
          </MainLayout>
          
          <Redirect to="/" />
        </Switch>       
      </BrowserRouter>
    );
  }
}

export default Routes;
