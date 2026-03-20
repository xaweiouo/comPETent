import { useEffect, useState } from 'react';
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
import { supabase } from "../lib/supabaseClient";
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../slices/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, role } = useSelector(state => state.auth)
  const [userEmail, setUserEmail] = useState("")
  const [userNickName, setUserNickName] = useState("")
  const [userImg, setUserImg] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = (e) => {
    e.preventDefault(); // 阻止 <a> 標籤的預設行為
    setIsDropdownOpen(!isDropdownOpen);
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

  // //想要在登入後再取得會員照片、姓名，重新渲染於navbar，但一直沒辦法解決!!!!
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
        if(userData){
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
                <a className="dropdown-toggle d-flex align-items-center gap-2 text-black text-decoration-none" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" onClick={toggleDropdown}>
                  <div className='rounded-circle overflow-hidden'>
                    <img src={userImg} alt="會員照片" style={{ width: "36px", height: "36px" }} />
                  </div>
                  <span className="fw-bold fs-5">{userNickName}</span>
                </a>
                {/* 下拉選單 */}
                <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuLink">
                  {/* 飼主 */}
                  {(role === "owner" || role === "sitter" || role === "admin") && (
                    <li><a className="dropdown-item" href="#">我是飼主</a></li>
                  )}

                  {/* 保母 */}
                  {(role === "sitter" || role === "admin") && (
                    <li><a className="dropdown-item" href="#">我是保母</a></li>
                  )}

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
              <button className="btn-login" onClick={() => { navigate("/login"), setIsMenuOpen(!isMenuOpen) }}>登入 / 註冊</button>
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
