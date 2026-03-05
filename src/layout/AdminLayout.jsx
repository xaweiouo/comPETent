import { Link, Outlet } from "react-router";

function AdminLayout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to='/admin/adminusers'>用戶管理</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to='/admin/adminbookings'>訂單管理</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  )
};
export default AdminLayout;