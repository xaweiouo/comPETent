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
// import radarIcon from "../../images/icons/radar_icon.png";

import { SITTER_SERVICE_OPTIONS, PET_SPECIES_OPTIONS, WEEKDAY_OPTIONS, HOUR_OPTIONS, MINUTE_OPTIONS } from "../../utils/options";
import Select from "../../components/Select";
import { createAsyncMessage } from "../../slices/messageSlice";

const ServiceDeployForm = () => {
  // const [isChecking, setIsChecking] = useState(true);
  const dispatch=useDispatch();
  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);
  const [userId, setUserId] = useState(null);
  const { locations, cityOptions } = useLocations();

  // 監聽目前選中的縣市（這不是註冊在表單裡的，只是 UI 邏輯）
  const [tempCity, setTempCity] = useState('');
  // const[tempDistrict,setTempDistrict]=useState('');

  // 過濾出該縣市的所有地區組合
  const filteredDistricts = locations.filter(loc => loc.city === tempCity).map(loc => ({ value: loc.id, label: loc.district }));



  const navigate = useNavigate();


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
      // 開啟倒數 3 秒後跳轉
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
    defaultValues: {
      // category: '',
      // species: '',
      // location: '',
      // photo_url: '',
      // day_of_week: '',
      // start_time: '',
      // end_time: '',
      // description: '',
      // price: '',
      // 設定預設值避免 undefined
    }
  });

  // 監控 category 欄位的值
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


  const onSubmit = async (data) => {
    try {
      const formattedStartTime = `${data.start_hour}:${data.start_minute}:00`;
      const formattedEndtTime = `${data.end_hour}:${data.end_minute}:00`;
      const dataToSave = { category: data.category };

      // 寫入 services 主表
      const { error: sError } = await supabase
        .from('services')
        .insert([{
          sitter_id: userId,
          location_id: data.location_id,
          // photo_url: mainPhotoPath,
          category: data.category,
          species: data.species,
          day_of_week: data.day_of_week,
          start_time: formattedStartTime,
          end_time: formattedEndtTime,
          description: data.description,
          // 根據類別寫入對應價格，其餘為 null
          price_per_30min: data.price_per_30min || null,
          price_per_day: data.price_per_day || null,
          price_per_session: data.price_per_session || null,
        }])
        .select()
        .single();

      if (sError) throw sError;

      reset();
      setTempCity('');
    } catch (error) {
      dispatch(createAsyncMessage(error));
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
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center fw-bold text-primary mb-5">發布服務</h2>

            <div className="row g-3 align-items-start justify-content-between">

              <div className="col-12 col-md-3">
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

                        // 當類別改變，清空所有價格欄位
                        setValue("price_per_30min", null);
                        setValue("price_per_day", null);
                        setValue("price_per_session", null);
                      }}
                      // {...field} // 這會自動傳入 value 和 onChange
                      error={errors?.category}
                    />
                  )}
                />
              </div>

              <div className="col-12 col-md-3">
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
                      {...field} // 這會自動傳入 value 和 onChange
                      error={errors?.species}
                    />
                  )}
                />
              </div>

              <div className="col-12 col-md-3">
                {/* 1. 縣市選單 (純 UI) */}
                <Select
                  id="city"
                  imgSrc={locationIcon}
                  label="服務地區"
                  options={cityOptions}
                  value={tempCity} // 手動綁定狀態
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setTempCity(newCity);
                    setValue("location_id", ""); // 連動清空地區 ID
                  }}
                />
              </div>

              <div className="col-12 col-md-3">
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
                      {...field} // 這會自動傳入 value 和 onChange
                      disabled={!tempCity}
                      error={errors?.location_id}
                    />
                  )}
                />
              </div>

              <div className="col-12 col-md-3">
                <Controller
                  name="day_of_week"
                  control={control}
                  rules={{ required: "請選擇一天" }}
                  render={({ field }) => (
                    <Select
                      id="星期"
                      imgSrc={locationIcon}
                      label="服務星期"
                      options={WEEKDAY_OPTIONS}
                      {...field} // 這會自動傳入 value 和 onChange
                      error={errors?.day_of_week}
                    />
                  )}
                />
              </div>

              <div className="d-flex col-12 col-md-9 align-items-center">

                <div className="row gx-3 col-12 col-md-6 align-items-start">
                  <div className="col-12 col-md-6">
                    <Controller
                      name="start_hour"
                      control={control}
                      rules={{ required: "請選擇開始時段" }}
                      render={({ field }) => (
                        <Select
                          id="start_hour"
                          // imgSrc={locationIcon}
                          label="開始時"
                          options={HOUR_OPTIONS}
                          {...field} // 這會自動傳入 value 和 onChange
                          error={errors?.start_hour}
                        />
                      )}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <Controller
                      name="start_minute"
                      control={control}
                      rules={{ required: "請選擇開始時段" }}
                      render={({ field }) => (
                        <Select
                          id="start_minute"
                          // imgSrc={locationIcon}
                          label="開始分"
                          options={MINUTE_OPTIONS}
                          {...field} // 這會自動傳入 value 和 onChange
                          error={errors?.start_minute}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* 中間的 －（只桌機要） */}
                <span
                  className="mx-2 flex-shrink-0"
                  style={{ color: "#FF8400", fontWeight: 700 }}
                >
                  －
                </span>

                <div className="row gx-3 col-12 col-md-6">
                  <div className="col-12 col-md-6">
                    <Controller
                      name="end_hour"
                      control={control}
                      rules={{ required: "請選擇結束時段" }}
                      render={({ field }) => (
                        <Select
                          id="end_hour"
                          // imgSrc={locationIcon}
                          label="結束時"
                          options={HOUR_OPTIONS}
                          {...field} // 這會自動傳入 value 和 onChange
                          error={errors?.start_hour}
                        />
                      )}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <Controller
                      name="end_minute"
                      control={control}
                      rules={{ required: "請選擇結束時段" }}
                      render={({ field }) => (
                        <Select
                          id="end_minute"
                          // imgSrc={locationIcon}
                          label="結束分"
                          options={MINUTE_OPTIONS}
                          {...field} // 這會自動傳入 value 和 onChange
                          error={errors?.start_minute}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-3">
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

              <div className="col-9">
                <div className="d-flex">
                  <label className="form-label">服務簡述</label>
                  {errors.description && <p className="text-danger ms-3">{errors.description.message}</p>}
                </div>
                <textarea
                  {...register("description", { required: "請簡述服務" })}
                  className="form-control border border-warning"

                  rows="4"
                // error={errors?.description}
                // value={newPet.note}
                // onChange={(e) =>
                //   setNewPet((prev) => ({ ...prev, note: e.target.value }))
                // }
                // placeholder="例如：怕生、對貓敏感、曾開刀等"
                />
              </div>

              <button type="submit" className="btn btn-primary">發布服務</button>
            </div>

          </form>
        </div>
      </section>
    </>
  )
};
export default ServiceDeployForm;