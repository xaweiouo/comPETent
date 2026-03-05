import { forwardRef } from "react";

const Select = forwardRef(({
  imgSrc,
  label,      // 選單標籤名稱
  options,    // 傳入的選項陣列 (例如 PET_SPECIES_OPTIONS)
  value,      // 目前選中的值
  onChange,   // 改變時的 callback
  name,       // 欄位名稱 (用於表單處理)
  placeholder = "請選擇" // 預設顯示文字
},ref) => {
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
        ref={ref}
        name={name}
        value={value}
        // value={filters.category}
        // onChange={(e) => handleFilterChange("category", e.target.value)}
        onChange={onChange}
      >
        <option value="">請選擇一項服務...</option>
        {options.map(opt =>
          <option value={opt.value}>{opt.label}</option>
        )}
  
      </select>
    </div>
  );
});

export default Select;