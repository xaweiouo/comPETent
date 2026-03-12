import * as bootstrap from 'bootstrap';
import { useRef, useEffect } from 'react';

function PetDetailModal({ pet }) {
  const petModalRef = useRef(null);
  const newPetModalRef = useRef(null);

  useEffect(() => {
    if (petModalRef.current) {
      newPetModalRef.current = new bootstrap.Modal(petModalRef.current);
    }

    // 定義處理函式：當 Modal 開始隱藏時移除焦點
    const handleHide = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };
    petModalRef.current.addEventListener('hide.bs.modal', handleHide);

    //  清除機制 (Cleanup)：元件卸載時移除監聽器
    return () => {
      petModalRef.current?.removeEventListener('hide.bs.modal', handleHide);
    };
  }, []);

  useEffect(() => {
    if (pet) {
      newPetModalRef.current?.show();
    } else {
      newPetModalRef.current?.hide();
    }
  }, [pet]); // 監聽 pet 的變化

  return (
    <>
      <div
        className="modal fade"
        ref={petModalRef}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">編輯資料 (useRef 模式)</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form id="editForm">
                <div className="mb-3">
                  <label className="form-label">姓名</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pet?.name || ''}
                  // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                  // onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
              <button
                type="button"
                className="btn btn-primary"
              // onClick={() => onSave(formData)}
              >
                儲存更新
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};
export default PetDetailModal;