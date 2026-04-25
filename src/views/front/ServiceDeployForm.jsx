import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useLocations } from "../../utils/useLocations";

import feetIcon from "../../images/icons/feet_icon.png";
import locationIcon from "../../images/icons/location_icon.png";
import calendarIcon from "../../images/icons/calendar_icon.png";
import workIcon from "../../images/icons/work_icon.png";

import { SITTER_SERVICE_OPTIONS, PET_SPECIES_OPTIONS, WEEKDAY_OPTIONS, HOUR_OPTIONS, MINUTE_OPTIONS } from "../../utils/options";
import Select from "../../components/Select";
import { createAsyncMessage } from "../../slices/messageSlice";

const ServiceDeployForm = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);
  const [userId, setUserId] = useState(null);
  const { locations, cityOptions } = useLocations();

  const [tempCity, setTempCity] = useState('');
  const filteredDistricts = locations.filter(loc => loc.city === tempCity).map(loc => ({ value: loc.id, label: loc.district }));

  const navigate = useNavigate();

  // 新增：管理選擇的檔案與預覽圖片 URL 的狀態
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (isAuthLoading) return;

    const getUserId = async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();
      setUserId(userData.id);
    };

    if (!isAuthenticated) {
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } else if (isAuthenticated) {
      getUserId();
    }
  }, [isAuthenticated, navigate, user, isAuthLoading]);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {}
  });

  const selectedCategory = watch("category");
  const getPriceInfo = (category) => {
    switch (category) {
      case '陪伴散步':
      case '寵物安親':
      case '到府照顧':
      case '訓練':
        return { label: '(每半小時)', fieldName: 'price_per_30min' };
      case '寄宿':
        return { label: '(每日)', fieldName: 'price_per_day' };
      case '洗澡美容':
        return { label: '(每次)', fieldName: 'price_per_session' };
      default:
        return { label: '', fieldName: null };
    }
  };

  const { label, fieldName } = getPriceInfo(selectedCategory);

  // 新增：處理圖片選擇與產生預覽 URL
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    // 防呆處理：限制最多 3 張
    if (files.length > 3) {
      dispatch(createAsyncMessage({ text: '最多只能上傳 3 張照片喔！', isError: true }));
      e.target.value = ''; // 清空 input
      return;
    }

    setSelectedFiles(files);

    // 產生 Blob URL 供預覽輪播使用
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const onSubmit = async (data) => {
    try {
      const formattedStartTime = `${data.start_hour}:${data.start_minute}:00`;
      const formattedEndtTime = `${data.end_hour}:${data.end_minute}:00`;

      // 新增：1. 上傳照片到 Supabase Storage
      let uploadedUrls = [];
      if (selectedFiles.length > 0) {
        for (let file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          // 產生不重複的檔名
          const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('service_photos') //Storage Bucket 名稱
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // 取得公開 URL
          const { data: publicUrlData } = supabase.storage
            .from('service_photos')
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      // 新增：取第一張上傳的照片做為列表主圖，若無則為 null
      const mainPhotoUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : null;

      // 修改：寫入 services 主表，加入 photo_url
      const { data: insertedService, error: sError } = await supabase
        .from('services')
        .insert([{
          sitter_id: userId,
          location_id: data.location_id,
          photo_url: mainPhotoUrl, // 寫入主封面照片
          category: data.category,
          species: data.species,
          day_of_week: data.day_of_week,
          start_time: formattedStartTime,
          end_time: formattedEndtTime,
          description: data.description,
          price_per_30min: data.price_per_30min || null,
          price_per_day: data.price_per_day || null,
          price_per_session: data.price_per_session || null,
        }])
        .select()
        .single(); // 取得剛新增的服務 ID 以便寫入關聯照片

      if (sError) throw sError;

      // 新增：3. 寫入 service_photos 表格
      if (uploadedUrls.length > 0) {
        const photoRecords = uploadedUrls.map((url, index) => ({
          service_id: insertedService.id,
          photo_url: url,
          sort_order: index + 1
        }));

        const { error: photoError } = await supabase
          .from('service_photos')
          .insert(photoRecords);

        if (photoError) throw photoError;
      }

      dispatch(createAsyncMessage({ text: '已成功發布服務' }));
      reset();
      setTempCity('');
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      dispatch(createAsyncMessage({ text: error.message || '發布失敗', isError: true }));
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
      <section className="lookfor-filter-group py-5">
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center fw-bold text-primary mb-5">發布服務</h2>

            {/* 新增：最上方的照片上傳與預覽區塊 */}
            <div className="row justify-content-center mb-5">
              <div className="col-md-8">
                <label className="form-label fw-bold">上傳服務照片 (最多 3 張)</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                />

                {/* 照片預覽輪播 (Bootstrap Carousel) */}
                <div id="servicePhotoCarousel" className="carousel slide position-relative rounded-4 overflow-hidden bg-light" style={{ height: '350px' }}>
                  
                  {/* Indicators */}
                  <div className="carousel-indicators">
                    {previewUrls.map((_, index) => (
                      <button
                        key={`indicator-${index}`}
                        type="button"
                        data-bs-target="#servicePhotoCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : undefined}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>

                  {/* Carousel Items */}
                  <div className="carousel-inner h-100">
                    {previewUrls.length > 0 ? (
                      previewUrls.map((url, index) => (
                        <div
                          key={`photo-${index}`}
                          className={`carousel-item h-100 ${index === 0 ? "active" : ""}`}
                        >
                          <img
                            src={url}
                            className="d-block w-100 h-100"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            alt={`預覽照片 ${index + 1}`}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="carousel-item h-100 active d-flex justify-content-center align-items-center">
                        <span className="text-muted">尚無照片，請選擇檔案上傳</span>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  {previewUrls.length > 1 && (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target="#servicePhotoCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target="#servicePhotoCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* 照片上傳區塊結束 */}


            <div className="row g-3 align-items-start justify-content-between">
              <div className="col-md-3">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "請選擇一個服務類別" }}
                  render={({ field }) => (
                    <Select
                      id="服務類別"
                      imgSrc={workIcon}
                      label="服務類別"
                      options={SITTER_SERVICE_OPTIONS}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        field.onChange(newValue);
                        setValue("price_per_30min", null);
                        setValue("price_per_day", null);
                        setValue("price_per_session", null);
                      }}
                      error={errors?.category}
                    />
                  )}
                />
              </div>

              <div className="col-md-3">
                <Controller
                  name="species"
                  control={control}
                  rules={{ required: "請選擇一個寵物類別" }}
                  render={({ field }) => (
                    <Select
                      id="寵物類別"
                      imgSrc={feetIcon}
                      label="寵物類別"
                      options={PET_SPECIES_OPTIONS}
                      {...field}
                      error={errors?.species}
                    />
                  )}
                />
              </div>

              <div className="col-md-3">
                <Select
                  id="city"
                  imgSrc={locationIcon}
                  label="服務地區"
                  options={cityOptions}
                  value={tempCity}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setTempCity(newCity);
                    setValue("location_id", "");
                  }}
                />
              </div>

              <div className="col-md-3">
                <Controller
                  name="location_id"
                  control={control}
                  rules={{ required: "請選擇一個服務地區" }}
                  render={({ field }) => (
                    <Select
                      id="服務地區"
                      imgSrc={locationIcon}
                      label="服務地區"
                      options={filteredDistricts}
                      {...field}
                      disabled={!tempCity}
                      error={errors?.location_id}
                    />
                  )}
                />
              </div>

              <div className="col-md-3">
                <Controller
                  name="day_of_week"
                  control={control}
                  rules={{ required: "請選擇一天" }}
                  render={({ field }) => (
                    <Select
                      id="星期"
                      imgSrc={calendarIcon}
                      label="服務星期"
                      options={WEEKDAY_OPTIONS}
                      {...field}
                      error={errors?.day_of_week}
                    />
                  )}
                />
              </div>
              
              {/* --- 時間選擇區塊 --- */}
              <div className="col-md-9">
                <div className="d-flex flex-column flex-md-row align-items-md-center">
                  <div className="row gx-3 flex-grow-1 mb-3 mb-md-0">
                    <div className="col-6">
                      <Controller
                        name="start_hour"
                        control={control}
                        rules={{ required: "請選擇開始時段" }}
                        render={({ field }) => (
                          <Select
                            id="start_hour"
                            label="開始時"
                            options={HOUR_OPTIONS}
                            {...field}
                            error={errors?.start_hour}
                          />
                        )}
                      />
                    </div>
                    <div className="col-6">
                      <Controller
                        name="start_minute"
                        control={control}
                        rules={{ required: "請選擇開始時段" }}
                        render={({ field }) => (
                          <Select
                            id="start_minute"
                            label="開始分"
                            options={MINUTE_OPTIONS}
                            {...field}
                            error={errors?.start_minute}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <span
                    className="mx-3 flex-shrink-0 d-none d-md-block"
                    style={{ color: "#FF8400", fontWeight: 700 }}
                  >
                    －
                  </span>

                  <div className="row gx-3 flex-grow-1">
                    <div className="col-6">
                      <Controller
                        name="end_hour"
                        control={control}
                        rules={{ required: "請選擇結束時段" }}
                        render={({ field }) => (
                          <Select
                            id="end_hour"
                            label="結束時"
                            options={HOUR_OPTIONS}
                            {...field}
                            error={errors?.end_hour} 
                          />
                        )}
                      />
                    </div>
                    <div className="col-6">
                      <Controller
                        name="end_minute"
                        control={control}
                        rules={{ required: "請選擇結束時段" }}
                        render={({ field }) => (
                          <Select
                            id="end_minute"
                            label="結束分"
                            options={MINUTE_OPTIONS}
                            {...field}
                            error={errors?.end_minute} 
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* --- 時間選擇區塊結束 --- */}
              
              <div className="col-md-3">
                <label className="form-label">
                  價格 {label}
                </label>
                {fieldName ? (
                  <>
                    <input
                      type="number"
                      className="form-control rounded-pill border border-warning"
                      {...register(fieldName, {
                        required: `請輸入${label}價格`,
                        min: { value: 0, message: "價格不能低於 0 元" }
                      })}
                      placeholder="請輸入金額"
                    />
                    <p className="text-danger">{errors[fieldName]?.message}</p>
                  </>
                ) : (
                  <input
                    type="text"
                    className="form-control rounded-pill border border-secondary"
                    disabled
                    placeholder="請先選擇服務類別"
                  />
                )}
              </div>

              <div className="col-md-9">
                <div className="d-flex">
                  <label className="form-label">服務簡述</label>
                  {errors.description && <p className="text-danger ms-3">{errors.description.message}</p>}
                </div>
                <textarea
                  {...register("description", { required: "請簡述服務" })}
                  className="form-control border border-warning"
                  rows="4"
                />
              </div>

              <div className="mt-4 text-center">
                <button type="submit" className="btn btn-primary px-5">發布服務</button>
              </div>

            </div>
          </form>
        </div>
      </section>
    </>
  )
};
export default ServiceDeployForm;