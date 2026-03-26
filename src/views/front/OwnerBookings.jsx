import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { TailSpin } from "react-loader-spinner";
import { createAsyncMessage } from "../../slices/messageSlice";

function OwnerBookings() {
  const { user, isAuthenticated, isAuthLoading } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [ownerBooking, setOwnerBooking] = useState({});
  const [ownerPets, setOwnerPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const petMap = useMemo(() => {
    return ownerPets.reduce((acc, pet) => ({ ...acc, [pet.id]: pet.name }), {})
  }
    , [ownerPets]);

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
          pets (*),
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
          setOwnerPets(data.pets || []);
          setOwnerBooking(data.bookings || []);
          setLoading(false);
        }
      } catch (error) {
        dispatch(createAsyncMessage(error));
      }
    };
    // 登入後，只在初始化時跑這一次
    fetchInitialData();

  }, [isAuthenticated, isAuthLoading,user, navigate,dispatch]);

  const handleDelete = async (bookingId) => {
    // if (!window.confirm("確定要取消這筆預約嗎？此操作無法復原。")) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      // 成功後，同步更新本地 State，讓該筆訂單從畫面消失
      setOwnerBooking(prev => prev.filter(b => b.id !== bookingId));

      // 可以發送成功訊息
      dispatch(createAsyncMessage({ text: "預約已成功刪除", type: "success" }));

    } catch (error) {
      dispatch(createAsyncMessage({ text: "刪除失敗，請稍後再試", type: "danger" }));
    }
  };


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

  return (
    <>
      <div className="container">
        <h2 className="ms-3 text-primary text-center mb-6" >我的預約</h2>
        {ownerBooking?.map(b => (

          <div key={b.id} className="card border-0 rounded-4 shadow-sm mb-3">
            <div className="card-body p-3 d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-success rounded-pill mb-2">{b?.status}</span>
                <h5 className="fw-bold mb-1">{b.services.category} (保母：{b.services.users.nickname})</h5>
                <p className="fs-6 mb-0">{b.arrival_date + ' ' + b.arrival_time + '~' + b.departure_time}</p>
                <p className="fs-6">服務對象：{petMap[b.pet_id]}</p>
              </div>
              <div className="text-end d-flex flex-column align-items-end">
                <h5 className="fw-bold mb-2 text-primary" >NT$ {b.total_price}</h5>
                <div className="d-flex flex-column gap-2" style={{width:'80px'}}>
                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill"
                    onClick={() => navigate(`/owner/bookings/${b.id}`)}
                  >
                    查看詳情
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill"
                    onClick={() => handleDelete(b.id)}
                  >
                    刪除訂單
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
};
export default OwnerBookings;