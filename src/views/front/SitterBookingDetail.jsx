//SitterBookingDetail.jsx
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { supabase } from "../../lib/supabaseClient";
import CancelBookingModal from "../../components/CancelBookingModal";
import feetIcon from "../../images/icons/feet_icon.png";
import dogIcon from "../../images/icons/dog_icon.png";
import cakeIcon from "../../images/icons/cake_icon.png";
import calendarIcon from "../../images/icons/calendar_icon.png";
import sitterLogo from "../../images/Logo.png";
import clockIcon from "../../images/icons/clock_icon.png";
import locationIcon from "../../images/icons/location_icon.png";
import infoIcon from "../../images/icons/info_icon.png";

import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slices/messageSlice";


function formatBookingStatus(status) {
  switch (status) {
    case "pending":
      return "待處理";
    case "accepted":
      return "已接受";
    case "paid":
      return "已付款";
    case "completed":
      return "已完成";
    case "rated":
      return "已評價";
    case "cancelled":
      return "已取消";
    default:
      return status || "";
  }
}

function formatCategory(category) {
  switch (category) {
    case "walk":
    case "陪伴散步":
      return "陪伴散步";
    case "daycare":
      return "寵物安親";
    case "home_visit":
      return "到府照顧";
    case "boarding":
      return "寄宿";
    case "grooming":
      return "洗澡美容";
    case "training":
      return "訓練";
    default:
      return category || "未指定";
  }
}
function formatSize(size) {
  switch (size) {
    case "small":
    case "小型":
      return "小 - 10 公斤以下";
    case "medium":
    case "中型":
      return "中 - 10–20 公斤";
    case "large":
    case "大型":
      return "大 - 20 公斤以上";
    default:
      return size || "未填寫";
  }
}



function formatSpecies(species) {
  switch (species) {
    case "dog":
    case "狗":
      return "狗";
    case "cat":
    case "貓":
      return "貓";
    case "rabbit":
    case "兔":
      return "兔";
    case "bird":
    case "鳥":
      return "鳥";
    case "other":
    case "其他":
      return "其他";
    default:
      return species || "未填寫";
  }
}





