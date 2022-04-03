import React from 'react'
import TextField from "@mui/material/TextField";
import { useFormikContext } from 'formik';

function Name(props) {
  const{setFieldValue} = useFormikContext();

  const handleChange = (event) => {
    setFieldValue(props.name, event.target.value);
  };

  return( 
    <TextField 
      //Formik
      placeholder={`Lån #${props.index + 1}`}
      onChange={handleChange}
      //Material UI
      label=""
      {...props}
    />
  )
}

  export default Name