import top_dec from '../../images/service_detail_img/good_review_top_dec.png'
import bot_dec from '../../images/service_detail_img/good_review_bot_dec.png'
import mb_top_dec from '../../images/service_detail_img/good_review_mb_top_dec.png'
import mb_bot_dec from '../../images/service_detail_img/good_review_mb_bot_dec.png'
import {  useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import { authListener, setRole } from '../../slices/authSlice';
import { supabase } from "../../lib/supabaseClient";
import { fetchUserPermissions } from '../../slices/authSlice';
import { createAsyncMessage } from '../../slices/messageSlice';
function Login() {
  // const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";
  // const{isAuthenticated}=useSelector(state=>state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: "onChange",
  });



  const handleLogin = async (loginInfo) => {

    try {
      // 1. 執行 Supabase 登入
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginInfo.email,
        password: loginInfo.password,
      });

      if (authError) throw authError;

      await dispatch(fetchUserPermissions(authData.user)).unwrap();
      dispatch(createAsyncMessage({text:'登入成功'}));
      navigate(from, { replace: true });

    } catch (err) {
     
      dispatch(createAsyncMessage(err));
      
    }
  };

  // 防止迴圈：如果來源是登入或註冊頁，一律改回首頁或其他特定頁面（如寵物服務頁）
  if (from === "/login" || from === "/signup") {
    from = "/"; // 或者你希望的預設頁面
  }

//   useEffect(() => {
//   if (isAuthenticated) {
//     const timer = setTimeout(() => {
//       navigate('/', { replace: true });
//     }, 3000);

//     // 記得清除 timer，避免元件卸載後還在執行跳轉
//     return () => clearTimeout(timer);
//   }
// }, [isAuthenticated, navigate]);

//   if(isAuthenticated){
//     return (
//     <>
//       <h1 className="text-center mt-9">您已登入</h1>
//       <p className="text-center">三秒後跳轉至首頁</p>
//     </>
//   );
//   }


  return (
    <>
      <div className=" bg-secondary" style={{
        '--bs-bg-opacity': .2
      }}>
        <img src={top_dec} alt="decoration" className="w-100 d-none d-sm-block" />
        <img src={mb_top_dec} alt="decoration" className="w-100 d-block d-sm-none" />
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <div className="d-flex justify-content-center align-items-center">


            <h2 className="ms-3 text-primary" >登入</h2>
          </div>

          {/* 登入容器 */}
          <div
            className="px-3 py-2 mt-8 rounded bg-primary-01"
            style={{ border: '1px solid #eee', }}
          >
            <div className="container my-5">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  {/* {error && <div className="alert alert-danger">{error}</div>} */}
                  <form onSubmit={handleSubmit(handleLogin)}>
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
                    <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>{isSubmitting ? '登入中...' : '登入'}</button>
                    <div className='d-flex mt-3'>
                      <a className='ms-auto me-3' onClick={() => navigate('/signup')}>註冊成為comPETent會員</a>
                    </div>
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

export default Login;