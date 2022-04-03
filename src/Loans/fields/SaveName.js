

import React from 'react'
import TextField from "@mui/material/TextField";
import { useFormikContext } from 'formik';

function SaveName(props) {
  const{setFieldValue} = useFormikContext();

  const handleChange = (event) => {
    setFieldValue(props.name, event.target.value);
  };

  return( 
    <TextField 
      //Formik
      name="saveName"
      placeholder="Ex: Annas lån"
      onChange={handleChange}
      //Material UI
      label=""
      {...props}
    />
  )
}

  export default SaveName