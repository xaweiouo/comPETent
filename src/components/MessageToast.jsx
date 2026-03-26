import { useSelector } from "react-redux";

function MessageToast() {
  const messages = useSelector(state => state.message);
  return (
    <>
      <div className="toast-container position-fixed top-0 end-0 p-3">
        {messages.map(message => (
          <div key={message.id} className="toast show bg-white" role="alert" aria-live="assertive" aria-atomic="true">
            <div className={`toast-header text-white bg-${message.type}`}>
              <strong className="me-auto">{message.title}</strong>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </>
  )
};
export default MessageToast;