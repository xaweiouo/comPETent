import { supabase } from "../../utils/supabaseClient";

import { useState } from "react";

function Login() {
  const [currentUser, setCurrentUser] = useState(null);


  async function handleTestLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "owner1@example.com",
      password: "owner1",
    });

    console.log("login result:", data, error);

    if (error) {
      alert("測試登入失敗：" + error.message);
    } else {
      // 把目前登入者存起來
      setCurrentUser(data.user);
      alert("測試登入成功！");
      console.log("current user:", currentUser);
    }
  }

  return (
    <>
      <div className="container">
        <form className="">
          <h1 className="text-danger text-center mb-3">登入</h1>
          <div className="mb-5">
            <label htmlFor="username" className="form-label">電子信箱</label>
            <input id="username" type="email" className="form-control" name="username" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">密碼</label>
            <input id="password" type="password" className="form-control" name="password" />
          </div>

          <button type="submit" className='btn btn-primary w-100 mt-2'
          onClick={handleTestLogin}>
            登入
          </button>
        </form>
      </div>
    </>
  )
};
export default Login;