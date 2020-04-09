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

        const estimatedInfectionsOverTime = currentlyInfected
            * (2 ** Math.trunc((estimatedTimeConvert / 3)));

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
    const availableBeds = 0.35 * totalHospitalBeds;

    let hospitalBedsByRequestedTime = Math.trunc(availableBeds - severeCasesByRequestedTime);
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
    severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;
    hospitalBedsByRequestedTime = Math.trunc(availableBeds - severeCasesByRequestedTime);
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

// const data = {
//     region: {
//         name: 'Africa',
//         avgAge: 19.7,
//         avgDailyIncomeInUSD: 5,
//         avgDailyIncomePopulation: 0.71
//     },
//     periodType: 'days',
//     timeToElapse: 60,
//     reportedCases: 674,
//     population: 66622705,
//     totalHospitalBeds: 1380614
// };
// const data1 = {
//     region: {
//         name: 'Africa',
//         avgAge: 19.7,
//         avgDailyIncomeInUSD: 5,
//         avgDailyIncomePopulation: 0.71
//     },
//     periodType: 'weeks',
//     timeToElapse: 8.571428571,
//     reportedCases: 674,
//     population: 66622705,
//     totalHospitalBeds: 1380614
// };
// const data2 = {
//     region: {
//         name: 'Africa',
//         avgAge: 19.7,
//         avgDailyIncomeInUSD: 5,
//         avgDailyIncomePopulation: 0.71
//     },
//     periodType: 'months',
//     timeToElapse: 2,
//     reportedCases: 674,
//     population: 66622705,
//     totalHospitalBeds: 1380614
// };

// console.log(covid19ImpactEstimator(data));
// console.log(covid19ImpactEstimator(data1));
// console.log(covid19ImpactEstimator(data2));

export default covid19ImpactEstimator;
