import { useEffect, useState } from "react";

function OwnerBookings(){
  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);
  const[ownerBooking,setOwnerBooking]=useState({});
  const[loading,setLoading]=useState(true);

  useEffect(() => {
      if (isAuthLoading) return;
  
      if (!isAuthenticated) {
        const timer = setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
        return () => clearTimeout(timer);
      }
  
      const fetchInitialData = async () => {
        try {
          // 從 users 出發，一次拉回 bookings 和 services
          const { data, error } = await supabase
            .from('users')
            .select(`
          *,
          bookings!bookings_owner_id_fkey (
            *,
            services (
            *,
            users (name, nickname, avatar_url))
          )
        `)
            .eq('email', user.email)
            .maybeSingle();
  
          if (error) throw error;
  
          if (data) {
            // 拆分資料存入不同的 State
            // setOwnerProfile(data);
            // setOwnerPets(data.pets || []);
            setOwnerBooking(data.bookings || []);
            setLoading(false);
  
            // console.log("✅ 資料同步完成：", data);
          }
        } catch (error) {
          console.error("❌ 抓取初始化資料失敗：", error.message);
        }
      };
      // 登入後，只在初始化時跑這一次
      fetchInitialData();
  
    }, [isAuthenticated, isAuthLoading, navigate, user]);


  if (!isAuthenticated) {
    return (
      <>
        <p className="text-center">請先登入</p>
        <p className="text-center">3秒後回到首頁</p>
      </>
    )
  } else if (loading) {
    return <div className="d-flex justify-content-center">
      <TailSpin color="var(--bs-primary)" />
    </div>

  };  

  return(
    <>

    </>
  )
};
export default OwnerBookings;