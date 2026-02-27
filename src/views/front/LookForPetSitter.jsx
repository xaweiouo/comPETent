// import { useEffect, useState } from 'react'
// import { supabase } from '../../lib/supabaseClient'


// const LookForPetSitter = () => {
//     const [rows, setRows] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true)
//             setError(null)
//             try {
//                 // 取得 全部保母服務清單
//                 // const { data, error } = await supabase.from('sitter_service_with_rating').select('*')

//                 // 對 保母列表進行排序
//                 const { data, error } = await supabase.from('sitter_service_with_rating').select('*').order('sitter_id', { ascending: false })
//                 // const { data, error } = await supabase.from('sitter_service_with_rating').select('*').order('sitter_id', { ascending: true })

//                 // 取得篩選區的保母服務清單

                
//                 if (error) throw error
//                 setRows(data)
//             } catch (err) {
//                 setError(err?.message ?? String(err))
//             } finally {
//                 setLoading(false)
//             }
//         }
//         fetchData()
//     }, [])

//     return (
//         <div>s
//             <h1>Supabase_【sitter_service_with_rating 資料讀取測試】</h1>
//             {loading && <p>載入中...</p>}
//             {error && <pre style={{ color: 'red' }}>{error}</pre>}
//             {rows && <pre id="output">{JSON.stringify(rows, null, 2)}</pre>}
//         </div>
//     )
// }

// export default LookForPetSitter


// // AJ-Demo-Code
// <!DOCTYPE html>
// <html lang="zh-TW">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>comPETent - 寵物保姆搜尋平台</title>
//   <script src="https://cdn.tailwindcss.com"></script>
//   <style>
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }

//     body {
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
//         'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
//         sans-serif;
//       -webkit-font-smoothing: antialiased;
//       -moz-osx-font-smoothing: grayscale;
//     }

//     .custom-select {
//       background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fb923c' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
//       background-repeat: no-repeat;
//       background-position: right 12px center;
//       padding-right: 32px;
//     }

//     .heart-btn {
//       transition: all 0.3s ease;
//       cursor: pointer;
//     }

//     .heart-btn:hover {
//       transform: scale(1.1);
//     }

//     .sitter-card {
//       transition: all 0.3s ease;
//     }

//     .sitter-card:hover {
//       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//       transform: translateY(-2px);
//     }

//     .float-btn {
//       position: fixed;
//       bottom: 2rem;
//       right: 2rem;
//       width: 4rem;
//       height: 4rem;
//       background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
//       border-radius: 50%;
//       border: 4px solid white;
//       box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 1.5rem;
//       font-weight: bold;
//       color: white;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       z-index: 50;
//     }

//     .float-btn:hover {
//       box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.4);
//       transform: scale(1.1);
//     }
//   </style>
// </head>
// <body class="bg-gradient-to-b from-amber-100 via-amber-50 to-white">
//   <div class="p-6">
//     <div class="max-w-4xl mx-auto">
//       <!-- 標題 -->
//       <h1 class="text-center text-3xl font-bold text-orange-600 mb-8">我想尋找</h1>

//       <!-- 搜尋表單容器 -->
//       <div class="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-8 shadow-lg mb-12">
//         <!-- 第一行：4個下拉菜單 -->
//         <div class="grid grid-cols-4 gap-4 mb-6">
//           <!-- 寵物類別 -->
//           <div>
//             <label class="text-xs text-gray-600 block mb-2">寵物類別</label>
//             <select id="petType" class="w-full bg-white border-2 border-orange-200 rounded-full px-4 py-2.5 text-sm text-gray-700 appearance-none cursor-pointer hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-colors custom-select">
//               <option value="服務">服務</option>
//               <option value="狗">狗</option>
//               <option value="貓">貓</option>
//               <option value="鳥">鳥</option>
//             </select>
//           </div>

//           <!-- 服務類別 -->
//           <div>
//             <label class="text-xs text-gray-600 block mb-2">服務類別</label>
//             <select id="sitterType" class="w-full bg-white border-2 border-orange-200 rounded-full px-4 py-2.5 text-sm text-gray-700 appearance-none cursor-pointer hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-colors custom-select">
//               <option value="寵物">寵物</option>
//               <option value="肉球保姆">肉球保姆</option>
//               <option value="寄宿">寄宿</option>
//             </select>
//           </div>

