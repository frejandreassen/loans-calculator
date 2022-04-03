import React from 'react'
import NumberFormat from 'react-number-format';
import { useFormikContext } from 'formik';

function Pv(props) {
    const { setFieldValue } = useFormikContext();

    return (
        <NumberFormat
        //Formik
        name={`loans.${props.index}.pv`}
        placeholder="Eg $75,000"
        //NumberFormat
        type='tel'
        isNumericString={true}
        thousandSeparator=','
        prefix='$'
        onValueChange={val => setFieldValue(`loans.${props.index}.pv`, val.floatValue)}
        //Material UI
        label="Amount *"
        {...props}
        />
    )
}

  export default Pv