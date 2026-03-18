function MessageToast() {
  return (
    <>
      <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
            <strong className="me-auto">Bootstrap</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div className="toast-body">
          Hello, world! This is a toast message.
        </div>
      </div>
    </>
  )
};
export default MessageToast;