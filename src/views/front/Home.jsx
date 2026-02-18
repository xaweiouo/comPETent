const Home = () => {
    return (
        <>
            <section className="container">
                <nav className="navbar navbar-expand-lg py-2 px-3 mt-7 mb-6 bg-body-tertiary rounded-5 shadow">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">
                            <img src="./src/images/logo.png" className="nav-logo" alt="logo" />
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center" href="#"><img src="./src/images/icons/feet_icon.png" className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">關於我們</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center" href="#"><img src="./src/images/icons/flow_icon.png" className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">服務流程</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center" href="#"><img src="./src/images/icons/search_icon.png" className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">尋找保母</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center" href="#"><img src="./src/images/icons/become_icon.png" className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">成為保母</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center" href="#"><img src="./src/images/icons/shield_icon.png" className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">安心保障</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link d-flex align-items-center" href="#"><img src="./src/images/icons/faq_icon.png" className="me-2" alt="" width="20" /><span className="fw-bold h5 mb-0">FAQ</span></a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        會員
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="#">基本資料</a></li>
                                        <li><a className="dropdown-item" href="#">我是保母</a></li>
                                        <li><a className="dropdown-item" href="#">我是飼主</a></li>
                                        <li><a className="dropdown-item" href="#">登出</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </section>
            <section className="container">
                <div className="row flex-column-reverse flex-md-row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                        <h1 className="mt-4 mb-10 mb-md-7 fw-bold text-primary">comPETent 我能寵</h1>
                        <h3 className="mb-8 fw-bold">從不認識到放心託付，comPETent 幫您把關每一步！</h3>
                        <button type="button" className="fw-bold me-3 btn btn-gradint-secondary py-3 px-4">當保母</button>
                        <button type="button" className="fw-bold btn btn-gradint-primary py-3 px-4">找保母</button>
                    </div>
                    <div className="col-md-6 text-center">
                        <img className="banner-image" src="./src/images/banner_img.png" alt="主圖" />
                    </div>
                </div>
            </section>
            <section className="container">
                <div className="row justify-content-center text-center mt-9">
                    <div className="col-md-6">
                        <h2 className="mb-8 text-primary fw-bold"><img src="./src/images/icons/feet_icon.png" className="me-3" alt="" width="32" />關於 comPETent 我能寵</h2>
                        <p className="h5 mb-2">comPETent 是協助媒合飼主與物保母的平台。</p>
                        <p className="h5 mb-2">competent 有形容“能勝任的”意思，裡面包含了 PET 這三個字母，</p>
                        <p className="h5 mb-2">以此為名，傳達出與我們合作的保母能給寵物無微不至的照顧！</p>
                    </div>
                </div>
                <div className="row text-center mt-5 mb-9">
                    <div className="col-md-4 position-relative mb-6 mb-md-0">
                        <div className="bg-white rounded-4 p-7 h-100">
                            <h5 className="mb-10 fw-bold">多元服務</h5>
                            <p className="h5">comPETent 提供多元的服務，各種寵物皆能找到保母，不局限於貓、狗，還有提供各種服務的保母。</p>
                        </div>
                        <button type="button" className="btn btn-primary text-white fw-bold position-absolute top-100 start-50 translate-middle">找服務<i className="bi bi-arrow-right ms-2"></i></button>
                    </div>
                    <div className="col-md-4 position-relative mb-6 mb-md-0">
                        <div className="bg-white rounded-4 p-7 h-100">
                            <h5 className="mb-10 fw-bold">自由接案</h5>
                            <p className="h5">comPETent 提供保母一個自由接案的平台，讓您有機會嶄現您的專業，提供寵物無微不至的照顧。</p>
                        </div>
                        <button type="button" className="btn btn-primary text-white fw-bold position-absolute top-100 start-50 translate-middle">當保母<i className="bi bi-arrow-right ms-2"></i></button>
                    </div>
                    <div className="col-md-4 position-relative mb-6 mb-md-0">
                        <div className="bg-white rounded-4 p-7 h-100">
                            <h5 className="mb-10 fw-bold">安心保障</h5>
                            <p className="h5">於服務開始前取消預約，將全額退款。comPETent 提供免費寵物保險，且所有保母皆通過良民證審查，讓飼主更安心。</p>
                        </div>
                        <button type="button" className="btn btn-primary text-white fw-bold position-absolute top-100 start-50 translate-middle">看保障<i className="bi bi-arrow-right ms-2"></i></button>
                    </div>
                </div>
            </section>
            <section className="container">
                <h2 className="text-center mb-8 text-primary fw-bold"><img src="./src/images/icons/fire_icon.png" className="me-3" alt="" width="32" />熱門保母</h2>
                <div className="row">
                    <div className="col-md-4 mb-6 mb-md-0">
                        <div className="card rounded-4">
                            <div className="position-relative">
                                <img src="https://images.unsplash.com/photo-1579119134757-5c38803f34fc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="300"/>
                                <div className="bg-light bg-opacity-75 d-flex justify-content-between align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                    <h4 className="card-title mb-0 fw-bold">Elsa</h4>
                                    <div className="d-flex">
                                        <p className="fs-6 fw-bold mb-0 px-2 py-1 rounded-pill bg-white me-10">到府服務</p>
                                        <p className="fs-6 fw-bold mb-0 px-2 py-1 rounded-pill bg-white">狗</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-text d-flex flex-column justify-content-center align-items-center">
                                    <p className="fs-6 fw-bold mb-10"><img src="./src/images/icons/location_icon.png" className="me-2" alt="" />台北市 信義區</p>
                                    <p className="mb-3">
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <span className="fs-6 ms-2 fw-bold">4.8</span>
                                    </p>
                                    <div className="border border-secondary w-75 mb-3"></div>
                                    <p className="fs-6 fw-bold">NT$ <span className="fs-5">300</span> /次</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-6 mb-md-0">
                        <div className="card rounded-4">
                            <div className="position-relative">
                                <img src="https://images.unsplash.com/photo-1532469060546-4eb37b460481?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="300"/>
                                <div className="bg-light bg-opacity-75 d-flex justify-content-between align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                    <h4 className="card-title mb-0 fw-bold">Tommy</h4>
                                    <div className="d-flex">
                                        <p className="fs-6 fw-bold mb-0 px-2 py-1 rounded-pill bg-white me-10">陪伴散步</p>
                                        <p className="fs-6 fw-bold mb-0 px-2 py-1 rounded-pill bg-white">狗</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-text d-flex flex-column justify-content-center align-items-center">
                                    <p className="fs-6 fw-bold mb-10"><img src="./src/images/icons/location_icon.png" className="me-2" alt="" />台中市 中區</p>
                                    <p className="mb-3">
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <span className="fs-6 ms-2 fw-bold">4.7</span>
                                    </p>
                                    <div className="border border-secondary w-75 mb-3"></div>
                                    <p className="fs-6 fw-bold">NT$ <span className="fs-5">200</span> /次</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-6 mb-md-0">
                        <div className="card rounded-4">
                            <div className="position-relative">
                                <img src="https://images.unsplash.com/photo-1642112312562-f7dfcfcff8b6?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4 overflow-hidden" alt="保母圖片" height="300" />
                                <div className="bg-light bg-opacity-75 d-flex justify-content-between align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                    <h4 className="card-title mb-0 fw-bold">Sana</h4>
                                    <div className="d-flex">
                                        <p className="fs-6 fw-bold mb-0 px-2 py-1 rounded-pill bg-white me-10">寄宿</p>
                                        <p className="fs-6 fw-bold mb-0 px-2 py-1 rounded-pill bg-white">貓</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-text d-flex flex-column justify-content-center align-items-center">
                                    <p className="fs-6 fw-bold mb-10"><img src="./src/images/icons/location_icon.png" className="me-2" alt="" />高雄市 新興區</p>
                                    <p className="mb-3">
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                        <span className="fs-6 ms-2 fw-bold">4.6</span>
                                    </p>
                                    <div className="border border-secondary w-75 mb-3"></div>
                                    <p className="fs-6 fw-bold">NT$ <span className="fs-5">800</span> /次</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center mb-9">
                    <button type="button" className="btn btn-primary text-white fw-bold">查看更多<i className="bi bi-arrow-right ms-2"></i></button>
                </div>
            </section>
        </>
    )
}
export default Home