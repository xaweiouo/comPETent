import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slices/messageSlice";

function AdminBookings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch=useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      // 使用 Supabase 關聯查詢取得所需資料
      // 注意：因 owner_id 和 sitter_id 皆指向 users，需依照 Supabase 外鍵規則指定關聯名稱
      const { data, error } = await supabase
        .from('bookings')
        .select(`
        id,
        order_number,
        arrival_date, arrival_time,
        departure_date, departure_time,
        total_price,
        status,
        pickup_address_detail,
        owner:users!bookings_owner_id_fkey(name),
        sitter:users!bookings_sitter_id_fkey(name),
        pet:pets(name),
        service:services(category),
        location:locations(city, district)
      `)
        .order('created_at', { ascending: false }); // 新訂單在上面

      if (error) {
        dispatch(createAsyncMessage(error));
      } else {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [dispatch]);

  // 狀態對應的 Bootstrap 徽章顏色
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: '待確認', class: 'bg-warning text-dark' },
      accepted: { label: '已接單', class: 'bg-info text-dark' },
      paid: { label: '已付款', class: 'bg-primary' },
      completed: { label: '已完成', class: 'bg-success' },
      rated: { label: '已評價', class: 'bg-success' },
      cancelled: { label: '已取消', class: 'bg-danger' }
    };
    const mapped = statusMap[status] || { label: status, class: 'bg-secondary' };
    return <span className={`badge ${mapped.class}`}>{mapped.label}</span>;
  };

  if (loading) return <div className="text-center mt-5">載入中...</div>;

  // 如果未登入，導向後台登入頁
  // if (!isAdminAuthenticated) {
  //   navigate('/admin/adminlogin');
  // }

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <h4 className="mb-0">訂單管理</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>訂單編號</th>
                  <th>飼主</th>
                  <th>寵物</th>
                  <th>保母</th>
                  <th>服務項目</th>
                  <th>服務時間</th>
                  <th>服務地點</th>
                  <th>價格</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-4">目前尚無訂單</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td><small className="font-monospace">{order.order_number}</small></td>
                      <td>{order.owner?.name}</td>
                      <td>{order.pet?.name}</td>
                      <td>{order.sitter?.name}</td>
                      <td>{order.service?.category}</td>
                      <td>
                        <small>
                          {order.arrival_date} {order.arrival_time} <br />
                          ~ {order.departure_date} {order.departure_time}
                        </small>
                      </td>
                      <td>
                        <small>
                          {order.location?.city}{order.location?.district}<br />
                          {order.pickup_address_detail}
                        </small>
                      </td>
                      <td>NT$ {order.total_price?.toLocaleString()}</td>
                      <td>{getStatusBadge(order.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
};
export default AdminBookings;