//           <!-- 服務地區 -->
//           <div>
//             <label class="text-xs text-gray-600 block mb-2">服務地區</label>
//             <select id="location" class="w-full bg-white border-2 border-orange-200 rounded-full px-4 py-2.5 text-sm text-gray-700 appearance-none cursor-pointer hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-colors custom-select">
//               <option value="縣市">縣市</option>
//               <option value="台中市">台中市</option>
//               <option value="台北市">台北市</option>
//             </select>
//           </div>

//           <!-- 地區 -->
//           <div>
//             <label class="text-xs text-gray-600 block mb-2">地區</label>
//             <select id="neighborhood" class="w-full bg-white border-2 border-orange-200 rounded-full px-4 py-2.5 text-sm text-gray-700 appearance-none cursor-pointer hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-colors custom-select">
//               <option value="地區">地區</option>
//               <option value="中區">中區</option>
//               <option value="西區">西區</option>
//             </select>
//           </div>
//         </div>

//         <!-- 第二行：日期時間 -->
//         <div>
//           <label class="text-xs text-gray-600 block mb-2">服務時間</label>
//           <div class="flex items-center gap-3 flex-wrap">
//             <!-- 日期 -->
//             <input type="date" id="date" class="bg-white border-2 border-orange-200 rounded-full px-4 py-2.5 text-sm text-gray-700 hover:border-orange-300 focus:outline-none focus:border-orange-500 transition-colors">

//             <!-- 開始時間 -->
//             <div class="flex items-center gap-1">
//               <select id="startHour" class="bg-white border-2 border-orange-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 appearance-none cursor-pointer hover:border-orange-300 w-16 custom-select">
//                 <option value="00">00</option>
//                 <option value="01">01</option>
//                 <option value="02">02</option>
//                 <option value="03">03</option>
//                 <option value="04">04</option>
//                 <option value="05">05</option>
//                 <option value="06">06</option>
//                 <option value="07">07</option>
//                 <option value="08">08</option>
//                 <option value="09">09</option>
//                 <option value="10">10</option>
//                 <option value="11">11</option>
//                 <option value="12">12</option>
//                 <option value="13">13</option>
//                 <option value="14">14</option>
//                 <option value="15">15</option>
//                 <option value="16">16</option>
//                 <option value="17">17</option>
//                 <option value="18">18</option>
//                 <option value="19">19</option>
//                 <option value="20">20</option>
//                 <option value="21">21</option>
//                 <option value="22">22</option>
//                 <option value="23">23</option>
//               </select>
//               <span class="text-gray-700 font-medium text-sm">時</span>
//               <select id="startMin" class="bg-white border-2 border-orange-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 appearance-none cursor-pointer hover:border-orange-300 w-16 custom-select">
//                 <option value="00">00</option>
//                 <option value="15">15</option>
//                 <option value="30">30</option>
//                 <option value="45">45</option>
//               </select>
//               <span class="text-gray-700 font-medium text-sm">分</span>
//             </div>

//             <!-- 分隔線 -->
//             <span class="text-gray-400 font-bold">—</span>

//             <!-- 結束時間 -->
//             <div class="flex items-center gap-1">
//               <select id="endHour" class="bg-white border-2 border-orange-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 appearance-none cursor-pointer hover:border-orange-300 w-16 custom-select">
//                 <option value="00">00</option>
//                 <option value="01">01</option>
//                 <option value="02">02</option>
//                 <option value="03">03</option>
//                 <option value="04">04</option>
//                 <option value="05">05</option>
//                 <option value="06">06</option>
//                 <option value="07">07</option>
//                 <option value="08">08</option>
//                 <option value="09">09</option>
//                 <option value="10">10</option>
//                 <option value="11">11</option>
//                 <option value="12">12</option>
//                 <option value="13">13</option>
//                 <option value="14">14</option>
//                 <option value="15">15</option>
//                 <option value="16">16</option>
//                 <option value="17">17</option>
//                 <option value="18">18</option>
//                 <option value="19">19</option>
//                 <option value="20">20</option>
//                 <option value="21">21</option>
//                 <option value="22">22</option>
//                 <option value="23">23</option>
//               </select>
//               <span class="text-gray-700 font-medium text-sm">時</span>
//               <select id="endMin" class="bg-white border-2 border-orange-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 appearance-none cursor-pointer hover:border-orange-300 w-16 custom-select">
//                 <option value="00">00</option>
//                 <option value="15">15</option>
//                 <option value="30">30</option>
//                 <option value="45">45</option>
//               </select>
//               <span class="text-gray-700 font-medium text-sm">分</span>
//             </div>

