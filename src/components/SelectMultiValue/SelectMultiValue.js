import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import makeAnimated from "react-select/animated";
import PropTypes from "prop-types";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import './SelectMultiValue.css';
import SelectMultiOption from "./SelectMultiOption";



function SelectMultiValue ({options, style, value, onChange, placeholder, allowSelectAll}){
    function Option(props){
        return (
          <div>
            <components.Option {...props}>
              <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null}
              />{" "}
              <label>{props.value}</label>
            </components.Option>
          </div>
        );
      };
      
    const animatedComponents = makeAnimated();
    const MultiValue = props => (
        <components.MultiValue {...props}>
        <span>{props.data.value}</span>
        </components.MultiValue>
    );

    return (
      <>
        <div className="select-and-checkbox"  style={style}>
            <SelectMultiOption
                placeholder={placeholder}
                options={options}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(selected)=>onChange(selected)}
                allowSelectAll={allowSelectAll}
                value={value}
            />
        </div>
      </>
    );
  
}

export default SelectMultiValue;

