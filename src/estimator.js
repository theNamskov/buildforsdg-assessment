const WEEKS = 'weeks';
const MONTHS = 'months';

const covid19ImpactEstimator = (data) => {
    const {
        region,
        reportedCases,
        timeToElapse,
        totalHospitalBeds
    } = data;

    // eslint-disable-next-line no-nested-ternary
    const convertTimeToDays = (et, ptype) => (ptype === WEEKS
        ? (et * 7)
        : ptype === MONTHS
            ? (et * 30)
            : et
    );

    // Calculates 3-Day figure doubling according to time estimation
    const calcInfectedByTime = (currentlyInfected, estimatedTime, periodType) => {
        const estimatedTimeConvert = convertTimeToDays(estimatedTime, periodType);

        const estimatedInfectionsOverTime = currentlyInfected * (2 ** (estimatedTimeConvert / 3));

        return Math.trunc(estimatedInfectionsOverTime);
    };

    let currentlyInfected = reportedCases * 10;
    const { periodType } = data;
    let infectionsByRequestedTime = calcInfectedByTime(
        currentlyInfected,
        timeToElapse,
        periodType
    );
    let severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
    const availableBeds = Math.trunc(0.35 * totalHospitalBeds);

    let hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
    let casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
    let casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);

    const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
    let dollarsInFlight = (infectionsByRequestedTime
                * avgDailyIncomeInUSD
                * avgDailyIncomePopulation
                * convertTimeToDays(timeToElapse, periodType)
    ).toFixed(2);

    const impact = {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
    };


    currentlyInfected = reportedCases * 50;
    infectionsByRequestedTime = calcInfectedByTime(currentlyInfected, timeToElapse, periodType);
    severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
    hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
    casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);
    casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);
    dollarsInFlight = (infectionsByRequestedTime
                * avgDailyIncomeInUSD
                * avgDailyIncomePopulation
                * convertTimeToDays(timeToElapse, periodType)
    ).toFixed(2);

    const severeImpact = {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
    };

    return { data, impact, severeImpact };
};


export default covid19ImpactEstimator;
