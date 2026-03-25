import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import { setAdminLogin } from "../../slices/adminAuthSlice";
import { supabase } from "../../lib/supabaseClient";
import { fetchUserPermissions, setLogout } from "../../slices/authSlice";

function AdminLogin() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const { role } = useSelector(state => state.auth);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
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

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', authData.user.email)
        .maybeSingle();

      const userId = userData.id;

      // 2. 檢查是否為 admin 角色
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (roleError || !roleData) {
        // 如果不是管理員，強制登出並阻擋
        await supabase.auth.signOut();
        throw new Error('權限不足：您不是管理員');
      }else navigate('/admin/adminbookings');

      // if (role === 'admin') { navigate('/admin/adminbookings') }
      // else {
      //   dispatch(setLogout())
      //   // await supabase.auth.signOut();
      //   throw new Error('權限不足：您不是管理員');
      // }


      // navigate('/admin/adminbookings');

    } catch (err) {
      setError(err.message || '登入失敗，請檢查帳號密碼');
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">後台管理登入</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit(handleLogin)}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input id="email" type="email" name="email" className="form-control"
                      {...register("email", { required: "請輸入 Email" })} />
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">密碼</label>
                    <input id="password" type="password" name="password" className="form-control"
                      {...register("password", { required: "請輸入密碼", })} />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                  </div>
                  <button type="submit" className="btn btn-primary w-100">登入</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};
export default AdminLogin;