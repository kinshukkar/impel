import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import { randHex, generateKeyForReact } from 'components/Utils/Utils';

const useStyles = makeStyles(() => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 250,
  },
}));

const CustomSelect = (props) => {
  const classes = useStyles();
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [htmlForValue] = React.useState(randHex(6));

  const {
    label,
    options,
    defaultValue,
    value,
    onChange,
  } = props;

  const [selectVal, setSelectVal] = React.useState('');

  React.useEffect(() => {
    setSelectVal(defaultValue);
  }, [defaultValue]);

  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} htmlFor={`outlined-${htmlForValue}`}>
        {label}
      </InputLabel>
      <Select
        native
        labelWidth={labelWidth}
        onChange={(e) => {
          setSelectVal(e.target.value);
          // eslint-disable-next-line eqeqeq
          onChange(options.find((opt) => opt.value == e.target.value));
        }}
        value={value || selectVal}
        inputProps={{
          name: 'age',
          id: `outlined-${htmlForValue}`,
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <option value="" />
        {
          options.map((x) => (
            <option key={generateKeyForReact(x.name)} value={x.value}>{x.name}</option>
          ))
        }
      </Select>
    </FormControl>
  );
};

CustomSelect.defaultProps = {
  label: '',
  defaultValue: null,
  value: null,
  onChange: () => null,
};

CustomSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.any.isRequired,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default CustomSelect;
