import React, { Component } from "react";
import { Navbar, Container, NavbarBrand } from "reactstrap";

export default class Header extends Component {
  render() {
    return (
      <Navbar
        expand="md"
        className="d-flex flex-row justify-content-between px-0"
      >
        <Container>
          <NavbarBrand>
            <div className="d-flex flex-row">
              <div className="d-flex flex-column justify-content-center flex-wrap">
                <h1 className="website-title m-0 d-flex flex-column flex-md-row">
                  Monitor&nbsp;<span>Bitcoin</span>
                </h1>
              </div>
            </div>
          </NavbarBrand>
        </Container>
      </Navbar>
    );
  }
}