function SitterBookingDetail() {
  const dispatch = useDispatch();

  const { id } = useParams();
  const bookingId = id;
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);



  // 先放幾個測試用 state，避免 JSX 找不到變數
  const [serviceLoading] = useState(false);
  const [serviceError] = useState("");


  //switch 版本

  function renderActionSection(status) {
    switch (status) {
      case "pending":
        return (
          <div className="d-flex justify-content-between gap-3">
            <button
              type="button"
              className="btn btn-primary fw-bold rounded-pill flex-fill"
              onClick={handleAcceptBooking}
            >
              接受預約
            </button>
            <button
              type="button"
              className="btn btn-outline-danger flex-fill"
              data-bs-toggle="modal"
              data-bs-target="#cancelBookingModal"
            >
              取消預約
            </button>
          </div>
        );

      case "paid":
        return (
          <div className="d-flex flex-column gap-3">
            <p className="mb-1 fw-bold">已付款，等待保母完成服務</p>

            <div className="d-flex justify-content-between gap-3">
              <button
                type="button"
                className="btn btn-primary fw-bold rounded-pill flex-fill"
                onClick={handleCompleteBooking}
              >
                完成訂單
              </button>
              <button
                type="button"
                className="btn btn-outline-danger rounded-pill flex-fill"
                data-bs-toggle="modal"
                data-bs-target="#cancelBookingModal"
              >
                取消預約
              </button>
            </div>
          </div>
        );



      case "completed":
        // 保母端：服務完成，靜態顯示即可
        return <p>訂單已完成，等待飼主評分與評論</p>;

      case "rated":
        // 飼主已評分，雙方都看成「完全結束」
        return <p>訂單已完成並收到評價</p>;

      case "cancelled":
        return <p>訂單已取消</p>;

      default:
        return null;
    }
  }

  async function fetchSitterBookingDetail(bookingId) {
    // 如果沒有 id，直接丟錯 / 回傳 null
    if (!bookingId) return;

    // 1) 從 Supabase 抓 bookings 那一筆
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, order_number, status, arrival_date, arrival_time, departure_date, departure_time, pickup_location_id, pickup_address_detail, note, total_price, pet_id, owner_id, service_id, service_days, service_units"
      )
      .eq("id", bookingId)
      .single();

    if (error) {
      throw error;
    }

    // 如果有 pickup_location_id，再去抓一次 locations 表，拿到地點資訊
    let locationData = null;
    if (data.pickup_location_id) {
      const { data: loc } = await supabase
        .from("locations")
        .select("id, city, district")
        .eq("id", data.pickup_location_id)
        .single();
      locationData = loc; // 沒有資料就是 null，不影響後面
    }

    // [步驟 3]用 data.pet_id 去抓 pets，放到 petData
    let petData = null;
    if (data.pet_id) {
      const { data: pet } = await supabase
        .from("pets")
        .select(
          "id, name, species, size, gender, birth_date, last_vaccination_date, is_neutered, photo_url, note"
        )
        .eq("id", data.pet_id)
        .single();
      petData = pet;
    }

    // [步驟 4]（之後要加）用 data.owner_id 去抓 users，放到 ownerData
    let ownerData = null;
    if (data.owner_id) {
      const { data: owner } = await supabase
        .from("users")
        .select("id, name, nickname, email, phone, avatar_url")
        .eq("id", data.owner_id)
        .single();
      ownerData = owner;
    }

    // [步驟 5]（之後要加）用 data.service_id 去抓 services，放到 serviceData
    let serviceData = null;
    if (data.service_id) {
      const { data: service } = await supabase
        .from("services")
        .select(
          "id, category, species, day_of_week, start_time, end_time, price_per_30min, price_per_day, price_per_session"
        )
        .eq("id", data.service_id)
        .single();
      serviceData = service;
    }

    // 2) 組成 bookingData 物件（至少要有 booking 這包）
    const bookingData = {
      booking: {
        id: data.id,
        order_number: data.order_number,
        status: data.status,
        arrival_date: data.arrival_date,
        arrival_time: data.arrival_time,
        departure_date: data.departure_date,
        departure_time: data.departure_time,
        pickup_location_id: data.pickup_location_id,
        pickup_address_detail: data.pickup_address_detail,
        service_days: data.service_days,
        service_units: data.service_units,
        note: data.note,
        total_price: data.total_price,
      },
      pet: petData,
      owner: ownerData,
      service: serviceData,
      location: locationData,
      review: null,
    };

    // 3) 回傳 bookingData
    return bookingData;
  }


  useEffect(() => {
    async function loadBooking() {
      try {
        const data = await fetchSitterBookingDetail(bookingId);
        setBookingData(data);
      } catch {
        dispatch(
          createAsyncMessage({
            message: "載入訂單資料時發生錯誤，請稍後再試。",
          })
        );
      }
    }

    loadBooking();
  }, [bookingId, dispatch]);


  async function handleAcceptBooking() {
    if (!bookingId) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "accepted" })   // 這裡直接寫成目標狀態
      .eq("id", bookingId)
      .select("status")
      .single();

    if (error) {
      // 失敗：用 message（danger / 失敗）
      dispatch(
        createAsyncMessage({
          message: "接受預約失敗，請稍後再試。",
        })
      );
      return;
    }

    // 更新前端 state：只改 bookingData.booking.status
    setBookingData((prev) =>
      prev
        ? {
          ...prev,
          booking: {
            ...prev.booking,
            status: "accepted",
          },
        }
        : prev
    );

    // 成功：用 text（success / 成功）
    dispatch(
      createAsyncMessage({
        text: "已接受訂單！",
      })
    );
  }



  // 完成訂單
  async function handleCompleteBooking() {
    if (!bookingId) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", bookingId)
      .select("status")
      .single();

    if (error) {
      // 失敗 → danger / 失敗
      dispatch(
        createAsyncMessage({
          message: "完成訂單失敗，請稍後再試。",
        })
      );
      return;
    }

    // 更新前端 state：只改 bookingData.booking.status
    setBookingData((prev) =>
      prev
        ? {
          ...prev,
          booking: {
            ...prev.booking,
            status: "completed", // 或 data.status
          },
        }
        : prev
    );

    // 成功 → success / 成功
    dispatch(
      createAsyncMessage({
        text: "已完成訂單！",
      })
    );
  }




  // 取消訂單
  const [cancelReason, setCancelReason] = useState("");

  async function handleCancelBooking() {
    const now = new Date().toISOString();

    if (!bookingId) return;

    const { error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: now,
        cancelled_by: "sitter",
        cancel_reason: cancelReason,
      })
      .eq("id", bookingId)
      .select("status")
      .single();

    if (error) {
      // 失敗 → danger / 失敗
      dispatch(
        createAsyncMessage({
          message: "取消訂單失敗，請稍後再試。",
        })
      );
      return;
    }

    // 更新前端 state：只改 bookingData.booking.status
    setBookingData((prev) =>
      prev
        ? {
          ...prev,
          booking: {
            ...prev.booking,
            status: "cancelled",
            cancelled_at: now,
            cancelled_by: "sitter",
            cancel_reason: cancelReason,
          },
        }
        : prev
    );

    // 成功 → success / 成功
    dispatch(
      createAsyncMessage({
        text: "已取消訂單！",
      })
    );
  }



  //手機版費用假資料
  //const [isFeeOpen, setIsFeeOpen] = useState(false);


  return (
    <div className="container booking-page">
      <header className="booking-header-nav">
        {/* navbar 共用區 */}
      </header>

      <main className="booking-main container">
        {/* row 把左半／右半包起來 */}
        <section className="row booking-sitter-and-price">
          {/* 返回＋保母資訊＋下面整個表單區 */}
          <div className="col-lg-9 booking-sitter">
            {/* 返回按鈕 */}
            <button
              className="btn btn-link p-0 booking-back-btn mb-3"
              onClick={() => {
                // 優先回上一頁
                navigate(-1);
                // 強制回指定路由
                // navigate(`/lookforpetsitter/${sitterId}`);
              }}
            >
              <i className="bi bi-chevron-left me-1"></i>
              <h5 className="ms-2">返回</h5>
            </button>

            {/* 服務資料載入狀態（只在有狀態時出現） */}
            {serviceLoading && <p className="text-muted small mb-2">服務資料載入中...</p>}
            {serviceError && <p className="text-danger small mb-2">{serviceError}</p>}

            {/* 飼主資訊 */}
            <div className="d-flex flex-column gap-3 sitter-header">
              <div
                className="
                  d-flex
                  align-items-center
                  gap-3
                  flex-wrap 
                "
              >
                {/* 手機時允許換行 */}
                <img
                  src={bookingData?.owner?.avatar_url ? bookingData.owner.avatar_url : sitterLogo}

                  className="rounded-circle border border-1 border-warning"
                  alt={bookingData?.owner ? `${bookingData.owner.nickname}飼主logo` : "飼主logo"}
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />

                {/* 名字 + 飼主：給一個最小寬度，避免被擠到換行 */}
                <div className="d-flex align-items-center gap-2" style={{ minWidth: "110px" }}>
                  <h2 className="mb-0 fw-bold sitter-name">
                    {bookingData?.owner?.nickname || "飼主"}</h2>
                  <span className="border-primary sitter-role-badge border border-2 rounded-pill px-3 py-2">
                    飼主
                  </span>
                </div>

                {/* 訂單編號 */}
                <div className="ms-auto">
                  <div className="small text-muted">訂單編號</div>
                  <div className="fw-bold">{bookingData?.booking.order_number ?? "載入中"}</div>

                  {/* 訂單狀態 */}
                  <div className="d-flex align-items-center gap-3">
                    <h5 className="mb-0 fw-bold sitter-service-label">訂單狀態</h5>
                    <span className="bg-white badge-pill-gray rounded-pill">
                      {formatBookingStatus(bookingData?.booking.status)}
                    </span>
                  </div>

                </div>
              </div>

              {/* 服務項目 */}
              <div className="d-flex align-items-center gap-3 mt-3">
                <h5 className="mb-0 fw-bold sitter-service-label">服務項目</h5>
                <span className="bg-white badge-pill-gray rounded-pill">
                  {formatCategory(bookingData?.service?.category)}
                </span>
              </div>

              {/* 訂單狀態 */}
              {/* <div className="d-flex align-items-center gap-3">
                                <h5 className="mb-0 fw-bold sitter-service-label">訂單狀態</h5>
                                <span className="bg-white badge-pill-gray rounded-pill">
                                    {formatBookingStatus(bookingData?.booking.status)}
                                </span>
                            </div> */}
            </div>

            {/* 選擇寵物卡片輪播＋新增寵物提示 */}
            <section className="booking-pet mt-5">


              {/* 毛小孩詳細資料表單 */}
              <section className="booking-pet-form">
                <div className="card border-0 rounded-4 background-transparent">
                  <div className="card-body px-0 py-2">
                    <div className="d-flex align-items-center mb-4">
                      <img
                        src={feetIcon}
                        alt="feet" width="20" height="20" className="me-2" />
                      <h4 className="text-primary mb-0">本次預約的寵物</h4>
                    </div>

                    {/* 毛小孩詳細資料卡片內容 */}
                    <div className="rounded-4 p-4" style={{ backgroundColor: "#FFB22C33" }}>
                      <div className="row g-4 align-items-start">
                        {/* 左側：照片 + 名字 */}
                        <div className=" col-md-3 d-flex flex-column align-items-center">
                          <div className="w-100 mb-3">
                            <div className="ratio" style={{ "--bs-aspect-ratio": "133.33%" }}>
                              <img
                                src={bookingData?.pet?.photo_url ? bookingData.pet.photo_url
                                  : { feetIcon }}
                                alt={bookingData?.pet?.name || "寵物照片"}
                                className="w-100 h-100 rounded-4"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          </div>

                          {/* 名字 */}
                          <div className="">
                            <label className="form-label">名字</label>
                            <div
                              className="form-control border-0 rounded-pill d-flex align-items-center"
                              style={{ backgroundColor: "#FEF3E2" }}
                            >
                              {bookingData?.pet?.name ?? "未填寫"}
                            </div>
                          </div>


                        </div>

                        {/* 右側欄位 */}
                        <div className=" col-md-9">
                          <div className="row g-3">
                            {/* 種類 */}
                            <div className=" col-sm-6">
                              <label className="form-label">種類</label>
                              <div className="input-group rounded-pill overflow-hidden border border-warning" style={{ backgroundColor: "#FEF3E2" }}>
                                <span
                                  className="input-group-text border-0"
                                  style={{ backgroundColor: "#FEF3E2" }}
                                >
                                  <img
                                    src={feetIcon}
                                    alt="feet" width="20" height="20" />
                                </span>
                                <div className="mb-1 d-flex align-items-center" style={{ backgroundColor: "#FEF3E2" }}>
                                  {formatSpecies(bookingData?.pet?.species)}
                                </div>
                              </div>
                            </div>

                            {/* 體型 */}
                            <div className=" col-sm-6">
                              <label className="form-label">體型</label>
                              <div className="input-group rounded-pill overflow-hidden border border-warning" style={{ backgroundColor: "#FEF3E2" }}>
                                <span
                                  className="input-group-text border-0"
                                  style={{ backgroundColor: "#FEF3E2" }}
                                >
                                  <img
                                    src={dogIcon}
                                    alt="dog" width="20" height="20" />
                                </span>
                                <div className="mb-1 d-flex align-items-center" style={{ backgroundColor: "#FEF3E2" }}>
                                  {formatSize(bookingData?.pet?.size)}
                                </div>
                              </div>
                            </div>

                            {/* 出生年（改用 date） */}
                            <div className=" col-sm-6">
                              <label className="form-label">出生日期</label>
                              <div className="input-group rounded-pill overflow-hidden border border-warning" style={{ backgroundColor: "#FEF3E2" }}>
                                <span
                                  className="input-group-text border-0"
                                  style={{ backgroundColor: "#FEF3E2" }}
                                >
                                  <img
                                    src={cakeIcon}
                                    alt="cake" width="20" height="20" />
                                </span>
                                <p className="mb-1 d-flex align-items-center">{bookingData?.pet?.birth_date ?? "未填寫"}</p>
                              </div>
                            </div>

                            {/* 上次施打疫苗日期 */}
                            <div className=" col-sm-6">
                              <label className="form-label">上次施打疫苗日期</label>
                              <div className="input-group rounded-pill overflow-hidden border border-warning" style={{ backgroundColor: "#FEF3E2" }}>
                                <span
                                  className="input-group-text border-0"
                                  style={{ backgroundColor: "#FEF3E2" }}
                                >
                                  <img
                                    src={calendarIcon}
                                    alt="calendar" width="20" height="20" />
                                </span>
                                <p className="mb-1 d-flex align-items-center" style={{ backgroundColor: "#FEF3E2" }}>
                                  {bookingData?.pet?.last_vaccination_date ?? "未填寫"}
                                </p>
                              </div>
                            </div>

                            {/* 性別 */}
                            <div className=" col-sm-6">
                              <label className="form-label d-block">性別</label>
                              <div className="btn-group" role="group" aria-label="pet gender">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="petGenderReadonly"
                                  id="petGenderMaleReadonly"
                                  checked={bookingData?.pet?.gender === "male"}
                                  readOnly
                                />
                                <label className="btn pet-toggle-pill" htmlFor="petGenderMaleReadonly">
                                  公
                                </label>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="petGenderReadonly"
                                  id="petGenderFemaleReadonly"
                                  checked={bookingData?.pet?.gender === "female"}
                                  readOnly
                                />
                                <label className="btn pet-toggle-pill" htmlFor="petGenderFemaleReadonly">
                                  母
                                </label>
                              </div>
                            </div>


                            {/* 是否結紮 */}
                            <div className=" col-sm-6">
                              <label className="form-label d-block">是否結紮</label>
                              <div className="btn-group" role="group" aria-label="pet neuter">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="petNeuterReadonly"
                                  id="petNeuterYesReadonly"
                                  checked={bookingData?.pet?.is_neutered === true}
                                  readOnly
                                />
                                <label className="btn pet-toggle-pill" htmlFor="petNeuterYesReadonly">
                                  是
                                </label>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="petNeuterReadonly"
                                  id="petNeuterNoReadonly"
                                  checked={bookingData?.pet?.is_neutered === false}
                                  readOnly
                                />
                                <label className="btn pet-toggle-pill" htmlFor="petNeuterNoReadonly">
                                  否
                                </label>
                              </div>
                            </div>


                            {/* 備註 */}
                            <div className="">
                              <label className="form-label">備註</label>
                              <div
                                className="form-control border-0 rounded-4"
                                style={{ backgroundColor: "#FEF3E2", minHeight: "120px" }}
                              >
                                {bookingData?.pet?.note ?? "未填寫"}
                              </div>
                            </div>


                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /毛小孩詳細資料卡片內容 */}
                  </div>
                </div>
              </section>

              {/* 預約表單時間+地點+備註 */}
              <section className="booking-pet-form mt-5">
                {/* 服務時間 */}
                <section className="booking-service-time">
                  <div className="px-4 py-4">
                    {/* 標題 */}
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={clockIcon}
                        alt="service time" width="20" height="20" className="me-2" />
                      <h4 className="text-primary mb-0">服務時間</h4>
                    </div>

                    {/* 內容 */}
                    <div className="row g-3 align-items-center booking-service-time-row">
                      {/* 從 */}
                      <div className=" d-flex align-items-center mb-1">
                        <span className="me-3 fw-bold">從</span>

                        {/* 日期 */}
                        <div className="flex-grow-1 me-3">
                          <div className="input-group rounded-pill overflow-hidden border border-warning">
                            <span className="input-group-text border-0 background-transparent">
                              <img
                                src={calendarIcon}
                                alt="date" width="20" height="20" />
                            </span>

                            <div className="form-control border-0 background-transparent d-flex align-items-center">
                              {bookingData?.booking.arrival_date} {bookingData?.booking.arrival_time}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 到 */}
                      <div className=" d-flex align-items-center">
                        <span className="me-3 fw-bold">到</span>

                        {/* 日期 */}
                        <div className="flex-grow-1 me-3">
                          <div className="input-group rounded-pill overflow-hidden border border-warning">
                            <span className="input-group-text border-0 background-transparent">
                              <img
                                src={calendarIcon}
                                alt="date" width="20" height="20" />
                            </span>
                            <div className="form-control border-0 background-transparent d-flex align-items-center">
                              {bookingData?.booking.departure_date} {bookingData?.booking.departure_time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 接送地點 */}
                <section className="booking-location">
                  <div className="px-4 py-4">
                    {/* 標題 */}
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={locationIcon}
                        alt="location" width="20" height="20" className="me-2" />
                      <h4 className="text-primary mb-0">接送地點</h4>
                    </div>

                    {/* 內容 */}
                    <div className="row g-3 align-items-center booking-location-row">
                      {/* 縣市 */}
                      <div className=" col-sm-3">
                        <div className="form-control rounded-pill border border-warning background-transparent d-flex align-items-center">
                          {bookingData?.location?.city
                            ? bookingData.location.city
                            : "（無縣市資訊）"}
                        </div>
                      </div>

                      {/* 地區 */}
                      <div className=" col-sm-3">
                        <div className="form-control rounded-pill border border-warning background-transparent d-flex align-items-center">
                          {bookingData?.location?.district
                            ? bookingData.location.district
                            : "（無地區資訊）"}
                        </div>
                      </div>

                      {/* 詳細地址（吃剩餘寬度） */}
                      <div className=" col-sm-6">
                        <div className="form-control rounded-pill border border-warning background-transparent d-flex align-items-center">
                          {bookingData?.booking.pickup_address_detail || "（無詳細地址資訊）"}
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                {/* 備註 */}
                <section className="booking-notes">
                  <div className="px-4 py-4">
                    {/* 標題 */}
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={infoIcon}
                        alt="notes" width="20" height="20" className="me-2" />
                      <h4 className="text-primary mb-0">備註</h4>
                    </div>

                    {/* 內容 */}
                    <div className="form-control booking-notes-textarea border border-warning background-transparent">
                      {bookingData?.booking.note || "（此訂單沒有備註）"}
                    </div>
                  </div>
                </section>
              </section>
            </section>
          </div>

          {/* 電腦版-右半：費用總覽卡片 手機版-固定在下方可收放 */}
          <aside className=" col-lg-3 booking-price ">
            {/* 桌機版卡片（md 以上顯示） */}
            {/*<div className="d-none d-lg-block">*/}
            <div className="">
              <div className="card border-0 rounded-4 shadow-sm">
                <div className="card-body px-4 py-4">
                  <h3 className="text-center text-primary fw-bold mb-4">費用</h3>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-bold">基本費用</span>
                      <span className="fw-bold"> {bookingData?.service?.price_per_30min
                        ? `NT$ ${bookingData.service.price_per_30min} / 30 分鐘`
                        : bookingData?.service?.price_per_day
                          ? `NT$ ${bookingData.service.price_per_day} / 每日`
                          : bookingData?.service?.price_per_session
                            ? `NT$ ${bookingData.service.price_per_session} / 每次`
                            : "—"}</span>
                    </div>

                    {/* 天數：只有 per_day 時一定有意義，其餘可選擇要不要顯示 */}
                    {bookingData?.service?.price_per_day && (
                      <div className="d-flex justify-content-between mb-3">
                        <span className="fw-bold">天數</span>
                        <span className="fw-bold">x{bookingData?.booking?.service_days ?? 0}</span>
                      </div>
                    )}

                    {/* 30 分鐘單位：只有 per_30min 顯示 */}
                    {bookingData?.service?.price_per_30min && (
                      <div className="d-flex justify-content-between mb-3">
                        <span className="fw-bold">服務時間 (每 30 分鐘)</span>
                        <span className="fw-bold">x{bookingData?.booking?.service_units ?? 0}</span>
                      </div>
                    )}

                    {/* 一次性服務：每次收費 */}
                    {bookingData?.service?.price_per_session && (
                      <div className="d-flex justify-content-between mb-3">
                        <span className="fw-bold">服務次數</span>
                        <span className="fw-bold">x{bookingData?.booking?.service_units ?? 0}</span>
                      </div>
                    )}

                    <hr className="my-4 border-primary border-2" />

                    <div className="d-flex justify-content-between align-items-end">
                      <span className="fw-bold">總金額</span>
                      <span className="fw-bold fs-3 text-primary">NT$ {bookingData?.booking.total_price ?? 0}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    {renderActionSection(bookingData?.booking.status)}
                  </div>

                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-info-circle-fill text-primary me-2"></i>
                      <span className="fw-bold text-primary">注意事項</span>
                    </div>
                    <ul className="mb-0 ps-3">
                      <li className="mb-2">
                        點擊接受預約按鈕即代表接受訂單，
                        等待飼主付款。
                        預約請求都可以隨時取消。
                      </li>
                      <li>
                        服務預約及付款必須在我能寵平台上操作，才能享有平台提供的所有服務保障。
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 手機版固定在下方的費用卡片（lg 以下顯示） */}

          </aside>
        </section>
      </main>


      <CancelBookingModal
        cancelReason={cancelReason}
        onReasonChange={setCancelReason}
        onConfirm={handleCancelBooking}
      />
    </div>
  );
}

export default SitterBookingDetail;