import React from "react";

const Checkbox = ({ id, style, type, name, handleClick, isChecked }) => {
    return (
        <input
            id={id}
            style={style}
            name={name}
            type={type}
            onChange={handleClick}
            checked={isChecked}
        />
    );
};

export default Checkbox;
