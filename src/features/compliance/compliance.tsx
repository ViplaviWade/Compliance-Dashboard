import axios from "axios";
import React, { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Modal,
  Button,
  Form,
  Card,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import styles from "./styles.module.css";

const API_URL = "http://127.0.0.1:8000/api/upload/";

const Compliance: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, File | null>
  >({
    governmentID: null,
    proofOfAddress: null,
    selfieWithID: null,
    bankStatement: null,
    sourceOfFunds: null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleModalClose = () => {
    // Reset file input fields visually
    Object.keys(uploadedFiles).forEach((docType) => {
      const fileInput = document.getElementById(docType) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ""; // Clears the selected file
      }
    });

    // Reset file state
    setUploadedFiles({
      governmentID: null,
      proofOfAddress: null,
      selfieWithID: null,
      bankStatement: null,
      sourceOfFunds: null,
    });

    // Close the modal
    setModalOpen(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = event.target.files?.[0];
    console.log(`File selected for ${key}:`, file);
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleSubmit = async (category: "KYC" | "AML") => {
    console.log("Uploading files:", uploadedFiles);

    const formData = new FormData();
    let hasFiles = false;

    const categoryFiles =
      category === "KYC"
        ? ["governmentID", "proofOfAddress", "selfieWithID"]
        : ["bankStatement", "sourceOfFunds"];

    categoryFiles.forEach((docType) => {
      if (uploadedFiles[docType]) {
        console.log(`Adding file ${docType}`);
        formData.append("files", uploadedFiles[docType] as File);
        hasFiles = true;
      }
    });

    formData.append("category", category);

    if (!hasFiles) {
      setUploadStatus("Please upload at least one document before submitting.");
      setModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setUploadStatus("✅ Documents uploaded successfully!");
        setUploadedFiles({
          governmentID: null,
          proofOfAddress: null,
          selfieWithID: null,
          bankStatement: null,
          sourceOfFunds: null,
        });

        setModalOpen(true);
      } else {
        setUploadStatus("⚠️ Some files failed to upload. Please check errors.");
        setModalOpen(true);
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);

      if (error.response?.data?.errors) {
        setFileErrors(error.response.data.errors);
      } else {
        setFileErrors([]);
      }

      setUploadStatus("❌ Upload failed. Some files have errors.");
      setModalOpen(true);
    }
  };

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h3>Compliance Page</h3>
          <p>Manage your KYC and AML Documents here</p>
        </Col>
      </Row>
      <Accordion.Root type="single" collapsible className={styles.accordion}>
        <Row>
          <Col>
            {/* KYC Section */}
            <Accordion.Item value="kyc" className={styles.accordionBorder}>
              <Accordion.Header>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  KYC Documents
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className={styles.accordionContent}>
                <p>
                  <strong>Why required?</strong> To verify personal identity and
                  prevent fraud.
                </p>
                <Card>
                  <Card.Body className="p-2">
                    <Form.Group controlId="formFile" as={Row}>
                      <Form.Label column sm="12">
                        Government Issued ID
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="file"
                          className="m-0"
                          onChange={(e) =>
                            handleFileChange(
                              e as React.ChangeEvent<HTMLInputElement>,
                              "governmentID"
                            )
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body className="p-2">
                    <Form.Group controlId="formFile" as={Row}>
                      <Form.Label column sm="12">
                        Proof of Address
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="file"
                          className="m-0"
                          onChange={(e) =>
                            handleFileChange(
                              e as React.ChangeEvent<HTMLInputElement>,
                              "proofOfAddress"
                            )
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body className="p-2">
                    <Form.Group controlId="formFile" as={Row}>
                      <Form.Label column sm="12">
                        Selfie With ID
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="file"
                          className="m-0"
                          onChange={(e) =>
                            handleFileChange(
                              e as React.ChangeEvent<HTMLInputElement>,
                              "selfieWithID"
                            )
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <div className="text-center">
                  <Button
                    className="mt-3 w-50"
                    variant="primary"
                    type="submit"
                    onClick={() => handleSubmit("KYC")}
                  >
                    Submit KYC Documents
                  </Button>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Col>
          <Col>
            {/* AML Section */}
            <Accordion.Item value="aml" className={styles.accordionBorder}>
              <Accordion.Header>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  AML Documents
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className={styles.accordionContent}>
                <p>
                  <strong>Why required?</strong> To ensure the legal source of
                  funds.
                </p>
                <Card>
                  <Card.Body className="p-2">
                    <Form.Group controlId="formFile" as={Row}>
                      <Form.Label column sm="12">
                        Bank Statement
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="file"
                          className="m-0"
                          onChange={(e) =>
                            handleFileChange(
                              e as React.ChangeEvent<HTMLInputElement>,
                              "bankStatement"
                            )
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body className="p-2">
                    <Form.Group controlId="formFile" as={Row}>
                      <Form.Label column sm="12">
                        Source of Fund Declaration
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="file"
                          className="m-0"
                          onChange={(e) =>
                            handleFileChange(
                              e as React.ChangeEvent<HTMLInputElement>,
                              "sourceOfFunds"
                            )
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <div className="text-center">
                  <Button
                    className="mt-3 w-50"
                    variant="primary"
                    type="submit"
                    onClick={() => handleSubmit("AML")}
                  >
                    Submit AML Documents
                  </Button>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Col>
        </Row>
      </Accordion.Root>

      {/* React Bootstrap Modal */}
      <Modal show={modalOpen} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>File Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>{uploadStatus || "No status available"}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Compliance;
