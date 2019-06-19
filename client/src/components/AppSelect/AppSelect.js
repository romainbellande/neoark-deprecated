import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FilledInput from '@material-ui/core/FilledInput';
import Select from '@material-ui/core/Select';
import { shape, func, oneOfType, string, number, arrayOf } from 'prop-types';

const AppSelect = ({ classes, onChange, value, options, label }) => {
  return (
    <FormControl variant="filled" className={classes.formControl}>
      <InputLabel htmlFor="filled-recipe-native-simple"></InputLabel>
      <Select
        native
        classes={{ select: classes.select }}
        value={value}
        onChange={onChange}
        input={<FilledInput name={label} id="filled-recipe-native-simple" />}
      >
        <option value={-1} />
        {options.map(({ value: optionValue, name }) => (
          <option key={`option-${name}`} value={optionValue}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

AppSelect.propTypes = {
  label: string,
  classes: shape({}).isRequired,
  onChange: func.isRequired,
  value: oneOfType([string, number]).isRequired,
  options: arrayOf(
    shape({
      value: oneOfType([string, number]).isRequired,
      name: string.isRequired,
    })
  ).isRequired,
};

AppSelect.defaultProps = {
  label: 'Select',
};

export default AppSelect;
