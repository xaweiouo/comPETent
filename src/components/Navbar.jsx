import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from "react-router"
import logo from "../../src/images/logo.png"
import feetIcon from "../../src/images/icons/feet_icon.png"
import flowIcon from "../../src/images/icons/flow_icon.png"
import searchIcon from "../../src/images/icons/search_icon.png"
import becomeIcon from "../../src/images/icons/become_icon.png"
import shieldIcon from "../../src/images/icons/shield_icon.png"
import faqIcon from "../../src/images/icons/faq_icon.png"
import stroke from "../../src/images/icons/stroke_icon.png"
import topChevron from "../../src/images/icons/top_chevron_icon.png"
import botChevron from "../../src/images/icons/bot_chevron_icon.png"
import { useNavigate } from 'react-router';
import { supabase } from "../lib/supabaseClient";
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../slices/authSlice';

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role } = useSelector(state => state.auth)
  const [userEmail, setUserEmail] = useState("")
  const [userNickName, setUserNickName] = useState("")
  const [userImg, setUserImg] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault(); // 阻止 <a> 標籤的預設行為
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 紀錄哪個大項目被展開：null, 'sitter', 'owner'
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    // 如果點擊已展開的，就收合；否則展開新的
    setOpenSection(openSection === section ? null : section);
  };

  const logout = async () => {
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      dispatch(setLogout())
      setIsDropdownOpen(!isDropdownOpen);
      // setUserNickName(null)
      // setUserImg(null)
      navigate('/')
      if (logoutError) {
        throw logoutError
      }
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   //初始化簡查
  //   const initAuth = async () => {
  //     try {
  //       const { data: authData, erro: authError } = await supabase.auth.getSession();
  //       if (authData.session) {
  //         setUserEmail(authData.session.user.email)
  //         dispatch(authListener(authData));
  //       }
  //       if (authError) throw authError;
  //     } catch (error) {
  //       console.log(error.message)
  //     }
  //   };
  //   initAuth()
  // }, [])

  // //想要在登入後再取得會員照片、姓名，重新渲染於navbar
  useEffect(() => {
    const initRole = async () => {
      // 防呆機制：如果 Redux 裡還沒有 user，就不打 API，避免報錯
      if (!user || !user.email) return;

      try {
        const { data: userData } = await supabase
          .from('users')
          .select(`
            id,
            nickname,
            email,
            avatar_url
          `)
          .eq('email', user.email)
          .maybeSingle();
        console.log(userData)
        if (userData) {
          setUserNickName(userData.nickname)
          setUserImg(userData.avatar_url)
        }

        // // 2. 檢查角色
        // const { data: roleData, error: roleError } = await supabase
        //   .from('user_roles')
        //   .select('role')
        //   .eq('user_id', userData.id)

        // if (roleError || !roleData) {
        //   // 如果沒有角色，強制登出並阻擋
        //   await supabase.auth.signOut();
        //   throw new Error('沒有角色');
        // }
        // // 3. 驗證成功，寫入 Redux
        // dispatch(setRole(roleData))
      } catch (error) {
        console.log(error.message)
      }
    };
    initRole()
  }, [user])

  // 每當 URL 路徑改變時，就關閉所有選單
  useEffect(() => {
    setIsDropdownOpen(false); // 關閉下拉選單
    setIsMenuOpen(false);     // 關閉手機版漢堡選單
    setOpenSection(null);     // 關閉「我是飼主/保母」的子項目
  }, [location.pathname]);    // 監聽路徑變化

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

          {/*依登入狀態切換button，有Role呈現會員照片、姓名 */}
          {role ? (
            <div className="nav-auth">
              <div className="dropdown">
                <a className="dropdown-toggle d-flex align-items-center gap-2 text-black text-decoration-none" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => { toggleDropdown(e); toggleSection(null) }}>
                  {userImg && userNickName && (
                    <>
                      <div className='rounded-circle overflow-hidden'>
                        <img src={userImg} alt="會員照片" style={{ width: "36px", height: "36px" }} />
                      </div>
                      <span className="fw-bold fs-5">{userNickName}</span>
                    </>
                  )}
                </a>
                {/* 下拉選單 */}
                <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuLink">
                  <li onClick={(e) => toggleDropdown(e)}><NavLink className="dropdown-item" to="ownerprofile">基本資料</NavLink></li>
                  {/* 飼主 */}
                  {/* {(role === "owner" || role === "sitter" || role === "admin") && (
                  )} */}
                  <li onClick={() => toggleSection('owner')}>
                    <a className="dropdown-item">
                      我是飼主<img src={openSection === 'owner' ? topChevron : botChevron} alt="botChevron" className='align-self-center ms-1' />
                    </a>
                  </li>
                  <ul className={openSection === 'owner' ? 'd-block' : 'd-none'}>
                    <li><NavLink to='ownerprofile' className='text-decoration-none text-reset'>查看個人資料</NavLink></li>
                    <li><NavLink to='ownerbookings' className='text-decoration-none text-reset'>查看訂單</NavLink></li>
                  </ul>
                  {/* 保母 */}
                  {/* {(role === "sitter" || role === "admin") && (
                  )} */}
                  <li onClick={() => toggleSection('sitter')}>
                    <a className="dropdown-item">
                      我是保母<img src={openSection === 'sitter' ? topChevron : botChevron} alt="botChevron" className='align-self-center ms-1' />
                    </a>
                  </li>
                  <ul className={openSection === 'sitter' ? 'd-block' : 'd-none'}>
                    <li>查看個人資料</li>
                    <li><Link to='sitter/bookings/25' className='text-decoration-none text-reset'>查看訂單</Link></li>
                  </ul>

                  {/* 管理平台 */}
                  {role === "admin" && (
                    <li><a className="dropdown-item" href="#">管理平台</a></li>
                  )}
                  <li><a className="dropdown-item" onClick={() => logout()}>登出</a></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="nav-auth">
              <button className="btn-login" onClick={() => {
                navigate("/login", {
                  state: { from: location }
                }), setIsMenuOpen(!isMenuOpen)
              }}>登入 / 註冊</button>
            </div>
          )}

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
