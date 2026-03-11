import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
// import { starRating } from "../../utils/starRating";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PetCard from "../../components/PetCard";

function OwnerProfile() {
  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);

  // 狀態驅動：控制目前顯示的角色，預設為 'sitter'
  const [activeTab, setActiveTab] = useState('pets');
  // const [userId, setUserId] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [ownerPets, setOwnerPets] = useState([]);
  const [ownerBooking, setOwnerBooking] = useState(null);

  const navigate = useNavigate();

  const petMap = useMemo(() => {
    return ownerPets.reduce((acc, pet) => ({ ...acc, [pet.id]: pet.name }), {})
  }
    , [ownerPets])

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }

    const fetchInitialData = async () => {
      try {
        // 從 users 出發，一次拉回 bookings 和 services
        const { data, error } = await supabase
          .from('users')
          .select(`
        *,
        pets (*),
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
          setOwnerPets(data.pets || []);
          setOwnerBooking(data.bookings || []);


          // console.log("✅ 資料同步完成：", data);
        }
      } catch (error) {
        console.error("❌ 抓取初始化資料失敗：", error.message);
      }
    };
    // 登入後，只在初始化時跑這一次
    fetchInitialData();

  }, [isAuthenticated, isAuthLoading, navigate, user]);

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
      <div className="bg-primary-01" style={{  minHeight: '100vh', paddingBottom: '50px' }}>
        <div className="container pt-3">

          {/* 1. 頂部返回按鈕 */}
          <div className="mb-3" style={{ color: 'black', cursor: 'pointer', fontWeight: 'bold' }}>
            &lt; 返回
          </div>

          {/* 2. 英雄大圖與置中頭像 */}
          <div className="position-relative mb-5">
            {/* 背景大圖 (高度稍微調低，讓視覺焦點更集中在頭像) */}
            <img
              src={ownerProfile?.cover_url}
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
            <h2 className="fw-bold mb-1" >{ownerProfile?.nickname}</h2>
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
                {/* <div className="d-flex justify-content-between align-items-center mb-3"> */}
                {/* <h5 className="fw-bold mb-0">毛孩家族 (2)</h5> */}
                {/* <button className="btn btn-sm btn-outline-dark rounded-pill">+ 新增毛孩</button> */}
                {/* </div> */}

                <div className="row g-3">
                  {ownerPets?.map(pet => (
                    <PetCard key={pet.id} pet={pet} divClassName={'col-12 col-md-6 col-lg-3'} cardClassName={'card background-color:white'} />
                  ))}
                </div>
              </div>
            ) : (
              /* -------- [標籤 B] 我的預約 內容 -------- */
              <div className="col-12">
                {/* <h5 className="fw-bold mb-3">近期預約</h5> */}

                {/* 預約紀錄卡片 */}
                {ownerBooking?.map(b => (

                  <div key={b.id} className="card border-0 rounded-4 shadow-sm mb-3">
                    <div className="card-body p-4 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-success rounded-pill mb-2">{b?.status}</span>
                        <h5 className="fw-bold mb-1">{b.services.category} (保母：{b.services.users.nickname})</h5>
                        <p className="text-muted mb-0">{b.arrival_date + ' ' + b.arrival_time + '~' + b.departure_time}  ｜ 服務對象：{petMap[b.pet_id]}</p>
                      </div>
                      <div className="text-end">
                        <h5 className="fw-bold mb-2 text-primary" >NT$ {b.total_price}</h5>
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-pill"
                          onClick={() => navigate(`/owner/bookings/${b.id}`)}
                        >
                          查看詳情
                        </button>
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