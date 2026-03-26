import top_dec from '../../images/service_detail_img/good_review_top_dec.png'
import bot_dec from '../../images/service_detail_img/good_review_bot_dec.png'
import mb_top_dec from '../../images/service_detail_img/good_review_mb_top_dec.png'
import mb_bot_dec from '../../images/service_detail_img/good_review_mb_bot_dec.png'
import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import { authListener, setRole, setLogout } from '../../slices/userAuthSlice';
import { supabase } from "../../lib/supabaseClient";
function Signup() {
  const [error, setError] = useState('');
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: "onChange",
  });



  const handleSignup = async (signupInfo) => {

    try {
      // const { error } = await supabase.auth.signOut();
      // 1. 執行 Supabase 登入
      const { error: authError } = await supabase.auth.signUp({
        email: signupInfo.email,
        password: signupInfo.password,
      });

      if (authError) throw authError;

      // const { data: userData } = await supabase
      //   .from('users')
      //   .insert('id')
        


    } catch (error) {
      setError(error.message || '登入失敗，請檢查帳號密碼');
    }
  };


  return (
    <>
      <div className=" bg-secondary" style={{
        '--bs-bg-opacity': .2
      }}>
        <img src={top_dec} alt="decoration" className="w-100 d-none d-sm-block" />
        <img src={mb_top_dec} alt="decoration" className="w-100 d-block d-sm-none" />
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <div className="d-flex justify-content-center align-items-center">


            <h2 className="ms-3 text-primary" >註冊</h2>
          </div>

          {/* 註冊容器 */}
          <div
            className="px-3 py-2 mt-8 rounded bg-primary-01"
            style={{ border: '1px solid #eee', }}
          >
            <div className="container my-5">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit(handleSignup)}>
                    <div className="mb-3">
                      <label htmlFor="nickName" className="form-label">
                        暱稱
                      </label>
                      <input
                        id="nickName"
                        name="nickname"
                        type="text"
                        className="form-control"
                        {...register("nickname", {required: "請輸入暱稱"})}/>
                      {errors.nickname && <p className="text-danger">{errors.nickname.message}</p>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input id="email" type="email" name="email" className="form-control"
                        {...register("email", { required: "請輸入 Email" })} />
                      {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="form-label">密碼</label>
                      <input id="password" type="password" name="password" className="form-control"
                        {...register("password", { required: "請輸入密碼", })} />
                      {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>{isSubmitting ? '註冊中...' : '註冊'}</button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
        <img src={bot_dec} alt="decoration" className="w-100 d-none d-sm-block" />
        <img src={mb_bot_dec} alt="decoration" className="w-100 d-block d-sm-none" />
      </div>
    </>
  )
};

export default Signup;