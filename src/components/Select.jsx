const Select = ({
  imgSrc,
  label,      // 選單標籤名稱
  options,    // 傳入的選項陣列 (例如 PET_SPECIES_OPTIONS)
  value,      // 目前選中的值
  onChange,   // 改變時的 callback
  name,       // 欄位名稱 (用於表單處理)
  placeholder = "請選擇" // 預設顯示文字
}) => {
  return (
    <div className="input-group rounded-pill overflow-hidden border border-warning bg-white">
      <span className="input-group-text border-0 bg-transparent">
        <img
          src={imgSrc}
          alt="notes"
          width="20"
          height="20"
          className="me-2"
        />
      </span>
      <select
        className="form-select border-0 bg-transparent"
        id="serviceType"
        aria-label="服務類別"
        // value={filters.category}
        // onChange={(e) => handleFilterChange("category", e.target.value)}
        onChange={onChange}
      >
        <option value="">請選擇一項服務...</option>
        {options.map(opt =>
          <option value={opt.value}>{opt.label}</option>
        )}
        {/* <option value="">服務</option>
        <option value="陪伴散步">陪伴散步</option>
        <option value="寵物安親">寵物安親</option>
        <option value="洗澡美容">洗澡美容</option>
        <option value="到府照顧">到府照顧</option>
        <option value="寄宿">寄宿</option>
        <option value="訓練">訓練</option> */}
      </select>
    </div>
  );
};

export default Select;