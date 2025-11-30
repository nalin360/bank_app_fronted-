import React from 'react';

const FormControl = ({ label, type, placeholder, value, onChange, required = true }) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className="input input-bordered w-full"
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default FormControl;
