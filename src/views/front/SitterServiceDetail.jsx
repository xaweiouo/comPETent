import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import image01 from '../../images/image-01.jpg';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const SitterServiceDetail = () => {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState({});
  const [reviews, setReviews] = useState([])

  const schedule = [
    { day: "週一", times: ["10:30 - 12:00", "18:30 - 21:00"] },
    { day: "週二", times: ["11:00 - 14:00", "18:30 - 21:00"] },
    { day: "週三", times: ["18:30 - 21:00", "18:30 - 21:00"] },
    { day: "週四", times: ["18:30 - 21:00"] },
    { day: "週五", times: ["14:30 - 17:00", "18:30 - 21:00"] },
    { day: "週六", times: ["13:30 - 16:00", "18:30 - 21:00"] },
    { day: "週日", times: ["18:30 - 21:00"] },
  ];

  // 自定義顏色變數
  const colors = {
    bgLight: "#fcf6e9",
    containerBg: "#f9e4c8",
    orangeMain: "#e66b15",
    timeBg: "#e68a39"
  };

  const getServiceDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('services') // 你的資料表名稱
        .select('*')
      if (error) throw error;
      setData(data)
    } catch (err) {
      console.error('連線錯誤：', err);
    }
  }

  const getReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews') // 你的資料表名稱
        .select('*')
      if (error) throw error;
      setReviews(data)
    } catch (err) {
      console.error('連線錯誤：', err);
    }
  }

  useEffect(() => {
    getServiceDetail();
    getReviews();
  }, []);

  return (
    <>
      <div className="container">
        <p>返回</p>
        <h1>保母詳情</h1>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              {data.map(service =>

                <button type="button" className="btn btn-primary" onClick={() => setDetail(service)}>{service.id}保母詳情</button>
              )}
            </div>
            <div className="col-md-9">
              <h3>保母服務詳情</h3>
              <h4>服務類型</h4>
              <p>{detail.category}</p>
              <h4>服務寵物</h4>
              <p>{detail.species}</p>
              <h4>可服務時間</h4>
              <p>{detail.day_of_week}: {detail.start_time}~{detail.end_time}</p>

              <h4>價格</h4>
              <p>{detail.price_per_30min != null ? `${detail.price_per_30min}/30分鐘` : detail.price_per_day != null ? `${detail.price_per_day}/天` : `${detail.price_per_session}/次`}</p>
              {/* <p>{detail.price_per_30min}{detail.price_per_day}{detail.price_per_session}</p> */}

              <h4>服務描述</h4>
              <p>{detail.description}</p>
              <h4>評價</h4>
              {reviews.filter(review => review.sitter_id === detail.id).map(review => <p>{review.comment}</p>)}
            </div>
          </div>
        </div>


        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={image01} className="d-block w-100" alt="..." />
            </div>

          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <img
          src={image01}
          className="rounded-circle"
          alt="User Avatar"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />


          {/* 服務時間區塊 */}
          <div className="p-4 p-md-5 shadow-sm" style={{ backgroundColor: colors.containerBg, borderRadius: "30px" }}>
            <h2 className="text-center mb-4 fw-bold" style={{ color: colors.orangeMain }}>服務時間</h2>

            {/* 使用橫向捲軸以防小螢幕擠壓，或在 md 以上平鋪 */}
            <div className="row row-cols-7 g-7">
              {schedule.map((item, index) => (
                <div className="col" key={index}>
                  <div className="bg-white h-100 p-3 text-center border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                    <div className="fw-bold mb-3 text-dark">{item.day}</div>
                    {item.times.map((time, idx) => (
                      <div
                        key={idx}
                        className="small py-1 mb-2 text-white fw-medium"
                        style={{ backgroundColor: colors.timeBg, borderRadius: "10px" }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 下方按鈕區塊 */}
          <div className="row mt-4 g-3">
            <div className="col-6">
              <button
                className="btn w-100 py-2 fw-bold shadow-sm"
                style={{
                  color: colors.orangeMain,
                  border: `2px solid ${colors.orangeMain}`,
                  borderRadius: "50px",
                  backgroundColor: "transparent"
                }}
              >
                聯絡保母
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn w-100 py-2 fw-bold text-white shadow-sm"
                style={{
                  backgroundColor: colors.orangeMain,
                  borderRadius: "50px",
                  border: "none"
                }}
              >
                開始預約
              </button>
            </div>
          </div>

        <h2>好評推薦</h2>
        <div className="container mt-5">
          {/* 評論區容器：設定固定高度與溢出捲動 */}
          <div
            className="px-3 py-2 bg-light rounded"
            style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #eee' }}
          >

            {/* 單一評論卡片 */}

            {reviews.filter(review => review.sitter_id === detail.id).map(review => (
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center mb-2">
                      {/* 圓形頭貼 */}
                      <img
                        src={image01}
                        className="rounded-circle me-3"
                        alt="Avatar"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="mb-0 fw-bold">Yian</h6>
                        <div className="text-warning">
                          {/* 這裡可以用 Icon 字體如 FontAwesome */}
                          ★★★★★
                        </div>
                      </div>
                    </div>
                    <small className="text-muted">2026/01/02</small>
                  </div>
                  <p className="card-text mt-2 text-secondary">{review.comment}</p>
                </div>
              </div>
            ))}


          </div>
        </div>


      </div>
    </>
  )
}
export default SitterServiceDetail