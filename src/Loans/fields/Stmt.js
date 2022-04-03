import React from 'react'
import NumberFormat from 'react-number-format';
import { useFormikContext } from 'formik';


function Stmt(props) {
  const { setFieldValue } = useFormikContext();
  return( 
    <NumberFormat 
      //Formik
      name={`loans.${props.index}.stmt`}
      placeholder="$0"
      //NumberFormat
      type='tel'
      isNumericString={true}
      thousandSeparator=' '
      prefix='$'
      onValueChange={val => setFieldValue(`loans.${props.index}.stmt`, val.floatValue)}
      //Material UI
      label="Monthly fee"
      InputLabelProps={{ shrink: true }}
      {...props}
    />
  )
}

  export default Stmt