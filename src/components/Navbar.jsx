import { useState } from 'react';
import { NavLink } from "react-router"
import logo from "../../src/images/logo.png"
import feetIcon from "../../src/images/icons/feet_icon.png"
import flowIcon from "../../src/images/icons/flow_icon.png"
import searchIcon from "../../src/images/icons/search_icon.png"
import becomeIcon from "../../src/images/icons/become_icon.png"
import shieldIcon from "../../src/images/icons/shield_icon.png"
import faqIcon from "../../src/images/icons/faq_icon.png"
import stroke from "../../src/images/icons/stroke_icon.png"
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate()
  return (
    <nav className="container">
      <div className="nav-capsule mt-7 mb-6">
        {/* 左側：Logo */}
        <NavLink to="/">
          <img src={logo} alt="comPETent" className='nav-logo' />
        </NavLink>

        {/* 中間與右側混合容器 */}
        <div className={`nav-content ${isMenuOpen ? 'is-active' : ''}`}>
          {/* 中間：導覽連結 (PC 置中 / Mobile 置中) */}
          <ul className="nav-links">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={() => setIsMenuOpen(!isMenuOpen)}><img src={feetIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">關於我們</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={() => setIsMenuOpen(!isMenuOpen)}><img src={flowIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">服務流程</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/lookforpetsitter" onClick={() => setIsMenuOpen(!isMenuOpen)}><img src={searchIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">尋找保母</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={() => setIsMenuOpen(!isMenuOpen)}><img src={becomeIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">成為保母</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={() => setIsMenuOpen(!isMenuOpen)}><img src={shieldIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">安心保障</span></NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={() => setIsMenuOpen(!isMenuOpen)}><img src={faqIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">FAQ</span></NavLink>
            </li>
          </ul>

          {/* 右側：功能按鈕 (PC 靠右 / Mobile 置中) */}
          <div className="nav-auth">
            <button className="btn-login" onClick={() => {navigate("/login"), setIsMenuOpen(!isMenuOpen)}}>登入 / 註冊</button>
          </div>
        </div>

        {/* 漢堡選單 (僅 Mobile 顯示) */}
        <button
          className={`nav-toggle ${isMenuOpen ? 'is-open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <img src={stroke} alt="" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
