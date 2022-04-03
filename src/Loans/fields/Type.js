import React from 'react';
import { useFormikContext, useField } from 'formik';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function Type(props) {
  const{setFieldValue} = useFormikContext();
  const [value, setValue] = React.useState(props.value || 'annuity');

  const handleChange = (event) => {
    setFieldValue(props.name, event.target.value);
    setValue(event.target.value)
  };

  return (
    <FormControl component="fieldset" >
      <FormLabel component="legend">Repayment type</FormLabel>
      <RadioGroup row aria-label={props.name} name={props.name} value={value} onChange={handleChange}>
        <FormControlLabel value="annuity" control={<Radio color="default"/>} label="Annuity" />
        <FormControlLabel value="straight" control={<Radio color="default"/>} label="Straight" />
      </RadioGroup>
    </FormControl>
  );
}