import { supabase } from "../../utils/supabaseClient";
// import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { data, Link, useNavigate, useParams } from "react-router";

import { starRating } from "../../utils/starRating";
import { mandarinWeekDay } from "../../utils/mandarinWeekDay";

import { useSelector } from "react-redux";

// import allen_carousel01 from '../../images/Allen_carousel01.jpg';
import left_chevron_icon from '../../images/icons/left_chevron_icon.png';
import love_icon from '../../images/icons/love_icon.png';
import empt_heart_icon from '../../images/icons/empt_heart_icon.png';
import location_icon from '../../images/icons/location_icon.png';
// import { FavoriteButton } from "../../utils/FavoriteButton";

const SitterServiceDetail = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [detail, setDetail] = useState([]);
  // const [favorite, setFavorite] = useState('');
  // const willFavorite = !isFavorite;
  const [userId, setUserId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [serviceDetail, setServiceDetail] = useState(null); // 基礎資訊
  const [allSchedules, setAllSchedules] = useState([]); // 整合後的時段
  const [reviews, setReviews] = useState([]); // 評論列表
  const [isFavorite, setIsFavorite] = useState(false);

  // const [loading, setLoading] = useState(true);

  const params = useParams();
  const { id } = params;

  const { user, isAuthenticated } = useSelector(state => state.auth);
  // let ownerId='';
  // const ownerId=users.find(use=>use.email===user.email)?.id

  const weekSorter = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
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

  //重寫一段initial fetchData--------------------
  // useEffect(() => {
  //   // 1. 基礎資料下載 (只要有 id 就能跑)
  //   const fetchBaseData = async () => {
  //     try {
  //       const { data: baseService } = await supabase
  //         .from('services')
  //         .select(`*, users!services_sitter_id_fkey(nickname, avatar_url), locations(*)`)
  //         .eq('id', id)
  //         .single();

  //       if (baseService) {
  //         setServiceDetail(baseService);
  //         // 取得該保母的其他時段
  //         fetchSchedules(baseService.sitter_id, baseService.category);
  //       }
  //     } catch (err) { console.error(err); }
  //   };

  //   // 2. 收藏狀態檢查 (必須同時有 serviceDetail 和 user 才能跑)
  //   const checkFavorite = async () => {
  //     // 關鍵守護條件：沒登入或還沒拿到保母 ID 就直接跳出
  //     if (!user || !serviceDetail) return;

  //     const { data } = await supabase
  //       .from('favorites')
  //       .select('id')
  //       .eq('owner_id', user.id)
  //       .eq('sitter_id', serviceDetail.sitter_id)
  //       .maybeSingle(); // 使用 maybeSingle 避免找不到資料時報 406 錯誤

  //     setIsFavorite(!!data);
  //   };

  //   fetchBaseData();
  //   checkFavorite();

  // // 依賴項加入 id 和 user 是正確的，但裡面要判斷 null
  // }, [id, user, serviceDetail?.sitter_id]);


  //---------------------------------
  useEffect(() => {
    fetchData();

  }, [id, user]);

  const fetchData = async () => {
    try {
      // 1. 取得該服務的基本資訊與保母資訊
      const { data: baseService, error: baseError } = await supabase
        .from('services')
        .select(`
          *,
          users!services_sitter_id_fkey (id, nickname, avatar_url),
          locations (city, district),
          service_photos (photo_url, sort_order)
        `)
        .eq('id', id)
        .maybeSingle();
      setServiceDetail(baseService);
      console.log('servicedetail:', baseService);
      if (baseError) throw baseError;

      // 2. 根據保母 ID 和 類別，抓取所有相關時段
      const { data: schedules, error: scheduleError } = await supabase
        .from('services')
        .select('id, day_of_week, start_time, end_time')
        .eq('sitter_id', baseService.sitter_id)
        .eq('category', baseService.category);
      setAllSchedules(schedules);
      console.log('schedules:', schedules);
      if (scheduleError) throw scheduleError;

      // 3. 取得該保母的所有評論
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select(`
          id, rating, comment,
          users!reviews_owner_id_fkey (nickname, avatar_url)
        `)
        .eq('sitter_id', baseService.sitter_id);
      setReviews(reviewData);
      console.log('reviews:', reviewData);
      if (reviewError) throw reviewError;

      // 4. 檢查收藏狀態 (若已登入)
      if (user) {
        //         console.log('Checking IDs:', { 
        //   owner_id: user.id, 
        //   sitter_id: baseService?.sitter_id 
        // });
        const { data:userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();
        
        const { data: favData, error: favError } = await supabase
          .from('favorites')
          .select('id')
          // .eq('owner_id', user.id)
          .eq('owner_id', userData.id)
          .eq('sitter_id', baseService.sitter_id)
          .maybeSingle();
        setIsFavorite(!!favData);
        console.log('favorite:', favData);
        console.log('faveError:', favError);
        // console.log('internalId',internalId);
        console.log('user:',user)
      }
    } catch (error) {
      console.log('Error fetching details:', error.message);
    }
  };

  // const handleToggleFavorite = async () => {
  //   if (!isAuthenticated) {
  //     alert('請先登入再使用收藏功能');
  //     return;
  //   }

  //   if (isFavorite) {
  //     // 取消收藏
  //     await supabase.from('favorites').delete().eq('owner_id', user.id).eq('sitter_id', serviceDetail.sitter_id);
  //     setIsFavorite(false);
  //   } else {
  //     // 新增收藏
  //     await supabase.from('favorites').insert({ owner_id: user.id, sitter_id: serviceDetail.sitter_id });
  //     setIsFavorite(true);
  //   }
  // };
  //----------------------------------------------

  // const getAllService = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('services')
  //       .select(`
  //   *,
  //   users!sitter_id (*), 
  //   reviews:users!sitter_id (
  //     reviews!sitter_id (*) 
  //   )
  // `);
  //     if (error) throw error;
  //     console.log(data);
  //     !data.find(service => service.id == id) && navigate('*', { replace: true });

  //     setServices(data);

  //   } catch (err) {
  //     console.error('連線錯誤：', err);
  //   }
  // };

  // const getAllUsers = async () => {
  //   try {
  //     const { data, error } = await supabase.from('users').select('*');
  //     setUsers(data);
  //     console.log(data);
  //   } catch (error) {
  //     console.error('連線錯誤：', error);
  //   }
  // }

  // useEffect(() => {
  //   getAllService();
  //   getAllUsers();
  // }, [id]);

  // // 當 services 資料回來後，進行篩選
  // useEffect(() => {
  //   // 確保 services 已經有資料且 id 存在
  //   if (services.length > 0 && id) {
  //     // 找到當前 id 對應的那一筆
  //     const firstService = services.find(s => s.id == id);

  //     if (firstService) {
  //       // 篩選出同保母且同類別的所有服務
  //       const filteredServices = services.filter(s =>
  //         s.sitter_id === firstService.sitter_id &&
  //         s.category === firstService.category
  //       ).reverse().sort((a, b) =>
  //         weekSorter.indexOf(a.day_of_week) - weekSorter.indexOf(b.day_of_week));

  //       setDetail(filteredServices);
  //     }
  //   };
  //   // getFavorite();
  // }, [services, id]); // 當服務列表或 ID 變動時重新篩選

  // // 1. 初始化：檢查登入狀態與收藏狀態
  // useEffect(() => {
  //   const checkStatus = async () => {
  //     // const { data: { user } } = await supabase.auth.getUser();

  //     if (user) {
  //       setUserId(users.find(use => use.email === user.email)?.id);
  //       // 查詢資料庫是否存在該收藏
  //       const { data, error } = await supabase
  //         .from('favorites')
  //         .select('*')
  //         .eq('owner_id', userId)
  //         .eq('sitter_id', detail[0].sitter_id)
  //         .maybeSingle();

  //       setIsFavorite(!!data);
  //     }
  //     // setLoading(false);
  //   };

  //   checkStatus();
  // }, [detail]);

  // // 2. 處理點擊邏輯
  // const toggleFavorite = async () => {
  //   // 未登入處理
  //   if (!userId) {
  //     alert('請先登入後再進行收藏！');
  //     return;
  //   }

  //   // 樂觀更新 UI (先改畫面，再跑 API)
  //   const previousState = isFavorite;
  //   setIsFavorite(!previousState);

  //   if (previousState) {
  //     // 取消收藏 (Delete)
  //     const { error } = await supabase
  //       .from('favorites')
  //       .delete()
  //       .eq('owner_id', userId)
  //       .eq('sitter_id', detail[0].sitter_id);

  //     if (error) {
  //       setIsFavorite(previousState); // 失敗則回滾
  //       console.log(error)
  //     }
  //   } else {
  //     // 新增收藏 (Insert)
  //     const { error } = await supabase
  //       .from('favorites')
  //       .insert([{ owner_id: userId, sitter_id: detail[0].sitter_id }]);

  //     if (error) {
  //       setIsFavorite(previousState); // 失敗則回滾
  //       console.log(error)
  //     }
  //   }
  // };

  return (
    <>
      {JSON.stringify(user)}
      <div className="">
        <div className="container">
          <img src={left_chevron_icon} alt="" />
          <Link to='/' className="ms-2 text-decoration-none">返回</Link>
        </div>


        {/* 輪播 */}
        <div className="container">
          <div id="carouselExample" className=" carousel slide mb-4 position-relative">

            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>


            <div className="carousel-inner rounded-4 carousel_sitter-service-detail" style={{}}>
              <div className="carousel-item h-100 active">
                <img src={detail[0]?.photo_url} className="d-block w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} alt="..." />
              </div>

              <div className="carousel-item h-100">
                <img src={detail[0]?.photo_url} className="d-block w-100 h-100" alt="..." />
              </div>

              <div className="carousel-item h-100">
                <img src={detail[0]?.photo_url} className="d-block w-100 h-100" alt="..." />
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
                  src={detail[0]?.users?.avatar_url}
                  className="user_avatar rounded-circle border border-secondary border-2 me-4"
                  alt="User Avatar"
                  style={{}}
                />
                <h2 className="me-10" style={{ fontFamily: '"Noto Sans TC",sans-serif', fontWeight: 700 }}>{detail[0]?.users?.nickname}</h2>
                <span className="badge rounded-pill bg-transparent text-dark fs-5 px-2 py-2" style={{ border: '2px solid #FA812F' }}>保母</span>
              </div>

              <div className="d-flex align-items-center">
                <p className="h5 me-2" style={{ color: '#FF5400', fontFamily: '"Noto Sans TC",sans-serif', fontWeight: 700 }}>NT$</p>
                <p className="h5" style={{ color: '#FF5400', fontFamily: '"Noto Sans TC",sans-serif', fontWeight: 700, fontSize: '28px' }}>{detail[0]?.price_per_30min != null ? `${detail[0]?.price_per_30min} / 30分鐘` : detail[0]?.price_per_day != null ? `${detail[0]?.price_per_day} / 天` : `${detail[0]?.price_per_session} / 次`}</p>
              </div>


            </div>

            <div
              className="ms-8 me-3 mb-7"
              style={{ cursor: 'pointer' }}
            >
              <img src={empt_heart_icon} alt="" />
            </div>

            {/* <button
              onClick={toggleFavorite}
              className="transition duration-200 transform hover:scale-110"
            > */}
            {isFavorite ? (
              <div
                className="ms-8 me-3 mb-7"
                style={{ cursor: 'pointer' }}
              // onClick={toggleFavorite}
              >
                <img src={love_icon} alt="" />
              </div>
            ) : (
              <div
                className="ms-8 me-3 mb-7"
                style={{ cursor: 'pointer' }}
              // onClick={toggleFavorite}
              >
                <img src={empt_heart_icon} alt="" />
              </div>
            )}
            {/* </button> */}


          </div>

          <div className="row row-cols-1 row-cols-sm-2 g-4">

            <div className="col">
              <div className="d-flex flex-column bg-white bg-opacity-50 rounded-4 px-7 py-10" style={{ height: '106px' }}>

                <div className="d-flex align-items-center mb-7">
                  {starRating(detail[0]?.rating)}
                  <p style={{ fontFamily: '"Noto Sans TC",sans-serif', fontWeight: 700, marginBottom: 0 }}>
                    {detail[0]?.rating}
                  </p>
                </div>
                <div>
                  <img src={location_icon} alt="" />
                  台中市 中區
                </div>
              </div>
            </div>

            <div className="col">
              <div className="d-flex flex-column bg-white bg-opacity-50 rounded-4 px-7 py-10" style={{}}>
                <div className="d-flex flex-column flex-sm-row">
                  <p className="mb-3" style={{ fontFamily: '"Noto Sans TC",sans-serif', fontWeight: 700 }}>
                    服務項目
                    <span className="badge rounded-pill text-bg-light border ms-10">
                      {detail[0]?.category}
                    </span>
                  </p>

                  <p className="mb-7 ms-sm-4" style={{ fontFamily: '"Noto Sans TC",sans-serif', fontWeight: 700 }}>
                    服務寵物
                    <span className="badge rounded-pill text-bg-light border ms-10">
                      {detail[0]?.species}
                    </span>
                  </p>
                </div>

                <p>{detail[0]?.description}</p>
              </div>
            </div>

          </div>
        </div>



        <div className="container">
          {/* 服務時間區塊 */}
          <div className="p-4 p-md-5 shadow-sm mt-8" style={{ backgroundColor: '#FA812F33', borderRadius: "30px" }}>
            <h5 className="text-primary text-center mb-4 fw-bold" >服務時間</h5>

            {/* 使用橫向捲軸以防小螢幕擠壓，或在 md 以上平鋪 */}
            <div className="row row-cols-7 g-7 flex-sm-row flex-column">
              {/* {testServiceArr} */}
              {/* {detail.sort((a,b)=>
              weekSorter.indexOf(a.day_of_week) - weekSorter.indexOf(b.day_of_week))} */}
              {detail.map(service => (
                <div className="col">
                  <div className="bg-white h-100 p-3 text-center border-0 shadow-sm" style={{ borderRadius: "15px" }}>

                    <div className="fw-bold mb-3 text-dark">
                      {mandarinWeekDay(service.day_of_week)}
                    </div>

                    <div
                      // key={idx}
                      className="small py-1 mb-2 text-white fw-medium"
                      style={{ backgroundColor: '#FA812F', borderRadius: "10px" }}
                    >
                      {service.start_time.slice(0, -3)} ~ {service.end_time.slice(0, -3)}
                    </div>

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
                  if (isAuthenticated) {
                    navigate('booking', {
                      state: {
                        serviceId: detail[0].id,
                        sitterId: detail[0].sitter_id,
                      },
                    });
                  } else {
                    alert('請先登入')
                  }

                  // if (!detail.id || !detail.sitter_id) {
                  //   alert('請先選擇一個保母服務');
                  //   return;
                  // }             
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
                <path d="M11 4.66048e-09C11.7652 -4.26217e-05 12.5015 0.292325 13.0583 0.817284C13.615 1.34224 13.9501 2.06011 13.995 2.824L14 3V7H16C16.7351 6.99988 17.4447 7.26968 17.994 7.75819C18.5434 8.24669 18.8942 8.91989 18.98 9.65L18.995 9.824L19 10L18.98 10.196L17.974 15.228C17.593 16.854 16.472 18.024 15.164 18.008L15 18H7C6.75507 18 6.51866 17.91 6.33563 17.7473C6.15259 17.5845 6.03566 17.3603 6.007 17.117L6 17L6.001 7.464C6.00118 7.28864 6.04747 7.11641 6.13523 6.96458C6.22299 6.81276 6.34913 6.68668 6.501 6.599C6.92742 6.35272 7.28662 6.00519 7.54684 5.58713C7.80706 5.16907 7.96029 4.69335 7.993 4.202L8 4V3C8 2.20435 8.31607 1.44129 8.87868 0.87868C9.44129 0.316071 10.2044 4.66048e-09 11 4.66048e-09Z" fill="#FF5400" className="gradient-fill" />
                <path d="M3 7C3.24493 7.00003 3.48134 7.08996 3.66437 7.25272C3.84741 7.41547 3.96434 7.63975 3.993 7.883L4 8V17C3.99997 17.2449 3.91004 17.4813 3.74728 17.6644C3.58453 17.8474 3.36025 17.9643 3.117 17.993L3 18H2C1.49542 18.0002 1.00943 17.8096 0.639452 17.4665C0.269471 17.1234 0.0428434 16.6532 0.00500021 16.15L1.00272e-07 16V9C-0.000159579 8.49542 0.190406 8.00943 0.533497 7.63945C0.876588 7.26947 1.34684 7.04284 1.85 7.005L2 7H3Z" fill="#FF5400" className="gradient-fill" />
              </svg>


              <h2 className="ms-3" style={{ color: '#FF5400' }}>好評推薦</h2>
            </div>

            {/* 評論區容器：設定固定高度與溢出捲動 */}
            <div
              className="px-3 py-2 mt-8 rounded"
              style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #eee', backgroundColor: '#FEF3E2' }}
            >

              {/* 單一評論卡片 */}
              {
                detail[0]?.reviews?.reviews.map(review =>
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center mb-2">

                          <img
                            src={users.find(user => user.id === review.owner_id)?.avatar_url}
                            className="rounded-circle me-3"
                            alt="Avatar"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          />
                          <div>
                            <h6 className="mb-0 fw-bold">{users.find(user => user.id === review.owner_id)?.nickname}</h6>
                            <div className="text-warning">
                              {starRating(review.rating)}
                              {/* ★★★★★ */}
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
export default SitterServiceDetail;