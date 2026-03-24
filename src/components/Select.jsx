// import { forwardRef } from "react";

const Select = ({ id, label, value, onChange, options, imgSrc, disabled,error }) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className={`input-group rounded-pill overflow-hidden border ${disabled ? 'border-secondary' : 'border-warning'
        }`}>
        {imgSrc && (
          <span className="input-group-text border-0 ">
            <img
              src={imgSrc}
              alt="notes"
              width="20"
              height="20"
              className="me-2"
            />
          </span>
        )}
        <select
          className="form-select border-0"
          value={value}
          onChange={onChange}
          // onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">
            {disabled?'請先選擇縣市':'請選擇'}
          </option>
          {options.map(opt =>
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}

        </select>
      </div>
      {error && <p className="text-danger">{error.message}</p>}
    </>
  );
}

export default Select;