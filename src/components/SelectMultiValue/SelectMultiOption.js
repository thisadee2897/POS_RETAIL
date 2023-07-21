import React from "react";
import PropTypes from "prop-types";
import { default as ReactSelect } from "react-select";

const SelectMultiOption = props => {
  if (props.allowSelectAll) {
    return (
      <ReactSelect
        {...props}
        options={[props.allOption, ...props.options]}
        onChange={selected => {
          if (
            selected !== null &&
            selected.length > 0 &&
            selected[selected.length - 1].value === props.allOption.value
          ) {
            return props.onChange(props.options);
          }
          return props.onChange(selected);
        }}
      />
    );
  }

  return <ReactSelect {...props} />;
};

SelectMultiOption.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.string
  })
};

SelectMultiOption.defaultProps = {
  allOption: {
    id: "เลือกทั้งหมด",
    value: "เลือกทั้งหมด"
  }
};

export default SelectMultiOption;
