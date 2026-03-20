//CancelBookingModal.jsx
function CancelBookingModal({ cancelReason, onReasonChange, onConfirm }) {
  return (
    <div
      className="modal fade"
      id="cancelBookingModal"
      tabIndex="-1"
      aria-labelledby="cancelBookingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="cancelBookingModalLabel">
              取消訂單
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <textarea
              className="form-control"
              placeholder="請輸入取消原因"
              value={cancelReason}
              onChange={(e) => onReasonChange(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={onConfirm}
            >
              確認取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelBookingModal;
