import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabaseClient";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/authSlice";
import { useState } from "react";
import { NavLink } from "react-router";
function LogInModal() {
  const [loginSwitch, setLoginSwitch] = useState(true);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: "onChange",
  });
  const handleLogin = async (formData) => {
    console.log(formData);
    const { data, error } = await supabase.auth.signInWithPassword(formData);
    if (error) {
      alert(`登入失敗: ${error.message}`);
      console.log(error)
    } else {
      dispatch(setUser(data.user));
      console.log(data)
    }
  };
  const handleSignup = async (formData) => {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });

    if (error) {
      alert(`註冊出錯：${error.message}`);
    } else {
      alert('請檢查電子郵件以完成驗證！');
      console.log(data);
    }
  };
  // const handleSignup = async (formData) => {
  //   console.log(formData)
  //   const session = await supabase.auth.signUp({
  //     email: formData.email,
  //     password: formData.password
  //   });
  // await supabase
  //   .from('user')
  //   .insert([{
  //     id: data.user.id,
  //     name: formData.name,
  //     nickname: formData.nickname,
  //     email: formData.email,
  //     password: formData.password
  //   }])
  // console.log(session)

  return (
    <>
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          {
            loginSwitch ? (
              <div className="modal-content">
                <form onSubmit={() => handleSubmit(handleLogin)}>
                  <div className="modal-header">
                    <h5 className="modal-title" id="loginModalLabel">登入</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-5">
                      <label htmlFor="email" className="form-label">電子信箱</label>
                      <input id="email" type="email" className="form-control" name="email" placeholder="請輸入Email"
                        {...register("email", {
                          required: "請輸入 Email",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email 格式不正確"
                          }
                        })} />
                      {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>
                    <div className="mb-1">
                      <label htmlFor="password" className="form-label">密碼</label>
                      <input id="password" type="password" className="form-control" name="password" placeholder="請輸入密碼"
                        {...register("password", {
                          required: "請輸入密碼",
                          minLength: { value: 6, message: "密碼至少 6 位元" }
                        })} />
                      {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>
                    <div className="d-flex">
                      <NavLink className="ms-auto me-2" style={{ color: "blue" }} onClick={() => setLoginSwitch(false)}>註冊</NavLink>
                    </div>
                  </div>
                  <button type="submit" className='btn btn-gradient-primary ms-auto' disabled={isSubmitting}>
                    {isSubmitting ? "登入中..." : "登入"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="modal-content">
                <form onSubmit={() => handleSubmit(handleSignup)}>
                  <div className="modal-header">
                    <h5 className="modal-title" id="loginModalLabel">註冊</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
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
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">電子信箱</label>
                      <input id="email" type="email" className="form-control" name="email" placeholder="請輸入Email"
                        {...register("email", {
                          required: "請輸入 Email",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email 格式不正確"
                          }
                        })} />
                      {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>
                    <div className="mb-1">
                      <label htmlFor="password" className="form-label">密碼</label>
                      <input id="password" type="password" className="form-control" name="password" placeholder="請輸入密碼"
                        {...register("password", {
                          required: "請輸入密碼",
                          minLength: { value: 6, message: "密碼至少 6 位元" }
                        })} />
                      {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>
                    <div className="d-flex">
                      <NavLink className="ms-auto me-2" style={{ color: "blue" }} onClick={() => setLoginSwitch(true)}>登入</NavLink>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className='btn btn-gradient-primary ms-auto' disabled={isSubmitting}>
                      {isSubmitting ? "註冊中..." : "註冊"}
                    </button>
                  </div>
                </form>
              </div>
            )
          }
        </div>
      </div >
    </>)
};

export default LogInModal;