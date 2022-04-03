import React from 'react'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import { money, getCost, getEff, countLoans, sumPv, sumPmt, sumCost, sumEff, sumBalanceAt, sumPmtAt, countLoansAt, getMaxYears } from './utils/helpers'

//Material UI
import Container from "@mui/material/Container"
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


//Fields
import Years from './fields/Years'
import Pmt from './fields/Pmt'
import Pv from './fields/Pv'
import Interest from './fields/Interest'
import Stmt from './fields/Stmt'
import Type from './fields/Type'
import TimePoint from './fields/TimePoint'


function LoansForm({initialValues}) {

    const handleSubmit = async (values) => {
        //Submit
        await new Promise((r) => setTimeout(alert(JSON.stringify(values, null, 2)), 1000));
    }


    const customTextField = (props) => (
        <TextField
            {...props}
        />
    )
    
    const validateSchema = Yup.object().shape({
        loans: Yup.array()
          .of(
            Yup.object().shape({
                pv: Yup.number()
                    .required()
                    .min(0)
                    .max(10000000),
                interest: Yup.number()
                    .required()
                    .min(0)
                    .max(50),
                years: Yup.number()
                    .min(0.5)
                    .max(100),
                pmt: Yup.number()
                    .when(["pv","interest","years","stmt"], (pv, interest,years,stmt) => {
                        if (!isFinite(years)) {
                            let stmtNum  = isFinite(stmt) ? stmt : 0
                            let monthlyCost = pv * interest / 100 / 12 + stmtNum + (pv/(100*12)) || 0
                            return Yup.number()
                                        .required("Payment or time required")
                                        .min(monthlyCost,`Minimum ${money(monthlyCost + 1)}`)
                                        .max(pv, `Max loan amount`)
                            }
                    }),
                stmt: Yup.number()
                    .min(0)
                    .max(1000),
                name: Yup.string()
                    .max(25),
            })
          )
          .min(1),

      });
    
    return (
        <Formik
            validationSchema={validateSchema}
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={handleSubmit}>
        {({ values, setFieldValue, errors, touched, handleBlur }) => (
            <Form>
                
                <FieldArray name="loans">
                    {({ remove, push }) => (
                    <Container maxWidth="md">
                        <h2>Loans</h2>
                        {values.loans.length > 0 &&
                        values.loans.map((loan, index) => (
                            <Paper spacing={3} key={index}>
                                <Grid container spacing={1} sx={{ p: 1, my : 1 }}>
                                    <Grid item md={3}>
                                        <Pv 
                                            index={index}
                                            value={values.loans[index].pv}
                                            customInput={customTextField}
                                            onBlur={handleBlur}
                                            error={touched.loans?.[index]?.pv && (!!errors.loans?.[index]?.pv)}
                                            helperText={touched.loans?.[index]?.pv && errors.loans?.[index]?.pv}
                                        />
                                    </Grid>
                                    <Grid item md={3}>
                                        <Interest 
                                            index={index}
                                            value={values.loans[index].interest}
                                            customInput={customTextField}
                                            onBlur={handleBlur}
                                            error={touched.loans?.[index]?.interest && (!!errors.loans?.[index]?.interest)}
                                            helperText={touched.loans?.[index]?.interest && errors.loans?.[index]?.interest}
                                        />
                                    </Grid>
                                    <Grid item md={3}>
                                        <Pmt
                                            index={index}
                                            value={values.loans[index].pmt}
                                            customInput={customTextField}
                                            onBlur={handleBlur}
                                            error={touched.loans?.[index]?.pmt && (!!errors.loans?.[index]?.pmt)}
                                            helperText={touched.loans?.[index]?.pmt && errors.loans?.[index]?.pmt}
                                        />
                                    </Grid>
                                    <Grid item md={3}>
                                        <Grid 
                                            container
                                            justifyContent="flex-end"
                                        >
                                            <Tooltip title="Delete">
                                                <IconButton aria-label="Delete" onClick={() => remove(index)} size="large"> 
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {!values.loans[index].expand && (
                                                <Tooltip title="Show details">
                                                    <IconButton
                                                        aria-label="Expand"
                                                        onClick={() => setFieldValue(`loans.${index}.expand`, !values.loans[index].expand )}
                                                        size="large"> 
                                                        <ExpandMoreIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {values.loans[index].expand && (
                                                <Tooltip title="Hide details">
                                                    <IconButton
                                                        aria-label="Collapse"
                                                        onClick={() => setFieldValue(`loans.${index}.expand`, !values.loans[index].expand )}
                                                        size="large"> 
                                                        <ExpandLessIcon />
                                                    </IconButton> 
                                                </Tooltip>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {values.loans[index].expand && (                               
                                <div>
                                    <Grid container spacing={1} sx={{ p: 1, my : 1 }}>
                                        <Grid item md={3}>
                                            <Years
                                                index={index}
                                                value={values.loans[index].years}
                                                customInput={customTextField}
                                                onBlur={handleBlur}
                                                error={touched.loans?.[index]?.years && (!!errors.loans?.[index]?.years)}
                                                helperText={touched.loans?.[index]?.years && errors.loans?.[index]?.years}
                                            />
                                        </Grid>
                                        <Grid item md={3}>
                                            <Stmt
                                                index={index}
                                                value={values.loans[index].stmt}
                                                customInput={customTextField}
                                                onBlur={handleBlur}
                                                error={touched.loans?.[index]?.stmt && (!!errors.loans?.[index]?.stmt)}
                                                helperText={touched.loans?.[index]?.stmt && errors.loans?.[index]?.stmt}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <Type name={`loans.${index}.type`} value={values.loans[index].type}/>
                                        </Grid>
                                    </Grid>
                                    <hr/>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Total interests and costs</TableCell>
                                                    <TableCell align="right">{money(getCost(values.loans[index]))}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Effective interest rate</TableCell>
                                                    <TableCell align="right">{getEff(values.loans[index])}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>                 
                                    </TableContainer>
                                    <Grid 
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                    >
                                        <Tooltip title="Hide details">
                                            <IconButton aria-label="Collapse" onClick={() => setFieldValue(`loans.${index}.expand`, !values.loans[index].expand )}> 
                                                <ExpandLessIcon />
                                            </IconButton> 
                                        </Tooltip>
                                    </Grid>
                                </div>
                                )}
                            </Paper>
                        ))}
                        <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                            <Tooltip title="Add loan">
                                <IconButton
                                    aria-label="Add"
                                    onClick={() => push({ pv: '', interest: '', years: '', pmt: '', stmt: '', type: 'annuity', name: '', expand: false })}
                                    size="large"> 
                                    <AddCircleIcon />
                                </IconButton>
                            </Tooltip>
                            <Grid >
                                <Button type="submit">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                    )}
                </FieldArray>
                
                <Container maxWidth="md" >
                    <h2>Results</h2>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Loans #</TableCell>
                                    <TableCell align="right">{countLoans(values.loans)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total loan amount</TableCell>
                                    <TableCell align="right">{money(sumPv(values.loans))}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Monthly cost</TableCell>
                                    <TableCell align="right">{money(sumPmt(values.loans))}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Repayment time</TableCell>
                                    <TableCell align="right">{getMaxYears(values.loans)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total interests and costs</TableCell>
                                    <TableCell align="right">{money(sumCost(values.loans))}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Effective interest rate</TableCell>
                                    <TableCell align="right">{sumEff(values.loans)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>                 
                    </TableContainer>
                    {/* SCNEARIO SECTION */}
                    <h2>Projection</h2>
                    <TableContainer component={Paper}>                           
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TimePoint
                                            name='timePoint'
                                            value={values.timePoint}
                                            customInput={customTextField}
                                            onBlur={handleBlur}
                                            error={touched.timePoint && errors.timePoint}
                                            helperText={touched.timePoint && errors.timePoint}
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Loans # in {values.timePoint} years</TableCell>
                                    <TableCell align="right">{countLoansAt(values.loans, values.timePoint)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Loan amount in {values.timePoint} years</TableCell>
                                    <TableCell align="right">{money(sumBalanceAt(values.loans, values.timePoint))}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Monthly cost in {values.timePoint} years</TableCell>
                                    <TableCell align="right">{money(sumPmtAt(values.loans, values.timePoint))}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>                 
                    </TableContainer>
                    
                    <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                        <IconButton onClick={()=>{window.print()}} size="large">
                            <PrintIcon />
                        </IconButton>
                    </Grid> 
                </Container>
            </Form>
            )}
        </Formik>
    );}

export default LoansForm