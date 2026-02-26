import { supabase } from "../../utils/supabaseClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { handleLogout } from "../../utils/logout";

function Login() {
  const dispatch = useDispatch();
  const{user,isAuthenticated}=useSelector(state=>state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    mode: "onChange",
  });

  async function handleLogin(loginInfo) {
    console.log("正在嘗試登入的資料:", loginInfo);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginInfo.email,
      password: loginInfo.password
    });

    if (error) {
      alert(`登入失敗: ${error.message}`);
      console.log(error)
    } else {
      dispatch(setUser(data.user));
      alert('登入成功！');
    }
  }

  return (
    <>
      <div className="container">
        <form className="" style={{ maxWidth: '500px', margin: 'auto', marginTop: '100px' }} onSubmit={handleSubmit(handleLogin)}>
          <h1 className="text-danger text-center mb-3">登入</h1>
          <div className="mb-5">
            <label htmlFor="email" className="form-label">電子信箱</label>
            <input id="email" type="email" className="form-control" name="email"
              {...register("email", { required: "請輸入 Email" })} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">密碼</label>
            <input id="password" type="password" className="form-control" name="password"
              {...register("password", {
                required: "請輸入密碼",
                // minLength: { value: 6, message: "密碼至少 6 位元" }
              })} />
              {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
          </div>

          <button type="submit" className='btn btn-primary w-100 mt-2' disabled={isSubmitting}>
            {isSubmitting ? '登入中...' : '登入'}
          </button>
        </form>

        <p className="text-center">{isAuthenticated?'已登入':'未登入'}</p>
        <button type="button" disabled={!isAuthenticated} onClick={()=>{handleLogout(dispatch)}}>登出</button>
      </div>
    </>
  )
};
export default Login;