export function getNper(loan){
    const { pv, interest, stmt, pmt, years, type } = loan
    if (years) return round(years * 12, 0)
    const apr = interest / 100
    if (!pmt) return ''
    let nper
    if (type === "annuity") nper = Math.log(Math.pow(1 - (pv) * (apr/12) / (pmt-stmt), -1)) / Math.log(1 + (apr/12))
    if (type === "straight") nper = (pmt > (pv * apr/12 + stmt)) ? pv / (pmt - (pv * apr/12 + stmt)) : '∞'
    return isFinite(nper) ? Math.ceil(nper) : '∞'
}
export function getYearsIfMissing(loan) {
    if (loan.years) return ''
    return getYears(loan)
}
export function getYears(loan){
    if (loan.years) return loan.years
    const { pv, interest, pmt } = loan
    let type = loan.type
    const stmt = loan.stmt || 0
    const apr = interest / 100
    if (apr===0) type = 'straight'
    if (!pmt) return ''
    if (stmt>pmt) return '∞'
    let nper
    if (type === "annuity") nper = Math.log(Math.pow(1 - (pv) * (apr/12) / (pmt-stmt), -1)) / Math.log(1 + (apr/12))
    if (type === "straight") nper = (pmt > (pv * apr/12 + stmt)) ? pv / (pmt - (pv * apr/12 + stmt)) : '∞'
    return isFinite(nper) ? round(nper / 12, 1) + ' years' : '∞ years'
}

export function getPmtIfMissing(loan) {
    if (loan.pmt) return ''
    return getPmt(loan)
}

export function getPmt(loan){
    if (loan.pmt) return loan.pmt
    const { pv, interest, years, type } = loan
    const stmt = loan.stmt || 0
    const apr = interest / 100
    const nper = years * 12
    if (!nper) return ''
    let pmt
    if (type === "annuity") pmt = ((pv) * (apr / 12)) / (1 - Math.pow(1 + (apr / 12), -nper)) + stmt
    if (type === "straight") pmt = pv/nper + pv * apr/12 + stmt
    return Math.round(pmt)
}

export function getCost(loan){
    if (!isValid(loan)) return
    let details = getDetails(loan)
    return details.totPmt - details.pv
}

export function getEff(loan){
    if (!isValid(loan)) return
    let details = getDetails(loan)
    let eff = irr(details.pv, details.pmts) * 100
    return round(eff,2) + ' %' 
}

export function countLoans(loans) {
    let count = 0
    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        count += 1
    }
    return count
}

export function sumPv(loans) {
    let pv = 0
    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        pv += loans[i].pv
    }
    return pv
}

export function sumPmt(loans) {
    let pmt = 0
    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        pmt += getPmt(loans[i])
    }
    return pmt 
}

export function getMaxYears(loans){
    let maxNper = 0
    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        maxNper = (maxNper > getNper(loans[i])) ? maxNper : getNper(loans[i])
    }
    const maxYears = round(maxNper/12 , 1) + ' years'
    return maxYears
}

export function sumCost(loans){
    let cost = 0
    for (let i = 0; i < loans.length; i++){
        cost += getCost(loans[i]) || 0
    }
    return cost
}

export function sumEff(loans) {
    let maxNper = 0
    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        maxNper = Math.max(maxNper, getNper(loans[i]))
    }
    if (maxNper === 0) return 
    let pmts = new Array(maxNper).fill(0)
    let pv = 0

    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        let details = getDetails(loans[i])
        pv += details.pv
        for (let t=0; t < details.pmts.length; t++){
            pmts[t] += details.pmts[t]
        }
    }
    return round(irr(pv, pmts) * 100 , 2) + ' %'
}

export function countLoansAt(loans, year) {
    let numLoansAt = 0
    
    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        let details = getDetails(loans[i])
        if (details.balances[year*12] > 0){
            numLoansAt += 1
        }
    }

    return numLoansAt
}

export function sumBalanceAt(loans, year){
    let sumBalance = 0

    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        let details = getDetails(loans[i])
        if (details.balances[year*12]){
            sumBalance += details.balances[year * 12]
        }
    }
    return sumBalance
}

