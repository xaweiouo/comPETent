import { useState, useEffect, useMemo, useRef } from "react";
import * as bootstrap from 'bootstrap';
import { supabase } from "../../lib/supabaseClient";
// import { starRating } from "../../utils/starRating";

import { TailSpin } from "react-loader-spinner";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PetCard from "../../components/PetCard";
import PetDetailModal from "../../components/PetDetailModal";
import { useForm } from "react-hook-form";
import { createAsyncMessage } from "../../slices/messageSlice";
import { updateUserInfo } from "../../slices/authSlice";

function OwnerProfile() {
  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);

  const [loading, setLoading] = useState(true);

  // 狀態驅動：控制目前顯示的角色，預設為 'sitter'
  const [activeTab, setActiveTab] = useState('pets');
  // const [userId, setUserId] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [ownerPets, setOwnerPets] = useState([]);
  const [ownerBooking, setOwnerBooking] = useState(null);

  // 建立一個狀態來儲存當前點選的寵物物件
  const [selectedPet, setSelectedPet] = useState(null);
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'create'
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch=useDispatch();

  const petMap = useMemo(() => {
    return ownerPets.reduce((acc, pet) => ({ ...acc, [pet.id]: pet.name }), {})
  }
    , [ownerPets]);

  const petModalRef = useRef(null);
  const newPetModalRef = useRef(null);

  const profileRef = useRef(null);
  const newProfileRef = useRef(null);

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
          setLoading(false);
          reset({...data});

          console.log("✅ 資料同步完成：", ownerProfile); 
        }
      } catch (error) {
        console.error("❌ 抓取初始化資料失敗：", error.message);
      }
    };
    // 登入後，只在初始化時跑這一次
    fetchInitialData();

  }, [isAuthenticated, isAuthLoading, navigate, user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: ownerProfile || {},
    // mode: 'onChange'
  });

  const onSubmit=async(formData)=>{
    try {
      const updateData = {
      name: formData.name,
      nickname: formData.nickname,
      email: formData.email,
      phone: formData.phone,
    };
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', formData.id)
        .select() // 重要：加上 .select() 讓它回傳更新後的完整資料
        .single();

      if (error) throw error;

      if (data) {
      // 更新本地的 State，讓 UI 即時顯示新資料
      setOwnerProfile(data); 
      dispatch(updateUserInfo({
        name: data.name,
        nickname: data.nickname,}))
      
      dispatch(createAsyncMessage({ text: "更新成功"}));

      // 4. 自動關閉 Modal (如果你的 newProfileRef 已定義)
      if (newProfileRef.current) {
        newProfileRef.current.hide();
      }
    }
    } catch (error) {
      dispatch(createAsyncMessage(error))
    }
  }

  const openProfileModal = () => {
    const element = profileRef.current;
    if (element) {
      // 1. 檢查是否已經初始化過，沒有才 new
      // if (!newPetModalRef.current) {
      newProfileRef.current = new bootstrap.Modal(element, {
        keyboard: false
      });
      // }

      element.addEventListener('hide.bs.modal', () => {
        reset(ownerProfile);

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

      newProfileRef.current.show();

    } else {
      console.error("找不到 Modal DOM 或 Bootstrap 未載入");
    }
  }

  const openPetModal = () => {

    const element = petModalRef.current;

    if (element) {
      // 1. 檢查是否已經初始化過，沒有才 new
      // if (!newPetModalRef.current) {
      newPetModalRef.current = new bootstrap.Modal(element, {
        keyboard: false
      });
      // }

      element.addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

      newPetModalRef.current.show();

    } else {
      console.error("找不到 Modal DOM 或 Bootstrap 未載入");
    }
  };

  const closePetModal = () => {
    newPetModalRef.current.hide();
  }

  // 點擊寵物卡：看詳細資料
  const handleView = (pet) => {
    setSelectedPet({ ...pet });
    setMode('view');
    setIsPetModalOpen(true);
  };

  // 點擊新增：給予空資料
  const handleAdd = () => {
    setSelectedPet(null); // 清空
    setMode('create');
    setIsPetModalOpen(true);
  };

  const cardOnClick = (pet) => {
    openPetModal();
    handleView(pet);
    console.log(pet)
    // setSelectedPet(pet);
  }

  if (!isAuthenticated) {
    return (
      <>
        <p className="text-center">請先登入</p>
        <p className="text-center">3秒後回到首頁</p>
      </>
    )
  } else if (loading) {
    return <div className="d-flex justify-content-center">
      <TailSpin color="var(--bs-primary)" />
    </div>

  };

  return (
    <>
      <div className="bg-primary-01" style={{ minHeight: '100vh', paddingBottom: '50px' }}>
        <div className="container pt-3">

          {/* 1. 頂部返回按鈕 */}
          {/* <div className="mb-3" style={{ color: 'black', cursor: 'pointer', fontWeight: 'bold' }}>
            &lt; 返回
          </div> */}

          {/* 2. 封面相片與置中頭像 */}
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
          <div className="text-center mt-5 pt-3 mb-4 border-bottom pb-3">
            <h2 className="fw-bold mb-1" >{ownerProfile?.nickname}</h2>
            <p className="text-black mb-2">姓名:{ownerProfile?.name}</p>
            <p className="text-black mb-2">臺北市 信義區</p>
            <p className="text-black mb-2">{ownerProfile?.phone}</p>
            <p className="text-black mb-2">{ownerProfile?.email}</p>

            <button type="button" className="btn btn-sm btn-secondary mt-2 rounded-pill"
              onClick={openProfileModal}
            >修改基本資料</button>

            {/* <span
              className="badge rounded-pill bg-transparent border px-3 py-1"
              style={{ borderColor: theme.orange, color: theme.orange, fontSize: '0.9rem' }}
            >
              認證飼主
            </span> */}
          </div>

          <div
            className="modal fade"
            ref={profileRef}
            tabIndex="-1"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">修改基本資料</h5>
                  <button type="button" className="btn-close" ></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-body">
                    {/* 封面相片與大頭照展示區 */}
                    <div className="position-relative mb-5" style={{ height: '200px' }}>
                      <div className="w-100 h-100 bg-light border rounded overflow-hidden">
                        {/* 這裡可放置封面圖預覽 */}
                        <div className="text-center mt-5 text-muted">封面相片預覽區</div>
                      </div>

                      {/* 圓形大頭照 */}
                      <div
                        className="position-absolute start-0 bottom-0 translate-middle-y ms-4"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          border: '4px solid white',
                          backgroundColor: '#ddd',
                          overflow: 'hidden'
                        }}
                      >
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted" style={{ fontSize: '12px' }}>
                          大頭照
                        </div>
                      </div>
                    </div>

                    {/* 表單欄位 */}
                    <div className="row g-3 mt-4">
                      <div className="col-md-12 mb-3">
                        <label className="form-label">封面相片 URL</label>
                        <input type="text" className="form-control" {...register("coverUrl")} />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">大頭照 URL</label>
                        <input type="text" className="form-control" {...register("avatarUrl")} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">姓名</label>
                        <input
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          {...register("name", { required: "姓名為必填" })}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">暱稱</label>
                        <input className="form-control" {...register("nickname")} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">電話</label>
                        <input className="form-control" {...register("phone")} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          {...register("email", { required: "Email 為必填" })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">地址</label>
                        <input className="form-control" {...register("address")} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary">取消</button>
                    <button type="submit" className="btn btn-primary">儲存變更</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 4. Tab 切換導航列 (置中) */}
          {/* <div className="d-flex justify-content-center gap-3 mb-5 border-bottom pb-3"> */}
          {/* <button
              className={`btn rounded-pill px-4 fw-bold ${activeTab === 'pets' ? 'btn-dark' : 'btn-light text-muted'}`}
              onClick={() => setActiveTab('pets')}
              style={{ transition: 'all 0.2s' }}
            >
              我的寵物
            </button> */}
          {/* <button
              className={`btn rounded-pill px-4 fw-bold ${activeTab === 'bookings' ? 'btn-dark' : 'btn-light text-muted'}`}
              onClick={() => setActiveTab('bookings')}
              style={{ transition: 'all 0.2s' }}
            >
              我的預約
            </button> */}
          {/* </div> */}


          <div className="row px-2">
            <h2 className="text-black text-center mb-4">我的寵物</h2>
            <div className="">
              <PetDetailModal pet={selectedPet} innerRef={petModalRef} closeModal={closePetModal} mode={mode} setMode={setMode} setOwnerPets={setOwnerPets} />
              <div className="row g-3">
                {ownerPets?.map(pet => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    divClassName={'col-md-6 col-lg-3'}
                    cardClassName={'card background-color:white'}
                    // cardRef={cardRef}
                    // 點擊時把當前的 pet 物件傳回去
                    cardOnClick={() => cardOnClick(pet)}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
};
export default OwnerProfile;