//             <!-- 搜尋按鈕 -->
//             <button onclick="handleSearch()" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-8 rounded-full transition-colors ml-auto">
//               搜尋
//             </button>
//           </div>
//         </div>
//       </div>

//       <!-- 附近的保姆標題 -->
//       <div class="flex items-center justify-between mb-6">
//         <div class="flex items-center gap-2">
//           <span class="text-3xl">🐾</span>
//           <h2 class="text-2xl font-bold text-orange-600">附近的保姆</h2>
//         </div>
//         <select id="sortBy" class="bg-amber-100 border border-orange-300 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium appearance-none cursor-pointer hover:bg-amber-200 transition-colors custom-select">
//           <option value="距離">距離</option>
//           <option value="評分">評分</option>
//           <option value="價格">價格</option>
//         </select>
//       </div>

//       <!-- 保姆卡片列表 -->
//       <div id="sitterContainer" class="space-y-5"></div>
//     </div>
//   </div>

//   <!-- 浮動聯絡按鈕 -->
//   <button class="float-btn" onclick="alert('聯絡客服')">T</button>

//   <script>
//     // 示範資料
//     const sitters = [
//       {
//         id: 1,
//         name: '阿倫',
//         image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22 viewBox=%220 0 128 128%22%3E%3Crect fill=%22%23e5b89f%22 width=%22128%22 height=%22128%22/%3E%3Ccircle cx=%2264%22 cy=%2240%22 r=%2220%22 fill=%22%23d4a574%22/%3E%3Cellipse cx=%2264%22 cy=%2280%22 rx=%2225%22 ry=%2230%22 fill=%22%23d4a574%22/%3E%3C/svg%3E',
//         rating: 5,
//         petTypes: ['狗'],
//         serviceType: '肉球保姆',
//         description: '陪伴散步・會國時注意狗狗的狀況與安全！',
//         price: 'NT$ 200 / 30 分鐘',
//         location: '台中市 中區',
//         distance: '1km',
//       },
//       {
//         id: 2,
//         name: '雪莉',
//         image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22 viewBox=%220 0 128 128%22%3E%3Crect fill=%22%23a0826d%22 width=%22128%22 height=%22128%22/%3E%3Ccircle cx=%2264%22 cy=%2235%22 r=%2218%22 fill=%22%238b6f47%22/%3E%3Cellipse cx=%2264%22 cy=%2285%22 rx=%2228%22 ry=%2232%22 fill=%22%238b6f47%22/%3E%3C/svg%3E',
//         rating: 4.8,
//         petTypes: ['貓', '鳥', '鼠'],
//         serviceType: '寶盒',
//         description: '可伴舍置協助居家・清理籠子。',
//         price: 'NT$ 600 / 一晚',
//         location: '台中市 中區',
//         distance: '2km',
//       },
//       {
//         id: 3,
//         name: 'John',
//         image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22 viewBox=%220 0 128 128%22%3E%3Crect fill=%22%23f4a460%22 width=%22128%22 height=%22128%22/%3E%3Ccircle cx=%2264%22 cy=%2238%22 r=%2219%22 fill=%22%23cd7f32%22/%3E%3Cellipse cx=%2264%22 cy=%2282%22 rx=%2226%22 ry=%2231%22 fill=%22%23cd7f32%22/%3E%3C/svg%3E',
//         rating: 3.5,
//         petTypes: ['鳥', '鳥', '爬蟲'],
//         serviceType: '到府照顧',
//         description: '到府協助照顧・清理籠子。',
//         price: 'NT$ 200 / 30 分鐘',
//         location: '台中市 中區',
//         distance: '3km',
//       },
//     ];

