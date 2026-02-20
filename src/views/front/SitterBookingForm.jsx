// SitterBookingForm.jsx
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// export { supabase };

function SitterBookingForm() {
    // const { id } = useParams(); // 這裡拿到保母 id
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState(null);

    // 編輯模式：哪一隻在編輯（用 id 或 null）
    const [editingPetId, setEditingPetId] = useState(null);

    // 編輯中的表單值（避免直接動到原本 pets）
    const [editingPetForm, setEditingPetForm] = useState({
        name: "",
        species: "",
        size: "",
        birth_date: "",
        gender: "unknown",
        is_neutered: false,
        last_vaccination_date: "",
        note: "",
        photo_url: "",
    });

    // 新增寵物的表單是否顯示
    const [isAddingPet, setIsAddingPet] = useState(false);

    // 新增寵物的表單值
    const [newPet, setNewPet] = useState({
        name: "",
        species: "",
        size: "",
        birth_date: "",
        gender: "unknown",
        is_neutered: false,
        last_vaccination_date: "",
        note: "",
        photo_url: "",
    });


    const [bookingForm, setBookingForm] = useState({
        pet_id: null,
        arrival_date: "",
        departure_date: "",
        arrival_hour: "",
        arrival_minute: "",
        departure_hour: "",
        departure_minute: "",
        pickup_address_detail: "台北市大安區中正路 26 號",
        note: "",
    });
    const [currentUser, setCurrentUser] = useState(null);



    useEffect(() => {
        async function fetchPets() {
            const { data, error } = await supabase.from("pets").select("*");
            if (error) {
                console.log("fetchPets error", error);
                return;
            }
            setPets(data);

            if (data.length > 0) {
                setSelectedPetId(data[0].id);
                setBookingForm((prev) => ({
                    ...prev,
                    pet_id: data[0].id,
                }));
            }
        }

        fetchPets();
    }, []);




    async function getOwnerIdFromAuth() {
        // 1) 取得目前登入的 auth user
        const { data: authData, error: authError } = await supabase.auth.getUser();
        const authUser = authData?.user; //有值就拿 authData.user，?選擇鏈結運算子
        if (authError || !authUser) {
            // 如果有錯誤，或是 user 是 null => 沒登入
            return {
                status: false,
                message: "請先登入後再建立預約",
                ownerId: null,
            };
        }
        // 2) 用 email 去 public.users 找對應的 id（int）
        //data: userRow 的意思是：把回傳物件裡的 data 欄位，裝到一個叫 userRow 的變數裡
        const { data: userRow, error: userError } = await supabase
            .from("users")
            .select("id") // 只要 users.id 就好
            .eq("email", authUser.email) // where email = authUser.email
            .single(); // 只拿一筆
        //userError 有資料或userRow 是 null 或 undefined，!userRow 就是 true。
        if (userError || !userRow) {
            console.log("userError:", userError);
            return {
                status: false,
                message: "找不到對應的使用者資料，請聯絡開發者",
                ownerId: null,
            };
        }
        return {
            status: true,
            message: "取得 owner_id 成功",
            ownerId: userRow.id, // 之後寫進 bookings.owner_id 用
        };
    }

    function handleBookingChange(e) {
        const { name, value } = e.target;
        setBookingForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        //console.log(bookingForm);
    }

    async function handleBookingSubmit(e) {
        e.preventDefault();
        const arrival_time = `${bookingForm.arrival_hour}:${bookingForm.arrival_minute}`;
        const departure_time = `${bookingForm.departure_hour}:${bookingForm.departure_minute}`;
        const pickup_address_detail = bookingForm.pickup_address_detail || "";
        console.log("arrival_time:", arrival_time);
        console.log("departure_time:", departure_time);

        // 1) 表單基本檢查
        if (bookingForm.pet_id == null) {
            alert("請選擇寵物");
            return;
        }
        if (!bookingForm.arrival_date) {
            alert("請填寫抵達時間");
            return;
        }
        if (!bookingForm.departure_date) {
            alert("請填寫離開時間");
            return;
        }

        console.log("準備送出 booking：", bookingForm);
        // 2) 透過工具函式，從目前登入狀態取得 owner_id（users.id）
        const ownerResult = await getOwnerIdFromAuth();

        if (!ownerResult.status || !ownerResult.ownerId) {
            alert(ownerResult.message);
            return;
        }
        const ownerId = ownerResult.ownerId;

        // 3) 呼叫 Supabase 新增 bookings
        const { data: insertData, error } = await supabase
            .from("bookings")
            .insert([
                {
                    owner_id: ownerId,
                    sitter_id: 2, // 先用假資料
                    service_id: 3, // 先用假資料
                    pet_id: bookingForm.pet_id,
                    arrival_date: bookingForm.arrival_date,
                    arrival_time: arrival_time,
                    departure_date: bookingForm.departure_date,
                    departure_time: departure_time,
                    note: bookingForm.note,
                    pickup_address_detail: pickup_address_detail,
                    status: "pending",
                },
            ])
            .select("id, order_number");

        if (error) {
            console.log("添加預約表單失敗:", error);
            alert("建立預約失敗，請稍後再試");
            return;
        }

        // 4) 成功時提示 + 清空表單
        console.log("建立預約成功:", insertData);
        alert("建立預約成功！");

        setBookingForm({
            pet_id: null,
            arrival_date: "",
            departure_date: "",
            arrival_hour: "",
            arrival_minute: "",
            departure_hour: "",
            departure_minute: "",
            note: "",
            pickup_address_detail: "",
        });
    }

    async function handleTestLogin() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: "owner1@example.com",
            password: "owner1",
        });

        console.log("login result:", data, error);

        if (error) {
            alert("測試登入失敗：" + error.message);
        } else {
            // 把目前登入者存起來
            setCurrentUser(data.user);
            alert("測試登入成功！");
        }
    }
    // 點編輯按鈕，進入編輯模式（把這隻寵物的資料丟到 editingPetForm 裡）
    function handleEditPet() {
        if (!selectedPet) return;
        setEditingPetId(selectedPet.id);
        setEditingPetForm({
            name: selectedPet.name || "",
            species: selectedPet.species || "dog",
            size: selectedPet.size || "small",
            birth_date: selectedPet.birth_date || "",
            gender: selectedPet.gender || "unknown",
            is_neutered: !!selectedPet.is_neutered,
            last_vaccination_date: selectedPet.last_vaccination_date || "",
            note: selectedPet.note || "",
            photo_url: selectedPet.photo_url || "",
        });
    }
    // 編輯寵物表單的變更處理器
    function handleEditPetFieldChange(e) {
        const { name, value, type, checked } = e.target;
        setEditingPetForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }
    // 點取消編輯，離開編輯模式
    function handleCancelEdit() {
        setEditingPetId(null);
    }
    // 點儲存，送出更新寵物的 API 請求
    async function handleSavePet() {
        if (!selectedPet) return;

        const { error } = await supabase
            .from("pets")
            .update({
                name: editingPetForm.name,
                species: editingPetForm.species,
                size: editingPetForm.size,
                birth_date: editingPetForm.birth_date || null,
                gender: editingPetForm.gender,
                is_neutered: editingPetForm.is_neutered,
                last_vaccination_date: editingPetForm.last_vaccination_date || null,
                note: editingPetForm.note,
                photo_url: editingPetForm.photo_url,
            })
            .eq("id", selectedPet.id);

        if (error) {
            console.log("update pet error", error);
            alert("更新寵物資料失敗，請稍後再試");
            return;
        }

        // 更新前端的 pets 陣列
        setPets((prev) =>
            prev.map((p) =>
                p.id === selectedPet.id
                    ? { ...p, ...editingPetForm }
                    : p
            )
        );

        setEditingPetId(null);
        alert("寵物資料已更新！");
    }

    // 點新增寵物，送出新增寵物的 API 請求
    async function handleAddPet(e) {
        e.preventDefault();

        // 1) 取得目前登入者 id（你之前 getOwnerIdFromAuth 已經寫好了）
        const ownerResult = await getOwnerIdFromAuth();
        if (!ownerResult.status || !ownerResult.ownerId) {
            alert(ownerResult.message);
            return;
        }
        const ownerId = ownerResult.ownerId;

        // 2) 寫入 Supabase
        const { data, error } = await supabase
            .from("pets")
            .insert([
                {
                    owner_id: ownerId,
                    name: newPet.name,
                    species: newPet.species || "dog",
                    size: newPet.size || "small",
                    birth_date: newPet.birth_date || null,
                    gender: newPet.gender || "unknown",
                    is_neutered: newPet.is_neutered,
                    last_vaccination_date: newPet.last_vaccination_date || null,
                    note: newPet.note || "",
                    photo_url: newPet.photo_url || null,
                },
            ])
            .select()
            .single();

        if (error) {
            console.log("handleAddPet error", error);
            alert("新增寵物失敗，請稍後再試");
            return;
        }

        // 3) 更新前端列表，並選中新寵物
        setPets((prev) => [...prev, data]);
        setSelectedPetId(data.id);
        setBookingForm((prev) => ({
            ...prev,
            pet_id: data.id,
        }));

        // 4) 清空表單 + 離開新增模式
        setNewPet({
            name: "",
            species: "",
            size: "",
            birth_date: "",
            gender: "unknown",
            is_neutered: false,
            last_vaccination_date: "",
            note: "",
            photo_url: "",
        });
        setIsAddingPet(false);
        alert("新增寵物成功！");
    }

    // 每頁最多 3 張卡片
    const petsPerPage = 3;
    const petPages = [];

    for (let i = 0; i < pets.length; i += petsPerPage) {
        petPages.push(pets.slice(i, i + petsPerPage));
    }



    // 根據 selectedPetId 從 pets 裡找到對應的寵物資料
    const selectedPet = pets.find((p) => p.id === selectedPetId) || null;
    // 判斷目前是否在編輯 selectedPetId 這隻寵物
    const isEditing = editingPetId === selectedPetId;

    return (
        <div className="container booking-page">
            <header className="booking-header-nav">
                {/* navbar 共用區 */}
                <section className="container">
                    <nav className="navbar navbar-expand-lg py-2 px-3 mt-7 mb-6 bg-body-tertiary rounded-5 shadow">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/">
                                <img src="./src/images/logo.png" className="nav-logo" alt="logo" />
                            </a>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-items-center" href="#">
                                            <img src="./src/images/icons/feet_icon.png" className="me-2" alt="" width="20" />
                                            <span className="fw-bold h5 mb-0">關於我們</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-items-center" href="#">
                                            <img src="./src/images/icons/flow_icon.png" className="me-2" alt="" width="20" />
                                            <span className="fw-bold h5 mb-0">服務流程</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-items-center" href="#">
                                            <img src="./src/images/icons/search_icon.png" className="me-2" alt="" width="20" />
                                            <span className="fw-bold h5 mb-0">尋找保母</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-items-center" href="#">
                                            <img src="./src/images/icons/become_icon.png" className="me-2" alt="" width="20" />
                                            <span className="fw-bold h5 mb-0">成為保母</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-items-center" href="#">
                                            <img src="./src/images/icons/shield_icon.png" className="me-2" alt="" width="20" />
                                            <span className="fw-bold h5 mb-0">安心保障</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link d-flex align-items-center" href="#">
                                            <img src="./src/images/icons/faq_icon.png" className="me-2" alt="" width="20" />
                                            <span className="fw-bold h5 mb-0">FAQ</span>
                                        </a>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            id="navbarDropdown"
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
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
            </header>

            <main className="booking-main container">
                {/* row 把左半／右半包起來 */}
                <section className="row booking-sitter-and-price">
                    {/* 左半：返回＋保母資訊＋下面整個表單區 */}
                    <div className="col-lg-9 booking-sitter">
                        {/* 返回按鈕 */}
                        <button className="btn btn-link p-0 booking-back-btn mb-3">
                            <i className="bi bi-chevron-left me-1"></i>
                            <h5 className="ms-2">返回</h5>
                        </button>

                        {/* 保母資訊 */}
                        <div className="d-flex flex-column gap-3 sitter-header">
                            <div className="d-flex align-items-center gap-3">
                                <img
                                    src="src/images/booking_img/阿倫保姆logo_預約表單.png"
                                    className="rounded-circle border border-1 border-warning"
                                    alt="阿倫保姆logo"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                />

                                <h2 className="mb-0 fw-bold sitter-name">阿倫</h2>

                                <span className="border-primary sitter-role-badge border border-2 rounded-pill px-3 py-2 mt-2">
                                    保母
                                </span>

                                <div className="d-flex align-items-center gap-1">
                                    <i className="text-primary bi bi-star-fill"></i>
                                    <i className="text-primary bi bi-star-fill"></i>
                                    <i className="text-primary bi bi-star-fill"></i>
                                    <i className="text-primary bi bi-star-fill"></i>
                                    <i className="text-primary bi bi-star-fill"></i>
                                    <span className="ms-1 fw-bold sitter-score">5</span>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <h5 className="mb-0 fw-bold sitter-service-label">服務項目</h5>
                                <span className="bg-white badge-pill-gray rounded-pill ">
                                    陪伴散步
                                </span>
                            </div>
                        </div>

                        {/* 選擇寵物卡片輪播＋新增寵物提示 */}
                        <section className="booking-pet mt-5">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center py-3">
                                    <img
                                        src="./src/images/icons/feet_icon.png"
                                        className="me-2"
                                        alt=""
                                        width="20"
                                        height="20"
                                    />
                                    <h4 className="text-primary mb-2">選擇寵物</h4>
                                </div>

                                <button
                                    type="button"
                                    className="btn border-0 bg-transparent d-inline-flex align-items-center p-0 mt-1 me-3"
                                    onClick={() => {
                                        setIsAddingPet(true);
                                        setSelectedPetId(null);   // 詳細區顯示空白表單
                                    }}
                                >
                                    <i className="bi bi-file-plus">新增寵物</i>
                                </button>
                            </div>

                            {/* 寵物卡片輪播 */}
                            <div id="petCarousel" className="carousel slide">
                                <div className="carousel-inner">
                                    {petPages.map((pagePets, pageIndex) => (
                                        <div
                                            key={pageIndex}
                                            className={`carousel-item ${pageIndex === 0 ? "active" : ""}`}
                                        >
                                            {/* 固定一個寬度區塊，裡面三張卡片水平排 */}
                                            <div
                                                className="mx-auto d-flex justify-content-center gap-3"
                                                style={{ maxWidth: "1100px" }}  // 根據設計稿可調整
                                            >
                                                {pagePets.map((pet) => (
                                                    <div
                                                        key={pet.id}
                                                        className={
                                                            "card mb-3 pet-card" +
                                                            (bookingForm.pet_id === pet.id ? " border-warning border-3" : "")
                                                        }
                                                        style={{ width: "306px", cursor: "pointer" }}  // 固定寬度，確保三張排進這個區塊
                                                        onClick={() => {
                                                            setSelectedPetId(pet.id);
                                                            setBookingForm((prev) => ({
                                                                ...prev,
                                                                pet_id: pet.id,
                                                            }));
                                                        }}
                                                    >
                                                        <div className="row g-0">
                                                            {/* 左側圖片 */}
                                                            <div className="col-5 d-flex align-items-center pe-0 me-0">
                                                                <img
                                                                    src={pet.photo_url || "src/images/booking_img_logo.jpg"}
                                                                    className="img-fluid rounded-4 py-2 ps-2 pe-0 me-0"
                                                                    alt={pet.name}
                                                                    style={{ height: "100%", objectFit: "cover" }}
                                                                />
                                                            </div>
                                                            {/* 右側資訊 */}
                                                            <div className="col-7 ps-0 ms-0">
                                                                <div className="card-body ms-1">
                                                                    <h5 className="card-title fw-bold mb-2">{pet.name}</h5>

                                                                    <p className="card-text mb-1">
                                                                        <span className="badge bg-warning text-dark me-2">年齡</span>
                                                                        <span>
                                                                            {pet.birth_date
                                                                                ? `${new Date().getFullYear() - new Date(pet.birth_date).getFullYear()} 歲`
                                                                                : "未填"}
                                                                        </span>
                                                                    </p>
                                                                    <p className="card-text mb-1">
                                                                        <span className="badge bg-warning text-dark me-2">性別</span>
                                                                        <span>
                                                                            {pet.gender === "male"
                                                                                ? "公"
                                                                                : pet.gender === "female"
                                                                                    ? "母"
                                                                                    : "未知"}
                                                                        </span>
                                                                    </p>
                                                                    <p className="card-text mb-1">
                                                                        <span className="badge bg-warning text-dark me-2">體型</span>
                                                                        <span>
                                                                            {pet.size === "small"
                                                                                ? "小型"
                                                                                : pet.size === "medium"
                                                                                    ? "中型"
                                                                                    : pet.size === "large"
                                                                                        ? "大型"
                                                                                        : "未填"}
                                                                        </span>
                                                                    </p>

                                                                    <p className="card-text mt-2 mb-0">
                                                                        {pet.is_neutered ? "已結紮，有施打疫苗" : "未結紮，疫苗狀態請洽飼主"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            {/* 下方左右切換按鈕（自訂位置） */}
                            <div className="d-flex justify-content-center gap-4 mt-0">
                                <button
                                    className="btn btn-link p-0"
                                    type="button"
                                    data-bs-target="#petCarousel"
                                    data-bs-slide="prev"
                                >
                                    <i className="bi bi-chevron-left fs-3 text-primary"></i>
                                </button>

                                <button
                                    className="btn btn-link p-0"
                                    type="button"
                                    data-bs-target="#petCarousel"
                                    data-bs-slide="next"
                                >
                                    <i className="bi bi-chevron-right fs-3 text-primary"></i>
                                </button>
                            </div>
                        </section>


                        {/* 毛小孩詳細資料表單 */}
                        <section className="booking-pet-form">
                            <div className="card border-0 rounded-4 background-transparent">
                                <div className="card-body px-0 py-2">
                                    <div className="d-flex align-items-center mb-4">
                                        <img src="./src/images/icons/feet_icon.png" alt="feet" width="20" height="20" className="me-2" />
                                        <h4 className="text-primary mb-0">毛小孩詳細資料</h4>
                                    </div>

                                    {!selectedPet ? (
                                        <form
                                            className="rounded-4 p-4"
                                            style={{ backgroundColor: "#FFB22C33" }}
                                            onSubmit={handleAddPet}
                                        >
                                            <div className="row g-4 align-items-start">
                                                {/* 左側：照片 + 名字 */}
                                                <div className="col-12 col-md-3 d-flex flex-column align-items-center">
                                                    <div className="w-100 mb-3">
                                                        <div className="ratio" style={{ "--bs-aspect-ratio": "133.33%" }}>
                                                            <img
                                                                src={newPet.photo_url || "src/images/booking_img/booking_img_logo.jpg"}
                                                                alt={newPet.name || "new pet"}
                                                                className="w-100 h-100 rounded-4"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="w-100">
                                                        <label className="form-label">名字</label>
                                                        <input
                                                            type="text"
                                                            className="form-control rounded-pill border border-warning"
                                                            value={newPet.name}
                                                            onChange={(e) =>
                                                                setNewPet((prev) => ({ ...prev, name: e.target.value }))
                                                            }
                                                            placeholder="請輸入名字"
                                                            style={{ backgroundColor: "#FEF3E2" }}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* 右側欄位：種類 / 體型 / 出生日期 / 疫苗日期 / 性別 / 是否結紮 / 備註 */}
                                                <div className="col-12 col-md-9">
                                                    <div className="row g-3">
                                                        {/* 種類 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label">種類</label>
                                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                                <span
                                                                    className="input-group-text border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                >
                                                                    <img
                                                                        src="./src/images/icons/feet_icon.png"
                                                                        alt="feet"
                                                                        width="20"
                                                                        height="20"
                                                                    />
                                                                </span>
                                                                <select
                                                                    className="form-select"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                    value={newPet.species}
                                                                    onChange={(e) =>
                                                                        setNewPet((prev) => ({ ...prev, species: e.target.value }))
                                                                    }
                                                                    required
                                                                >
                                                                    <option value="">請選擇種類</option>
                                                                    <option value="dog">狗</option>
                                                                    <option value="cat">貓</option>
                                                                    <option value="others">其他</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* 體型 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label">體型</label>
                                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                                <span
                                                                    className="input-group-text border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                >
                                                                    <img
                                                                        src="./src/images/icons/dog_icon.png"
                                                                        alt="dog"
                                                                        width="20"
                                                                        height="20"
                                                                    />
                                                                </span>
                                                                <select
                                                                    className="form-select border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                    value={newPet.size}
                                                                    onChange={(e) =>
                                                                        setNewPet((prev) => ({ ...prev, size: e.target.value }))
                                                                    }
                                                                >
                                                                    <option value="">請選擇體型</option>
                                                                    <option value="small">小型</option>
                                                                    <option value="medium">中型</option>
                                                                    <option value="large">大型</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* 出生日期 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label">出生日期</label>
                                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                                <span
                                                                    className="input-group-text border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                >
                                                                    <img
                                                                        src="./src/images/icons/cake_icon.png"
                                                                        alt="cake"
                                                                        width="20"
                                                                        height="20"
                                                                    />
                                                                </span>
                                                                <input
                                                                    type="date"
                                                                    className="form-control border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                    value={newPet.birth_date || ""}
                                                                    onChange={(e) =>
                                                                        setNewPet((prev) => ({ ...prev, birth_date: e.target.value }))
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* 上次施打疫苗日期 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label">上次施打疫苗日期</label>
                                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                                <span
                                                                    className="input-group-text border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                >
                                                                    <img
                                                                        src="./src/images/icons/calendar_icon.png"
                                                                        alt="calendar"
                                                                        width="20"
                                                                        height="20"
                                                                    />
                                                                </span>
                                                                <input
                                                                    type="date"
                                                                    className="form-control border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                    value={newPet.last_vaccination_date || ""}
                                                                    onChange={(e) =>
                                                                        setNewPet((prev) => ({
                                                                            ...prev,
                                                                            last_vaccination_date: e.target.value,
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* 性別 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label d-block">性別</label>
                                                            <div className="btn-group" role="group" aria-label="pet gender">
                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="newPetGender"
                                                                    id="newPetGenderMale"
                                                                    value="male"
                                                                    checked={newPet.gender === "male"}
                                                                    onChange={(e) =>
                                                                        setNewPet((prev) => ({ ...prev, gender: e.target.value }))
                                                                    }
                                                                />
                                                                <label className="btn pet-toggle-pill" htmlFor="newPetGenderMale">
                                                                    公
                                                                </label>

                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="newPetGender"
                                                                    id="newPetGenderFemale"
                                                                    value="female"
                                                                    checked={newPet.gender === "female"}
                                                                    onChange={(e) =>
                                                                        setNewPet((prev) => ({ ...prev, gender: e.target.value }))
                                                                    }
                                                                />
                                                                <label
                                                                    className="btn pet-toggle-pill"
                                                                    htmlFor="newPetGenderFemale"
                                                                >
                                                                    母
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* 是否結紮 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label d-block">是否結紮</label>
                                                            <div className="btn-group" role="group" aria-label="pet neuter">
                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="newPetNeuter"
                                                                    id="newPetNeuterYes"
                                                                    value="true"
                                                                    checked={newPet.is_neutered === true}
                                                                    onChange={() =>
                                                                        setNewPet((prev) => ({ ...prev, is_neutered: true }))
                                                                    }
                                                                />
                                                                <label className="btn pet-toggle-pill" htmlFor="newPetNeuterYes">
                                                                    是
                                                                </label>

                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="newPetNeuter"
                                                                    id="newPetNeuterNo"
                                                                    value="false"
                                                                    checked={newPet.is_neutered === false}
                                                                    onChange={() =>
                                                                        setNewPet((prev) => ({ ...prev, is_neutered: false }))
                                                                    }
                                                                />
                                                                <label className="btn pet-toggle-pill" htmlFor="newPetNeuterNo">
                                                                    否
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* 備註 */}
                                                        <div className="col-12">
                                                            <label className="form-label">備註</label>
                                                            <textarea
                                                                className="form-control"
                                                                style={{ backgroundColor: "#FEF3E2" }}
                                                                rows="4"
                                                                value={newPet.note}
                                                                onChange={(e) =>
                                                                    setNewPet((prev) => ({ ...prev, note: e.target.value }))
                                                                }
                                                                placeholder="例如：怕生、對貓敏感、曾開刀等"
                                                            />
                                                        </div>

                                                        {/* 按鈕列 */}
                                                        <div className="col-12 d-flex justify-content-end">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary me-2"
                                                                onClick={() => {
                                                                    setIsAddingPet(false);
                                                                    setNewPet({
                                                                        name: "",
                                                                        species: "",
                                                                        size: "",
                                                                        birth_date: "",
                                                                        gender: "unknown",
                                                                        is_neutered: false,
                                                                        last_vaccination_date: "",
                                                                        note: "",
                                                                        photo_url: "",
                                                                    });
                                                                }}
                                                            >
                                                                取消
                                                            </button>
                                                            <button type="submit" className="btn btn-gradint-primary">
                                                                送出
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>) : (
                                        <div className="rounded-4 p-4" style={{ backgroundColor: "#FFB22C33" }}>
                                            <div className="row g-4 align-items-start">
                                                {/* 左側：照片 + 名字 */}
                                                <div className="col-12 col-md-3 d-flex flex-column align-items-center">
                                                    <div className="w-100 mb-3">
                                                        <div className="ratio" style={{ "--bs-aspect-ratio": "133.33%" }}>
                                                            <img
                                                                src={(isEditing ? editingPetForm.photo_url : selectedPet.photo_url) || "src/images/booking_img/booking_img_logo.jpg"}
                                                                alt={isEditing ? editingPetForm.name : selectedPet.name}
                                                                className="w-100 h-100 rounded-4"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="w-100">
                                                        <label className="form-label">名字</label>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                className="form-control rounded-pill border border-warning"
                                                                name="name"
                                                                value={editingPetForm.name}
                                                                onChange={handleEditPetFieldChange}
                                                                style={{ backgroundColor: "#FEF3E2" }}
                                                                placeholder="請輸入名字"
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                className="form-control rounded-pill border border-warning"
                                                                value={selectedPet.name || ""}
                                                                readOnly
                                                                style={{ backgroundColor: "#FEF3E2" }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 右側欄位 */}
                                                <div className="col-12 col-md-9">
                                                    <div className="row g-3">
                                                        {/* 種類 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label">種類</label>
                                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                                <span className="input-group-text border-0" style={{ backgroundColor: "#FEF3E2" }}>
                                                                    <img src="./src/images/icons/feet_icon.png" alt="feet" width="20" height="20" />
                                                                </span>
                                                                <select
                                                                    className="form-select"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                    name="species"
                                                                    value={(isEditing ? editingPetForm.species : selectedPet.species) || ""}
                                                                    onChange={isEditing ? handleEditPetFieldChange : undefined}
                                                                    disabled={!isEditing}
                                                                >
                                                                    <option value="dog">狗</option>
                                                                    <option value="cat">貓</option>
                                                                    <option value="others">其他</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* 體型 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label">體型</label>
                                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                                <span className="input-group-text border-0" style={{ backgroundColor: "#FEF3E2" }}>
                                                                    <img src="./src/images/icons/dog_icon.png" alt="dog" width="20" height="20" />
                                                                </span>
                                                                <select
                                                                    className="form-select border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                    name="size"
                                                                    value={(isEditing ? editingPetForm.size : selectedPet.size) || ""}
                                                                    onChange={isEditing ? handleEditPetFieldChange : undefined}
                                                                    disabled={!isEditing}
                                                                >
                                                                    <option value="small">小 - 10 公斤以下</option>
                                                                    <option value="medium">中 - 10–20 公斤</option>
                                                                    <option value="large">大 - 大於 20 公斤</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* 出生年（改用 date） */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label">出生日期</label>
                                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                                <span className="input-group-text border-0" style={{ backgroundColor: "#FEF3E2" }}>
                                                                    <img src="./src/images/icons/cake_icon.png" alt="cake" width="20" height="20" />
                                                                </span>
                                                                <input
                                                                    type="date"
                                                                    className="form-control border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                    name="birth_date"
                                                                    value={isEditing ? (editingPetForm.birth_date || "") : (selectedPet.birth_date || "")}
                                                                    onChange={isEditing ? handleEditPetFieldChange : undefined}
                                                                    readOnly={!isEditing}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* 上次施打疫苗日期 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label">上次施打疫苗日期</label>
                                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                                <span className="input-group-text border-0" style={{ backgroundColor: "#FEF3E2" }}>
                                                                    <img src="./src/images/icons/calendar_icon.png" alt="calendar" width="20" height="20" />
                                                                </span>
                                                                <input
                                                                    type="date"
                                                                    className="form-control border-0"
                                                                    style={{ backgroundColor: "#FEF3E2" }}
                                                                    name="last_vaccination_date"
                                                                    value={isEditing ? (editingPetForm.last_vaccination_date || "") : (selectedPet.last_vaccination_date || "")}
                                                                    onChange={isEditing ? handleEditPetFieldChange : undefined}
                                                                    readOnly={!isEditing}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* 性別 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label d-block">性別</label>
                                                            <div className="btn-group" role="group" aria-label="pet gender">
                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="gender"
                                                                    id="petGenderMale"
                                                                    value="male"
                                                                    checked={(isEditing ? editingPetForm.gender : selectedPet.gender) === "male"}
                                                                    onChange={isEditing ? handleEditPetFieldChange : undefined}
                                                                    disabled={!isEditing}
                                                                />
                                                                <label className="btn pet-toggle-pill" htmlFor="petGenderMale">
                                                                    公
                                                                </label>

                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="gender"
                                                                    id="petGenderFemale"
                                                                    value="female"
                                                                    checked={(isEditing ? editingPetForm.gender : selectedPet.gender) === "female"}
                                                                    onChange={isEditing ? handleEditPetFieldChange : undefined}
                                                                    disabled={!isEditing}
                                                                />
                                                                <label className="btn pet-toggle-pill" htmlFor="petGenderFemale">
                                                                    母
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* 是否結紮 */}
                                                        <div className="col-12 col-sm-6">
                                                            <label className="form-label d-block">是否結紮</label>
                                                            <div className="btn-group" role="group" aria-label="pet neuter">
                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="is_neutered"
                                                                    id="petNeuterYes"
                                                                    value="true"
                                                                    checked={isEditing ? editingPetForm.is_neutered === true : !!selectedPet.is_neutered}
                                                                    onChange={
                                                                        isEditing
                                                                            ? () =>
                                                                                setEditingPetForm((prev) => ({
                                                                                    ...prev,
                                                                                    is_neutered: true,
                                                                                }))
                                                                            : undefined
                                                                    }
                                                                    disabled={!isEditing}
                                                                />
                                                                <label className="btn pet-toggle-pill" htmlFor="petNeuterYes">
                                                                    是
                                                                </label>

                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name="is_neutered"
                                                                    id="petNeuterNo"
                                                                    value="false"
                                                                    checked={isEditing ? editingPetForm.is_neutered === false : selectedPet.is_neutered === false}
                                                                    onChange={
                                                                        isEditing
                                                                            ? () =>
                                                                                setEditingPetForm((prev) => ({
                                                                                    ...prev,
                                                                                    is_neutered: false,
                                                                                }))
                                                                            : undefined
                                                                    }
                                                                    disabled={!isEditing}
                                                                />
                                                                <label className="btn pet-toggle-pill" htmlFor="petNeuterNo">
                                                                    否
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* 備註 */}
                                                        <div className="col-12">
                                                            <label className="form-label">備註</label>
                                                            <textarea
                                                                className="form-control"
                                                                style={{ backgroundColor: "#FEF3E2" }}
                                                                rows="4"
                                                                name="note"
                                                                value={isEditing ? editingPetForm.note : (selectedPet.note || "")}
                                                                onChange={isEditing ? handleEditPetFieldChange : undefined}
                                                                readOnly={!isEditing}
                                                                placeholder="例如：怕生、對貓敏感、曾開刀等"
                                                            />
                                                        </div>

                                                        {/* 按鈕：三元運算 */}
                                                        <div className="col-12 d-flex justify-content-end">
                                                            {isEditing ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-gradint-primary me-2"
                                                                        onClick={handleSavePet}
                                                                    >
                                                                        保存
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-secondary"
                                                                        onClick={handleCancelEdit}
                                                                    >
                                                                        取消
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-gradint-secondary"
                                                                    onClick={handleEditPet}
                                                                >
                                                                    編輯
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>


                        {/* 預約表單時間+地點+備註 */}
                        <section className="booking-pet-form mt-5">
                            {/* 服務時間 */}
                            <section className="booking-service-time">
                                <div className="px-4 py-4">
                                    {/* 標題 */}
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src="./src/images/icons/clock_icon.png"
                                            alt="service time"
                                            width="20"
                                            height="20"
                                            className="me-2"
                                        />
                                        <h4 className="text-primary mb-0">服務時間</h4>
                                    </div>

                                    {/* 內容 */}
                                    <div className="row g-3 align-items-center booking-service-time-row">
                                        {/* 從 */}
                                        <div className="col-12 d-flex align-items-center">
                                            <span className="me-3 fw-bold">從</span>

                                            {/* 日期 */}
                                            <div className="flex-grow-1 me-3">
                                                <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                    <span className="input-group-text border-0 background-transparent">
                                                        <img
                                                            src="./src/images/icons/calendar_icon.png"
                                                            alt="date"
                                                            width="20"
                                                            height="20"
                                                        />
                                                    </span>
                                                    <input
                                                        type="date"
                                                        id="InputArrivalDate"
                                                        name="arrival_date"
                                                        className="form-control border-0 background-transparent"
                                                        value={bookingForm.arrival_date}
                                                        onChange={handleBookingChange}
                                                        placeholder="DD/MM/YYYY"
                                                    />

                                                </div>
                                            </div>

                                            {/* 時 */}
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="input-group rounded-pill overflow-hidden border border-warning me-2"
                                                    style={{ minWidth: "96px" }}
                                                >
                                                    <select className="form-select border-0 background-transparent"
                                                        name="arrival_hour"
                                                        value={bookingForm.arrival_hour}
                                                        onChange={handleBookingChange}>

                                                        <option value="00">00</option>
                                                        <option value="01">01</option>
                                                        <option value="02">02</option>
                                                        <option value="03">03</option>
                                                        <option value="04">04</option>
                                                        <option value="05">05</option>
                                                        <option value="06">06</option>
                                                        <option value="07">07</option>
                                                        <option value="08">08</option>
                                                        <option value="09">09</option>
                                                        <option value="10">10</option>
                                                        <option value="11">11</option>
                                                        <option value="12">12</option>
                                                        <option value="13">13</option>
                                                        <option value="14">14</option>
                                                        <option value="15">15</option>
                                                        <option value="16">16</option>
                                                        <option value="17">17</option>
                                                        <option value="18">18</option>
                                                        <option value="19">19</option>
                                                        <option value="20">20</option>
                                                        <option value="21">21</option>
                                                        <option value="22">22</option>
                                                        <option value="23">23</option>
                                                    </select>
                                                </div>
                                                <span className="me-2 fw-bold">時</span>

                                                <div
                                                    className="input-group rounded-pill overflow-hidden border border-warning me-2"
                                                    style={{ minWidth: "96px" }}
                                                >
                                                    <select className="form-select border-0 background-transparent"
                                                        name="arrival_minute"
                                                        value={bookingForm.arrival_minute}
                                                        onChange={handleBookingChange}
                                                    >
                                                        <option value="00">00</option>
                                                        <option value="10">10</option>
                                                        <option value="20">20</option>
                                                        <option value="30">30</option>
                                                        <option value="40">40</option>
                                                        <option value="50">50</option>
                                                    </select>
                                                </div>
                                                <span className="fw-bold">分</span>
                                            </div>
                                        </div>

                                        {/* 到 */}
                                        <div className="col-12 d-flex align-items-center">
                                            <span className="me-3 fw-bold">到</span>

                                            {/* 日期 */}
                                            <div className="flex-grow-1 me-3">
                                                <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                    <span className="input-group-text border-0 background-transparent">
                                                        <img
                                                            src="./src/images/icons/calendar_icon.png"
                                                            alt="date"
                                                            width="20"
                                                            height="20"
                                                        />
                                                    </span>
                                                    <input
                                                        type="date"
                                                        className="form-control border-0 background-transparent"
                                                        id="InputDepartureDate"
                                                        name="departure_date"
                                                        value={bookingForm.departure_date}
                                                        onChange={handleBookingChange}
                                                        placeholder="DD/MM/YYYY"
                                                    />
                                                </div>
                                            </div>

                                            {/* 時 */}
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="input-group rounded-pill overflow-hidden border border-warning me-2"
                                                    style={{ minWidth: "96px" }}
                                                >
                                                    <select className="form-select border-0 background-transparent"
                                                        name="departure_hour"
                                                        value={bookingForm.departure_hour}
                                                        onChange={handleBookingChange}
                                                    >
                                                        <option value="00">00</option>
                                                        <option value="01">01</option>
                                                        <option value="02">02</option>
                                                        <option value="03">03</option>
                                                        <option value="04">04</option>
                                                        <option value="05">05</option>
                                                        <option value="06">06</option>
                                                        <option value="07">07</option>
                                                        <option value="08">08</option>
                                                        <option value="09">09</option>
                                                        <option value="10">10</option>
                                                        <option value="11">11</option>
                                                        <option value="12">12</option>
                                                        <option value="13">13</option>
                                                        <option value="14">14</option>
                                                        <option value="15">15</option>
                                                        <option value="16">16</option>
                                                        <option value="17">17</option>
                                                        <option value="18">18</option>
                                                        <option value="19">19</option>
                                                        <option value="20">20</option>
                                                        <option value="21">21</option>
                                                        <option value="22">22</option>
                                                        <option value="23">23</option>
                                                    </select>
                                                </div>
                                                <span className="me-2 fw-bold">時</span>

                                                <div
                                                    className="input-group rounded-pill overflow-hidden border border-warning me-2"
                                                    style={{ minWidth: "96px" }}
                                                >
                                                    <select className="form-select border-0 background-transparent"
                                                        name="departure_minute"
                                                        value={bookingForm.departure_minute}
                                                        onChange={handleBookingChange}
                                                    >
                                                        <option value="00">00</option>
                                                        <option value="10">10</option>
                                                        <option value="20">20</option>
                                                        <option value="30">30</option>
                                                        <option value="40">40</option>
                                                        <option value="50">50</option>
                                                    </select>
                                                </div>
                                                <span className="fw-bold">分</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 接送地點 */}
                            <section className="booking-location">
                                <div className="px-4 py-4">
                                    {/* 標題 */}
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src="./src/images/icons/location_icon.png"
                                            alt="location"
                                            width="20"
                                            height="20"
                                            className="me-2"
                                        />
                                        <h4 className="text-primary mb-0">接送地點</h4>
                                    </div>

                                    {/* 內容 */}
                                    <div className="row g-3 align-items-center booking-location-row">
                                        <div className="col-12 col-sm-3">
                                            <div className="input-group rounded-pill overflow-hidden border border-warning">
                                                <select className="form-select border-0 background-transparent"
                                                    defaultValue="我家"
                                                    name="pickup_type"
                                                    value={bookingForm.pickup_type}
                                                    onChange={handleBookingChange}
                                                >
                                                    <option value="我家">我家</option>
                                                    <option value="保母家">保母家</option>
                                                    <option value="其他">其他</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-9">
                                            <input
                                                type="text"
                                                className="form-control rounded-pill border border-warning background-transparent"
                                                name="pickup_address_detail"
                                                value={bookingForm.pickup_address_detail}
                                                onChange={handleBookingChange}
                                                placeholder="請輸入接送地址"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 備註 */}
                            <section className="booking-notes">
                                <div className="px-4 py-4">
                                    {/* 標題 */}
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src="./src/images/icons/info_icon.png"
                                            alt="notes"
                                            width="20"
                                            height="20"
                                            className="me-2"
                                        />
                                        <h4 className="text-primary mb-0">備註</h4>
                                    </div>

                                    {/* 內容 */}
                                    <textarea
                                        className="form-control booking-notes-textarea border border-warning background-transparent"
                                        rows="4"
                                        name="note"
                                        value={bookingForm.note}
                                        onChange={handleBookingChange}
                                        placeholder="輸入備註或是您毛小孩的醫療需求與狀況"
                                    />
                                </div>
                            </section>
                        </section>






                    </div>

                    {/* 右半：費用總覽卡片 */}
                    <aside className="col-lg-3 booking-price">
                        <div className="card border-0 rounded-4 shadow-sm">
                            <div className="card-body px-4 py-4">
                                <h3 className="text-center text-primary fw-bold mb-4">費用</h3>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="fw-bold">基本費用</span>
                                        <span className="fw-bold">NT$ 300 / 30 分鐘</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="fw-bold">天數</span>
                                        <span className="fw-bold">x3</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="fw-bold">服務時間 (每 30 分鐘)</span>
                                        <span className="fw-bold">x2</span>
                                    </div>

                                    <hr className="my-4 border-primary border-2" />

                                    <div className="d-flex justify-content-between align-items-end">
                                        <span className="fw-bold">總金額</span>
                                        <span className="fw-bold fs-3 text-primary">NT$ 600</span>
                                    </div>
                                </div>

                                <div className="d-grid mb-4">
                                    <button type="button" className="btn btn-primary fw-bold py-3 rounded-pill" onClick={handleBookingSubmit}>
                                        送出預約申請
                                    </button>
                                </div>

                                <div>
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="bi bi-info-circle-fill text-primary me-2"></i>
                                        <span className="fw-bold text-primary">注意事項</span>
                                    </div>
                                    <ul className="mb-0 ps-3">
                                        <li className="mb-2">
                                            預約請求是免費的，在確認付款前您可以與保母討論服務細節，且可同時送出多個預約請求，幫助您更快找到適合的人選。預約請求都可以隨時取消。
                                        </li>
                                        <li>
                                            服務預約及付款必須在我能寵平台上操作，才能享有平台提供的所有服務保障。
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section >
            </main >

            <footer className="booking-footer">
                footer區域
                <button type="button" onClick={handleTestLogin}>
                    測試登入 owner1@example.com
                </button>
                {currentUser ? (
                    <p>你好，{currentUser.email}（已登入）</p>
                ) : (
                    <p>目前尚未登入</p>
                )}
            </footer>
        </div >
    );
}

export default SitterBookingForm;
