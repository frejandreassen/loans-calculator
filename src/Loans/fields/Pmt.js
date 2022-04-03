import React from 'react'
import { useFormikContext } from 'formik';
import NumberFormat from 'react-number-format';
import {money, getPmtIfMissing} from '../utils/helpers'

function Pmt(props) {
    let name = `loans.${props.index}.pmt`
    const {
        values,
        touched,
        setFieldValue
    } = useFormikContext();

    React.useEffect(() => {
        // clear the value of Pmt if value in Years
        if (touched && values.loans[props.index].years) {
            setFieldValue(name, '');
        } 
    }, [values.loans[props.index].years,  setFieldValue, name]);

    return (
        <>
        <NumberFormat 
            //Formik
            name={name}
            placeholder="Eg $2,000"
            //NumberFormat
            type='tel'
            isNumericString={true}
            thousandSeparator=' '
            prefix='$'
            onValueChange={val => setFieldValue(`loans.${props.index}.pmt`, val.floatValue)}
            //Material UI
            label={money(getPmtIfMissing(values.loans[props.index])) || 'Monthly payment'}
            {...props} 
        />
        </>
    );
};

export default Pmt