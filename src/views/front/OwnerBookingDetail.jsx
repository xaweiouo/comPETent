//OwnerBookingDetail.jsx
import React, { useState, useEffect } from "react";
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

/* 共用 formatter：直接複製你現在的 */
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

function OwnerBookingDetail() {
  const { id } = useParams();
  const bookingId = id;
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);
  const [cancelReason, setCancelReason] = useState("");


  /* 1. 讀取訂單資料（直接沿用你現在的 fetchSitterBookingDetail） */
  async function fetchOwnerBookingDetail(bookingId) {
    if (!bookingId) return;

    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, order_number, status, arrival_date, arrival_time, departure_date, departure_time, pickup_location_id, pickup_address_detail, note, total_price, pet_id, owner_id, sitter_id, service_id, service_days, service_units"
      )
      .eq("id", bookingId)
      .single();

    if (error) {
      console.log("fetch booking detail error", error);
      alert("載入訂單資料失敗，請稍後再試");
      return;
    }

    // 接送地點
    let locationData = null;
    if (data.pickup_location_id) {
      const { data: loc, error: locError } = await supabase
        .from("locations")
        .select("id, city, district")
        .eq("id", data.pickup_location_id)
        .single();
      if (!locError) locationData = loc;
    }

    // 寵物
    let petData = null;
    if (data.pet_id) {
      const { data: pet, error: petError } = await supabase
        .from("pets")
        .select(
          "id, name, species, size, gender, birth_date, last_vaccination_date, is_neutered, photo_url, note"
        )
        .eq("id", data.pet_id)
        .single();
      if (!petError) petData = pet;
    }

    // 飼主自己
    let ownerData = null;
    if (data.owner_id) {
      const { data: owner, error: ownerError } = await supabase
        .from("users")
        .select("id, name, email, phone, avatar_url")
        .eq("id", data.owner_id)
        .single();
      if (!ownerError) ownerData = owner;
    }

    // 保母資訊（飼主版要看保母）
    let sitterData = null;
    if (data.sitter_id) {
      const { data: sitter, error: sitterError } = await supabase
        .from("users")
        .select("id, name, email, phone, avatar_url")
        .eq("id", data.sitter_id)
        .single();
      if (!sitterError) sitterData = sitter;
    }

    // 服務
    let serviceData = null;
    if (data.service_id) {
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .select(
          "id, category, species, day_of_week, start_time, end_time, price_per_30min, price_per_day, price_per_session"
        )
        .eq("id", data.service_id)
        .single();
      if (!serviceError) serviceData = service;
    }

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
      sitter: sitterData,
      service: serviceData,
      location: locationData,
      review: null,
    };

    return bookingData;
  }

  useEffect(() => {
    async function loadBooking() {
      try {
        const data = await fetchOwnerBookingDetail(bookingId);
        setBookingData(data);
      } catch (err) {
        console.log("loadBooking error", err);
      }
    }
    loadBooking();
  }, [bookingId]);

  /* 2. 飼主視角的動作：提交預約（其實在別頁）、付款、取消、評價 */

  // 付款：status pending/accepted -> paid
  async function handlePayBooking() {
    if (!bookingId) return;
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "paid" })
      .eq("id", bookingId)
      .select("status")
      .single();

    if (error) {
      console.log("pay booking error", error);
      alert("付款失敗，請稍後再試");
      return;
    }

    setBookingData((prev) =>
      prev
        ? {
            ...prev,
            booking: {
              ...prev.booking,
              status: data.status || "paid",
            },
          }
        : prev
    );
    alert("付款成功！");
  }

  // 飼主取消訂單：任何非完成/已評價狀態都可取消
  async function handleCancelBooking() {
    if (!bookingId) return;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: now,
        cancelled_by: "owner",
        cancel_reason: cancelReason,
      })
      .eq("id", bookingId)
      .select("status")
      .single();

    if (error) {
      console.log("cancel booking error", error);
      alert("取消訂單失敗，請稍後再試");
      return;
    }

    setBookingData((prev) =>
      prev
        ? {
            ...prev,
            booking: {
              ...prev.booking,
              status: data.status || "cancelled",
              cancelled_at: now,
              cancelled_by: "owner",
              cancel_reason: cancelReason,
            },
          }
        : prev
    );
    alert("已取消訂單");
  }

  // 評分 / 評論：這裡先做假 handler，之後你可以接真正的評論表單
  async function handleRateBooking() {
    if (!bookingId) return;

    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "rated" })
      .eq("id", bookingId)
      .select("status")
      .single();

    if (error) {
      console.log("rate booking error", error);
      alert("送出評價失敗，請稍後再試");
      return;
    }

    setBookingData((prev) =>
      prev
        ? {
            ...prev,
            booking: {
              ...prev.booking,
              status: data.status || "rated",
            },
          }
        : prev
    );
    alert("已送出評分與評論！");
  }

  /* 3. 飼主版：根據狀態顯示不同按鈕 */

  function renderActionSection(status) {
    switch (status) {
      case "pending":
        // 飼主剛送出預約，等保母接受，可以取消
        return (
          <div className="d-flex justify-content-between gap-3">
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

      case "accepted":
        // 保母已接受，飼主可以付款或取消
        return (
          <div className="d-flex justify-content-between gap-3">
            <button
              type="button"
              className="btn btn-primary fw-bold rounded-pill flex-fill"
              onClick={handlePayBooking}
            >
              前往付款
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
  // 已付款，等保母完成服務，可以取消（例如要提前改變行程）
  return (
    <div className="d-flex flex-column gap-3">
      <p className="mb-1 fw-bold">已付款，等待保母完成服務</p>

      <button
        type="button"
        className="btn btn-outline-danger rounded-pill px-4 py-2"
        data-bs-toggle="modal"
        data-bs-target="#cancelBookingModal"
      >
        取消預約
      </button>
    </div>
  );


      case "completed":
        // 保母已標記完成，飼主可以評價
        return (
          <div className="d-flex justify-content-between gap-3">
            <p className="mb-0">服務已完成，歡迎留下評價</p>
            <button
              type="button"
              className="btn btn-primary fw-bold rounded-pill"
              onClick={handleRateBooking}
            >
              評分與評論
            </button>
          </div>
        );

      case "rated":
        return <p className="mb-0">已完成並留下評價，感謝你的回饋！</p>;

      case "cancelled":
        return <p className="mb-0">此訂單已取消</p>;

      default:
        return null;
    }
  }

  if (!bookingData) {
    return <p className="text-center py-5">訂單載入中...</p>;
  }

  return (
    <div className="container booking-page">
      <header className="booking-header-nav">{/* navbar 共用區 */}</header>

      <main className="booking-main container">
        <section className="row booking-sitter-and-price">
          {/* 左半：保母 + 寵物 + 訂單細節（版型沿用你現在的） */}
          <div className="col-lg-9 booking-sitter">
            {/* 返回 */}
            <button
              className="btn btn-link p-0 booking-back-btn mb-3"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-chevron-left me-1"></i>
              <h5 className="ms-2">返回</h5>
            </button>

            {/* 保母資訊 */}
            <div className="d-flex flex-column gap-3 sitter-header">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <img
                  src={
                    bookingData?.sitter?.avatar_url
                      ? bookingData.sitter.avatar_url
                      : sitterLogo
                  }
                  className="rounded-circle border border-1 border-warning"
                  alt={
                    bookingData?.sitter
                      ? `${bookingData.sitter.name} 保母頭像`
                      : "保母頭像"
                  }
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />

                <div
                  className="d-flex align-items-center gap-2"
                  style={{ minWidth: "110px" }}
                >
                  <h2 className="mb-0 fw-bold sitter-name">
                    {bookingData?.sitter?.name || "保母"}
                  </h2>
                  <span className="border-primary sitter-role-badge border border-2 rounded-pill px-3 py-2">
                    保母
                  </span>
                </div>

                <div className="ms-auto text-end">
                  <div className="small text-muted">訂單編號</div>
                  <div className="fw-bold">
                    {bookingData?.booking.order_number ?? "載入中"}
                  </div>

                  <div className="d-flex align-items-center gap-3 mt-2 justify-content-end">
                    <h5 className="mb-0 fw-bold sitter-service-label">
                      訂單狀態
                    </h5>
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
            </div>

            {/* 本次預約的寵物（直接複製你現在的排版） */}
            {/* ... 這裡可以沿用你 SitterBookingDetail 裡「本次預約的寵物」那一整段 JSX */}
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
                                                            <div className="col-12 col-md-3 d-flex flex-column align-items-center">
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
                                                                <div className="col-12">
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
                                                            <div className="col-12 col-md-9">
                                                                <div className="row g-3">
                                                                    {/* 種類 */}
                                                                    <div className="col-12 col-sm-6">
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
                                                                    <div className="col-12 col-sm-6">
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
                                                                    <div className="col-12 col-sm-6">
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
                                                                    <div className="col-12 col-sm-6">
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
                                                                    <div className="col-12 col-sm-6">
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
                                                                    <div className="col-12 col-sm-6">
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
                                                                    <div className="col-12">
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
                                                        <div className="col-12 d-flex align-items-center mb-1">
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
                                                        <div className="col-12 d-flex align-items-center">
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
                                                        <div className="col-12 col-sm-3">
                                                            <div className="form-control rounded-pill border border-warning background-transparent d-flex align-items-center">
                                                                {bookingData?.location?.city
                                                                    ? bookingData.location.city
                                                                    : "（無縣市資訊）"}
                                                            </div>
                                                        </div>
            
                                                        {/* 地區 */}
                                                        <div className="col-12 col-sm-3">
                                                            <div className="form-control rounded-pill border border-warning background-transparent d-flex align-items-center">
                                                                {bookingData?.location?.district
                                                                    ? bookingData.location.district
                                                                    : "（無地區資訊）"}
                                                            </div>
                                                        </div>
            
                                                        {/* 詳細地址（吃剩餘寬度） */}
                                                        <div className="col-12 col-sm-6">
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

      {/* 取消訂單 Modal（飼主取消用） */}
      <CancelBookingModal
        cancelReason={cancelReason}
        onReasonChange={setCancelReason}
        onConfirm={handleCancelBooking}
      />
    </div>
  );
}

export default OwnerBookingDetail;
