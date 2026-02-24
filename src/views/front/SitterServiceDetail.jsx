import { supabase } from "../../utils/supabaseClient";
// import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import allen_carousel01 from '../../images/Allen_carousel01.jpg';

import { starRating } from "../../utils/starRating";
import { mandarinWeekDay } from "../../utils/mandarinWeekDay";

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const SitterServiceDetail = () => {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState({});
  // const [reviews, setReviews] = useState([]);

  // const schedule = [

  //   { day: "週一", times: ["10:30 - 12:00", "18:30 - 21:00"] },
  //   { day: "週二", times: ["11:00 - 14:00", "18:30 - 21:00"] },
  //   { day: "週三", times: ["18:30 - 21:00", "18:30 - 21:00"] },
  //   { day: "週四", times: ["18:30 - 21:00"] },
  //   { day: "週五", times: ["14:30 - 17:00", "18:30 - 21:00"] },
  //   { day: "週六", times: ["13:30 - 16:00", "18:30 - 21:00"] },
  //   { day: "週日", times: ["18:30 - 21:00"] },
  // ];

  // 自定義顏色變數
  const colors = {
    bgLight: "#fcf6e9",
    containerBg: "#f9e4c8",
    orangeMain: "#e66b15",
    timeBg: "#e68a39"
  };

  const navigate = useNavigate();

  // const getServiceDetail = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('services') // 你的資料表名稱
  //       .select('*')
  //     if (error) throw error;
  //     setData(data)
  //   } catch (err) {
  //     console.error('連線錯誤：', err);
  //   }
  // }

  const getAllService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
    *,
    users!sitter_id (*), 
    reviews:users!sitter_id (
      reviews!sitter_id (*) 
    )
  `);
      if (error) throw error;
      console.log(data)
      setData(data)
    } catch (err) {
      console.error('連線錯誤：', err);
    }
  }

  useEffect(() => {
    getAllService();

  }, []);

  return (
    <>
      <div className="container mt-4">
        <button type="button" className="btn btn-primary text-white"
          onClick={() => {
            // 1. 複製一份新陣列，避免直接修改原狀態
            const sortedData = [...data].sort((a, b) => {
              // 2. 取得 a 和 b 的有效價格 (取這三個欄位中第一個不為 null 的值)
              const priceA = a.price_per_30min ?? a.price_per_day ?? a.price_per_session ?? 0;
              const priceB = b.price_per_30min ?? b.price_per_day ?? b.price_per_session ?? 0;

              return priceA - priceB;
            });

            // 3. 更新狀態，觸發重新渲染
            setData(sortedData);
          }}>
          價格低到高
        </button>

        <button type="button" className="btn btn-primary text-white"
          onClick={() => {
            // 1. 複製一份新陣列，避免直接修改原狀態
            const sortedData = [...data].sort((a, b) => {
              // 2. 取得 a 和 b 的有效價格 (取這三個欄位中第一個不為 null 的值)
              const priceA = a.price_per_30min ?? a.price_per_day ?? a.price_per_session ?? 0;
              const priceB = b.price_per_30min ?? b.price_per_day ?? b.price_per_session ?? 0;

              return priceB - priceA;
            });

            // 3. 更新狀態，觸發重新渲染
            setData(sortedData);
          }}>
          價格高到低
        </button>

        <button type="button" className="btn btn-primary text-white"
          onClick={() => {
            // 1. 複製一份新陣列，避免直接修改原狀態
            const sortedData = [...data].sort((a, b) => {
              // // 2. 取得 a 和 b 的有效價格 (取這三個欄位中第一個不為 null 的值)
              // const priceA = a.price_per_30min ?? a.price_per_day ?? a.price_per_session ?? 0;
              // const priceB = b.price_per_30min ?? b.price_per_day ?? b.price_per_session ?? 0;

              return b.rating - a.rating;
            });

            // 3. 更新狀態，觸發重新渲染
            setData(sortedData);
          }}>
          星級高到低
        </button>

        {
          data.map(service => (

            <div className="d-flex  align-items-center shadow-sm border-0 p-3 my-3" style={{ backgroundColor: 'white', borderRadius: '12px' }}>

              {/* 左側圖片區 (md-4 代表在桌面版佔 4/12 寬度) */}
              <div className="">
                <div className="" style={{}}>
                  <img
                    src={service.photo_url}
                    alt="服務者照片"
                    className=""
                    style={{ width: '280px', height: '280px', objectFit: 'cover' }}
                  />
                </div>
              </div>

              <div className="p-4 d-flex h-100">
                <div>
                  {/* 頂部：姓名、星等與愛心 */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 className="h4 fw-bold mb-1">{service.users.nickname}</h3>
                      <div className="d-flex align-items-center text-warning">
                        <span className="me-1">★★★★★</span>
                        <span className="text-dark fw-bold small">{service.rating}</span>
                      </div>
                    </div>
                    <button className="btn p-0 border-0 text-danger shadow-none" style={{ fontSize: '1.5rem' }}>
                      ♡
                    </button>
                  </div>

                  {/* 中間：服務標籤 */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-muted me-3 small" style={{ width: '70px' }}>服務寵物</span>
                      <div className="px-3 py-1 border rounded-pill small bg-white text-dark">狗</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="text-muted me-3 small" style={{ width: '70px' }}>服務項目</span>
                      <div className="px-3 py-1 border rounded-pill small bg-white text-dark">陪伴散步</div>
                    </div>
                  </div>

                  {/* 描述文字 */}
                  <p className="text-secondary mb-4">
                    陪伴散步，會隨時注意狗狗的狀況與安全！
                  </p>

                  {/* 底部：價格、距離與按鈕組 */}
                  {/* <div className="mt-auto pt-3 border-top d-flex flex-wrap align-items-center justify-content-between"> */}

                  {/* 價格資訊 */}
                  <div className="d-flex align-items-baseline">
                    <p className="h5 me-2" style={{ color: '#FF5400' }}>NT$</p>
                    <p className="h5" style={{ color: '#FF5400' }}>{service.price_per_30min != null ? `${service.price_per_30min} / 30分鐘` : service.price_per_day != null ? `${service.price_per_day} / 天` : `${service.price_per_session} / 次`}</p>
                    {/* <span className="text-muted small me-1">NT$</span>
                <span className="h3 fw-bold mb-0">200</span>
                <span className="text-muted small ms-1">/ 30 分鐘</span> */}
                  </div>
                </div>

                <div>
                  {/* 地點與距離 (桌面版靠右對齊) */}
                  <div className="d-none d-lg-block">
                    <div className="small text-dark fw-medium">
                      📍 台中市 中區
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>距離 1km</div>
                  </div>

                  {/* 按鈕組 */}
                  <div className="d-flex gap-2 ms-auto">
                    <button className="btn btn-outline-secondary rounded-pill px-4 btn-sm fw-medium">
                      詳情
                    </button>
                    <button
                      className="btn rounded-pill px-4 btn-sm fw-bold text-white"
                      style={{ backgroundColor: '#E65100' }}
                    >
                      預約
                    </button>
                  </div>
                </div>
              </div>
            </div>

          )
          )
        }
      </div>


      <div className="container">
        <div className="row">
          <div className="">
            {data.map(service =>
              <button type="button" className="btn btn-primary" onClick={() => setDetail(service)}>{service.users.nickname}保母詳情</button>
            )}
          </div>
        </div>
      </div>

      <div className="">
        <div className="container">
          <img src="./src/images/icons/left_chevron_icon.png" alt="" />
          <Link to='/home' className="ms-2 text-decoration-none">返回</Link>
        </div>


        {/* 輪播 */}
        <div className="container">
          <div id="carouselExample" className=" carousel slide mb-4 position-relative">

            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>


            <div className="carousel-inner rounded-4 carousel_sitter-service-detail" style={{}}>
              <div className="carousel-item h-100 active">
                <img src={allen_carousel01} className="d-block w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} alt="..." />
              </div>

              <div className="carousel-item h-100">
                <img src='./src/images/Allen.png' className="d-block w-100 h-100" alt="..." />
              </div>

              <div className="carousel-item h-100">
                <img src='./src/images/Allen.png' className="d-block w-100 h-100" alt="..." />
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
        </div>

        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-7" style={{ width: '93.83%' }}>

              <div className="d-flex align-items-center mb-10">
                <img
                  src={detail?.users?.avatar_url}
                  className="user_avatar rounded-circle border border-secondary border-2 me-4"
                  alt="User Avatar"
                  style={{}}
                />
                <h2 className="me-10">{detail?.users?.nickname}</h2>
                <span class="badge rounded-pill bg-transparent text-dark fs-5 px-2 py-2" style={{ border: '2px solid #FA812F' }}>保母</span>
              </div>

              <div className="d-flex">
                <p className="h5 me-2" style={{ color: '#FF5400' }}>NT$</p>
                <p className="h5" style={{ color: '#FF5400' }}>{detail.price_per_30min != null ? `${detail.price_per_30min} / 30分鐘` : detail.price_per_day != null ? `${detail.price_per_day} / 天` : `${detail.price_per_session} / 次`}</p>
              </div>


            </div>




            <div
              className="ms-8 me-3 mb-7"
              style={{ cursor: 'pointer' }}
            >
              <img src="./src/images/icons/empt_heart_icon.png" alt="" />
            </div>


          </div>

          <div className="row row-cols-1 row-cols-sm-2 g-4">

            <div className="col">
              <div className="d-flex flex-column bg-white bg-opacity-50 rounded-4 px-7 py-10" style={{ height: '106px' }}>

                <div className="mb-7">
                  {starRating(detail.rating)}
                  {detail.rating}
                </div>
                <div>
                  <img src="./src/images/icons/location_icon.png" alt="" />
                  台中市 中區
                </div>
              </div>
            </div>

            <div className="col">
              <div className="d-flex flex-column bg-white bg-opacity-50 rounded-4 px-7 py-10" style={{}}>
                <div className="d-flex flex-column flex-sm-row">
                  <p className="mb-3">
                    服務項目
                    <span class="badge rounded-pill text-bg-light border ms-10">
                      {detail.category}
                    </span>
                  </p>

                  <p className="mb-7 ms-sm-4">
                    服務寵物
                    <span class="badge rounded-pill text-bg-light border ms-10">
                      {detail.species}
                    </span>
                  </p>
                </div>


                <p>{detail.description}</p>
              </div>
            </div>

          </div>
        </div>



        <div className="container">
          {/* 服務時間區塊 */}
          <div className="p-4 p-md-5 shadow-sm mt-8" style={{ backgroundColor: '#FA812F33', borderRadius: "30px" }}>
            <h5 className="text-primary text-center mb-4 fw-bold" >服務時間</h5>

            {/* 使用橫向捲軸以防小螢幕擠壓，或在 md 以上平鋪 */}
            <div className="row row-cols-7 g-7">
              <div className="col">
                <div className="bg-white h-100 p-3 text-center border-0 shadow-sm" style={{ borderRadius: "15px" }}>

                  <div className="fw-bold mb-3 text-dark">
                    {mandarinWeekDay(detail.day_of_week)}
                  </div>

                  <div
                    // key={idx}
                    className="small py-1 mb-2 text-white fw-medium"
                    style={{ backgroundColor: '#FA812F', borderRadius: "10px" }}
                  >
                    {detail?.start_time?.slice(0, -3)} ~ {detail?.end_time?.slice(0, -3)}
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* 下方按鈕區塊 */}
          <div className="row mt-4 g-3">
            <div className="col-6">
              <button
                className="btn w-100 py-2 fw-bold shadow-sm"
                style={{
                  color: '#FF5400',
                  border: `2px solid #FF5400`,
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
                  backgroundColor: '#FF5400',
                  borderRadius: "50px",
                  border: "none"
                }}
                onClick={() => {
                  if (!detail.id || !detail.sitter_id) {
                    alert('請先選擇一個保母服務');
                    return;
                  }

                  navigate('booking', {
                    state: {
                      serviceId: detail.id,
                      sitterId: detail.sitter_id,
                    },
                  });
                }}
              >
                開始預約
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5" style={{
          backgroundColor: '#FFB22C33'
        }}>
          <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div className="d-flex justify-content-center align-items-center">

              <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="good-icon">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" style={{ stopColor: '#FFB22C', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FF5400', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M11 4.66048e-09C11.7652 -4.26217e-05 12.5015 0.292325 13.0583 0.817284C13.615 1.34224 13.9501 2.06011 13.995 2.824L14 3V7H16C16.7351 6.99988 17.4447 7.26968 17.994 7.75819C18.5434 8.24669 18.8942 8.91989 18.98 9.65L18.995 9.824L19 10L18.98 10.196L17.974 15.228C17.593 16.854 16.472 18.024 15.164 18.008L15 18H7C6.75507 18 6.51866 17.91 6.33563 17.7473C6.15259 17.5845 6.03566 17.3603 6.007 17.117L6 17L6.001 7.464C6.00118 7.28864 6.04747 7.11641 6.13523 6.96458C6.22299 6.81276 6.34913 6.68668 6.501 6.599C6.92742 6.35272 7.28662 6.00519 7.54684 5.58713C7.80706 5.16907 7.96029 4.69335 7.993 4.202L8 4V3C8 2.20435 8.31607 1.44129 8.87868 0.87868C9.44129 0.316071 10.2044 4.66048e-09 11 4.66048e-09Z" fill="#FF5400" class="gradient-fill" />
                <path d="M3 7C3.24493 7.00003 3.48134 7.08996 3.66437 7.25272C3.84741 7.41547 3.96434 7.63975 3.993 7.883L4 8V17C3.99997 17.2449 3.91004 17.4813 3.74728 17.6644C3.58453 17.8474 3.36025 17.9643 3.117 17.993L3 18H2C1.49542 18.0002 1.00943 17.8096 0.639452 17.4665C0.269471 17.1234 0.0428434 16.6532 0.00500021 16.15L1.00272e-07 16V9C-0.000159579 8.49542 0.190406 8.00943 0.533497 7.63945C0.876588 7.26947 1.34684 7.04284 1.85 7.005L2 7H3Z" fill="#FF5400" class="gradient-fill" />
              </svg>


              <h2 className="ms-3" style={{ color: '#FF5400' }}>好評推薦</h2>
            </div>

            {/* 評論區容器：設定固定高度與溢出捲動 */}
            <div
              className="px-3 py-2 mt-8 bg-light rounded"
              style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #eee' }}
            >

              {/* 單一評論卡片 */}
              {
                detail?.reviews?.reviews.map(review =>
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center mb-2">

                          <img
                            src='./src/images/Allen.png'
                            className="rounded-circle me-3"
                            alt="Avatar"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          />

                          <div>
                            <h6 className="mb-0 fw-bold">Yian</h6>
                            <div className="text-warning">

                              ★★★★★
                            </div>
                          </div>
                        </div>
                        <small className="text-muted">2026/01/02</small>
                      </div>
                      <p className="card-text mt-2">{review.comment}</p>
                    </div>
                  </div>
                )
              }



            </div>
          </div>
        </div>


      </div>
    </>
  )
}
export default SitterServiceDetail