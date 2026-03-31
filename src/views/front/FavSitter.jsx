import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router";
function FavSitter() {
  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 有登入而且有 email 才去查 users.id
    const init = async () => {
      //又是可選鏈 
      //如果 user 是 null 或 undefined，整個 user?.email 直接變成 undefined，不會因為去讀 user.email 而噴錯
      // 如果還沒登入，或是雖然說登入了但 user 上沒有 email，就不要去查 users.id，直接當作 ownerId 無效，避免不必要的查詢和錯誤
      if (!isAuthenticated || !user?.email) {
        setOwnerId(null);
        return;
      }

      const { data: userRow, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (userError || !userRow) {
        dispatch(createAsyncMessage(userError));
        setOwnerId(null);
        return;
      }

      setOwnerId(userRow.id); // favorites.owner_id 要用的 int
    };

    init();


    // const fetchInitialData = async () => {
    //   try {
    //     // 從 users 出發
    //     const { data, error } = await supabase
    //       .from('users')
    //       .select()
    //       .eq('email', user.email)
    //       .maybeSingle();

    //     if (error) throw error;

    //     if (data) {
    //       // 拆分資料存入不同的 State
    //       // setOwnerProfile(data);
    //       setOwnerPets(data.pets || []);
    //       setOwnerBooking(data.bookings || []);
    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     dispatch(createAsyncMessage(error));
    //   }
    // };
    // // 登入後，只在初始化時跑這一次
    // fetchInitialData();

  }, [isAuthenticated, isAuthLoading, user, navigate, dispatch]);

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
      <h2 className="ms-3 text-primary text-center mb-6" >我收藏的保母</h2>
      <section id="nearby-sitter-section" className="lookfor-sitter-list py-4">
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
            {cards.map((card) => (
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
                                  {/* {"★".repeat(Math.round(card.rating))}{" "} */}
                                  {starRating(card.rating)}
                                  <span className="text-muted">
                                    ({card.rating.toFixed(1)})
                                  </span>
                                </span>
                              )}
                            </div>
                            <FavoriteButton
                              serviceId={card.serviceId}
                              sitterId={card.sitterId}
                              ownerId={ownerId}
                              isFavorite={card.isFavorite}
                              isAuthenticated={isAuthenticated}
                              user={user}
                              onToggleDone={(willFavorite) => {
                                // 更新當前頁面的 cards
                                setCards((prev) =>
                                  prev.map((c) =>
                                    c.serviceId === card.serviceId
                                      ? { ...c, isFavorite: willFavorite }
                                      : c
                                  )
                                );
                                // 同步更新整包 allCards（避免換頁後收藏狀態跑掉）
                                setAllCards((prev) =>
                                  prev.map((c) =>
                                    c.serviceId === card.serviceId
                                      ? { ...c, isFavorite: willFavorite }
                                      : c
                                  )
                                );
                              }}
                            />

                          </div>

                          {/* 服務寵物 + 地區 */}
                          <div className="card-meta-row d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className="card-label-title">服務寵物</span>
                              <span className="border text-black badge rounded-pill card-chip">
                                {speciesLabelMap[card.species] ?? card.species}
                              </span>
                            </div>
                            <div className="d-flex align-items-center text-muted small gap-1">
                              <img
                                src={locationIcon}
                                alt="location"
                                width="16"
                                height="16"
                              />
                              <span>{card.city}</span>
                              <span>{card.district}</span>
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
                            <button className="btn btn-gradint-primary btn-sm rounded-pill"
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





          {/* 分頁按鈕 */}
          <div className="d-flex justify-content-center align-items-center my-4">
            {/* 左箭頭 */}
            <button
              type="button"
              className="btn btn-link p-0 me-3"
              disabled={currentPage === 1}
              onClick={() => {
                if (currentPage === 1) return;
                const newPage = currentPage - 1;
                goToPage(newPage);
              }}
              style={{ color: currentPage === 1 ? "#ccc" : "#ff6600" }}
            >
              <i className="bi bi-chevron-left" style={{ fontSize: "1.4rem" }}></i>
            </button>

            {/* 中間頁碼 */}
            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                className="btn mx-1"
                onClick={() => {
                  if (page === currentPage) return;
                  goToPage(page);
                }}
                style={{
                  borderRadius: "999px",
                  minWidth: "36px",
                  height: "36px",
                  padding: 0,
                  lineHeight: "36px",
                  fontWeight: page === currentPage ? "600" : "400",
                  backgroundColor:
                    page === currentPage ? "#ff6600" : "transparent",
                  color: page === currentPage ? "#fff" : "#333",
                  border: "none",
                }}
              >
                {page}
              </button>
            ))}

            {/* 右箭頭 */}
            <button
              type="button"
              className="btn btn-link p-0 ms-3"
              disabled={currentPage === totalPages}
              onClick={() => {
                if (currentPage === totalPages) return;
                const newPage = currentPage + 1;
                goToPage(newPage);
              }}
              style={{ color: currentPage === totalPages ? "#ccc" : "#ff6600" }}
            >
              <i className="bi bi-chevron-right" style={{ fontSize: "1.4rem" }}></i>
            </button>
          </div>
        </div>
      </section>
    </>
  )
};
export default FavSitter;