import React from 'react'
import NumberFormat from 'react-number-format';
import { useFormikContext } from 'formik';

function Interest(props) {
  const { setFieldValue } = useFormikContext();
  
  return (
    <NumberFormat
      //Formik
      name={`loans.${props.index}.interest`}
      placeholder="Eg 5.25%"
      //NumberFormat
      isNumericString={true}
      decimalSeparator='.'
      suffix=' %'
      onValueChange={val => setFieldValue(`loans.${props.index}.interest`, val.floatValue)}                                 
      //Material UI
      label="APR *"
      {...props}
    />
  )
}
  export default Interest