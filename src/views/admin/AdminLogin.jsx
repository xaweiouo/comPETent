import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. 執行 Supabase 登入
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = authData.user.id; // 這裡假設你的 users 表 id 跟 auth.uid 有關聯或相同

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
      }

      // 3. 驗證成功，寫入 Redux 並跳轉
      dispatch(setAdminLogin(authData.user));
      navigate('/admin/orders');

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
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">密碼</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
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