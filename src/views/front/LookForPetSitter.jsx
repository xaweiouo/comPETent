//基本板型與完整功能差收藏
// LookForPetSitter.jsx
import React from "react";
// import { supabase } from "./createClient";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import feetIcon from "../../images/icons/feet_icon.png";
import locationIcon from "../../images/icons/location_icon.png";
import calendarIcon from "../../images/icons/calendar_icon.png";
import workIcon from "../../images/icons/work_icon.png";
import radarIcon from "../../images/icons/radar_icon.png";
import { starRating } from "../../utils/starRating";


// {starRating(detail.rating)}

// export { supabase };

function LookForPetSitter() {
  const [filters, setFilters] = useState({
    category: "",
    species: "",
    city: "",
    district: "",
    date: "",
    // startTime: "",
    // endTime: "",
    sortBy: "",
  });

  const [cards, setCards] = useState([
    {
      serviceId: 1,
      sitterName: "阿倫",
      rating: 5,
      isFavorite: false,
      category: "陪伴散步",
      species: "dog",
      city: "台中市",
      district: "中區",
      distanceKm: 1,
      description: "陪伴散步，會隨時注意狗狗的狀況與安全！",
      pricePer30min: 200,
      pricePerDay: null,
      pricePerSession: null,
      imageUrl: "...",
    },
  ]);

  const speciesLabelMap = {
    dog: "狗",
    cat: "貓",
    bird: "鳥",
    fish: "魚",
    rabbit: "兔",
    rodent: "鼠類",
    reptiles: "爬蟲類",
    others: "其他",
  };



  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const padTime = (value) =>
    value === "" ? "" : value.toString().padStart(2, "0");

  const getStartTime = () =>
    startHour && startMinute ? `${padTime(startHour)}:${padTime(startMinute)}` : "";

  const getEndTime = () =>
    endHour && endMinute ? `${padTime(endHour)}:${padTime(endMinute)}` : "";


  const hours = Array.from({ length: 24 }, (_, i) => i); // [0, 1, ..., 23]

  const PAGE_SIZE = 3; // 先固定 3 筆一頁

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // 之後可以拿來顯示「共幾筆 / 共幾頁」

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pageNumbers.push(i);
  }



  const getDowFromDate = (dateStr) => {
    if (!dateStr) return '';

    const date = new Date(dateStr); // 例如 '2026-03-01'
    const jsDay = date.getDay();    // 0 ~ 6，0 = Sunday

    const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    return map[jsDay] || '';
  };

  // 點擊搜尋按鈕，將 filters 套進 Supabase 查詢
  async function fetchServicesWithFilters(overrideSortBy, page = 1) {
    const sortBy = overrideSortBy ?? filters.sortBy;

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // 1) 撈 favorites 的那段可以先跳過（你剛說還沒做登入，就先不加）

    let query = supabase
      .from("services")
      .select(
        `
      id,
      sitter_id,
      category,
      species,
      description,
      rating,
      price_per_30min,
      price_per_day,
      price_per_session,
      photo_url,
      users!inner (
        name,
        good_citizen_status
      ),
      loc:locations!inner (
        city,
        district
      )
    `,
        { count: "exact" } // 順便拿到總筆數
      )
      .eq("users.good_citizen_status", "approved");

    // 日期 → 轉成 day_of_week
    const dow = getDowFromDate(filters.date);
    console.log("dow from date", filters.date, "=>", dow);

    if (dow) {
      query = query.eq("day_of_week", dow);
    }

    // 由 startHour/startMinute/endHour/endMinute 推導出時間字串
    const startTime = getStartTime();
    const endTime = getEndTime();

    // 時間重疊：service_start < userEnd 且 service_end > userStart
    if (startTime && endTime) {
      query = query.lt("start_time", endTime).gt("end_time", startTime);
    }

    if (filters.category) query = query.eq("category", filters.category);
    if (filters.species) query = query.eq("species", filters.species);

    if (filters.city) {
      query = query.eq("loc.city", filters.city).not("loc.city", "is", null);
    }

    if (filters.district) {
      query = query.eq("loc.district", filters.district);
    }

    if (sortBy === "rating") {
      console.log("ordering by rating desc");
      query = query.order("rating", { ascending: false });
    } else {
      console.log("ordering by id asc");
      query = query.order("id", { ascending: true });
    }

    // 分頁範圍：from ~ to
    query = query.range(from, to);

    // 一起解構 count
    const { data, error, count } = await query;

    if (error) {
      console.log("fetchServicesWithFilters error", error);
      return;
    }
    if (!data) {
      setCards([]);
      setTotalCount(0);
      return;
    }

    console.log("raw data from supabase", data);

    // 更新 totalCount
    setTotalCount(count ?? 0);

    const mapped = data.map((row) => ({
      serviceId: row.id,
      sitterName: row.users.name,
      rating: row.rating,
      isFavorite: false,
      category: row.category,
      species: row.species,
      city: row.loc?.city ?? "",
      district: row.loc?.district ?? "",
      distanceKm: null,
      description: row.description,
      pricePer30min: row.price_per_30min,
      pricePerDay: row.price_per_day,
      pricePerSession: row.price_per_session,
      imageUrl: row.photo_url,
    }));

    setCards(mapped);
    console.log("services with filters", mapped);
  }




  // 監聽 filters，專門用來 debug
  useEffect(() => {
    console.log("filters changed", filters.startTime, filters.endTime);
  }, [filters.startTime, filters.endTime]);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchServicesWithFilters(undefined, 1);//初次載入用第 1 頁
  }, []);







  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchServicesWithFilters(undefined, 1);
    // 如果目前排序選項是「價格」，搜尋完就重新依價格排序一次

    if (filters.sortBy === "price") {
      sortCardsByPrice();
    }
    // 如果是 rating，就交給 fetchServicesWithFilters 裡的 .order('rating')

  };

  const sortCardsByPrice = () => {
    setCards(prev => {
      const sorted = [...prev].sort((a, b) => {
        const priceA =
          a.pricePer30min ?? a.pricePerDay ?? a.pricePerSession ?? 0;
        const priceB =
          b.pricePer30min ?? b.pricePerDay ?? b.pricePerSession ?? 0;
        return priceA - priceB; // 低到高
      });
      return sorted;
    });
  };

  //把價錢三元運算子抽成一個小函式
  const formatPrice = (card) => {
    if (card.pricePer30min != null) return `NT$ ${card.pricePer30min} / 30分鐘`;
    if (card.pricePerDay != null) return `NT$ ${card.pricePerDay} / 天`;
    if (card.pricePerSession != null) return `NT$ ${card.pricePerSession} / 次`;
    return "";
  };

  //卡片的愛心 icon 先用 local toggle 就好（還不串 favorites 表）
  const toggleFavorite = (serviceId) => {
    setCards((prev) =>
      prev.map((card) =>
        card.serviceId === serviceId
          ? { ...card, isFavorite: !card.isFavorite }
          : card
      )
    );
  };

  return (
    <>
      {/* 搜尋列 */}
      <section className="lookfor-filter-group py-5">
        <div className="container">
          <h2 className="text-center fw-bold text-primary mb-5">我想尋找</h2>

          <div className="row g-3 align-items-end">
            {/* 服務類別 */}
            <div className="col-12 col-md-3">
              <label htmlFor="serviceType" className="form-label mb-2">
                服務類別
              </label>
              <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                <span className="input-group-text border-0 bg-transparent">
                  <img
                    src={workIcon}
                    alt="notes"
                    width="20"
                    height="20"
                    className="me-2"
                  />
                </span>
                <select
                  className="form-select border-0 bg-transparent"
                  id="serviceType"
                  aria-label="服務類別"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="">服務</option>
                  <option value="陪伴散步">陪伴散步</option>
                  <option value="寵物安親">寵物安親</option>
                  <option value="洗澡美容">洗澡美容</option>
                  <option value="到府照顧">到府照顧</option>
                  <option value="寄宿">寄宿</option>
                  <option value="訓練">訓練</option>
                </select>
              </div>
            </div>

            {/* 寵物類別 */}
            <div className="col-12 col-md-3">
              <label htmlFor="petType" className="form-label mb-2">
                寵物類別
              </label>
              <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                <span className="input-group-text border-0 bg-transparent">
                  <img
                    src={feetIcon}
                    className="me-2"
                    alt=""
                    width="20"
                    height="20"
                  />
                </span>
                <select
                  className="form-select border-0 bg-transparent"
                  id="petType"
                  aria-label="寵物類別"
                  value={filters.species}
                  onChange={(e) => handleFilterChange("species", e.target.value)}
                >
                  <option value="">寵物</option>
                  <option value="dog">狗</option>
                  <option value="cat">貓</option>
                  <option value="bird">鳥</option>
                  <option value="fish">魚</option>
                  <option value="rabbit">兔</option>
                  <option value="rodent">鼠類</option>
                  <option value="reptiles">爬蟲類</option>
                  <option value="others">其他</option>

                </select>
              </div>
            </div>

            {/* 服務地區：縣市 */}
            <div className="col-12 col-md-3">
              <label htmlFor="city" className="form-label mb-2">
                服務地區
              </label>
              <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                <span className="input-group-text border-0 bg-transparent">
                  <img
                    src={locationIcon}
                    alt="location"
                    width="20"
                    height="20"
                    className="me-2"
                  />
                </span>
                <select
                  className="form-select border-0 bg-transparent"
                  id="city"
                  aria-label="服務縣市"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                >
                  <option value="">縣市</option>
                  <option value="臺北市">臺北市</option>
                  <option value="新北市">新北市</option>
                  <option value="臺中市">臺中市</option>
                  <option value="高雄市">高雄市</option>
                  <option value="苗栗市">苗栗市</option>
                  <option value="臺南市">臺南市</option>
                </select>
              </div>
            </div>

            {/* 服務地區：地區 */}
            <div className="col-12 col-md-3">
              <label htmlFor="district" className="form-label mb-2">
                服務地區
              </label>
              <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                <span className="input-group-text border-0 bg-transparent">
                  {/* 地區 icon */}
                </span>
                <select
                  className="form-select border-0 bg-transparent"
                  id="district"
                  aria-label="服務地區"
                  value={filters.district}
                  onChange={(e) => handleFilterChange("district", e.target.value)}
                >
                  <option value="">地區</option>
                  <option value="中山區">中山區</option>
                  <option value="信義區">信義區</option>
                  <option value="西區">西區</option>
                  <option value="萬華區">萬華區</option>
                  <option value="西屯區">西屯區</option>
                </select>
              </div>
            </div>

            {/* 服務時間：日期 */}
            <div className="col-12 col-md-3">
              <label htmlFor="serviceDate" className="form-label mb-2">
                服務時間
              </label>
              <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                <span className="input-group-text border-0 bg-transparent">
                  <img
                    src={calendarIcon}
                    alt="date"
                    width="20"
                    height="20"
                  />
                </span>
                <input
                  type="date"
                  id="serviceDate"
                  className="form-control border-0 bg-transparent"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>

            {/* 開始時間：時分 */}
            <div className="col-12 col-md-3">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label mb-2">時</label>
                  <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                    <select
                      className="form-select border-0 bg-transparent"
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                    >
                      <option value="">00</option>
                      {hours.map((h) => (
                        <option key={h} value={h.toString().padStart(2, "0")}>
                          {h.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label mb-2">分</label>
                  <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                    <select
                      className="form-select border-0 bg-transparent"
                      value={startMinute}
                      onChange={(e) => setStartMinute(e.target.value)}
                    >
                      <option value="">00</option>
                      <option value="00">00</option>
                      <option value="30">30</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 結束時間：時分 */}
            <div className="col-12 col-md-3">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label mb-2">時</label>
                  <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                    <select
                      className="form-select border-0 bg-transparent"
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                    >
                      <option value="">00</option>
                      {hours.map((h) => (
                        <option key={h} value={h.toString().padStart(2, "0")}>
                          {h.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label mb-2">分</label>
                  <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                    <select
                      className="form-select border-0 bg-transparent"
                      value={endMinute}
                      onChange={(e) => setEndMinute(e.target.value)}
                    >
                      <option value="">00</option>
                      <option value="00">00</option>
                      <option value="30">30</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 搜尋按鈕 */}
            <div className="col-12 col-md-3 d-flex justify-content-md-end mt-3 mt-md-0">
              <button
                type="button"
                onClick={handleSearch}
                className="btn btn-gradint-primary w-100 rounded-pill py-2"
              >
                搜尋
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 保姆卡片 */}
      <section className="lookfor-sitter-list py-4">
        <div className="container">
          <div className="text-center mb-3">
            <img
              src={radarIcon}
              alt="notes"
              width="32"
              height="32"
              className="me-2 mb-3"
            />
            <h2 className="text-primary d-inline-block mb-0">附近的保姆</h2>
          </div>

          <div className="row mb-3">
            <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              {/* 左側：總筆數文字 */}
              <small className="text-muted mb-2 mb-md-0">
                共 {totalCount} 位保姆符合條件
              </small>
              <div className="col-12 col-md-2">
                {/* 排序 select */}
                <select
                  id="sortBy"
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange("sortBy", value);
                    setCurrentPage(1);
                    if (value === "price") {
                      sortCardsByPrice();
                    } else {
                      fetchServicesWithFilters(value, 1);
                    }
                  }}
                >
                  <option value="">排序</option>
                  <option value="price">價格（由低到高）</option>
                  <option value="rating">評分（由高到低）</option>
                </select>
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
                    <div className="col-12 col-md-3 d-flex justify-content-center">
                      <div className="sitter-card-img-wrapper rounded-3 overflow-hidden">
                        <img
                          src={card.imageUrl}
                          className="sitter-card-img"
                          alt="保姆"
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-9 d-flex">
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
                            <button
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => toggleFavorite(card.serviceId)}
                            >
                              <i
                                className={
                                  card.isFavorite
                                    ? "bi bi-heart-fill text-danger"
                                    : "bi bi-heart"
                                }
                              />
                            </button>
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
                            <button className="btn btn-outline-secondary btn-sm me-2 rounded-pill">
                              詳情
                            </button>
                            <button className="btn btn-gradint-primary btn-sm rounded-pill">
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
              onClick={async () => {
                if (currentPage === 1) return;
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                await fetchServicesWithFilters(undefined, newPage);
                if (filters.sortBy === "price") {
                  sortCardsByPrice();
                }
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
                onClick={async () => {
                  if (page === currentPage) return;
                  setCurrentPage(page);
                  await fetchServicesWithFilters(undefined, page);
                  if (filters.sortBy === "price") {
                    sortCardsByPrice();
                  }
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
              onClick={async () => {
                if (currentPage === totalPages) return;
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                await fetchServicesWithFilters(undefined, newPage);
                if (filters.sortBy === "price") {
                  sortCardsByPrice();
                }
              }}
              style={{ color: currentPage === totalPages ? "#ccc" : "#ff6600" }}
            >
              <i className="bi bi-chevron-right" style={{ fontSize: "1.4rem" }}></i>
            </button>
          </div>
        </div>
      </section>
    </>
  );

}
export default LookForPetSitter;
