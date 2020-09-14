import logo200Image from "assets/img/logo/lamislogo.png";
import sidebarBgImage from "assets/img/sidebar/sidebar-4.jpg";
import SourceLink from "components/SourceLink";
import React from "react";
import { MdDashboard, MdGraphicEq, MdPerson, MdKeyboardArrowDown } from "react-icons/md";
import { GiTestTubes, GiMedicines } from "react-icons/gi";
import { FaUserPlus, FaListUl, FaUserCog, FaCogs, FaWpforms } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Collapse, Nav, Navbar, NavItem, NavLink as BSNavLink } from "reactstrap";
import bn from "utils/bemnames";

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const navItems = [
  { to: '/dashboard', name: 'Dashboard', exact: true, Icon: MdDashboard },
  { to: '/patients', name: 'Find Patient', exact: false, Icon: FaUserPlus },
  { to: '/laboratory', name: 'Laboratory', exact: false, Icon: GiTestTubes },
  { to: '/pharmacy', name: 'Pharmacy', exact: false, Icon: GiMedicines },
  { to: '/appointments', name: 'Appointments', exact: false, Icon: MdGraphicEq },
  { to: '/report', name: 'Reports', exact: false, Icon: FaListUl },
  { to: '/visual', name: 'Visualization', exact: false, Icon: MdGraphicEq },
  { to: '/admin', name: 'Administration', exact: false, Icon: FaUserCog },

  //{ to: '/admin-dashboard', name: 'Administration Module', exact: false, Icon: FaUserCog },
  
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
  state = {
    isOpenComponents: false,
  };

  handleClick = (name) => () => {
    this.setState((prevState) => {
      const isOpen = prevState[`isOpen${name}`];
      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
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
            {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e("nav-item")}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e("nav-item-icon")} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
            {/* The Pharmacy Menu  */}

          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
