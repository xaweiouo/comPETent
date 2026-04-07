import { useNavigate } from "react-router";
import { FavoriteButton } from "../utils/FavoriteButton";
import { starRating } from "../utils/starRating";

function ServiceCard({card,id,isAuthenticated,user,locationIcon,formatPrice}) {
  const navigate=useNavigate();
  return (
    <>
      <div
        key={card?.serviceId}
        className="col-12 mb-4"
      >
        <div className="card border-0 shadow-sm rounded-3 px-3 py-3 sitter-card h-100">
          <div className="row g-3 align-items-center">
            <div className="col-md-3 d-flex justify-content-center">
              <div className="sitter-card-img-wrapper rounded-3 overflow-hidden">
                <img
                  src={card?.sitterAvatar || card?.imageUrl}
                  className="sitter-card-img"
                  alt="保姆"
                />
              </div>
            </div>

            <div className="col-md-9 d-flex">
              <div className="card-body p-0 d-flex flex-column justify-content-between w-100">
                <div>
                  <div className="card-header-row d-flex justify-content-between align-items-start mb-3">
                    {/* <!-- 左邊 sitterName + 星等，右邊愛心 icon --> */}
                    <div className="d-flex flex-column align-items-start">
                      <h4 className="card-title mb-1 me-2">
                        {card?.sitterName}
                      </h4>
                      {/* 星星＋分數 */}

                      {card?.rating != null && (
                        <span className="text-warning small">
                          {starRating(card.rating)}
                          <span className="text-muted">
                            ({card.rating.toFixed(1)})
                          </span>
                        </span>
                      )}
                    </div>
                    <FavoriteButton
                      serviceId={card?.serviceId}
                      sitterId={card?.sitter_id}
                      ownerId={id}
                      isFavorite={card?.isFavorite}
                      isAuthenticated={isAuthenticated}
                      user={user}
                      onToggleDone={() => {
                        setFavList(prev => prev.filter(item => item.sitter_id !== card.sitter_id))
                      }
                        //   (willFavorite) => {
                        //   // 更新當前頁面的 cards
                        //   setCards((prev) =>
                        //     prev.map((c) =>
                        //       c.serviceId === card.serviceId
                        //         ? { ...c, isFavorite: willFavorite }
                        //         : c
                        //     )
                        //   );
                        //   // 同步更新整包 allCards（避免換頁後收藏狀態跑掉）
                        //   setAllCards((prev) =>
                        //     prev.map((c) =>
                        //       c.serviceId === card.serviceId
                        //         ? { ...c, isFavorite: willFavorite }
                        //         : c
                        //     )
                        //   );
                        // }
                      }
                    />

                  </div>

                  {/* 服務寵物 + 地區 */}
                  <div className="card-meta-row d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="card-label-title">服務寵物</span>
                      <span className="border text-black badge rounded-pill card-chip">
                        {card?.species}
                      </span>
                    </div>
                    <div className="d-flex align-items-center text-muted small gap-1">
                      <img
                        src={locationIcon}
                        alt="location"
                        width="16"
                        height="16"
                      />
                      <span>{card?.location.city}</span>
                      <span>{card?.location.district}</span>
                    </div>
                  </div>

                  {/* 服務項目 + 距離 */}
                  <div className="card-service-row d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="card-label-title">服務項目</span>
                      <span className="border text-black badge rounded-pill card-chip">
                        {card?.category}
                      </span>
                    </div>
                    <p className="mb-0 text-muted small">距離 1km</p>
                  </div>

                  <div className="card-description-row mb-3">
                    {card?.description}
                  </div>
                </div>

                <div className="card-footer-row d-flex flex-wrap justify-content-between align-items-center pt-2">
                  <p className="mb-2 mb-md-0 fw-bold">{formatPrice(card)}</p>
                  <div>
                    <button className="btn btn-outline-secondary btn-sm me-2 rounded-pill"
                      onClick={() => {
                        // card.serviceId 就是 services.id
                        navigate(`/lookforpetsitter/${card?.serviceId}`);
                      }}
                    >
                      詳情
                    </button>

                    {/* {card.isBooking ? (
                                    <button className="btn btn-outline-primary btn-sm rounded-pill"
                                      onClick={() => {
                                        navigate(`/owner/bookings/${card.bookings.id}`);
                                      }}>
                                      已預約，看訂單
                                    </button>
                                  ) : (
                                    <button className="btn btn-outline-primary btn-sm rounded-pill"
                                      onClick={() => {
                                        navigate(`/lookforpetsitter/${card.serviceId}/booking`, {
                                          state: {
                                            serviceId: card.serviceId,
                                            sitterId: card.sitterId,
                                          },
                                        });
                                      }}>
                                      預約
                                    </button>
                                  )} */}
                  </div>
                </div>

                {/* <p className="card-text mt-2 mb-0">
                            <small className="text-body-secondary">
                              Last updated 3 mins ago
                            </small>
                          </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};
export default ServiceCard;