//基本板型與完整功能差收藏
// LookForPetSitter.jsx
import React from "react";
// import { supabase } from "./createClient";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import feetIcon from "../../images/icons/feet_icon.png";
import locationIcon from "../../images/icons/location_icon.png";
import calendarIcon from "../../images/icons/calendar_icon.png";
import workIcon from "../../images/icons/work_icon.png";
import radarIcon from "../../images/icons/radar_icon.png";
import { starRating } from "../../utils/starRating";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FavoriteButton } from "../../utils/FavoriteButton";
import { createAsyncMessage } from "../../slices/messageSlice";

// export { supabase };

function LookForPetSitter() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [ownerId, setOwnerId] = useState(null);

  const PAGE_SIZE = 3; // 先固定 3 筆一頁

  const initialFilters = {
    category: "",
    species: "",
    city: "",
    district: "",
    date: "",
    sortBy: "",
  };


  const [filters, setFilters] = useState(initialFilters);

  const [allCards, setAllCards] = useState([]);
  const [locations, setLocations] = useState([]);          // 全部縣市+區
  const [cityOptions, setCityOptions] = useState([]);      // 唯一縣市列表
  const [districtOptions, setDistrictOptions] = useState([]); // 依縣市篩出的區
  // const [allCards, setAllCards] = useState([
  //   {
  //     serviceId: 1,
  //     sitterName: "阿倫",
  //     rating: 5,
  //     isFavorite: false,
  //     category: "陪伴散步",
  //     species: "dog",
  //     city: "台中市",
  //     district: "中區",
  //     distanceKm: 1,
  //     description: "陪伴散步，會隨時注意狗狗的狀況與安全！",
  //     pricePer30min: 200,
  //     pricePerDay: null,
  //     pricePerSession: null,
  //     imageUrl: "...",
  //   },
  // ]);
  const [cards, setCards] = useState(allCards.slice(0, PAGE_SIZE));


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
    // 服務地區：縣市改變時，重算該市的地區列表並清空已選 district
    if (key === "city") {
      const districts = locations
        .filter((loc) => loc.city === value)
        .map((loc) => loc.district);

      setDistrictOptions(districts);

      setFilters((prev) => ({
        ...prev,
        city: value,
        district: "", // 換縣市時清空地區
      }));
      setCurrentPage(1);
      return;
    }

    // 服務地區：地區改變
    if (key === "district") {
      setFilters((prev) => ({
        ...prev,
        district: value,
      }));
      setCurrentPage(1);
      return;
    }

    // 其他一般欄位
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

  // 未登入：跳登入提醒。
  // 已登入：會真正查 favorites，把有收藏的 sitter 卡片變成實心愛心。

  async function fetchServicesWithFilters(overrideSortBy, overrideFilters) {
    setIsLoading(true);

    const sortBy = overrideSortBy ?? filters.sortBy;
    const effectiveFilters = overrideFilters ?? filters;

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
        nickname,
        good_citizen_status,
        avatar_url
      ),
      loc:locations!inner (
        city,
        district
      )
    `
      )
      .eq("users.good_citizen_status", "approved");

    // 日期 → 轉成 day_of_week
    const dow = getDowFromDate(effectiveFilters.date);
    if (dow) {
      query = query.eq("day_of_week", dow);
    }

    // 時間
    const startTime = getStartTime();
    const endTime = getEndTime();
    if (startTime && endTime) {
      query = query.lt("start_time", endTime).gt("end_time", startTime);
    }

    // 類別 / 寵物
    if (effectiveFilters.category) query = query.eq("category", effectiveFilters.category);
    if (effectiveFilters.species) query = query.eq("species", effectiveFilters.species);

    // 地點
    if (effectiveFilters.city) {
      query = query.eq("loc.city", effectiveFilters.city).not("loc.city", "is", null);
    }
    if (effectiveFilters.district) {
      query = query.eq("loc.district", effectiveFilters.district);
    }

    // 排序：評分交給後端；價格等一下前端處理
    if (sortBy === "rating") {
      query = query.order("rating", { ascending: false });
    } else {
      query = query.order("id", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      dispatch(createAsyncMessage(error));
      setAllCards([]);
      setCards([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }
    if (!data) {
      setAllCards([]);
      setCards([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    // 先做「只套 Supabase 篩選，不含收藏」的基本列表
    const baseCards = data.map((row) => ({
      serviceId: row.id,
      sitterId: row.sitter_id,
      sitterName: row.users.nickname,
      sitterAvatar: row.users.avatar_url,
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

    // 未登入：不用查 favorites，這次搜尋的結果就是 baseCards
    if (!isAuthenticated || !user || !ownerId) {

      setAllCards(baseCards);
      setCards(baseCards.slice(0, PAGE_SIZE));
      setTotalCount(baseCards.length);
      setIsLoading(false);
      return;
    }

    // 已登入：補收藏資料
    const { data: favRows, error: favError } = await supabase
      .from("favorites")
      .select("sitter_id")
      .eq("owner_id", ownerId);

    if (favError) {
      setAllCards(baseCards);
      setCards(baseCards.slice(0, PAGE_SIZE));
      setTotalCount(baseCards.length);
      setIsLoading(false);
      return;
    }

    const favoriteSitterIdSet = new Set(
      (favRows ?? []).map((row) => row.sitter_id)
    );

    let mergedCards = baseCards.map((card) => ({
      ...card,
      isFavorite: favoriteSitterIdSet.has(card.sitterId),
    }));

    
    setAllCards(mergedCards);
    setCards(mergedCards.slice(0, PAGE_SIZE));
    setTotalCount(mergedCards.length);  // ✅ totalCount 永遠對齊這次結果

    setIsLoading(false);
  }



  //監聽登入狀態和 user.email 的變化，去查對應的 users.id，存到 ownerId state 裡，給 favorites.owner_id 用
  useEffect(() => {
    // 有登入而且有 email 才去查 users.id
    const fetchOwnerId = async () => {
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
  dispatch(
    createAsyncMessage({
      type: "danger",
      text: "找不到對應會員資料，請重新登入後再試一次",
    })
  );
  setOwnerId(null);
  return;
}

      setOwnerId(userRow.id); // ✅ favorites.owner_id 要用的 int
    };

    fetchOwnerId();
  }, [isAuthenticated, user?.email, dispatch]);

  // 抓 locations（縣市 & 地區）
  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase
        .from("locations")
        .select("id, city, district")
        .is("deleted_at", null); // 只拿還在用的

      if (error) {
        dispatch(createAsyncMessage(error));
        return;
      }

      setLocations(data || []);

      // 產生唯一的縣市列表
      const cities = Array.from(
        new Set((data || []).map((item) => item.city))
      );
      setCityOptions(cities);
    }

    fetchLocations();
  }, [dispatch]);

  // 初次載入抓整包，再切第一頁
  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      await fetchServicesWithFilters(undefined);
      setCurrentPage(1);
    }

    if (isMounted) {
      loadInitial();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ownerId 改變（登入完成）後，重新依目前篩選抓一次資料
  useEffect(() => {
    if (!ownerId) return;

    async function loadOnOwnerChange() {
      await fetchServicesWithFilters(undefined);

      // 如果目前是價格排序，重排一次整包
      if (filters.sortBy === "price") {
        sortCardsByPrice(1);
      } else {
        // 非價格排序，fetchServicesWithFilters 已經切好第一頁，不用再動
        setCurrentPage(1);
      }
    }

    loadOnOwnerChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);


  const handleSearch = async () => {
    const sortByNow = filters.sortBy;

    // 只決定要用什麼排序方式呼叫 fetch
    if (sortByNow === "rating") {
      await fetchServicesWithFilters("rating");
    } else {
      await fetchServicesWithFilters(undefined);
    }

    // 價格排序：在 fetch 抓回的 allCards 上再做一次排序
    if (sortByNow === "price") {
      sortCardsByPrice(1);  // 會更新 allCards + cards + currentPage
    } else {
      // 非價格排序，fetch 已經幫你切好第一頁和 totalCount，不用再動
      setCurrentPage(1);
    }
  };




  const handleClearAll = async () => {
    // 1. 清空所有篩選條件與排序（給 UI 用）
    setFilters(initialFilters);

    // 2. 清空時間
    setStartHour("");
    setStartMinute("");
    setEndHour("");
    setEndMinute("");

    // 3. 回到第 1 頁
    setCurrentPage(1);

    // 4. 直接用「空條件」呼叫 fetchServicesWithFilters，不依賴 filters state
    await fetchServicesWithFilters("", initialFilters);

    // 5. 確保顯示第 1 頁
    setCards(prev => prev.slice(0, PAGE_SIZE));
  };




  const sortCardsByPrice = (page = 1) => {
    setAllCards(prevAll => {
      const sorted = [...prevAll].sort((a, b) => {
        const priceA =
          a.pricePer30min ?? a.pricePerDay ?? a.pricePerSession ?? 0;
        const priceB =
          b.pricePer30min ?? b.pricePerDay ?? b.pricePerSession ?? 0;
        return priceA - priceB; // 低到高
      });

      // 依目前頁碼，切出這一頁要顯示的 cards
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      setCards(sorted.slice(from, to));
      setCurrentPage(page);

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

  const goToPage = (page) => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;

    const source = allCards;

    setCards(source.slice(from, to));
    setCurrentPage(page);
    // 移動到保姆區塊
    const section = document.getElementById("nearby-sitter-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };





  return (
    <>
      {/* 搜尋列 */}
      <section className="lookfor-filter-group py-5">
        <div className="container">
          <h2 className="text-center fw-bold text-primary mb-5">我想尋找</h2>

          <div className="row g-3 align-items-end">
            {/* 服務類別 */}
            <div className="col-md-3">
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
            <div className="col-md-3">
              <label htmlFor="petType" className="form-label mb-2">
                寵物類別
              </label>
              <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                <span className="input-group-text border-0 bg-transparent">
                  <img
                    src={feetIcon}
                    className="me-2"
                    alt="feetIcon"
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
            <div className="col-md-3">
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
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 服務地區：地區 */}
            <div className="col-md-3">
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
                  disabled={!filters.city} // 沒選縣市時先禁用
                >
                  <option value="">地區</option>
                  {districtOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 服務時間：日期 */}
            <div className="col-md-3">
              <label htmlFor="serviceDate" className="form-label mb-2">
                服務時間
              </label>
              <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white">
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

            {/* 服務時間：起訖 - 桌機版 */}
            <div className="col-md-6 d-none d-md-block">
              <div className="d-flex align-items-center w-100">
                {/* 開始：時 */}
                <div className="d-flex align-items-center flex-fill me-3">
                  <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white w-100">
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
                  <span className="ms-1">時</span>
                </div>

                {/* 開始：分 */}
                <div className="d-flex align-items-center flex-fill me-3">
                  <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white w-100">
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
                  <span className="ms-1">分</span>
                </div>

                {/* 中間的 －（只桌機要） */}
                <span
                  className="mx-2 flex-shrink-0"
                  style={{ color: "#FF8400", fontWeight: 700 }}
                >
                  －
                </span>

                {/* 結束：時 */}
                <div className="d-flex align-items-center flex-fill me-3">
                  <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white w-100">
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
                  <span className="ms-1">時</span>
                </div>

                {/* 結束：分 */}
                <div className="d-flex align-items-center flex-fill">
                  <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white w-100">
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
                  <span className="ms-1">分</span>
                </div>
              </div>
            </div>
            {/* 服務時間：起訖 - 手機版（兩行滿版） */}
            <div className="col-12 d-block d-md-none">
              <div className="row g-2">
                {/* 第一行：開始 時 + 分 */}
                <div className="col-12">
                  <div className="d-flex align-items-center w-100">
                    {/* 開始：時 */}
                    <div className="d-flex align-items-center flex-fill me-2">
                      <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white w-100">
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
                      <span className="ms-1">時</span>
                    </div>

                    {/* 開始：分 */}
                    <div className="d-flex align-items-center flex-fill">
                      <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white w-100">
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
                      <span className="ms-1">分</span>
                    </div>
                  </div>
                </div>

                {/* 第二行：結束 時 + 分 */}
                <div className="col-12">
                  <div className="d-flex align-items-center w-100">
                    {/* 結束：時 */}
                    <div className="d-flex align-items-center flex-fill me-2">
                      <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white w-100">
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
                      <span className="ms-1">時</span>
                    </div>

                    {/* 結束：分 */}
                    <div className="d-flex align-items-center flex-fill">
                      <div className="mb-2 input-group rounded-pill overflow-hidden border border-warning bg-white w-100">
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
                      <span className="ms-1">分</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* 按鈕 */}
            <div className="col-md-3 d-flex justify-content-md-end mt-3 mt-md-0">
              <button
                type="button"
                onClick={handleSearch}
                className="btn btn-primary text-white w-100 rounded-pill py-2 mb-2"
              >
                搜尋
              </button>
            </div>
            {/* 清除按鈕 */}
            <div className="col-md-3 ms-md-auto mt-2">
              <button
                type="button"
                onClick={handleClearAll}
                className="btn btn-outline-secondary w-100 rounded-pill py-2"
              >
                清除全部篩選與排序
              </button>
            </div>


          </div>
        </div>
      </section>

      {/* 保姆卡片 */}
      <section id="nearby-sitter-section" className="lookfor-sitter-list py-4">
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

          {/* 載入中提示 */}
          {isLoading && (
            <p className="text-center text-muted mb-3">
              服務載入中，請稍候...
            </p>
          )}

          <div className="row mb-3">
            <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              {/* 左側：總筆數文字 */}
              <small className="text-muted mb-2 mb-md-0">
                共 {totalCount} 位保姆符合條件
              </small>
              <div className="col-md-2">
                {/* 排序 select */}
                <select
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
                            <button className="btn btn-outline-primary btn-gradint-primary btn-sm rounded-pill"
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
  );

}
export default LookForPetSitter;
