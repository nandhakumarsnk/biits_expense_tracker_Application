import React from "react";
import { Button, Modal } from "react-bootstrap";

const ViewExpenseReceipts = ({
  showReceiptModal,
  setShowReceiptModal,
  expenseReceiptImages,
}) => {
  return (
    <Modal
      show={showReceiptModal}
      onHide={() => {
        setShowReceiptModal(false);
      }}
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title className="">Expenses Receipts</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {expenseReceiptImages?.map((receipt, index) => (
            <div key={index}>
              <p>{receipt}</p>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowReceiptModal(false);
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewExpenseReceipts;
