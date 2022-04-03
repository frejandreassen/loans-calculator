import React from 'react'
import { useFormikContext } from 'formik';
import NumberFormat from 'react-number-format';
import { getYearsIfMissing } from '../utils/helpers'

function Years(props) {
    let name = `loans.${props.index}.years`
    const {
        values,
        touched,
        setFieldValue,
    } = useFormikContext();

    React.useEffect(() => {
        // clear the value of Years if value in Pmt
        if (touched && values.loans[props.index].pmt) {
            setFieldValue(name, '');
        }
    }, [values.loans[props.index].pmt,  setFieldValue, name]);

    return (
        <>
        <NumberFormat
            //Formik
            name={name}
            placeholder={getYearsIfMissing(values.loans[props.index]) || "Eg 7 years"} 
            //NumberFormat
            isNumericString={true}
            thousandSeparator=' '
            decimalSeparator='.'
            suffix=' years'
            onValueChange={val => setFieldValue(`loans.${props.index}.years`, val.floatValue)}
            //Material UI
            label="Repayment time"                      
            InputLabelProps={{ shrink: true }}
            {...props} 
        />
        </>
    );
};

export default Years