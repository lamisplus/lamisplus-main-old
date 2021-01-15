import logo200Image from "assets/img/logo/lamislogo.png";
import sidebarBgImage from "assets/img/sidebar/sidebar-4.jpg";
import SourceLink from "components/SourceLink";
import React, {useState} from "react";
import { MdDashboard, MdGraphicEq, MdPerson, MdKeyboardArrowDown } from "react-icons/md";
import { GiTestTubes, GiMedicines } from "react-icons/gi";
import { FaUserPlus, FaListUl, FaUserCog, FaCogs, FaWpforms } from "react-icons/fa";
import {Link, NavLink} from "react-router-dom";
import { Nav, Navbar, NavItem, NavLink as BSNavLink, Collapse } from "reactstrap";
import bn from "utils/bemnames";
import { authentication } from '../../_services/authentication';
import {fetchAll} from "../../actions/menu";
import {connect} from "react-redux";

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
  { to: '/radiology-home', name: 'Radiology', exact: false, Icon: GiTestTubes },
  { to: '/pharmacy', name: 'Pharmacy', exact: false, Icon: GiMedicines,
    roles: ["pharmacy_read", "pharmacy_write", "pharmacy_delete"]},
  { to: '/appointments', name: 'Appointments', exact: false, Icon: MdGraphicEq,
<<<<<<< HEAD
  roles: ["appointment_read", "appointment_write", "appointment_delete"]},

  { to: '/report', name: 'Reports', exact: false, Icon: FaListUl },
  { to: '/visual', name: 'Visualization', exact: false, Icon: MdGraphicEq },
=======
    roles: ["appointment_read", "appointment_write", "appointment_delete"]},
  // { to: '/report', name: 'Reports', exact: false, Icon: FaListUl },
  // { to: '/visual', name: 'Visualization', exact: false, Icon: MdGraphicEq },
>>>>>>> dev
  { to: '/admin', name: 'Administration', exact: false, Icon: FaUserCog,
    roles: ["admin_read", "user_read"] },
  // { to: '/data-visualisation', name: 'Data Visualisation', exact: false, Icon: GiTestTubes },
  // { to: '/select', name: 'React Select', exact: false, Icon: FaUserCog },

  // { to: '/admin-dashboard', name: 'Administration Module', exact: false, Icon: FaUserCog },

 
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
const userRoles = authentication.getCurrentUserRole();



class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenComponents: false,
      loading: false,
    };

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
              {navItems.map(({ to, name, exact, Icon , roles}, index) => (

                  <>
                    {!authentication.userHasRole(roles) ?
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
  };
};

const mapActionToProps = {
  fetchAllExternalModulesMenu: fetchAll,
};


export default connect(mapStateToProps, mapActionToProps)(Sidebar);
