import { supabase } from "../../lib/supabaseClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../slices/authSlice";
import { handleLogout } from "../../utils/logout";
import { NavLink } from "react-router";

function Login() {
  const [loginSwitch, setLoginSwitch] = useState(true);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting}
  } = useForm({
    mode: "onChange",
  });

  async function handleLogin(loginInfo) {
    // console.log("正在嘗試登入的資料:", loginInfo);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginInfo.email,
      password: loginInfo.password
    });

    if (error) {
      alert(`登入失敗: ${error.message}`);
      // console.log(error)
    } else {
      dispatch(setUser(data.user));
      alert('登入成功！');
    }
  }

  const handleSignup = async (formData) => {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });

    if (error) {
      alert(`註冊出錯：${error.message}`);
    } else {
      alert('請檢查電子郵件以完成驗證！');
      // console.log(data);
    }
  };

  return (
    <>
      <div className="container">
        {
          loginSwitch ? (
            <form className="" style={{ maxWidth: '500px', margin: 'auto', marginTop: '100px' }} onSubmit={handleSubmit(handleLogin)}>
              <h1 className="text-danger text-center mb-3">登入</h1>
              <div className="mb-5">
                <label htmlFor="email" className="form-label">電子信箱</label>
                <input id="email" type="email" className="form-control" name="email"
                  {...register("email", { required: "請輸入 Email" })} />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">密碼</label>
                <input id="password" type="password" className="form-control" name="password"
                  {...register("password", {required: "請輸入密碼",})} />
                {errors.password && <p className="text-danger">{errors.password.message}</p>}
              </div>

              <button type="submit" className='btn btn-primary w-100 mt-2' disabled={isSubmitting}>
                {isSubmitting ? '登入中...' : '登入'}
              </button>
              <NavLink className="ms-auto me-2" style={{ color: "blue" }} onClick={() => setLoginSwitch(false)}>註冊</NavLink>
            </form>
          ) : (
            <form className="" style={{ maxWidth: '500px', margin: 'auto', marginTop: '100px' }} onSubmit={handleSubmit(handleSignup)}>
              <h1 className="text-danger text-center mb-3">註冊</h1>
              <div className="mb-5">
                <label htmlFor="nickName" className="form-label">
                  暱稱
                </label>
                <input
                  id="nickName"
                  name="nickname"
                  type="text"
                  className="form-control"
                  placeholder="請輸入暱稱"
                  {...register("nickname", {
                    required: "請輸入暱稱",
                    minLength: {
                      value: 2,
                      message: "姓名至少需要 2 個字"
                    }
                  })}
                />
                {errors.nickname && <p className="text-danger">{errors.nickname.message}</p>}
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="form-label">電子信箱</label>
                <input id="email" type="email" className="form-control" name="email"
                  {...register("email", { required: "請輸入 Email" })} />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">密碼</label>
                <input id="password" type="password" className="form-control" name="password"
                  {...register("password", {
                    required: "請輸入密碼",
                    // minLength: { value: 6, message: "密碼至少 6 位元" }
                  })} />
                {errors.password && <p className="text-danger">{errors.password.message}</p>}
              </div>

              <button type="submit" className='btn btn-primary w-100 mt-2' disabled={isSubmitting}>
                {isSubmitting ? '登入中...' : '登入'}
              </button>
              <NavLink className="ms-auto me-2" style={{ color: "blue" }} onClick={() => setLoginSwitch(true)}>登入</NavLink>
            </form>
          )
        }


        <p className="text-center">{isAuthenticated ? '已登入' : '未登入'}</p>
        <button type="button" className="d-block mx-auto" disabled={!isAuthenticated} onClick={() => { handleLogout(dispatch) }}>登出</button>
      </div>
    </>
  )
};
export default Login;