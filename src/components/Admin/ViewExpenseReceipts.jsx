import React from "react";
import { Button, Modal } from "react-bootstrap";

const ViewExpenseReceipts = ({
  showReceiptModal,
  setShowReceiptModal,
  // expenseReceiptImages,
  refundDetails,
}) => {
  console.log(refundDetails);
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
          <div className="row px-5">
            <table className="table ">
              <thead className="custom-table-head">
                <tr>
                  <th scope="col" className="appHead">
                    S.no
                  </th>
                  <th scope="col" className="appHead">
                    Item
                  </th>
                  <th scope="col" className="appHead">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="allApp-scroll px-3">
                {refundDetails?.items?.map((items, index) => (
                  <tr key={index} className="custom-table-body">
                    <td>{index + 1}</td>
                    <td>{items?.item}</td>
                    <td>{items?.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {refundDetails?.receipt?.map((receipt, index) => (
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
