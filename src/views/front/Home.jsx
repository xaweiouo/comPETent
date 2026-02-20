import { useState } from 'react';

const Home = () => {
    const [open, setOpen] = useState(false);
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
            <section className="container mb-9">
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
            <section className="container mb-9">
                <div className="row justify-content-center text-center">
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
            <section className="container mb-9">
                <h2 className="text-center mb-4 mb-md-8 text-primary fw-bold"><img src="./src/images/icons/fire_icon.png" className="me-3" alt="" width="32" />熱門保母</h2>
                <div className="row">
                    <div className="col-md-4 mb-6 mb-md-0">
                        <div className="card rounded-4">
                            <div className="position-relative">
                                <img src="https://images.unsplash.com/photo-1579119134757-5c38803f34fc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="300" />
                                <div className="bg-light bg-opacity-75 d-flex justify-content-between align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                    <h4 className="card-title mb-0 fw-bold">Elsa</h4>
                                    <div className="d-flex">
                                        <p className="fs-6 fw-bold mb-0 px-2 py-1 rounded-pill bg-white me-10">到府服務</p>
                                        <p className="fs-6 fw-bold mb-0 px-2 py-1 rounded-pill bg-white">狗</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-10">
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
                                <img src="https://images.unsplash.com/photo-1532469060546-4eb37b460481?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="300" />
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
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-primary text-white fw-bold">查看更多<i className="bi bi-arrow-right ms-2"></i></button>
                </div>
            </section>
            <section className="container mb-9">
                <h2 className="text-center mb-4 mb-md-8 text-primary fw-bold"><img src="./src/images/icons/flow_icon.png" className="me-3" alt="" width="32" />服務流程</h2>
                <div className="row">
                    <div className="col-6">
                        <div className="d-flex flex-column flex-md-row align-items-center">
                            <div className="bg-box mb-3 mb-md-0">
                                <img src="./src/images/icons/owner_icon.png" className="flex-shrink-0" alt="" width="92" />
                            </div>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">篩選需要的保姆服務</div>
                            <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info"></i>
                            <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info"></i>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">選擇中意的保姆服務</div>
                        </div>
                    </div>
                    <div className="d-block d-md-none col-6">
                        <div className="d-flex flex-column flex-md-row align-items-center">
                            <div className="bg-box mb-3 mb-md-0">
                                <img src="./src/images/icons/sitter_icon.png" className="flex-shrink-0" alt="" width="92" />
                            </div>
                            <div className="fs-6 fs-lg-1 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">上傳良民證審核</div>
                            <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info"></i>
                            <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info"></i>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">通過並發布服務</div>
                            <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info"></i>
                            <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info"></i>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">等待飼主預約</div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-md-end">
                    <div className="col-md-6">
                        <div className="d-flex flex-column flex-md-row justify-content-end  align-items-center">
                            <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info"></i>
                            <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info"></i>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">確認服務細節</div>
                            <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info"></i>
                            <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info"></i>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">付款後成立訂單</div>
                            <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info"></i>
                            <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info"></i>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">完成訂單並給予評價</div>
                        </div>
                    </div>
                </div>
                <div className="d-none d-md-block row">
                    <div className="col-md-7">
                        <div className="d-flex flex-column flex-md-row align-items-center">
                            <div className="bg-box mb-3 mb-md-0">
                                <img src="./src/images/icons/sitter_icon.png" className="flex-shrink-0" alt="" width="92" />
                            </div>
                            <div className="fs-6 fs-lg-1 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">上傳良民證審核</div>
                            <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info"></i>
                            <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info"></i>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">通過並發布服務</div>
                            <i className="d-none d-md-block bi bi-arrow-right ms-1 text-info"></i>
                            <i className="d-block d-md-none bi bi-arrow-down ms-1 text-info"></i>
                            <div className="fs-6 ms-1 bg-white rounded-4 border border-secondary py-7 px-10">等待飼主預約</div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container mb-9">
                <h2 className="text-center mb-4 mb-md-8 text-primary fw-bold"><img src="./src/images/icons/love_icon.png" className="me-3" alt="" width="32" />毛孩父母一致好評</h2>
                <div className="row overflow-x-auto flex-nowrap gap-3 px-3">
                    <div className="card rounded-4 card-comment">
                        <div className="position-relative">
                            <img src="https://images.unsplash.com/photo-1609138271629-571665f418a3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="240" />
                            <div className="bg-light bg-opacity-75 d-flex align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                <p className="fs-6 fw-bold mb-0 me-10 px-2 py-1 rounded-pill bg-info text-white">飼主</p>
                                <h4 className="card-title mb-0 fw-bold">Awei</h4>
                            </div>
                        </div>
                        <div className="card-body p-10">
                            <div className="card-text">
                                <p className="fs-6 fw-bold mb-10">給<span className="rounded-pill border border-2 border-secondary px-2 py-1 mx-1">保母</span>王小明</p>
                                <p className="mb-2">
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                </p>
                                <p className="fs-6 fw-bold">出門散步會傳照片記錄，讓我感到非常放心。</p>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-4 card-comment">
                        <div className="position-relative">
                            <img src="https://images.unsplash.com/photo-1562505209-85d7688af8a7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="240" />
                            <div className="bg-light bg-opacity-75 d-flex align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                <p className="fs-6 fw-bold mb-0 me-10 px-2 py-1 rounded-pill bg-info text-white">飼主</p>
                                <h4 className="card-title mb-0 fw-bold">叮咚</h4>
                            </div>
                        </div>
                        <div className="card-body p-10">
                            <div className="card-text">
                                <p className="fs-6 fw-bold mb-10">給<span className="rounded-pill border border-2 border-secondary px-2 py-1 mx-1">保母</span>愛爾莎</p>
                                <p className="mb-2">
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                </p>
                                <p className="fs-6 fw-bold">讓狗狗去洗澡美容，新造型很好看！</p>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-4 card-comment">
                        <div className="position-relative">
                            <img src="https://images.unsplash.com/photo-1601758176175-45914394491c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="240" />
                            <div className="bg-light bg-opacity-75 d-flex align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                <p className="fs-6 fw-bold mb-0 me-10 px-2 py-1 rounded-pill bg-info text-white">飼主</p>
                                <h4 className="card-title mb-0 fw-bold">Yian</h4>
                            </div>
                        </div>
                        <div className="card-body p-10">
                            <div className="card-text">
                                <p className="fs-6 fw-bold mb-10">給<span className="rounded-pill border border-2 border-secondary px-2 py-1 mx-1">保母</span>阿倫</p>
                                <p className="mb-2">
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                </p>
                                <p className="fs-6 fw-bold">很有耐心的訓練狗狗，狗狗的進步非常迅速。</p>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-4 card-comment">
                        <div className="position-relative">
                            <img src="https://images.unsplash.com/photo-1555955924-a8c17aa846b2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="240" />
                            <div className="bg-light bg-opacity-75 d-flex align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                <p className="fs-6 fw-bold mb-0 me-10 px-2 py-1 rounded-pill bg-info text-white">飼主</p>
                                <h4 className="card-title mb-0 fw-bold">AJ</h4>
                            </div>
                        </div>
                        <div className="card-body p-10">
                            <div className="card-text">
                                <p className="fs-6 fw-bold mb-10">給<span className="rounded-pill border border-2 border-secondary px-2 py-1 mx-1">保母</span>Kitty</p>
                                <p className="mb-2">
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                </p>
                                <p className="fs-6 fw-bold">寄宿了貓咪三天，要接回去的時候牠還依依不捨，看起來適應得不錯。</p>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-4 card-comment">
                        <div className="position-relative">
                            <img src="https://images.unsplash.com/photo-1609138271629-571665f418a3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img-top rounded-top-4" alt="保母圖片" height="240" />
                            <div className="bg-light bg-opacity-75 d-flex align-items-center position-absolute bottom-0 start-0 w-100 py-2 px-10">
                                <p className="fs-6 fw-bold mb-0 me-10 px-2 py-1 rounded-pill bg-info text-white">飼主</p>
                                <h4 className="card-title mb-0 fw-bold">Awei</h4>
                            </div>
                        </div>
                        <div className="card-body p-10">
                            <div className="card-text">
                                <p className="fs-6 fw-bold mb-10">給<span className="rounded-pill border border-2 border-secondary px-2 py-1 mx-1">保母</span>王小明</p>
                                <p className="mb-2">
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                    <img className="me-1" src="./src/images/icons/star_full_icon.png" alt="" />
                                </p>
                                <p className="fs-6 fw-bold">出門散步會傳照片記錄，讓我感到非常放心。</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn text-primary"><i className="bi bi-chevron-compact-left"></i></button>
                    <button type="button" className="btn text-primary"><i className="bi bi-chevron-compact-right"></i></button>
                </div>
            </section >
            <section className="container mb-9">
                <h2 className="text-center mb-4 mb-md-8 text-primary fw-bold"><img src="./src/images/icons/faq_icon.png" className="me-3" alt="" width="32" />FAQ</h2>
                <div className="row mb-7">
                    <h4 className="text-info fw-bold title-owner mb-10">我是飼主</h4>
                    <div className="col-12 bg-white rounded-5 mb-7 px-7 py-10">
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 fw-bold">我可以使用現金付款嗎？</p><button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_01" aria-expanded="false" aria-controls="collapse_01" onClick={() => setOpen(!open)}>
                                <i className={`bi ${open ? "bi-dash-lg" : "bi-plus-lg"} text-primary`}></i>
                            </button>
                        </div>
                        <div className={`collapse ${open ? "show" : ""}`} id="collapse_01">
                            <div className="card card-body border-0 p-0">
                                不可以，請遵守我們的付款方式與流程以確保您享有最完整的保障。
                            </div>
                        </div>
                    </div>
                    <div className="col-12 bg-white rounded-5 mb-7 px-7 py-10">
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 fw-bold">我接回寵物時，發現寵物身上有外傷或是表現異常，該怎麼辦？</p><button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_02" aria-expanded="false" aria-controls="collapse_02" onClick={() => setOpen(!open)}>
                                <i className={`bi ${open ? "bi-dash-lg" : "bi-plus-lg"} text-primary`}></i>
                            </button>
                        </div>
                        <div className={`collapse ${open ? "show" : ""}`} id="collapse_02">
                            <div className="card card-body border-0 p-0">
                                寵物若在服務過程中受到傷害，若是保母之疏失而導致的，保母需先支付相關的獸醫醫療費用，超出自負額之部分，我們的保險公司會提供醫療費。
                            </div>
                        </div>
                    </div>
                    <div className="col-12 bg-white rounded-5 mb-7 px-7 py-10">
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 fw-bold">我的寵物如果有攻擊性，可以預約保母服務嗎？</p><button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_03" aria-expanded="false" aria-controls="collapse_03" onClick={() => setOpen(!open)}>
                                <i className={`bi ${open ? "bi-dash-lg" : "bi-plus-lg"} text-primary`}></i>
                            </button>
                        </div>
                        <div className={`collapse ${open ? "show" : ""}`} id="collapse_03">
                            <div className="card card-body border-0 p-0">
                                如果寵物的攻擊性非常難以掌控，您可能無法使用我們的服務。
                            </div>
                        </div>
                    </div>
                    <div className="col-12 bg-white rounded-5 mb-7 px-7 py-10">
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 fw-bold">comPETent 的保母值得信任嗎？</p><button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_04" aria-expanded="false" aria-controls="collapse_04" onClick={() => setOpen(!open)}>
                                <i className={`bi ${open ? "bi-dash-lg" : "bi-plus-lg"} text-primary`}></i>
                            </button>
                        </div>
                        <div className={`collapse ${open ? "show" : ""}`} id="collapse_04">
                            <div className="card card-body border-0 p-0">
                                我們的寵物保姆都經過身份驗證和良民證等審查。您也可以在預訂前查看每個寵物保姆的評價。
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <h4 className="text-info fw-bold title-owner mb-10">我是保母</h4>
                    <div className="col-12 bg-white rounded-5 mb-7 px-7 py-10">
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 fw-bold">comPETent 的保母值得信任嗎？</p><button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_01" aria-expanded="false" aria-controls="collapse_01" onClick={() => setOpen(!open)}>
                                <i className={`bi ${open ? "bi-dash-lg" : "bi-plus-lg"} text-primary`}></i>
                            </button>
                        </div>
                        <div className={`collapse ${open ? "show" : ""}`} id="collapse_01">
                            <div className="card card-body border-0 p-0">
                                有一個愛護動物的心，有相關服務的技能，我們會提供完整的服務流程教學。
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Home