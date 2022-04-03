

import React from 'react'
import TextField from "@mui/material/TextField";
import { useFormikContext } from 'formik';

function Email(props) {
  const{setFieldValue} = useFormikContext();

  const handleChange = (event) => {
    setFieldValue(props.name, event.target.value);
  };

  return( 
    <TextField 
      //Formik
      name="email"
      placeholder="Ex: anna@email.com"
      onChange={handleChange}
      //Material UI
      label=""
      {...props}
    />
  )
}

  export default Email