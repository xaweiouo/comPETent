// import { useRef,useEffect } from "react";
// import * as bootstrap from 'bootstrap';
// import PetDetailModal from "./PetDetailModal";

function PetCard({ pet, divClassName, cardClassName ,cardOnClick}) {

  return (
    <>
      {/* <PetDetailModal cardRef={cardRef}/> */}
      <div className={divClassName} onClick={cardOnClick}>
        <div
          // key={pet.id}
          className={
            cardClassName
          }
          style={{ width: "100%",  cursor: "pointer" }}  // 固定寬度，確保三張排進這個區塊
        // onClick={() => {
        //   setSelectedPetId(pet.id);
        //   setBookingForm((prev) => ({
        //     ...prev,
        //     pet_id: pet.id,
        //   }));
        // }}
        >
          <div className="row g-0">
            {/* 左側圖片 */}
            <div className="col-5 d-flex align-items-center pe-0 me-0">
              <img
                src={pet.photo_url || "src/images/booking_img_logo.jpg"}
                className="img-fluid rounded-4 py-2 ps-2 pe-0 me-0"
                alt={pet.name}
                style={{ height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* 右側資訊 */}
            <div className="col-7 ps-0 ms-0">
              <div className="card-body ms-1">
                <h5 className="card-title fw-bold mb-2" style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis'
                }}>{pet.name}</h5>

                <p className="card-text mb-1">
                  <span className="badge bg-warning text-dark me-2">年齡</span>
                  <span>
                    {pet.birth_date
                      ? `${new Date().getFullYear() - new Date(pet.birth_date).getFullYear()} 歲`
                      : "未填"}
                  </span>
                </p>
                <p className="card-text mb-1">
                  <span className="badge bg-warning text-dark me-2">性別</span>
                  <span>
                    {pet.gender === "male"
                      ? "公"
                      : pet.gender === "female"
                        ? "母"
                        : "未知"}
                  </span>
                </p>
                <p className="card-text mb-1">
                  <span className="badge bg-warning text-dark me-2">體型</span>
                  <span>
                    {pet.size === "small"
                      ? "小型"
                      : pet.size === "medium"
                        ? "中型"
                        : pet.size === "large"
                          ? "大型"
                          : "未填"}
                  </span>
                </p>

                <p className="card-text mt-2 mb-0">
                  {pet.is_neutered ? "已結紮，有施打疫苗" : "未結紮，疫苗請洽飼主"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};
export default PetCard;