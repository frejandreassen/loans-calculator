import React from 'react'
import NumberFormat from 'react-number-format'
import { useFormikContext } from 'formik';

function TimePoint(props) {
  const{setFieldValue} = useFormikContext();

  return( 
    <NumberFormat 
      //Formik
      value={props.timepoint}
      placeholder="Eg 10 years from now"
      onValueChange={val => setFieldValue(props.name, val.floatValue)}
      suffix=" years from now"
      //Material UI
      type="tel"
      label="Projection"
      {...props}
    />
  )
}

  export default TimePoint