import logo200Image from "assets/img/logo/lamislogo.png";
import sidebarBgImage from "assets/img/sidebar/sidebar-4.jpg";
import SourceLink from "components/SourceLink";
import React, {useState} from "react";
import { MdDashboard, MdGraphicEq, MdPerson, MdKeyboardArrowDown } from "react-icons/md";
import { GiTestTubes, GiMedicines,GiUnplugged } from "react-icons/gi";
import { FaUserPlus, FaListUl, FaUserCog, FaCogs, FaWpforms } from "react-icons/fa";
import {Link, NavLink} from "react-router-dom";
import { Nav, Navbar, NavItem, NavLink as BSNavLink, Collapse } from "reactstrap";
import bn from "utils/bemnames";
import { authentication } from '../../_services/authentication';
import {fetchAll, fetchUserPermission} from "../../actions/menu";
import {connect} from "react-redux";
import _ from "lodash";

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const navItems = [
  { to: '/dashboard', name: 'Dashboard', exact: true, Icon: MdDashboard },
  { to: '/patients', name: 'Find Patient', exact: false, Icon: FaUserPlus,
    roles:["patient_read", "patient_write", "patient_delete"]},
  { to: '/laboratory', name: 'Laboratory', exact: false, Icon: GiTestTubes,
    roles:["laboratory_read", "laboratory_write", "laboratory_delete"]},
  { to: '/radiology-home', name: 'Radiology', exact: false, Icon: GiTestTubes,
    roles: ["6f757363-0ee7-45df-99e2-39f0f427b096_read", "6f757363-0ee7-45df-99e2-39f0f427b096_write", "6f757363-0ee7-45df-99e2-39f0f427b096_delete"]},
  { to: '/pharmacy', name: 'Pharmacy', exact: false, Icon: GiMedicines,
    roles: ["pharmacy_read", "pharmacy_write", "pharmacy_delete"]},
  { to: '/appointments', name: 'Appointments', exact: false, Icon: MdGraphicEq,
  roles: ["4d358195-095a-4944-bc5b-aa711915af8a_read", "4d358195-095a-4944-bc5b-aa711915af8a_write", "4d358195-095a-4944-bc5b-aa711915af8a_delete", "22ec08bd-eeae-4f5e-9041-44461d511e90_read"]},
  { to: '/report', name: 'Reports', exact: false, Icon: FaListUl },
  // { to: '/data-visualisation', name: 'Data Visualization', exact: false, Icon: MdGraphicEq },
  // { to: '/plug-in', name: 'Plugins', exact: false, Icon: GiUnplugged },
  { to: '/admin', name: 'Administration', exact: false, Icon: FaUserCog,
    roles: ["admin_read", "user_read"] },
  // { to: '/data-analytics', name: 'Data Visualisation', exact: false, Icon: MdGraphicEq },
  // { to: '/select', name: 'React Select', exact: false, Icon: FaUserCog },

 

 
];
const navContents = [
  { to: '/bootstrap-configuration', name: 'Bootstrap Configuration', exact: false, Icon: FaListUl },
  { to: '/database-management', name: 'DataBase Management', exact: false, Icon: FaUserCog },
];

const adminItems = [
  { to: "/users", name: "Users", exact: false, Icon: MdPerson },
  {
    to: "/form-dashboard",
    name: "Forms",
    exact: false,
    Icon: FaWpforms,
  },
  { to: '/bootstrap-configuration', name: 'Bootstrap Configuration', exact: false, Icon: FaListUl },
  { to: '/database-management', name: 'DataBase Management', exact: false, Icon: FaUserCog },
  { to: '/organization-unit', name: 'Organization Unit', exact: false, Icon: FaUserCog },

];

const bem = bn.create("sidebar");



class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenComponents: false,
      loading: false,
      permissionLoading: false,
    };
    this.fetchPermisisons();
    this.fetchExternalMenu();

  }

  handleClick = (name) => () => {
    this.setState((prevState) => {
      const isOpen = prevState[`isOpen${name}`];
      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

   userHasRole(role){
    const userRoles = this.props.permissions;
    if(role && role.length > 0 && _.intersection(role, userRoles).length === 0){
      return false;
    }
    return true;
  }
  fetchExternalMenu = () => {
    this.setState({loading: true});
    const onSuccess = () => {
      this.setState({loading: false});
    }
    const onError = () => {
      this.setState({loading: false});
    }
    this.props.fetchAllExternalModulesMenu(onSuccess, onError);
  };

  fetchPermisisons = () => {
    this.setState({permissionLoading: true});
    const onSuccess = () => {
      this.setState({permissionLoading: false});
    }
    const onError = () => {
      this.setState({permissionLoading: false});
    }
    this.props.fetchUserPermission(onSuccess, onError);
  };



  render() {
    return (
        <aside className={bem.b()} data-image={sidebarBgImage}>
          <div className={bem.e("background")} style={sidebarBackground} />
          <div className={bem.e("content")}>
            <Navbar>
              <SourceLink className="navbar-brand d-flex">
                <img
                    src={logo200Image}
                    width="40"
                    height="30"
                    className="pr-2"
                    alt=""
                />
                <span className="text-white">LAMISPlus</span>
              </SourceLink>
            </Navbar>
            <Nav vertical>
              {this.props.permissions  && this.props.permissions.length > 0 && navItems.map(({ to, name, exact, Icon , roles}, index) => (

                  <>
                    {!this.userHasRole(roles) ?
                        <></> :
                        <NavItem key={index} className={bem.e("nav-item")}>
                          <BSNavLink
                              id={`navItem-${name}-${index}`}
                              tag={NavLink}
                              to={to}
                              activeClassName="active"
                              exact={exact}
                          >
                            <Icon className={bem.e("nav-item-icon")}/>
                            <span className="">{name}</span>
                          </BSNavLink>
                        </NavItem>
                    }
                  </>
              ))}
              {/* The External Module Menu  */}
              {this.props.menuList && this.props.menuList.length > 0 && <NavItem
                  className={bem.e('nav-item')}
                  onClick={this.handleClick('Administration')}
              >
                <BSNavLink className={bem.e('nav-item-collapse')}>
                  <div className="d-flex">
                    <FaCogs className={bem.e('nav-item-icon')}/>
                    <span className="">External Modules </span>
                  </div>
                  <MdKeyboardArrowDown
                      className={bem.e('nav-item-icon')}
                      style={{
                        padding: 0,
                        transform: this.state.isOpenAdministration
                            ? 'rotate(0deg)'
                            : 'rotate(-90deg)',
                        transitionDuration: '0.3s',
                        transitionProperty: 'transform',
                      }}
                  />
                </BSNavLink>
              </NavItem>
              }
              <Collapse isOpen={this.state.isOpenAdministration}>

                {this.props.menuList && this.props.menuList.map(({ url, name }, index) => (
                    <>
                    <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                  id={`navItem-${name}-${index}`}
                  // className="text-uppercase"
                  tag={NavLink}
                  to ={{
                  pathname: `/external-modules`,
                  state: url
                }}
                  activeClassName="active"
                  exact={false}
                  >
                {/*<Icon className={bem.e('nav-item-icon')} />*/}
                  <span className="">{name}</span>
                  </BSNavLink>
                  </NavItem>
                    </>
                ))}
              </Collapse>
            </Nav>
          </div>
        </aside>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    menuList: state.menu.list,
    permissions: state.menu.permissions,
  };
};

const mapActionToProps = {
  fetchAllExternalModulesMenu: fetchAll,
  fetchUserPermission: fetchUserPermission
};


export default connect(mapStateToProps, mapActionToProps)(Sidebar);
