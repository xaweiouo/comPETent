// import { forwardRef } from "react";

const Select = ({ id, label, value, onChange, options, imgSrc, error }) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
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
          value={value}
          onChange={onChange}
          // onChange={(e) => onChange(e.target.value)}
        >
          <option value="">請選擇</option>
          {options.map(opt =>
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}

        </select>
      </div>
      {error && <p className="">{error.message}</p>}
    </>
  );
}

export default Select;