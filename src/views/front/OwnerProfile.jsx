//test
import { useState, useEffect, useRef } from "react";
import * as bootstrap from 'bootstrap';
import { supabase } from "../../lib/supabaseClient";
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

  const [ownerProfile, setOwnerProfile] = useState(null);
  const [ownerPets, setOwnerPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [mode, setMode] = useState('view');

  // --- 新增：用來儲存準備上傳的檔案與預覽網址 ---
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // 控制上傳中的按鈕狀態

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const petModalRef = useRef(null);
  const newPetModalRef = useRef(null);
  const profileRef = useRef(null);
  const newProfileRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,   // 新增 setValue 用來手動更新 react-hook-form 的值
    watch,      // 新增 watch 用來監聽當前表單內的圖片 URL
    formState: { errors }
  } = useForm({
    defaultValues: ownerProfile || {},
  });

  // 監聽表單內的 URL，以便在畫面上正確渲染（若無預覽圖，則顯示這個 URL）
  const currentCoverUrl = watch('cover_url');
  const currentAvatarUrl = watch('avatar_url');

  // --- 新增：處理選擇圖片並產生預覽 ---
  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === 'cover') {
      setCoverFile(file);
      setCoverPreview(previewUrl);
    } else if (type === 'avatar') {
      setAvatarFile(file);
      setAvatarPreview(previewUrl);
    }
  };

  // --- 新增：立刻刪除照片邏輯 ---
  const handleDeletePhoto = async (type) => {
    try {
      const isCover = type === 'cover';
      const targetUrl = isCover ? ownerProfile?.cover_url : ownerProfile?.avatar_url;
      const bucketName = isCover ? 'user_cover' : 'user_avatar'; // 請確保 Supabase 有建立這兩個 bucket
      const fieldName = isCover ? 'cover_url' : 'avatar_url';

      // 1. 如果資料庫原本就有這張照片，從 Storage 刪除
      if (targetUrl && targetUrl.includes('supabase.co')) {
        const fileName = targetUrl.split('/').pop(); // 簡單萃取檔名
        await supabase.storage.from(bucketName).remove([fileName]);
        
        // 2. 立刻更新 users 表格，將該欄位設為 null
        await supabase.from('users').update({ [fieldName]: null }).eq('id', ownerProfile.id);
      }

      // 3. 清空本地表單與預覽狀態
      setValue(fieldName, null, { shouldDirty: true });
      if (isCover) {
        setCoverFile(null);
        setCoverPreview(null);
      } else {
        setAvatarFile(null);
        setAvatarPreview(null);
      }
      
      // 更新 Profile 狀態以防畫面沒重繪
      setOwnerProfile(prev => ({ ...prev, [fieldName]: null }));
      dispatch(createAsyncMessage({ text: "照片已刪除" }));

    } catch (error) {
      dispatch(createAsyncMessage({ text: "刪除照片失敗: " + error.message }));
    }
  };


  const onSubmit = async (formData) => {
    try {
      setIsUploading(true);
      let finalCoverUrl = formData.cover_url;
      let finalAvatarUrl = formData.avatar_url;

      // --- 新增：上傳新封面照 ---
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `cover_${ownerProfile.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('user_cover')
          .upload(fileName, coverFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('user_cover').getPublicUrl(fileName);
        finalCoverUrl = publicUrl;
      }

      // --- 新增：上傳新大頭照 ---
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar_${ownerProfile.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('user_avatar')
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('user_avatar').getPublicUrl(fileName);
        finalAvatarUrl = publicUrl;
      }

      // --- 更新資料庫 ---
      const updateData = {
        name: formData.name,
        nickname: formData.nickname,
        email: formData.email,
        phone: formData.phone,
        default_pickup_address_detail: formData.default_pickup_address_detail,
        cover_url: finalCoverUrl,
        avatar_url: finalAvatarUrl,
      };

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', formData.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setOwnerProfile(data);
        dispatch(updateUserInfo({
          name: data.name,
          nickname: data.nickname,
          avatar_url: data.avatar_url // 順便更新 Redux 的大頭照
        }));

        // 清空暫存的檔案狀態
        setCoverFile(null);
        setCoverPreview(null);
        setAvatarFile(null);
        setAvatarPreview(null);

        dispatch(createAsyncMessage({ text: "更新成功" }));

        if (newProfileRef.current) {
          newProfileRef.current.hide();
        }
      }
    } catch (error) {
      dispatch(createAsyncMessage({ text: error.message || "更新失敗" }));
    } finally {
      setIsUploading(false);
    }
  };

  const openProfileModal = () => {
    const element = profileRef.current;
    if (element) {
      newProfileRef.current = new bootstrap.Modal(element, { keyboard: false });

      element.addEventListener('hide.bs.modal', () => {
        reset(ownerProfile);
        // 關閉時清除預覽網址避免記憶體洩漏
        setCoverFile(null);
        setCoverPreview(null);
        setAvatarFile(null);
        setAvatarPreview(null);
        
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, { once: true }); // 使用 once 避免重複綁定事件

      newProfileRef.current.show();
    }
  };

  const openPetModal = () => {

    const element = petModalRef.current;

    if (element) {
      // 1. 檢查是否已經初始化過，沒有才 new
      if (!newPetModalRef.current) {
      newPetModalRef.current = new bootstrap.Modal(element, {
        keyboard: false
      });
      }

      element.addEventListener('hide.bs.modal', () => {
        // 關閉時清空狀態，下次點擊才會觸發 useEffect
        setMode('view'); 
        setSelectedPet(null);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

      newPetModalRef.current.show();

    }
  };

  const closePetModal = () => {
    newPetModalRef.current.hide();
    setSelectedPet(null);
  }

  // 點擊寵物卡：看詳細資料
  const handleView = (pet) => {
    setSelectedPet({ ...pet });
    setMode('view');
    // setIsPetModalOpen(true);
  };

  // 點擊新增：給予空資料
  const handleAdd = () => {
    setSelectedPet(null); // 清空
    setMode('create');
    openPetModal();
    // setIsPetModalOpen(true);
  };

  const cardOnClick = (pet) => {
    openPetModal();
    handleView(pet);

    // setSelectedPet(pet);
  }

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      const timer = setTimeout(() => navigate('/', { replace: true }), 3000);
      return () => clearTimeout(timer);
    }

    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`*, pets (*), bookings!bookings_owner_id_fkey (*, services (*, users (name, nickname, avatar_url)))`)
          .eq('email', user.email)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setOwnerProfile(data);
          setOwnerPets(data.pets || []);
          setLoading(false);
          reset({ ...data });
        }
      } catch (error) {
        dispatch(createAsyncMessage(error));
      }
    };
    fetchInitialData();
  }, [isAuthenticated, isAuthLoading, user, navigate, dispatch, reset]);

  if (!isAuthenticated) return (<><p className="text-center">請先登入</p><p className="text-center">3秒後回到首頁</p></>);
  if (loading) return <div className="d-flex justify-content-center"><TailSpin color="var(--bs-primary)" /></div>;

  return (
    <>
      <div className="bg-primary-01" style={{ minHeight: '100vh', paddingBottom: '50px' }}>
        <div className="container pt-3">

          {/* === 頁面上的大頭照與封面 (僅檢視) === */}
          <div className="position-relative mb-5">
            <img
              src={ownerProfile?.cover_url || "https://placehold.co/1920x451/e0e0e0/ffffff?text=No+Cover"}
              alt="Hero Background"
              className="w-100 object-fit-cover rounded-4 shadow-sm"
              style={{ height: '451px' }}
            />
            <img
              src={ownerProfile?.avatar_url || "https://placehold.co/120x120/e0e0e0/ffffff?text=User"}
              alt="Profile Avatar"
              className="position-absolute rounded-circle border border-2 border-white shadow bg-white"
              style={{ width: '120px', height: '120px', objectFit: 'cover', bottom: '-60px', left: '50%', transform: 'translateX(-50%)' }}
            />
          </div>

          <div className="text-center mt-5 pt-3 mb-4 border-bottom pb-3">
            <h2 className="fw-bold mb-1">{ownerProfile?.nickname}</h2>
            <p className="text-black mb-2">姓名:{ownerProfile?.name}</p>
            <p className="text-black mb-2">{ownerProfile?.phone}</p>
            <p className="text-black mb-2">{ownerProfile?.email}</p>
            <button type="button" className="btn btn-sm btn-secondary mt-2 rounded-pill" onClick={openProfileModal}>
              修改基本資料
            </button>
          </div>

          {/* === 修改基本資料 Modal === */}
          <div className="modal fade" ref={profileRef} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">修改基本資料</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-body">

                    {/* Modal 內的封面與頭像區塊 (可編輯) */}
                    <div className="position-relative mb-5 mt-2">
                      
                      {/* --- 封面圖片編輯區 --- */}
                      <div className="position-relative group">
                        <img
                          // 顯示優先序：1.新選的預覽 2.表單內的URL(既有的) 3.預設圖
                          src={coverPreview || currentCoverUrl || "https://placehold.co/1920x451/e0e0e0/ffffff?text=No+Cover"}
                          alt="Cover Preview"
                          className="w-100 object-fit-cover rounded-4 shadow-sm"
                          style={{ height: '300px' }} // Modal 內稍微調矮一點比較好看
                        />
                        {/* 封面操作按鈕 (放置於右上角) */}
                        <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
                          <label className="btn btn-sm btn-light shadow-sm mb-0 cursor-pointer">
                            <i className="bi bi-camera me-1"></i>上傳封面
                            <input type="file" accept="image/*" className="d-none" onChange={(e) => handleImageSelect(e, 'cover')} />
                          </label>
                          {/* {(coverPreview || currentCoverUrl) && (
                            <button type="button" className="btn btn-sm btn-danger shadow-sm" onClick={() => handleDeletePhoto('cover')}>
                              <i className="bi bi-trash"></i>
                            </button>
                          )} */}
                        </div>
                      </div>

                      {/* --- 大頭貼編輯區 --- */}
                      <div 
                        className="position-absolute"
                        style={{ bottom: '-50px', left: '50%', transform: 'translateX(-50%)' }}
                      >
                        <div className="position-relative">
                          <img
                            src={avatarPreview || currentAvatarUrl || "https://placehold.co/120x120/e0e0e0/ffffff?text=User"}
                            alt="Avatar Preview"
                            className="rounded-circle border border-3 border-white shadow bg-white"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                          />
                          {/* 大頭貼操作按鈕 (放置於頭像下方/旁邊) */}
                          <div className="position-absolute d-flex gap-1" style={{ bottom: '-15px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                             <label className="btn btn-sm btn-light rounded-circle shadow-sm mb-0 p-1 px-2 cursor-pointer" title="上傳大頭照">
                              <i className="bi bi-camera"></i>
                              <input type="file" accept="image/*" className="d-none" onChange={(e) => handleImageSelect(e, 'avatar')} />
                            </label>
                            {/* {(avatarPreview || currentAvatarUrl) && (
                              <button type="button" className="btn btn-sm btn-danger rounded-circle shadow-sm p-1 px-2" title="刪除" onClick={() => handleDeletePhoto('avatar')}>
                                <i className="bi bi-trash"></i>
                              </button>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 表單欄位 */}
                    <div className="row g-3 mt-5 pt-3">
                      {/* 隱藏的 URL 欄位，由程式控制 */}
                      <input type="hidden" {...register("cover_url")} />
                      <input type="hidden" {...register("avatar_url")} />

                      <div className="col-md-6 mb-3">
                        <label className="form-label">姓名</label>
                        <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} {...register("name", { required: "姓名為必填" })} />
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
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register("email", { required: "Email 為必填" })} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">地址</label>
                        <input className="form-control" {...register("default_pickup_address_detail")} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary" disabled={isUploading}>
                      {isUploading ? '處理中...' : '儲存變更'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 下方寵物區塊保留原樣... */}
          <div className="row px-2">
            <h2 className="text-black text-center mb-4">我的寵物</h2>
            <button type="button" className="btn border-0 bg-transparent d-inline-flex align-items-center p-0 mt-1 me-3" onClick={() => handleAdd()}>
              <i className="bi bi-file-plus">新增寵物</i>
            </button>
            <div className="">
              <PetDetailModal ownerId={ownerProfile?.id} pet={selectedPet} innerRef={petModalRef} closeModal={closePetModal} mode={mode} setMode={setMode} setOwnerPets={setOwnerPets} />
              <div className="row g-3">
                {ownerPets?.map(pet => (
                  <PetCard key={pet.id} pet={pet} divClassName={'col-md-6 col-lg-3'} cardClassName={'card background-color:white'} cardOnClick={() => cardOnClick(pet)} />
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