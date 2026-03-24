import { useEffect, useState } from 'react';
import bannerImg from "../../images/banner_img.png"
import feetIcon from "../../images/icons/feet_icon.png"
import fireIcon from "../../images/icons/fire_icon.png"
import starFull from "../../images/icons/star_full_icon.png"
import starHalf from "../../images/icons/star_half_icon.png"
import starNull from "../../images/icons/star_null_icon.png"
import flowIcon from "../../images/icons/flow_icon.png"
import ownerIcon from "../../images/icons/owner_icon.png"
import sitterIcon from "../../images/icons/sitter_icon.png"
import loveIcon from "../../images/icons/love_icon.png"
import faqIcon from "../../images/icons/faq_icon.png"
import { useNavigate } from 'react-router';
import { supabase } from "../../lib/supabaseClient";
import { PET_SPECIES_OPTIONS } from "../../utils/options"
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

const Home = () => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate()
  const faqList = [
    {
      question: '我可以使用現金付款嗎？',
      answer: '不可以，請遵守我們的付款方式與流程以確保您享有最完整的保障。'
    }, {
      question: '我接回寵物時，發現寵物身上有外傷或是表現異常，該怎麼辦？',
      answer: '寵物若在服務過程中受到傷害，若是保母之疏失而導致的，保母需先支付相關的獸醫醫療費用，超出自負額之部分，我們的保險公司會提供醫療費。'
    }, {
      question: '我的寵物如果有攻擊性，可以預約保母服務嗎？',
      answer: '如果寵物的攻擊性非常難以掌控，您可能無法使用我們的服務。'
    }, {
      question: 'comPETent 的保母值得信任嗎？',
      answer: '我們的寵物保姆都經過身份驗證和良民證等審查。您也可以在預訂前查看每個寵物保姆的評價。'
    }
  ];
  const [sitterData, setSitterData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const next = () => {
    if (startIndex < reviews.length - 4) {
      setStartIndex(startIndex + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
  useEffect(() => {
    const getSitterData = async () => {
      const { data, error } = await supabase.from('services').select(
        `
            id,
            sitter_id,
            category,
            species,
            rating,
            price_per_30min,
            price_per_day,
            price_per_session,
            user:users!inner (
            name,
            avatar_url,
            good_citizen_status
            ),
            loc:locations!inner (
            city,
            district
            )
            `,
      )
        .eq("users.good_citizen_status", "approved")
        .gt("rating", 4.9)
      // console.log(data)
      if (error) {
        console.log(error)
      }
      const formattedData = data.map((item) => ({
        serviceId: item.id,
        name: item.user.name,
        rating: item.rating,
        category: item.category,
        species: PET_SPECIES_OPTIONS.find((pet) => pet.value === item.species)?.label,
        city: item.loc.city,
        district: item.loc.district,
        prices: [
          { type: "30分鐘", price: item.price_per_30min },
          { type: "天", price: item.price_per_day },
          { type: "次", price: item.price_per_session }
        ].filter(p => p.price),
        imageUrl: item.user.avatar_url
      }));
      setSitterData(formattedData);
    };
    const getReviews = async () => {
      const { data, error } = await supabase.from('reviews').select(
        `
            id,
            rating,
            comment,
            owner:users!reviews_owner_id_fkey (
                name,
                avatar_url
            ),
            sitter:users!reviews_sitter_id_fkey (
                name
            )
            `
      )
        .order("rating", { ascending: false });
      const formattedData = data.map((item) => ({
        reviewId: item.id,
        ownerName: item.owner.name,
        ownerImageUrl: item.owner.avatar_url,
        sitterName: item.sitter.name,
        rating: item.rating,
        comment: item.comment
      }))
      setReviews(formattedData)
      if (error) {
        console.log(error)
      }
    }
    getSitterData()
    getReviews()
  }, [])

  return (
    <>
      <section className="container mb-9">
        <div className="row flex-column-reverse flex-md-row justify-content-md-between align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <h1 className="mt-4 mb-10 mb-md-7 fw-bold text-primary">comPETent 我能寵</h1>
            <h3 className="mb-8 fw-bold">從不認識到放心託付，comPETent 幫您把關每一步！</h3>
            <button type="button" className="fw-bold me-3 btn btn-gradient-secondary py-3 px-4">當保母</button>
            <button type="button" className="fw-bold btn btn-primary btn-gradient-primary py-3 px-4" onClick={() => navigate("/lookforpetsitter")}>找服務</button>
          </div>
          <div className="col-md-5 text-center">
            <img className="banner-image" src={bannerImg} alt="主圖" />
          </div>
        </div>
      </section>
      <section className="container mb-9">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-md-6">
            <h2 className="mb-8 text-primary fw-bold"><img src={feetIcon} className="me-3" alt="feetIcon" width="32" />關於 comPETent 我能寵</h2>
            <p className="h5 mb-2">comPETent 是協助媒合飼主與物保母的平台。</p>
            <p className="h5 mb-2">competent 有形容“能勝任的”意思，裡面包含了 PET 這三個字母，</p>
            <p className="h5 mb-2">以此為名，傳達出與我們合作的保母能給寵物無微不至的照顧！</p>
          </div>
        </div>
        <div className="row text-center mb-9">
          <div className="col-md-4 position-relative mb-6 mb-md-0">
            <div className="bg-white rounded-4 p-7 pb-md-8 h-100">
              <h5 className="mb-10 fw-bold">多元服務</h5>
              <p className="h5">comPETent 提供多元的服務，各種寵物皆能找到保母，不局限於貓、狗，還有提供各種服務的保母。</p>
            </div>
            <button type="button" className="btn btn-primary text-white fw-bold position-absolute top-100 start-50 translate-middle" onClick={() => navigate("/lookforpetsitter")}>找服務<i className="bi bi-arrow-right ms-2"></i></button>
          </div>
          <div className="col-md-4 position-relative mb-6 mb-md-0">
            <div className="bg-white rounded-4 p-7 pb-md-8 h-100">
              <h5 className="mb-10 fw-bold">自由接案</h5>
              <p className="h5">comPETent 提供保母一個自由接案的平台，讓您有機會嶄現您的專業，提供寵物無微不至的照顧。</p>
            </div>
            <button type="button" className="btn btn-primary text-white fw-bold position-absolute top-100 start-50 translate-middle">當保母<i className="bi bi-arrow-right ms-2"></i></button>
          </div>
          <div className="col-md-4 position-relative mb-6 mb-md-0">
            <div className="bg-white rounded-4 p-7 pb-md-8 h-100">
              <h5 className="mb-10 fw-bold">安心保障</h5>
              <p className="h5">於服務開始前取消預約，將全額退款。comPETent 提供免費寵物保險，且所有保母皆通過良民證審查，讓飼主更安心。</p>
            </div>
            <button type="button" className="btn btn-primary text-white fw-bold position-absolute top-100 start-50 translate-middle">看保障<i className="bi bi-arrow-right ms-2"></i></button>
          </div>
        </div>
      </section>
      {/* {JSON.stringify(sitterData)} */}
      <section className="container mb-9">
        <h2 className="text-center mb-4 mb-md-8 text-primary fw-bold"><img src={fireIcon} className="me-3" alt="fireIcon" width="32" />熱門保母</h2>
        <div className="row">
          {
            sitterData.slice(0, 3).map((sitter) => {
              return (
                <div className="col-md-4 mb-6 mb-md-0" key={sitter.serviceId}>
                  <a onClick={() => navigate(`/lookforpetsitter/${sitter.serviceId}`)} style={{ cursor: "pointer" }}>
                    <div className="card rounded-4">
                      <div className="position-relative">
                        <img src={sitter.imageUrl} className="card-img-top rounded-top-4" alt="保母圖片" height="300" />
                        <div className="bg-light bg-opacity-75 d-flex justify-content-between align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                          <h4 className="card-title fw-bold">{sitter.name}</h4>
                          <div>
                            <span className="fs-6 fw-bold px-2 py-1 rounded-pill bg-white me-10">{sitter.category}</span>
                            <span className="fs-6 fw-bold px-2 py-1 rounded-pill bg-white">{sitter.species}</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="card-text d-flex flex-column justify-content-center align-items-center">
                          <p className="fs-6 fw-bold mb-10"><img src="./src/images/icons/location_icon.png" className="me-2" alt="location_icon" />{sitter.city}{sitter.district}</p>
                          <p className="mb-3">
                            {[...Array(5)].map((_, i) => {
                              if (i + 1 <= Math.floor(sitter.rating)) {
                                return <img key={i} className="me-1" src={starFull} alt="starFull" />;
                              }

                              if (i + 1 - sitter.rating > 0) {
                                return <img key={i} className="me-1" src={starHalf} alt="starHalf" />;
                              }

                              return <img key={i} className="me-1" src={starNull} alt="starNull" />;
                            })}
                            <span className="fs-6 ms-2 fw-bold">{sitter.rating.toFixed(1)}</span>
                          </p>
                          <div className="border border-secondary w-75 mb-3"></div>
                          <p className="fs-6 fw-bold">NT$ <span className="fs-5">{sitter.prices[0].price}</span> / {sitter.prices[0].type}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              )
            })
          }
        </div>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-primary text-white fw-bold" onClick={() => navigate("/lookforpetsitter")}>查看更多<i className="bi bi-arrow-right ms-2"></i></button>
        </div>
      </section>
      <section className="container mb-9">
        <h2 className="text-center mb-4 mb-md-8 text-primary fw-bold"><img src={flowIcon} className="me-3" alt="flowIcon" width="32" />服務流程</h2>
        <div className="row">
          <div className="col-6">
            <div className="d-flex flex-column flex-md-row align-items-center">
              <div className="bg-box mb-3 mb-md-0">
                <img src={ownerIcon} className="flex-shrink-0" alt="ownerIcon" width="92" />
              </div>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">篩選需要的保姆服務</div>
              <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info fs-4"></i>
              <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info fs-4"></i>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">選擇中意的保姆服務</div>
            </div>
          </div>
          <div className="d-block d-md-none col-6">
            <div className="d-flex flex-column flex-md-row align-items-center">
              <div className="bg-box mb-3 mb-md-0">
                <img src={sitterIcon} className="flex-shrink-0" alt="sitterIcon" width="92" />
              </div>
              <div className="fs-6 fs-lg-1 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">上傳良民證審核</div>
              <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info fs-4"></i>
              <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info fs-4"></i>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">通過並發布服務</div>
              <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info fs-4"></i>
              <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info fs-4"></i>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">等待飼主預約</div>
            </div>
          </div>
        </div>
        <div className="row justify-content-md-end">
          <div className="col-md-6">
            <div className="d-flex flex-column flex-md-row justify-content-end  align-items-center">
              <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info fs-4"></i>
              <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info fs-4"></i>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">確認服務細節</div>
              <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info fs-4"></i>
              <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info fs-4"></i>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">付款後成立訂單</div>
              <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info fs-4"></i>
              <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info fs-4"></i>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">完成訂單並給予評價</div>
            </div>
          </div>
        </div>
        <div className="d-none d-md-block row">
          <div className="col-md-7">
            <div className="d-flex flex-column flex-md-row align-items-center">
              <div className="bg-box mb-3 mb-md-0">
                <img src={sitterIcon} className="flex-shrink-0" alt="sitterIcon" width="92" />
              </div>
              <div className="fs-6 fs-lg-1 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">上傳良民證審核</div>
              <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info fs-4"></i>
              <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info fs-4"></i>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">通過並發布服務</div>
              <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info fs-4"></i>
              <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info fs-4"></i>
              <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">等待飼主預約</div>
            </div>
          </div>
        </div>
      </section>
      <section className="container mb-9">
        <h2 className="text-center mb-4 mb-md-8 text-primary fw-bold"><img src={loveIcon} className="me-3" alt="loveIcon" width="32" />毛孩父母一致好評</h2>
        {/* {JSON.stringify(reviews)} */}
        <div className="row">
          {/* reviews卡片輪播 */}
          <div className="d-none d-md-flex justify-content-center gap-3 flex-nowrap overflow-hidden">
            {reviews
              .slice(startIndex, startIndex + 4)
              .map((review) => (
                <div
                  key={review.reviewId}
                  className="card rounded-4 card-comment"
                  style={{ width: "280px" }}
                >

                  <div className="position-relative">
                    <img
                      src={review.ownerImageUrl}
                      className="card-img-top rounded-top-4"
                      alt="ownerImage"
                      height="240"
                    />

                    <div className="bg-light bg-opacity-75 d-flex align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-3">
                      <span className="fs-6 fw-bold mb-1 me-2 px-2 py-1 rounded-pill bg-info text-white">
                        飼主
                      </span>

                      <h4 className="card-title mb-0 fw-bold">
                        {review.ownerName}
                      </h4>
                    </div>
                  </div>

                  <div className="card-body p-3">

                    <p className="fs-6 fw-bold mb-2">
                      給
                      <span className="rounded-pill border border-2 border-secondary px-2 py-1 mx-1">
                        保母
                      </span>
                      {review.sitterName}
                    </p>

                    {/* rating stars */}

                    <p className="mb-2">
                      {[...Array(5)].map((_, i) => {
                        let icon = starNull;

                        if (i + 1 <= Math.floor(review.rating)) {
                          icon = starFull;
                        } else if (i + 1 - review.rating <= 0.5) {
                          icon = starHalf;
                        }

                        return (
                          <img key={i} className="me-1" src={icon} alt="star" />
                        );
                      })}
                    </p>

                    <p className="fs-6 fw-bold">{review.comment}</p>

                  </div>
                </div>
              ))}

          </div>
          {/* 下方左右切換按鈕（自訂位置） */}
          <div className="d-none d-md-flex justify-content-center gap-4 mt-0">
            <button
              className="btn btn-link p-0"
              type="button"
              onClick={() => prev()}
            >
              <i className="bi bi-chevron-left fs-3 text-primary"></i>
            </button>

            <button
              className="btn btn-link p-0"
              type="button"
              onClick={() => next()}
            >
              <i className="bi bi-chevron-right fs-3 text-primary"></i>
            </button>
          </div>
          <div className="d-md-none d-flex overflow-x-auto flex-nowrap gap-3">
            {reviews
              .map((review) => (
                <div
                  key={review.reviewId}
                  className="card rounded-4 card-comment flex-shrink-0"
                  style={{ width: "280px" }}
                >

                  <div className="position-relative">
                    <img
                      src={review.ownerImageUrl}
                      className="card-img-top rounded-top-4"
                      alt="ownerImage"
                      height="240"
                    />

                    <div className="bg-light bg-opacity-75 d-flex align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-3">
                      <span className="fs-6 fw-bold mb-1 me-2 px-2 py-1 rounded-pill bg-info text-white">
                        飼主
                      </span>

                      <h4 className="card-title mb-0 fw-bold">
                        {review.ownerName}
                      </h4>
                    </div>
                  </div>

                  <div className="card-body p-3">

                    <p className="fs-6 fw-bold mb-2">
                      給
                      <span className="rounded-pill border border-2 border-secondary px-2 py-1 mx-1">
                        保母
                      </span>
                      {review.sitterName}
                    </p>

                    {/* rating stars */}

                    <p className="mb-2">
                      {[...Array(5)].map((_, i) => {
                        let icon = starNull;

                        if (i + 1 <= Math.floor(review.rating)) {
                          icon = starFull;
                        } else if (i + 1 - review.rating <= 0.5) {
                          icon = starHalf;
                        }

                        return (
                          <img key={i} className="me-1" src={icon} alt="star" />
                        );
                      })}
                    </p>

                    <p className="fs-6 fw-bold">{review.comment}</p>

                  </div>
                </div>
              ))}
          </div>
        </div>

      </section >
      <section className="container mb-9">
        <h2 className="text-center mb-4 mb-md-8 text-primary fw-bold"><img src={faqIcon} className="me-3" alt="faqIcon" width="32" />FAQ</h2>
        <div className="row mb-7">
          <h4 className="text-info fw-bold title-owner mb-10">我是飼主</h4>
          {faqList.map((sitter, index) => (
            <div key={index} className="col-12 bg-white rounded-5 mb-7 ps-6 pe-7 py-10 ">
              <div className="d-flex justify-content-between align-items-center">
                <span className="mb-1 fw-bold">{sitter.question}</span>
                <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse_${index}`} aria-expanded="false" aria-controls={`collapse_${index}`} onClick={() => setActiveIndex(activeIndex === index ? null : index)}>
                  <i className={`bi ${activeIndex === index ? "bi-dash-lg" : "bi-plus-lg"} text-primary fs-4`}></i>
                </button>
              </div>
              <div className={`collapse ${activeIndex === index ? "show" : ""}`} id={`collapse_${index}`}>
                <div className="card card-body border-0" style={{ padding: 0 }}>
                  {sitter.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <h4 className="text-info fw-bold title-owner mb-10">我是保母</h4>
          <div className="col-12 bg-white rounded-5 mb-7 ps-6 pe-7 py-10">
            <div className="d-flex justify-content-between align-items-center">
              <span className="mb-1 fw-bold">comPETent 的保母值得信任嗎？</span><button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_01" aria-expanded="false" aria-controls="collapse_01" onClick={() => setOpen(!open)}>
                <i className={`bi ${open ? "bi-dash-lg" : "bi-plus-lg"} text-primary fs-4`}></i>
              </button>
            </div>
            <div className={`collapse ${open ? "show" : ""}`} id="collapse_01">
              <div className="card card-body border-0" style={{ padding: 0 }}>
                有一個愛護動物的心，有相關服務的技能，我們會提供完整的服務流程教學。
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home