//     let favorites = {};

//     function renderSitters() {
//       const container = document.getElementById('sitterContainer');
//       container.innerHTML = sitters.map(sitter => `
//         <div class="bg-white rounded-2xl shadow-md overflow-hidden flex gap-5 p-6 border-l-4 border-orange-300 sitter-card">
//           <!-- 圖片 -->
//           <div class="flex-shrink-0">
//             <img src="${sitter.image}" alt="${sitter.name}" class="w-32 h-32 object-cover rounded-lg">
//           </div>

//           <!-- 內容 -->
//           <div class="flex-1">
//             <!-- 名稱和星評 -->
//             <div class="mb-2">
//               <h3 class="text-xl font-bold text-gray-900">${sitter.name}</h3>
//               <div class="flex items-center gap-1 mt-1">
//                 <div class="flex gap-0.5">
//                   ${[...Array(Math.floor(sitter.rating))].map(() => '<span class="text-yellow-400">★</span>').join('')}
//                   ${sitter.rating % 1 !== 0 ? '<span class="text-yellow-300">★</span>' : ''}
//                 </div>
//                 <span class="text-sm text-gray-600 ml-1">${sitter.rating}</span>
//               </div>
//             </div>

//             <!-- 服務資訊 -->
//             <div class="flex gap-6 mb-2 text-sm">
//               <div>
//                 <span class="text-gray-500 text-xs">服務寵物</span>
//                 <p class="font-medium text-gray-800">${sitter.petTypes.join('、')}</p>
//               </div>
//               <div>
//                 <span class="text-gray-500 text-xs">服務項目</span>
//                 <p class="font-medium text-gray-800">${sitter.serviceType}</p>
//               </div>
//             </div>

//             <!-- 描述 -->
//             <p class="text-gray-700 text-sm mb-3">${sitter.description}</p>

//             <!-- 底部：價格、地點、按鈕 -->
//             <div class="flex items-center justify-between">
//               <div class="flex items-center gap-4">
//                 <span class="font-bold text-gray-900">${sitter.price}</span>
//                 <div class="flex items-center gap-1 text-gray-600 text-sm">
//                   <span>📍</span>
//                   <span>${sitter.location}</span>
//                   <span class="text-gray-400 text-xs ml-1">${sitter.distance}</span>
//                 </div>
//               </div>

//               <!-- 按鈕 -->
//               <div class="flex items-center gap-3">
//                 <button onclick="toggleFavorite(${sitter.id})" class="heart-btn">
//                   <span id="heart-${sitter.id}" class="text-2xl">${favorites[sitter.id] ? '❤️' : '🤍'}</span>
//                 </button>
//                 <button onclick="alert('查看詳情')" class="border-2 border-orange-400 text-orange-500 hover:bg-orange-50 px-5 py-1.5 rounded-full text-sm font-medium transition-colors">
//                   詳情
//                 </button>
//                 <button onclick="alert('預約保姆')" class="bg-orange-500 hover:bg-orange-600 text-white px-5 py-1.5 rounded-full text-sm font-medium transition-colors">
//                   預約
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       `).join('');
//     }

//     function toggleFavorite(id) {
//       favorites[id] = !favorites[id];
//       document.getElementById(`heart-${id}`).textContent = favorites[id] ? '❤️' : '🤍';
//     }

//     function handleSearch() {
//       const petType = document.getElementById('petType').value;
//       const sitterType = document.getElementById('sitterType').value;
//       const location = document.getElementById('location').value;
//       const date = document.getElementById('date').value;
//       alert(`已搜尋: 寵物類別=${petType}, 服務類別=${sitterType}, 地區=${location}, 日期=${date || '未選擇'}`);
//     }

//     // 初始化
//     renderSitters();
//   </script>
// </body>
// </html>
