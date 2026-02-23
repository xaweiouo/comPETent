import React, { useState } from 'react';

// 使用內嵌 SVG 替代 lucide-react 以解決套件遺失問題
const Icons = {
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Star: ({ fill = "none" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Cat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.45.44.12.64.6.44 1.01-.19.38-.6.56-1.01.44-1.01-.3-2.86.42-4.05 2.14.35.2.68.44.98.72 2.48 2.36 2.48 6.14 0 8.5-.3.28-.63.52-.98.72 1.19 1.72 3.04 2.44 4.05 2.14.41-.12.82.06 1.01.44.2.41 0 .89-.44 1.01-1.39.39-4.64-.45-6.42-2.45-.65.17-1.33.26-2 .26s-1.35-.09-2-.26c-1.78 2-5.03 2.84-6.42 2.45-.44-.12-.64-.6-.44-1.01.19-.38.6-.56 1.01-.44 1.01.3 2.86-.42 4.05-2.14-.35-.2-.68-.44-.98-.72-2.48-2.36-2.48-6.14 0-8.5.3-.28.63-.52.98-.72-1.19-1.72-3.04-2.44-4.05-2.14-.41.12-.82-.06-1.01-.44-.2-.41 0-.89.44-1.01 1.39-.39 4.64.45 6.42 2.45.65-.17 1.33-.26 2-.26Z"/><path d="M15 10.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5.22-.5.5-.5.5.22.5.5Z"/><path d="M10 10.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5.22-.5.5-.5.5.22.5.5Z"/><path d="M12 14c.5 0 .9-.4.9-.9 0-.2-.1-.4-.2-.5l-.7-.6-.7.6c-.1.1-.2.3-.2.5 0 .5.4.9.9.9Z"/></svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  )
};

const LookForPetSitter = () => {
  // 模擬保姆數據
  const [sitters] = useState([
    {
      id: 1,
      name: '阿倫',
      rating: 5,
      pets: ['狗'],
      services: ['陪伴散步'],
      desc: '陪伴散步，會隨時注意狗狗的狀況與安全！',
      location: '台中市 中區',
      distance: '1km',
      price: '200 / 30 分鐘',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 2,
      name: '雪莉',
      rating: 4.8,
      pets: ['貓', '鳥', '鼠'],
      services: ['寄宿'],
      desc: '可供寄宿並協助餵食、清理籠子。',
      location: '台中市 中區',
      distance: '2km',
      price: '600 / 一晚',
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'John',
      rating: 3.5,
      pets: ['鳥', '魚', '爬蟲'],
      services: ['到府照顧'],
      desc: '到府協助餵食、清理籠子。',
      location: '台中市 中區',
      distance: '3km',
      price: '200 / 30 分鐘',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop'
    }
  ]);

  return (
    <div className="look-for-pet-sitter min-vh-100 pb-5" style={{ backgroundColor: '#FFF9ED' }}>
      {/* 搜尋區塊 */}
      <section className="py-5" style={{ backgroundColor: '#FFEDC2' }}>
        <div className="container">
          <h2 className="text-center mb-4 fw-bold" style={{ color: '#E87A30' }}>我想尋找</h2>
          
          <div className="row g-3 px-md-5">
            {/* 第一排：類別選擇 */}
            <div className="col-md-3">
              <label className="form-label fw-bold small">服務類別</label>
              <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border-0">
                <span className="input-group-text bg-white border-0 ps-3 text-warning">
                  <Icons.Briefcase />
                </span>
                <select className="form-select border-0 shadow-none">
                  <option>服務</option>
                  <option>陪伴散步</option>
                  <option>寄宿</option>
                  <option>到府照顧</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-3">
              <label className="form-label fw-bold small">寵物類別</label>
              <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border-0">
                <span className="input-group-text bg-white border-0 ps-3 text-warning">
                  <Icons.Cat />
                </span>
                <select className="form-select border-0 shadow-none">
                  <option>寵物</option>
                  <option>狗</option>
                  <option>貓</option>
                  <option>其他</option>
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold small">服務地區</label>
              <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border-0">
                <span className="input-group-text bg-white border-0 ps-3 text-warning">
                  <Icons.MapPin />
                </span>
                <select className="form-select border-0 shadow-none">
                  <option>縣市</option>
                  <option>台中市</option>
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold small">&nbsp;</label>
              <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border-0">
                <select className="form-select border-0 shadow-none ps-4">
                  <option>地區</option>
                  <option>中區</option>
                  <option>西區</option>
                </select>
              </div>
            </div>

            {/* 第二排：時間選擇與搜尋 */}
            <div className="col-md-3">
              <label className="form-label fw-bold small">服務時間</label>
              <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white border-0">
                <span className="input-group-text bg-white border-0 ps-3 text-warning">
                  <Icons.Calendar />
                </span>
                <input type="text" className="form-control border-0 shadow-none" placeholder="DD/MM/YYYY" />
              </div>
            </div>

            <div className="col-md-6 d-flex align-items-end">
              <div className="d-flex align-items-center w-100 gap-2">
                <select className="form-select shadow-sm rounded-pill border-0 py-2 text-center">
                  <option>00</option>
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <span className="fw-bold">時</span>
                <select className="form-select shadow-sm rounded-pill border-0 py-2 text-center">
                  <option>00</option>
                  <option>30</option>
                </select>
                <span className="fw-bold">分</span>
                <span className="mx-1 text-warning">—</span>
                <select className="form-select shadow-sm rounded-pill border-0 py-2 text-center">
                  <option>00</option>
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <span className="fw-bold">時</span>
                <select className="form-select shadow-sm rounded-pill border-0 py-2 text-center">
                  <option>00</option>
                  <option>30</option>
                </select>
                <span className="fw-bold">分</span>
              </div>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button className="btn w-100 rounded-pill py-2 fw-bold text-white shadow-sm" style={{ backgroundColor: '#FF5E00' }}>
                搜尋
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 列表內容區塊 */}
      <section className="container mt-5">
        <div className="d-flex justify-content-center align-items-center mb-4 position-relative">
          <h3 className="fw-bold d-flex align-items-center" style={{ color: '#E87A30' }}>
            <span className="me-2" style={{ transform: 'rotate(-20deg)', display: 'inline-block' }}>🐾</span>
            附近的保姆
          </h3>
          
          <div className="position-absolute end-0">
             <button className="btn bg-white shadow-sm rounded-pill btn-sm d-flex align-items-center px-3 border-0">
               距離 <Icons.ChevronDown />
             </button>
          </div>
        </div>

        {/* 保姆卡片列表 */}
        <div className="row flex-column align-items-center gap-4">
          {sitters.map(sitter => (
            <div key={sitter.id} className="col-12 col-lg-10">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-3 p-md-4">
                <div className="row g-4 align-items-center">
                  {/* 左側頭像 */}
                  <div className="col-md-3 text-center text-md-start">
                    <img 
                      src={sitter.img} 
                      alt={sitter.name} 
                      className="rounded-4 w-100 shadow-sm"
                      style={{ height: '180px', objectFit: 'cover', maxWidth: '240px' }}
                    />
                  </div>
                  
                  {/* 中間資訊 */}
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="fw-bold mb-0">{sitter.name}</h4>
                      <button className="btn btn-link p-0 text-danger border-0">
                        <Icons.Heart />
                      </button>
                    </div>
                    
                    <div className="d-flex align-items-center gap-1 mb-2 text-warning">
                      {[...Array(5)].map((_, i) => (
                        <Icons.Star key={i} fill={i < Math.floor(sitter.rating) ? "currentColor" : "none"} />
                      ))}
                      <span className="text-dark fw-bold ms-1">{sitter.rating}</span>
                    </div>

                    <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
                      <span className="small text-muted fw-bold">服務寵物</span>
                      {sitter.pets.map(p => (
                        <span key={p} className="badge bg-light text-dark border rounded-pill px-3 fw-normal">{p}</span>
                      ))}
                    </div>

                    <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
                      <span className="small text-muted fw-bold">服務項目</span>
                      {sitter.services.map(s => (
                        <span key={s} className="badge rounded-pill px-3 fw-normal" style={{ backgroundColor: '#E2E2E2', color: '#666' }}>{s}</span>
                      ))}
                    </div>

                    <p className="text-secondary small mb-3">{sitter.desc}</p>
                    
                    <div className="fw-bold">
                      NT$ <span className="fs-5" style={{ color: '#FF5E00' }}>{sitter.price}</span>
                    </div>
                  </div>

                  {/* 右側地點與按鈕 */}
                  <div className="col-md-3 text-md-end d-flex flex-column justify-content-between align-items-md-end h-100" style={{ minHeight: '180px' }}>
                    <div className="text-warning small mb-4">
                      <div className="d-flex align-items-center justify-content-md-end mb-1">
                        <Icons.MapPin /> <span className="ms-1">{sitter.location}</span>
                      </div>
                      <div className="fw-bold">距離 {sitter.distance}</div>
                    </div>
                    
                    <div className="d-flex gap-2 justify-content-md-end mt-auto">
                      <button className="btn btn-outline-warning rounded-pill px-3 fw-bold btn-sm border-2">詳情</button>
                      <button className="btn rounded-pill px-3 fw-bold btn-sm text-white" style={{ backgroundColor: '#FF5E00' }}>預約</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分頁器 */}
        <div className="d-flex justify-content-center mt-5 align-items-center gap-4">
          <span className="text-muted cursor-pointer hover-opacity">&lt;</span>
          <div className="d-flex gap-2">
            <span className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px', cursor: 'pointer' }}>1</span>
            <span className="text-muted d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', cursor: 'pointer' }}>2</span>
            <span className="text-muted d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', cursor: 'pointer' }}>3</span>
          </div>
          <span className="text-muted cursor-pointer hover-opacity">&gt;</span>
        </div>
      </section>

      {/* Footer 標誌 */}
      <div className="text-center mt-5 pt-4">
        <div className="d-inline-block p-3 rounded-circle" style={{ backgroundColor: '#FFEDC2' }}>
           <span className="fs-1">🐾</span>
        </div>
        <div className="fw-bold mt-2" style={{ color: '#E87A30', letterSpacing: '2px', fontSize: '1.2rem' }}>comPETent</div>
        <p className="text-muted small mt-2">© 2024 comPETent. All Rights Reserved.</p>
      </div>

      <style>{`
        .look-for-pet-sitter .form-select { 
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23f0ad4e' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e"); 
        }
        .look-for-pet-sitter .form-control:focus, .look-for-pet-sitter .form-select:focus { 
          border-color: #FFEDC2; 
          box-shadow: 0 0 0 0.25rem rgba(255, 237, 194, 0.25); 
        }
        .cursor-pointer { cursor: pointer; }
        .hover-opacity:hover { opacity: 0.7; }
        .btn-outline-warning { color: #E87A30; border-color: #E87A30; }
        .btn-outline-warning:hover { background-color: #E87A30; color: white; border-color: #E87A30; }
      `}</style>
    </div>
  );
};

export default LookForPetSitter;