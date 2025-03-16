import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Compliance from "./features/compliance/compliance";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import React from "react";

const App: React.FC = () => {
  return (
    <Router>
      <>
        <Navbar bg="dark" expand="lg" variant="dark">
          <Container className="d-flex justify-content-center align-items-center">
            <Navbar.Brand
              style={{
                color: "white",
                fontSize: "22px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Compliance Dashboard
            </Navbar.Brand>

            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/compliance"
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginLeft: "20px",
                }}
              ></Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route
            path="/"
            element={
              <Container className="text-center mt-5">
                <h1>Welcome to Viplavi Wade's Compliance Dashboard</h1>
                <p>Manage your compliance documents easily.</p>

                <Link to="/compliance">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </Container>
            }
          />
          <Route path="/compliance" element={<Compliance />} />
        </Routes>
      </>
    </Router>
  );
};

export default App;
