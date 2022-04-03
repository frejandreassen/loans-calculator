import React from 'react'

/* Components */
import LoansForm from './Loans/LoansForm'
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"

/* Assets */

function App() {
    
    const initialValues = {
        loans: [
          {
            pv: '',
            interest: '',
            years: '',
            pmt: '',
            stmt: '',
            type: 'annuity',
            expand: false,
          },
        ],
        timePoint: 10
      };

    return (
        <div>
            <Container maxWidth="md">
              <Grid container
                direction="column"
                >
                    <h1>Loans calculator</h1>
                    <p>Use this calculator to summarize multiple loans, calculate total costs, elaborate payments and project future debt.
                    </p>
              </Grid>
            </Container>
            <LoansForm initialValues={initialValues}/>
          </div>
    )
}

export default App
