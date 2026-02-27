import { useEffect, useState } from 'react'

/**
 * 注意：在 Artifacts 預覽環境中，若無法解析外部檔案路徑 (如 ../lib/supabaseClient)，
 * 我們通常會將必要的實例化邏輯整合或確保路徑指向正確的虛擬檔案。
 */
let supabase;
try {
  // 嘗試動態引用，若環境路徑不支援則捕捉錯誤以防崩潰
  const client = require('../lib/supabaseClient');
  supabase = client.supabase;
} catch (e) {
  console.warn("無法載入 supabaseClient，請檢查檔案路徑。");
}

/**
 * LookForPetSitter 組件
 * * 介面配置：
 * - 左側 (col-lg-3): 藍框設計的進階篩選面板
 * - 右側 (col-lg-9): 紫框設計的保母資料列表
 */
const LookForPetSitter2 = () => {
  const [allRows, setAllRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 篩選條件狀態 (對應左側 UI)
  const [filters, setFilters] = useState({
    serviceType: '',
    location: '',
    keyword: ''
  })

  // 從資料庫獲取保母服務與評分資料
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        setError("Supabase 用戶端未定義，請檢查設定。");
        setLoading(false);
        return;
      }

      setLoading(true)
      setError(null)
      try {
        // 從資料庫 View 或 Table 取得資料
        const { data, error: supabaseError } = await supabase
          .from('sitter_service_with_rating')
          .select('*')
          .order('sitter_id', { ascending: false })

        if (supabaseError) throw supabaseError
        
        setAllRows(data || [])
        setFilteredRows(data || [])
      } catch (err) {
        console.error("資料獲取失敗:", err)
        setError("讀取保母資料時發生錯誤，請稍後再試。")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 監聽篩選條件變化並過濾資料
  useEffect(() => {
    let result = [...allRows]

    if (filters.keyword) {
      const k = filters.keyword.toLowerCase()
      result = result.filter(item => 
        (item.sitter_name && item.sitter_name.toLowerCase().includes(k)) ||
        (item.description && item.description.toLowerCase().includes(k))
      )
    }

    if (filters.serviceType) {
      result = result.filter(item => item.service_name === filters.serviceType)
    }

    if (filters.location) {
      result = result.filter(item => item.city === filters.location)
    }

    setFilteredRows(result)
  }, [filters, allRows])

  // 處理表單變更
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container py-5">
      {/* 標題區域 */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="fw-bold text-dark border-start border-primary border-5 ps-3">尋找專屬保母</h2>
          <p className="text-muted ps-3 mt-2">篩選最符合您需求的專業寵物照顧者</p>
        </div>
      </div>

      <div className="row">
        {/* 左側：藍框部分 - 進階篩選面板 */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '100px', border: '2px solid #3498db' }}>
            <div className="card-header bg-primary text-white py-3 border-0 rounded-top-4">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-funnel-fill me-2"></i>條件篩選
              </h5>
            </div>
            <div className="card-body p-4 bg-white rounded-bottom-4">
              {/* 關鍵字搜尋 */}
              <div className="mb-4">
                <label className="form-label fw-bold text-secondary">關鍵字搜尋</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2 shadow-none" 
                  placeholder="搜尋名稱或內容..." 
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                />
              </div>

              {/* 服務項目 */}
              <div className="mb-4">
                <label className="form-label fw-bold text-secondary">服務項目</label>
                <select 
                  className="form-select bg-light border-0 py-2 shadow-none" 
                  name="serviceType"
                  value={filters.serviceType}
                  onChange={handleFilterChange}
                >
                  <option value="">全部服務</option>
                  <option value="到府代餵">到府代餵</option>
                  <option value="到府洗澡">到府洗澡</option>
                  <option value="陪伴散步">陪伴散步</option>
                  <option value="安親住宿">安親住宿</option>
                </select>
              </div>

              {/* 所在地區 */}
              <div className="mb-4">
                <label className="form-label fw-bold text-secondary">所在地區</label>
                <select 
                  className="form-select bg-light border-0 py-2 shadow-none" 
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                >
                  <option value="">所有縣市</option>
                  <option value="台北市">台北市</option>
                  <option value="新北市">新北市</option>
                  <option value="台中市">台中市</option>
                  <option value="高雄市">高雄市</option>
                </select>
              </div>

              {/* 重置 */}
              <button 
                className="btn btn-outline-primary w-100 rounded-pill fw-bold"
                onClick={() => setFilters({ serviceType: '', location: '', keyword: '' })}
              >
                清除所有條件
              </button>
            </div>
          </div>
        </div>

        {/* 右側：紫框部分 - 保母展示區 */}
        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 text-muted">正在為您搜尋保母...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger border-0 rounded-4 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
            </div>
          ) : (
            <div className="row g-4">
              {filteredRows.length > 0 ? (
                filteredRows.map((sitter) => (
                  <div className="col-md-6 col-xl-4" key={sitter.sitter_id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden card-hover-effect">
                      {/* 頭像區域 */}
                      <div className="position-relative">
                        <img 
                          src={sitter.avatar_url || "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop"} 
                          className="card-img-top" 
                          alt="保母照"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute top-0 end-0 m-3">
                          <span className="badge bg-white text-dark shadow-sm py-2 px-3 rounded-pill fw-bold">
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            {sitter.rating ? Number(sitter.rating).toFixed(1) : 'NEW'}
                          </span>
                        </div>
                      </div>

                      {/* 保母詳情區 (紫框風格) */}
                      <div className="card-body p-4 border-top border-purple border-5">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="card-title fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '140px' }}>
                            {sitter.sitter_name || '專業保母'}
                          </h5>
                          <span className="text-purple fw-bold fs-5">${sitter.price || 0}</span>
                        </div>
                        
                        <p className="text-muted small mb-3">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {sitter.city || '未知地區'}
                        </p>
                        
                        <div className="mb-3">
                          <span className="badge bg-purple-light text-purple rounded-pill px-3 py-1">
                            {sitter.service_name || '一般服務'}
                          </span>
                        </div>

                        <p className="card-text text-secondary small mb-4" style={{ height: '3em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {sitter.description || '專業且細心的照顧者，致力於提供您的愛寵最安心的陪伴環境。'}
                        </p>

                        <button className="btn btn-purple w-100 rounded-pill fw-bold py-2 shadow-sm mt-auto">
                          查看詳情
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5 bg-light rounded-4">
                  <i className="bi bi-search display-3 text-muted opacity-25"></i>
                  <h5 className="mt-4 text-muted">目前沒有符合條件的保母</h5>
                  <p className="text-muted">您可以試著清除篩選條件再試一次</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 自定義樣式 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .card-hover-effect {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .card-hover-effect:hover {
          transform: translateY(-8px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,0.15) !important;
        }
        /* 紫色設計標籤與按鈕 */
        .border-purple { border-color: #8e44ad !important; }
        .text-purple { color: #8e44ad !important; }
        .bg-purple-light { background-color: #f5eeff !important; color: #8e44ad !important; }
        .btn-purple {
          background-color: #8e44ad;
          border: none;
          color: white;
        }
        .btn-purple:hover {
          background-color: #732d91;
          color: white;
        }
        /* 藍色主視覺 (對應藍框篩選面板) */
        .bg-primary { background-color: #3498db !important; }
        .text-primary { color: #3498db !important; }
        .btn-outline-primary {
          color: #3498db;
          border-color: #3498db;
        }
        .btn-outline-primary:hover {
          background-color: #3498db;
          color: white;
        }
      `}} />
    </div>
  )
}

export default LookForPetSitter2