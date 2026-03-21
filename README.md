# comPETent - 寵物保姆媒合平台

以「寵物保姆媒合服務」為核心，提供飼主與保姆之間的預約、評價與服務管理功能，讓臨時外出或長期出差的飼主，也能放心把毛孩交給專業保姆照顧。

Demo Website：`https://xaweiouo.github.io/comPETent/#/`
## 專案說明

comPETent 是一個寵物保姆媒合平台，讓飼主可以依照地區、服務類型、評價等條件，快速找到合適的寵物保姆，並完成預約與溝通流程。

## 設計理念

- **名稱由來：** 結合「competent」與「pet」，希望打造一個讓飼主放心、保姆專業的寵物照護平台。
- **主要對象：** 需要短期託管、到府照護、遛狗等服務的飼主。
- **核心價值：** 透明的服務資訊、清楚的預約流程與評價機制，降低人與人之間的信任成本。

## 使用技術

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

- 使用 React + Vite 建構前端專案。
- 使用 React Router 建立多頁路由與前台 / 後台頁面切換。
- 使用 Redux Toolkit / RTK Query 管理會員狀態與 API 請求。
- 使用 Bootstrap 5 搭配 SCSS 客製化樣式，實作 RWD 響應式版型。
- 後端與資料庫使用 Supabase 提供 RESTful API、身分驗證與資料儲存。

## 主要功能

### 前台

- 首頁：簡介平台服務與推薦寵物保姆。
- 保姆列表：依地點、服務類型、評價進行篩選與瀏覽。
- 保姆詳情頁：查看保姆提供的服務、價格、評價與可預約時段。
- 預約流程：選擇日期與服務內容，送出預約申請。
- 會員系統：註冊 / 登入、編輯個人資料（飼主 / 保姆）。
- 訂單列表：查看訂單狀態（待確認、已接受、已完成...）。

### 後台 / 保姆端

- 服務管理：新增 / 編輯可提供的服務類型與價格。
- 訂單管理：查看與管理收到的預約，接受 / 拒絕訂單。
- 評價管理：查看飼主對服務的評價與回饋。

## 安裝方式

### 取得專案


```bash=
git clone https://github.com/xaweiouo/comPETent.git
```
### 移動到專案資料夾

```bash=
cd comPETent
```

### 安裝套件
```bash=
npm install
```
## 啟動方式

```bash=
npm run dev
```

## 使用版本

* nodejs - v20.16.0
* npm - 10.8.1

## 開發成員與分工

- awei（組長）：專案規劃、頁面架構、保母服務詳情頁、個人資料頁、後台、寵物卡片元件、編輯寵物Modal元件、alert Toast。
- 叮咚：使用者故事、Supabase schema 設計、資料庫關聯、預約表單線搞、尋找保母頁面、預約表單頁面、飼主/保母預約表單詳情頁。
- yian：預約流程討論、首頁切版頁面。
- AJ：預約流程討論、尋找保母頁面初版。
