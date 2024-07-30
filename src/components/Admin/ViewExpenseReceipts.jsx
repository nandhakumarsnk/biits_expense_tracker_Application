// import React from "react";
// import { Button, Modal } from "react-bootstrap";
// import ModalImage from "react-modal-image";

// const imgUrl = process.env.NEXT_PUBLIC_EMPLOYEE_RECEIPT_IMAGE;

// const ViewExpenseReceipts = ({
//   showReceiptModal,
//   setShowReceiptModal,
//   // expenseReceiptImages,
//   refundDetails,
// }) => {
//   console.log(refundDetails);
//   return (
//     <Modal
//       show={showReceiptModal}
//       onHide={() => {
//         setShowReceiptModal(false);
//       }}
//       centered
//       size="lg"
//       backdrop="static"
//     >
//       <Modal.Header>
//         <Modal.Title className="refund-heading">Expenses Receipts</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div>
//           <div className="row px-5">
//             <table className="table ">
//               <thead className="custom-table-head">
//                 <tr>
//                   <th scope="col" className="appHead">
//                     S.no
//                   </th>
//                   <th scope="col" className="appHead">
//                     Item
//                   </th>
//                   <th scope="col" className="appHead">
//                     Amount
//                   </th>
//                   <th scope="col" className="appHead">
//                     Amount in INR
//                   </th>
//                   <th scope="col" className="appHead">
//                     Description
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="allApp-scroll px-3">
//                 {refundDetails?.items?.map((items, index) => (
//                   <tr key={index} className="custom-table-body">
//                     <td>{index + 1}</td>
//                     <td>
//                       {items?.item_category}-{items?.item_subcategory}
//                     </td>
//                     <td>{items?.amount}</td>
//                     <td>{items?.amount_in_INR}</td>
//                     <td>{items?.description}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="row px-5">
//             <div className="d-flex flex-wrap">
//               {refundDetails?.items?.map((item, itemIndex) =>
//                 item.attachments.map((attachment, attachmentIndex) => (
//                   <div
//                     key={`${itemIndex}-${attachmentIndex}`}
//                     className="p-2"
//                     style={{ width: "100px", height: "auto" }}
//                   >
//                     <ModalImage
//                       small={`${imgUrl}${attachment}`}
//                       large={`${imgUrl}${attachment}`}
//                       alt={`Receipt ${attachmentIndex + 1}`}
//                       hideDownload={true}
//                       hideZoom={true}
//                     />
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button
//           className="cancel-btn"
//           onClick={() => {
//             setShowReceiptModal(false);
//           }}
//         >
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ViewExpenseReceipts;

import React from "react";
import { Button, Modal } from "react-bootstrap";
import { DocumentViewer } from "react-documents";
import ModalImage from "react-modal-image";

const imgUrl = process.env.NEXT_PUBLIC_EMPLOYEE_RECEIPT_IMAGE;

const isImage = (filename) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const extension = filename.split(".").pop().toLowerCase();
  return imageExtensions.includes(extension);
};

const isPdf = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  return extension === "pdf";
};

const AttachmentViewer = ({ attachment }) => {
  if (isImage(attachment)) {
    return (
      <ModalImage
        small={`${imgUrl}${attachment}`}
        large={`${imgUrl}${attachment}`}
        alt={`Receipt`}
        hideDownload={true}
        hideZoom={true}
      />
    );
  } else if (isPdf(attachment)) {
    return (
      <DocumentViewer
        queryParams="hl=Nl"
        url={`${imgUrl}${attachment}`}
        style={{ width: "100%", height: "100px" }}
        overrideLocalhost="https://react-doc-viewer.firebaseapp.com/"
      />
    );
  }
  return null;
};

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
        <Modal.Title className="refund-heading">Expenses Receipts</Modal.Title>
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
                  <th scope="col" className="appHead">
                    Amount in INR
                  </th>
                  <th scope="col" className="appHead">
                    Description
                  </th>
                </tr>
              </thead>

              <tbody className="allApp-scroll px-3">
                {refundDetails?.items?.map((items, index) => (
                  <tr key={index} className="custom-table-body">
                    <td>{index + 1}</td>
                    <td>
                      {items?.item_category}-{items?.item_subcategory}
                    </td>
                    <td>{items?.amount}</td>
                    <td>{items?.amount_in_INR}</td>
                    <td>{items?.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row px-5">
            <div className="d-flex flex-wrap">
              {refundDetails?.items?.map((item, itemIndex) =>
                item.attachments.map((attachment, attachmentIndex) => (
                  <div
                    key={`${itemIndex}-${attachmentIndex}`}
                    className="p-2"
                    style={{ width: "100px", height: "auto" }}
                  >
                    {/* <ModalImage
                      small={`${imgUrl}${attachment}`}
                      large={`${imgUrl}${attachment}`}
                      alt={`Receipt ${attachmentIndex + 1}`}
                      hideDownload={true}
                      hideZoom={true}
                    /> */}
                    <AttachmentViewer attachment={attachment} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="cancel-btn"
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