export function sumPmtAt(loans, year) {
    let sumPmt = 0
    for (let i = 0; i < loans.length; i++){
        if (!isValid(loans[i])) { continue; }
        let details = getDetails(loans[i])
        if (details.pmts[year*12]){
            sumPmt += details.pmts[year * 12]
        }
    }
    return sumPmt
}
function getDetails(loan) {
    let {pv, interest, pmt, years, type} = loan
    const stmt = loan.stmt || 0
    const apr = interest / 100
    let nper = round(years * 12, 0)
    //pmt or nper required
    if (!pmt || pmt === '') pmt = getPmt(loan)
    if (!years || years === '') nper = getNper(loan)
    
    //Break if loan is invalid
    
    //Calculate repayment schedule
    let monthDetails = []
    let balances = [] 
    let pmts = []

    //Limit calculation to 100 years
    nper = (isFinite(nper)) ? Math.min(nper, 1200) : 1200
    
    for (let i = 0; i < nper; i++) {
        /* First month */
        if (i === 0) {
            balances[i] = pv
            pmts[i] = round(pmt, 2)
            monthDetails.push({
                month: i,
                balance: round(balances[i], 0),
                pmt: pmts[i],
                interest: round((pv ) * apr / 12, 2),
                fee: stmt,
                amort: pmts[i] - stmt  - balances[i] * apr / 12
            })
        }
        else if (i < nper - 1) {
            balances[i] = monthDetails[i - 1].balance - monthDetails[i - 1].amort
            pmts[i] = (type === "annuity") ? round(pmt, 2) : round(pv/nper + balances[i] * apr / 12 + stmt, 2)
            monthDetails.push({
                month: i,
                balance: round(balances[i], 0),
                pmt: pmts[i],
                interest: round(balances[i] * apr / 12, 2),
                fee: stmt,
                amort: pmts[i] - stmt - balances[i] * apr / 12
            })
        }
        /* Last month */
        else if (i === nper - 1) {
            balances[i] = monthDetails[i - 1].balance - monthDetails[i - 1].amort
            pmts[i] = round(balances[i] + balances[i] * apr / 12 + stmt, 2)
            monthDetails.push({
                month: i,
                balance: round(balances[i], 0),
                pmt: pmts[i],
                interest: round(balances[i] * apr / 12, 2),
                fee: stmt,
                amort: balances[i]
            })
        }
    }

    let totPmt = 0
    for (let i = 0; i < nper; i++) {
        totPmt += monthDetails[i].pmt
    }

    //Build enriched loan-object
    const details = {
        pv,
        apr,
        pmt: round(pmt, 0),
        nper,
        stmt,
        totPmt: round(totPmt, 0),
        pmts: round(pmts, 0),
        balances: round(balances, 0),
        monthDetails: monthDetails
    }
    return details
}


function irr(pv, pmts) {

    let r = 0.0008 //equivalent to apr of 1%
    let pvtmp = 0
    let i = 0

    // Iterate to find the closest approximation
    while (i < 200) {
        pvtmp = 0
        for (let t = 0; t < pmts.length; t++) {
            pvtmp += pmts[t] / Math.pow(1 + r, t + 1)
        }
        if (Math.abs(pv / pvtmp - 1) <= 0.0001) break
        if (pvtmp > pv * 1.2) {
            r += 0.001
        }
        if (pvtmp > pv) {
            r += 0.0001
        }
        else {
            r -= 0.000009
        }
        i++

    }
    //Round to x.xx %
    const eff = Math.round((Math.pow(1 + r, 12) - 1) * 10000) / 10000;
    return eff
}

export function isValid(loan){
    let pvOk = (loan.pv > 0)
    let interestOk = (loan.interest > 0 && loan.interest < 100)
    let nper = getNper(loan)
    let nperOk = (nper <= 1200 && nper !== '') //Should be less than 100 years
    return (pvOk && interestOk && nperOk)
}

function round(number, digits) {
    if (typeof number == 'object') {
        for (let i = 0; i < number.length; i++) {
            number[i] = Math.round(number[i] * (10 ** digits)) / (10 ** digits)
        }
    }
    else if (typeof number == 'number') number = Math.round(number * (10 ** digits)) / (10 ** digits)
    return number
}

export function thousandString(num) {
    if (isNaN(num)) return '0'
    let numInt = round(num, 0)
    return num ? numInt.toLocaleString('en-us') : '0';
}
export function money(num, currency = '$') {
    if (num==='') return ''
    return `${currency} ${thousandString(num)} `
}

export function dateTime(date) {
    const d = new Date(date)
    return d.toLocaleString()
}