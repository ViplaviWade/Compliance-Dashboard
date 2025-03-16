import axios from "axios";
import React, { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Modal, Button } from "react-bootstrap";
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
        formData.append("file", uploadedFiles[docType] as File);
        formData.append("category", category);
        hasFiles = true;
      }
    });

    if (!hasFiles) {
      alert(
        `Please upload at least one ${category} document before submitting.`
      );
      return;
    }

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setUploadStatus(`${category} Documents uploaded successfully!`);
        setModalOpen(true);
      } else {
        setUploadStatus("Upload failed. Please try again.");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Upload failed. Invalid file type or size.");
      setModalOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Compliance Page</h1>
      <p>Manage your KYC and AML Documents here</p>

      <Accordion.Root type="single" collapsible className={styles.accordion}>
        {/* KYC Section */}
        <Accordion.Item value="kyc">
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
            <ul>
              <li>
                Government Issued ID
                <input
                  id="governmentID"
                  type="file"
                  onChange={(e) => handleFileChange(e, "governmentID")}
                />
              </li>
              <li>
                Proof of Address
                <input
                  id="proofOfAddress"
                  type="file"
                  onChange={(e) => handleFileChange(e, "proofOfAddress")}
                />
              </li>
              <li>
                Selfie with ID
                <input
                  id="selfieWithID"
                  type="file"
                  onChange={(e) => handleFileChange(e, "selfieWithID")}
                />
              </li>
            </ul>
            <button
              className={styles.submitButton}
              onClick={() => handleSubmit("KYC")}
            >
              Submit KYC Documents
            </button>
          </Accordion.Content>
        </Accordion.Item>

        {/* AML Section */}
        <Accordion.Item value="aml">
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
            <ul>
              <li>
                Bank Statement
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "bankStatement")}
                />
              </li>
              <li>
                Source of Funds Declaration
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "sourceOfFunds")}
                />
              </li>
            </ul>
            <button
              className={styles.submitButton}
              onClick={() => handleSubmit("AML")}
            >
              Submit AML Documents
            </button>
          </Accordion.Content>
        </Accordion.Item>
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
    </div>
  );
};

export default Compliance;
