import { supabase } from "../../utils/supabaseClient";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const ServiceDeployForm = () => {
  const [isChecking, setIsChecking] = useState(true);

  const { user, isAuthenticated , isAuthLoading} = useSelector(state => state.auth);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading)return;

    if (!isAuthenticated) {
      // 開啟倒數 3 秒後跳轉
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } else if (isAuthenticated) {
      getUserId();
    }
  }, [isAuthenticated]);

  const getUserId = async () => {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();
    setUserId(userData.id);
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
      <h1>發布服務</h1>
      <p>{userId}</p>
    </>
  )
};
export default ServiceDeployForm;