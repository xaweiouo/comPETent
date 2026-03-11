import logo from "../../src/images/logo.png"

function footer() {
    return (
        <footer className="container text-center my-8">
          <img src={logo} alt="comPETent Logo" className="mb-6 logo-size"/>
          <ul className="mb-6 d-flex justify-content-center p-0">
            <a href="#" className="text-decoration-none text-dark">
              <li className="me-3 fw-bold">使用者條款</li>
            </a>
            <a href="#" className="text-decoration-none text-dark">
              <li className="me-3 fw-bold">隱私政策</li>
            </a>
            <a href="#" className="text-decoration-none text-dark">
              <li className="fw-bold">聯絡我們</li>
            </a>
          </ul>
          <p>&copy; 2026 comPETent. All Rights Reserved</p>
        </footer>
    );
}

export default footer;