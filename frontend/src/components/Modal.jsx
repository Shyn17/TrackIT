const Modal = ({ title, children, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h5>{title}</h5>
        {children}
        <button className="btn btn-danger mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;