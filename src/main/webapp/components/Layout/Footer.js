import React from 'react';

import { Navbar, Nav, NavItem } from 'reactstrap';



const Footer = () => {
  return (
    <Navbar className='mt-3'>
      <Nav navbar >
        <NavItem >
         <span className='float-right mr-1' style={{fontSize:'14px', fontColor:'#000000', fontWeight:'bolder', position: 'bottom', bottom:'0'}}> Version 1.2</span>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Footer;
