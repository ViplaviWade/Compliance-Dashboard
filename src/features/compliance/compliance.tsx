import axios from "axios";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap"; // ✅ Import Bootstrap Modal
import * as Accordion from "@radix-ui/react-accordion";
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

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // ✅ Store message for modal

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = event.target.files?.[0];
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
        formData.append("file", uploadedFiles[docType] as File);
        hasFiles = true;
      }
    });

    formData.append("category", category); // ✅ Ensure category is included

    if (!hasFiles) {
      setModalMessage("No files uploaded.");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setModalMessage(`${category} Documents uploaded successfully!`);
        setUploadedFiles((prev) => {
          const updatedFiles = { ...prev };
          categoryFiles.forEach((docType) => {
            updatedFiles[docType] = null;
          });
          return updatedFiles;
        });
      } else {
        setModalMessage("Upload failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error?.response?.data || error);
      setModalMessage("Upload failed. Invalid file type or size.");
    } finally {
      setShowModal(true); // ✅ Open modal after upload attempt
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
                  type="file"
                  onChange={(e) => handleFileChange(e, "governmentID")}
                />
              </li>
              <li>
                Proof of Address
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "proofOfAddress")}
                />
              </li>
              <li>
                Selfie with ID
                <input
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
              <strong>Why required?</strong> To ensure legal source of funds.
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

      {/* ✅ React-Bootstrap Modal for Submission Message */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submission Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Compliance;
