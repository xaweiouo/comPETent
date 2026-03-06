import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { starRating } from "../../utils/starRating";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function OwnerProfile() {
  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);

  // 狀態驅動：控制目前顯示的角色，預設為 'sitter'
  const [activeTab, setActiveTab] = useState('pets');
  const [userId, setUserId] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [ownerBooking, setOwnerBooking] = useState(null);

  const navigate = useNavigate();

  // 自訂主題色（參考你提供的附圖）
  const theme = {
    bg: '#FDF8EF', // 米白背景
    orange: '#D35400', // 橘棕強調色
    textDark: '#333333',
  };

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 登入後，只在初始化時跑這一次
    fetchInitialData();

  }, [isAuthenticated, isAuthLoading]);

  const fetchInitialData = async () => {
    try {
      // 【終極 Join】從 users 出發，一次拉回 bookings 和 services
      const { data, error } = await supabase
        .from('users')
        .select(`
        *,
        bookings!bookings_owner_id_fkey (
          *,
          services (
          *,
          users (name, nickname, avatar_url))
        )
      `)
        .eq('email', user.email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // 拆分資料存入不同的 State
        setOwnerProfile(data);
        setOwnerBooking(data.bookings || []);

        console.log("✅ 資料同步完成：", data);
      }
    } catch (error) {
      console.error("❌ 抓取初始化資料失敗：", error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <p className="text-center">請先登入</p>
        <p className="text-center">3秒後回到首頁</p>
      </>
    )
  };

  return (
    <>
      {/* {JSON.stringify(ownerProfile)}
      {ownerBooking?.map(b=><p>{b}</p>)} */}
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: '50px' }}>
        <div className="container pt-3">

          {/* 1. 頂部返回按鈕 */}
          <div className="mb-3" style={{ color: theme.orange, cursor: 'pointer', fontWeight: 'bold' }}>
            &lt; 返回
          </div>

          {/* 2. 英雄大圖與置中頭像 */}
          <div className="position-relative mb-5">
            {/* 背景大圖 (高度稍微調低，讓視覺焦點更集中在頭像) */}
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
              alt="Hero Background"
              className="w-100 object-fit-cover rounded-4 shadow-sm"
              style={{ height: '451px' }}
            />

            {/* 大頭貼 (利用 left: 50% 與 translateX(-50%) 達到完美水平置中) */}
            <img
              src={ownerProfile?.avatar_url}
              alt="Profile Avatar"
              className="position-absolute rounded-circle border border-2 border-white shadow"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                bottom: '-60px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
          </div>

          {/* 3. 居中顯示的基本資料 */}
          <div className="text-center mt-5 pt-3 mb-4">
            <h2 className="fw-bold mb-1" style={{ color: theme.textDark }}>{ownerProfile?.nickname}</h2>
            <p className="text-muted mb-2">姓名:{ownerProfile?.name}</p>
            <p className="text-muted mb-2">臺北市 信義區</p>
            <p className="text-muted mb-2">{ownerProfile?.phone}</p>
            <p className="text-muted mb-2">{ownerProfile?.email}</p>
            {/* <span
              className="badge rounded-pill bg-transparent border px-3 py-1"
              style={{ borderColor: theme.orange, color: theme.orange, fontSize: '0.9rem' }}
            >
              認證飼主
            </span> */}
          </div>

          {/* 4. Tab 切換導航列 (置中) */}
          <div className="d-flex justify-content-center gap-3 mb-5 border-bottom pb-3">
            <button
              className={`btn rounded-pill px-4 fw-bold ${activeTab === 'pets' ? 'btn-dark' : 'btn-light text-muted'}`}
              onClick={() => setActiveTab('pets')}
              style={{ transition: 'all 0.2s' }}
            >
              我的寵物
            </button>
            <button
              className={`btn rounded-pill px-4 fw-bold ${activeTab === 'bookings' ? 'btn-dark' : 'btn-light text-muted'}`}
              onClick={() => setActiveTab('bookings')}
              style={{ transition: 'all 0.2s' }}
            >
              我的預約
            </button>
          </div>

          {/* 5. 條件渲染區塊 (依據 activeTab 顯示內容) */}
          <div className="row px-2">
            {activeTab === 'pets' ? (
              /* -------- [標籤 A] 我的寵物 內容 -------- */
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">毛孩家族 (2)</h5>
                  <button className="btn btn-sm btn-outline-dark rounded-pill">+ 新增毛孩</button>
                </div>

                <div className="row g-3">
                  {/* 寵物卡片 1 */}
                  <div className="col-md-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 d-flex flex-row align-items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=100&q=80"
                        alt="阿金"
                        className="rounded-circle object-fit-cover"
                        style={{ width: '80px', height: '80px' }}
                      />
                      <div>
                        <h5 className="fw-bold mb-1">阿金</h5>
                        <p className="text-muted mb-0 small">黃金獵犬 • 3歲 • 公 (已結紮)</p>
                      </div>
                    </div>
                  </div>

                  {/* 寵物卡片 2 */}
                  <div className="col-md-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 d-flex flex-row align-items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=100&q=80"
                        alt="咪咪"
                        className="rounded-circle object-fit-cover"
                        style={{ width: '80px', height: '80px' }}
                      />
                      <div>
                        <h5 className="fw-bold mb-1">咪咪</h5>
                        <p className="text-muted mb-0 small">米克斯貓 • 1歲 • 母 (未結紮)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* -------- [標籤 B] 我的預約 內容 -------- */
              <div className="col-12">
                {/* <h5 className="fw-bold mb-3">近期預約</h5> */}

                {/* 預約紀錄卡片 */}
                {ownerBooking?.map(b => (

                  <div className="card border-0 rounded-4 shadow-sm mb-3">
                    <div className="card-body p-4 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-success rounded-pill mb-2">即將到來</span>
                        <h5 className="fw-bold mb-1">{b.services.category} (保母：{b.services.users.nickname})</h5>
                        <p className="text-muted mb-0">{b.arrival_date+' '+b.arrival_time+'~'+b.departure_time}  ｜ 服務對象：</p>
                      </div>
                      <div className="text-end">
                        <h5 className="fw-bold mb-2" style={{ color: theme.orange }}>NT$ {b.total_price}</h5>
                        {/* <button className="btn btn-sm btn-outline-secondary rounded-pill">查看詳情</button> */}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 歷史預約卡片 (呈現反灰感) */}
                {/* <div className="card border-0 rounded-4 shadow-sm" style={{ opacity: 0.7 }}>
                <div className="card-body p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-secondary rounded-pill mb-2">已完成</span>
                    <h5 className="fw-bold mb-1">狗狗寄宿 (保母：王大明)</h5>
                    <p className="text-muted mb-0">2023/10/01 - 2023/10/03 ｜ 服務對象：阿金</p>
                  </div>
                  <div className="text-end">
                    <h5 className="fw-bold mb-2 text-muted">NT$ 2,400</h5>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill">再次預約</button>
                  </div>
                </div>
              </div> */}

              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
};
export default OwnerProfile;