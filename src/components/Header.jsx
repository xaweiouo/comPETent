import { NavLink } from "react-router";
import feetIcon from "../../src/images/icons/feet_icon.png"
import flowIcon from "../../src/images/icons/flow_icon.png"
import searchIcon from "../../src/images/icons/search_icon.png"
import becomeIcon from "../../src/images/icons/become_icon.png"
import shieldIcon from "../../src/images/icons/shield_icon.png"
import faqIcon from "../../src/images/icons/faq_icon.png"
const Header=()=>{
  return(
    <section className="container">
        <nav className="navbar navbar-expand-lg py-2 px-3 mt-7 mb-6 bg-body-tertiary rounded-5 shadow">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
              <img src="../../src/images/logo.png" className="nav-logo" alt="logo" />
            </NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center" to="/"><img src={feetIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">關於我們</span></NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center" to="/"><img src={flowIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">服務流程</span></NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center" to="/lookforpetsitter"><img src={searchIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">尋找保母</span></NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center" to="/"><img src={becomeIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">成為保母</span></NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center" to="/"><img src={shieldIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">安心保障</span></NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center" to="/"><img src={faqIcon} className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">FAQ</span></NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center" to="/login"><span className="fw-bold h5 mb-0">登入/註冊</span></NavLink>
                </li>
                {/* <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    會員
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="#">基本資料</a></li>
                    <li><a className="dropdown-item" href="#">我是保母</a></li>
                    <li><a className="dropdown-item" href="#">我是飼主</a></li>
                    <li><a className="dropdown-item" href="#">登出</a></li>
                  </ul>
                </li> */}
              </ul>
            </div>
          </div>
        </nav>
      </section>
  )
};
export default Header;