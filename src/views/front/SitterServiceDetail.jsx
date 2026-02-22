import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import allen_carousel01 from '../../images/Allen_carousel01.jpg';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const SitterServiceDetail = () => {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState({});
  // const [reviews, setReviews] = useState([]);

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

  // const getReviews = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('reviews') // 你的資料表名稱
  //       .select('*')
  //     if (error) throw error;
  //     setReviews(data)
  //   } catch (err) {
  //     console.error('連線錯誤：', err);
  //   }
  // }

  useEffect(() => {
    getAllService();
    // getReviews();
  }, []);

  return (
    <>
      <div className="">
        <div className="container">
          <img src="./src/images/icons/left_chevron_icon.png" alt="" />
          <Link to='/home' className="ms-2 text-decoration-none">返回</Link>
        </div>
        <div className="container">
          <div className="row">
            <div className="">
              {data.map(service =>

                <button type="button" className="btn btn-primary" onClick={() => setDetail(service)}>{service.users.nickname}保母詳情</button>
              )}
            </div>
            {/* <div className="col-md-9">
              <h3>保母服務詳情</h3>
              <h4>服務類型</h4>
              <p>{detail.category}</p>
              <h4>服務寵物</h4>
              <p>{detail.species}</p>
              <h4>可服務時間</h4>
              <p>{detail.day_of_week}: {detail.start_time}~{detail.end_time}</p>

              <h4>價格</h4>
              <p>{detail.price_per_30min != null ? `${detail.price_per_30min}/30分鐘` : detail.price_per_day != null ? `${detail.price_per_day}/天` : `${detail.price_per_session}/次`}</p>

              <h4>服務描述</h4>
              <p>{detail.description}</p>
              <h4>評價</h4>
              {reviews.filter(review => review.sitter_id === detail.id).map(review => <p>{review.comment}</p>)}
            </div> */}
          </div>
        </div>


        <div id="carouselExample" className="container carousel slide mb-4 position-relative">
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>



          <div className="carousel-inner rounded-4" style={{ height: '451px' }}>
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

        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center mb-7">
              <img
                // src='./src/images/Allen.png'
                src={detail.photo_url}
                className="rounded-circle border border-secondary border-2 me-4"
                alt="User Avatar"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h2 className="me-10">{detail?.users?.nickname}</h2>
              <span class="badge rounded-pill bg-transparent text-dark fs-5 px-2 py-2" style={{ border: '2px solid #FA812F' }}>保母</span>
            </div>

            <div className="d-flex">
              <div className="d-flex">
                <p className="h5 mb-7 me-2" style={{ color: '#FF5400' }}>NT$</p>
                <p className="h5 mb-7" style={{ color: '#FF5400' }}>{detail.price_per_30min != null ? `${detail.price_per_30min} / 30分鐘` : detail.price_per_day != null ? `${detail.price_per_day} / 天` : `${detail.price_per_session} / 次`}</p>
              </div>

              <div
                className="ms-8 me-3"
                style={{ zIndex: 10, cursor: 'pointer' }}
              >
                <img src="./src/images/icons/empt_heart_icon.png" alt="" />
              </div>
            </div>

          </div>

          <div className="row row-cols-2 g-4">
            <div className="col">
              <div className="d-flex flex-column bg-white bg-opacity-50 rounded-4 px-7 py-10" style={{ height: '106px' }}>

                <div className="mb-7">
                  <img src="./src/images/icons/star_full_icon.png" alt="" />
                  <img src="./src/images/icons/star_null_icon.png" alt="" />
                  {detail.rating}
                </div>
                <div>
                  <img src="./src/images/icons/location_icon.png" alt="" />
                  台中市 中區
                </div>
              </div>
            </div>
            <div className="col">
              <div className="d-flex flex-column bg-white bg-opacity-50 rounded-4 px-7 py-10" style={{ height: '106px' }}>
                <div className="d-flex">
                <p className="mb-3">
                  服務項目
                  <span class="badge rounded-pill text-bg-light border ms-10">
                    {detail.category}
                  </span>
                </p>

                <p className="mb-7 ms-4">
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
              {schedule.map((item, index) => (
                <div className="col" key={index}>
                  <div className="bg-white h-100 p-3 text-center border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                    <div className="fw-bold mb-3 text-dark">{item.day}</div>
                    {item.times.map((time, idx) => (
                      <div
                        key={idx}
                        className="small py-1 mb-2 text-white fw-medium"
                        style={{ backgroundColor: '#FA812F', borderRadius: "10px" }}
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

                  navigate('/booking', {
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
          <div className="container">
            <div className="d-flex">
              <img src="./src/images/icons/good_icon.svg" alt="" style={{ width: '32px' }} />
              <h2 className="ms-3" style={{ color: '#FF5400' }}>好評推薦</h2>
            </div>

            {/* 評論區容器：設定固定高度與溢出捲動 */}
            <div
              className="px-3 py-2 bg-light rounded"
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

              {/* {reviews.filter(review => review.sitter_id === detail.id).map(review => (
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
              ))} */}


            </div>
          </div>
        </div>


      </div>
    </>
  )
}
export default SitterServiceDetail