import React from 'react';

function Modal({ type, onClose, onConfirm }) {
  return (
    <div id="confirmation-modal" className="modal">
      <div className="modal-content">
        {type === 'deleteAll' && <p className='deletealltext'>Are you sure you want to delete all tasks?</p>}
        <button className="confirm-btn" onClick={onConfirm}>Yes</button>
        <button className="cancel-btn" onClick={onClose}>No</button>
      </div>
    </div>
  );
}

export default Modal;
