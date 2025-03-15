import axios from "axios";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Accordion from "@radix-ui/react-accordion";
import styles from "./styles.module.css";

const API_URL = "http://127.0.0.1:8000/api/upload/";

const Compliance: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({
        governmentID: null,
        proofOfAddress: null,
        selfieWithID: null,
        bankStatement: null,
        sourceOfFunds: null,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = event.target.files?.[0];
        console.log(`File selected for ${key}:`, file);
        if (file) {
            setUploadedFiles((prev) => ({ ...prev, [key]: file }));
        }
    };

    const handleSubmit = async (category: "KYC" | "AML") => {
        console.log("Uploaded files:", uploadedFiles);

        const formData = new FormData();
        let hasFiles = false;

        const categoryFiles =
            category === "KYC"
                ? ["governmentID", "proofOfAddress", "selfieWithID"]
                : ["bankStatement", "sourceOfFunds"];

        categoryFiles.forEach((docType) => {
            if (uploadedFiles[docType]) {
                console.log(`Adding file ${docType}, uploadedFiles[docType]`);
                formData.append("file", uploadedFiles[docType] as File);
                hasFiles = true;
            }
        });

        if (!hasFiles) {
            alert(`Please upload at least one ${category} document before submitting.`);
            return;
        }

        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201) {
                setUploadStatus(`${category} Documents uploaded successfully!`);
            } else {
                setUploadStatus("Upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadStatus("Upload failed. Invalid file type or size.");
        }

        setModalOpen(true);
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
                            <strong>Why required?</strong> To verify personal identity and prevent fraud.
                        </p>
                        <ul>
                            <li>
                                Government Issued ID
                                <input type="file" onChange={(e) => handleFileChange(e, "governmentID")} />
                                {uploadedFiles.governmentID && <span> File Uploaded</span>}
                            </li>
                            <li>
                                Proof of Address
                                <input type="file" onChange={(e) => handleFileChange(e, "proofOfAddress")} />
                                {uploadedFiles.proofOfAddress && <span> File Uploaded</span>}
                            </li>
                            <li>
                                Selfie with ID
                                <input type="file" onChange={(e) => handleFileChange(e, "selfieWithID")} />
                                {uploadedFiles.selfieWithID && <span> File Uploaded</span>}
                            </li>
                        </ul>
                        <button className={styles.submitButton} onClick={() => handleSubmit("KYC")}>
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
                                <input type="file" onChange={(e) => handleFileChange(e, "bankStatement")} />
                                {uploadedFiles.bankStatement && <span> File Uploaded</span>}
                            </li>
                            <li>
                                Source of Funds Declaration
                                <input type="file" onChange={(e) => handleFileChange(e, "sourceOfFunds")} />
                                {uploadedFiles.sourceOfFunds && <span> File Uploaded</span>}
                            </li>
                        </ul>
                        <button className={styles.submitButton} onClick={() => handleSubmit("AML")}>
                            Submit AML Documents
                        </button>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>

            {/* Dialog Modal */}
            <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className={styles.dialogOverlay} />
                    <Dialog.Content className={styles.dialogContent}>
                        <Dialog.Title>
                            {uploadStatus?.includes("successfully") ? "Submission Successful" : "Upload Failed"}
                        </Dialog.Title>
                        <Dialog.Description className={styles.dialogDescription}>
                            {uploadStatus || "No status available"}
                        </Dialog.Description>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)}>
                            OK
                        </button>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default Compliance;
