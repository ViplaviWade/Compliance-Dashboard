import React, {useState} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import * as Accordion from "@radix-ui/react-accordion"
import styles from "./styles.module.css"

const Compliance: React.FC = () => {

    const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>> ({
        governmentID: null,
        proofOfAddress: null,
        selfieWithID: null,
        bankStatement: null,
        sourceOfFunds: null,
    });

    const [modalOpen, setModalOpen] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFiles((prev) => {
                return { ...prev, [key]: file}
            })
        }
    }

    const handleSubmit =  () => {
        const fileUploaded = Object.values(uploadedFiles).some((file) => file !== null);
        if (fileUploaded) {
            setModalOpen(true);
        } else {
            alert("Please upload atleast one document before submitting.")
        }
    };

    return (
        <div className={styles.container}>
            <h1>Compliance Page</h1>
            <p>Manage your KYC and AML Documents here</p>
            <Accordion.Root type="single" collapsible className={styles.accordion}>
                {/* KYC Selection */}
                <Accordion.Item value="kyc">
                    <Accordion.Header>
                        <Accordion.Trigger className={styles.accordionTrigger}>
                            KYC Documents
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={styles.accordionContent}>
                        <p><strong>Why required?</strong>To verify personal identity and prevent fraud.</p>
                        <ul>
                            <li>Government Issued ID
                                <input type="file" onChange={(e) => handleFileChange(e, "governmentID")} />
                                    {uploadedFiles.governmentID && <span>File Uploaded</span>}
                            </li>
                            <li>Proof of address
                                <input type="file" onChange={(e) => handleFileChange(e, "proofOfAddress")} />
                                    {uploadedFiles.proofOfAddress && <span> File Uploaded</span>}
                            </li>
                            <li>Selfie with ID
                                <input type="file" onChange={(e) => handleFileChange(e, "selfieWithID")} />
                                    {uploadedFiles.selfieWithID && <span> File Uploaded</span>}
                            </li>
                        </ul>
                        <button className={styles.submitButton} onClick={handleSubmit}>
                            Submit KYC Documents
                        </button>
                    </Accordion.Content>
                </Accordion.Item>
                {/* AML Section */}
                <Accordion.Item value="aml">
                    <Accordion.Header>
                        <Accordion.Trigger className={styles.accordionHeader}>
                            AML Documents
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={styles.accordionContent}>
                        <p><strong>Why required?</strong>Toensure legal source of funds.</p>
                        <ul>
                            <li>Bank Statement
                                <input type="file" onChange={(e) => handleFileChange(e, "bankStatement")} />
                                    {uploadedFiles.bankStatement && <span>File Uploaded</span>}
                            </li>
                            <li>Source of Funds Declaration
                                <input type="file" onChange={(e) => handleFileChange(e, "sourceOfFunds")} />
                                    {uploadedFiles.sourceOfFunds && <span>File Uploaded</span>}
                            </li>
                        </ul>
                        <button className="styles.submitButton" onClick={handleSubmit}>
                            Submit Anti-Money Laundering Documents
                        </button>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
            <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
                <Dialog.Portal>
                    <Dialog.DialogOverlay className="styles.dialogOverlay" />
                    <Dialog.Content className="styles.dialogContent">
                        <Dialog.Title>
                            Submission Successful
                        </Dialog.Title>
                        <Dialog.DialogDescription className="styles.dialogDescription">
                            Your documents have been submitted Successfully
                        </Dialog.DialogDescription>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)}> 
                            OK 
                        </button>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}

export default Compliance