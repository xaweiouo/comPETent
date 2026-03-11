import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import { SITTER_SERVICE_OPTIONS, PET_SPECIES_OPTIONS, WEEKDAY_OPTIONS, HOUR_OPTIONS, MINUTE_OPTIONS } from "../../utils/options";
import Select from "../../components/Select";

const ServiceDeployForm = () => {
  // const [isChecking, setIsChecking] = useState(true);

  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);
  const [userId, setUserId] = useState(null);

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
  }, [isAuthenticated, navigate,user,isAuthLoading]);

  // const getUserId = async () => {
  //   const { data: userData } = await supabase
  //     .from('users')
  //     .select('id')
  //     .eq('email', user.email)
  //     .maybeSingle();
  //   setUserId(userData.id);
  // };

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: '',
      species: '',
      // location: '',
      // photo_url: '',
      day_of_week: '',
      start_time: '',
      end_time: '',
      // description: '',
      // price: '',
      // 設定預設值避免 undefined
    }
  });

  const onSubmit = async (data) => {
    try {
      const formattedStartTime = `${data.start_hour}:${data.start_minute}:00`;
      const formattedEndtTime = `${data.end_hour}:${data.end_minute}:00`;

      const dataToSave = { category: data.category };
      console.log("準備寫入的資料內容：", JSON.stringify(dataToSave));

      // 寫入 services 主表
      const { data: service, error: sError } = await supabase
        .from('services')
        .insert([{
          sitter_id: userId,
          // location_id: data.location_id,
          // photo_url: mainPhotoPath,
          category: service.category,
          species: service.species,
          day_of_week: data.day_of_week,
          start_time: formattedStartTime,
          end_time: formattedEndtTime,
          // description: data.description,
          // 根據類別寫入對應價格，其餘為 null
          // price_per_30min: data.price_per_30min || null,
          // price_per_day: data.price_per_day || null,
          // price_per_session: data.price_per_session || null,
        }])
        .select()
        .single();

      if (sError) throw sError;
    } catch (error) {
      console.log(error);
      alert("提交失敗，請檢查網路或格式");
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
      <p>{userId}</p>
      <section className="lookfor-filter-group py-5">
        <div className="container">
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center fw-bold text-primary mb-5">發布服務</h2>

            <div className="row g-3 align-items-end">
              {/* 服務類別 */}
              <div className="col-12 col-md-3">
                <label htmlFor="serviceType" className="form-label mb-2">
                  服務類別
                </label>
                <Select
                  {...register("category")}
                  options={SITTER_SERVICE_OPTIONS}
                />
              </div>

              {/* 寵物類別 */}
              <div className="col-12 col-md-3">
                <label htmlFor="serviceType" className="form-label mb-2">
                  服務的寵物
                </label>
                <Select
                  {...register("species")}
                  options={PET_SPECIES_OPTIONS}
                />
              </div>

              {/* 服務地區 */}
              {/* <div className="col-12 col-md-3">
                <label htmlFor="serviceType" className="form-label mb-2">
                  服務地區
                </label>
                <Select
                  {...register("category")}
                  options={SITTER_SERVICE_OPTIONS}
                />
              </div> */}

              {/* 服務天 */}
              <div className="col-12 col-md-3">
                <label htmlFor="serviceType" className="form-label mb-2">
                  服務天
                </label>
                <Select
                  {...register("day_of_week")}
                  options={WEEKDAY_OPTIONS}
                />
              </div>

              {/* 開始時間：時分 */}
              <div className="col-12 col-md-3">
                <div className="row g-2">

                  <div className="col-6">
                    <label className="form-label mb-2">開始時</label>
                    <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                      <Select
                        {...register("start_hour")}
                        options={HOUR_OPTIONS}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <label className="form-label mb-2">開始分</label>
                    <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                      <Select
                        {...register("start_minute")}
                        options={MINUTE_OPTIONS}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* 結束時間：時分 */}
              <div className="col-12 col-md-3">
                <div className="row g-2">

                  <div className="col-6">
                    <label className="form-label mb-2">結束時</label>
                    <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                      <Select
                        {...register("end_hour")}
                        options={HOUR_OPTIONS}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <label className="form-label mb-2">結束分</label>
                    <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
                      <Select
                        {...register("end_minute")}
                        options={MINUTE_OPTIONS}
                      />
                    </div>
                  </div>

                </div>
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