import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Compliance from "./features/compliance/compliance";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import React from "react";

const App: React.FC = () => {
  return (
    <Router>
      <>
        <Navbar bg="dark" expand="lg" variant="dark" className="mb-3">
          <Container className="d-flex justify-content-center align-items-center">
            <Navbar.Brand
              style={{
                color: "white",
                fontSize: "32px",
                fontWeight: "normal",
                textAlign: "center",
                padding: 20,
                textTransform: "uppercase",
              }}
            >
              Compliance Dashboard
            </Navbar.Brand>
          </Container>
        </Navbar>

        <Routes>
          <Route
            path="/"
            element={
              <Container
                className="text-center mt-5 d-flex align-items-center"
                style={{ height: "70vh" }}
              >
                <div className="flex-grow-1">
                  <h1>Welcome to Viplavi Wade's Compliance Dashboard</h1>
                  <p className="py-4 lead">
                    Manage your compliance documents easily.
                  </p>

                  <Link to="/compliance">
                    <Button variant="primary">Get Started</Button>
                  </Link>
                </div>
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
