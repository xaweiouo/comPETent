import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router";
import { createAsyncMessage } from "../../slices/messageSlice";
import { starRating } from "../../utils/starRating";
import { FavoriteButton } from "../../utils/FavoriteButton";
import locationIcon from "../../images/icons/location_icon.png";
function FavSitter() {
  const { id, user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [favList, setFavList] = useState(null);
  // const [isBooking, setIsBooking] = useState(false);
  // const [bookingData, setBookingData] = useState({});
  const navigate = useNavigate();

  //把價錢三元運算子抽成一個小函式
  const formatPrice = (card) => {
    if (card.pricePer30min != null) return `NT$ ${card.pricePer30min} / 30分鐘`;
    if (card.pricePerDay != null) return `NT$ ${card.pricePerDay} / 天`;
    if (card.pricePerSession != null) return `NT$ ${card.pricePerSession} / 次`;
    return "";
  };

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }


    const init = async (id) => {
      try {
        // 1. 抓取收藏清單中的所有保母 ID
        const { data: favData, error: favError } = await supabase
          .from('favorites')
          .select('sitter_id')
          .eq('owner_id', id);

        if (favError) throw favError;
        if (!favData || favData.length === 0) {
          setFavList([]);
          setLoading(false);
          return;
        }

        const sitterIds = favData.map(f => f.sitter_id);

        // 2. 根據保母 ID 抓取服務與相關資訊
        const { data, error } = await supabase
          .from('services')
          .select(`
        *,
        sitter:users!services_sitter_id_fkey ( 
          name,
          nickname,
          avatar_url
        ),
        location:locations ( 
          city, 
          district 
        ),bookings (
          id
        )
      `)
          .in('sitter_id', sitterIds) // 使用 .in 篩選
          .eq('bookings.owner_id', id);

        if (error) throw error;

        const formattedData = data.map(item => ({
          ...item,
          serviceId: item.id,
          sitterName: item.sitter?.nickname || item.sitter?.name,
          sitterAvatar: item.sitter?.avatar_url,
          imageUrl: item.photo_url,
          city: item.locations?.city,
          district: item.locations?.district,
          isFavorite: true,
          isBooking: item.bookings && item.bookings.length > 0
        }));

        setFavList(formattedData);
        setLoading(false);
      } catch (error) {
        createAsyncMessage(error);
      }
    };
    init(id);
  }, [isAuthenticated, isAuthLoading, id, navigate]);

  if (!isAuthenticated) {
    return (
      <>
        <p className="text-center">請先登入</p>
        <p className="text-center">3秒後回到首頁</p>
      </>
    )
  } else if (loading) {
    return <div className="d-flex justify-content-center">
      <TailSpin color="var(--bs-primary)" />
    </div>

  };

  return (
    <>
      <h2 className="ms-3 text-primary text-center">我收藏的保母</h2>
      <section id="nearby-sitter-section" className="lookfor-sitter-list py-3">
        <div className="container">

          {/* 載入中提示 */}
          {/* {isLoading && (
            <p className="text-center text-muted mb-3">
              服務載入中，請稍候...
            </p>
          )} */}

          <div className="row mb-3">
            <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              {/* 左側：總筆數文字 */}
              <small className="text-muted mb-2 mb-md-0">
                {/* 共 {totalCount} 位保姆符合條件 */}
              </small>
              <div className="col-md-2">
                {/* 排序 select */}
                {/* <select
                  id="sortBy"
                  className="form-select"
                  value={filters.sortBy}
                  onChange={async (e) => {
                    const value = e.target.value;
                    handleFilterChange("sortBy", value);

                    if (value === "price") {
                      // 價格：不打 API，只對現有 allCards 整包排序，從第 1 頁開始
                      sortCardsByPrice(1);
                    } else if (value === "rating") {
                      // 評分：重新從後端以 rating 排序抓整包
                      await fetchServicesWithFilters("rating");
                      // fetchServicesWithFilters 裡面已經會 setAllCards 和切第一頁
                      setCurrentPage(1);
                    } else {
                      // 無排序：用預設 id 順序
                      await fetchServicesWithFilters("");
                      setCurrentPage(1);
                    }
                  }}
                >
                  <option value="">排序</option>
                  <option value="price">價格（由低到高）</option>
                  <option value="rating">評分（由高到低）</option>
                </select> */}


              </div>
            </div>
          </div>

          {/* 卡片輪播 */}
          <div className="row">
            {favList.map((card) => (
              <div
                key={card.serviceId}
                className="col-12 mb-4"
              >
                <div className="card border-0 shadow-sm rounded-3 px-3 py-3 sitter-card h-100">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-3 d-flex justify-content-center">
                      <div className="sitter-card-img-wrapper rounded-3 overflow-hidden">
                        <img
                          src={card.sitterAvatar || card.imageUrl}
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
                                {card.sitterName}
                              </h4>
                              {/* 星星＋分數 */}

                              {card.rating != null && (
                                <span className="text-warning small">
                                  {starRating(card.rating)}
                                  <span className="text-muted">
                                    ({card.rating.toFixed(1)})
                                  </span>
                                </span>
                              )}
                            </div>
                            <FavoriteButton
                              serviceId={card.serviceId}
                              sitterId={card.sitter_id}
                              ownerId={id}
                              isFavorite={card.isFavorite}
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
                                {card.species}
                              </span>
                            </div>
                            <div className="d-flex align-items-center text-muted small gap-1">
                              <img
                                src={locationIcon}
                                alt="location"
                                width="16"
                                height="16"
                              />
                              <span>{card.location.city}</span>
                              <span>{card.location.district}</span>
                            </div>
                          </div>

                          {/* 服務項目 + 距離 */}
                          <div className="card-service-row d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <span className="card-label-title">服務項目</span>
                              <span className="border text-black badge rounded-pill card-chip">
                                {card.category}
                              </span>
                            </div>
                            <p className="mb-0 text-muted small">距離 1km</p>
                          </div>

                          <div className="card-description-row mb-3">
                            {card.description}
                          </div>
                        </div>

                        <div className="card-footer-row d-flex flex-wrap justify-content-between align-items-center pt-2">
                          <p className="mb-2 mb-md-0 fw-bold">{formatPrice(card)}</p>
                          <div>
                            <button className="btn btn-outline-secondary btn-sm me-2 rounded-pill"
                              onClick={() => {
                                // card.serviceId 就是 services.id
                                navigate(`/lookforpetsitter/${card.serviceId}`);
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
            ))}
          </div>
        </div>
      </section>
    </>
  )
};
export default FavSitter;