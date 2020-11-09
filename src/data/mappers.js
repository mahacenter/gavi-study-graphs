import _ from "lodash";
import monthlyRegionsValues from "./monthlyRegionsValues.json";
import monthlyDistrictsValues from "./monthlyDistrictsValues.json";

function getMonthValues(selectedIndicator, selectedOu, ouLabel, monthData) {
    return _.reduce(monthData.districtsValues, (yearValuesAcc, districtValues) => {
        if (!selectedOu.includes(districtValues[ouLabel])) {
            return yearValuesAcc;
        }
        return [
            ...yearValuesAcc,
            {
                month: monthData.month,
                regionOrDistrict: districtValues[ouLabel],
                ...districtValues[selectedIndicator],
            }
        ];
    }, []);
}

export function indicatorYearsValues(selectedIndicator, selectedDistricts) {
    return monthlyDistrictsValues.reduce((acc, monthData) => {
        const monthValues = getMonthValues(selectedIndicator, selectedDistricts, monthData);
        const accYear = acc.find(year => year.name === monthData.year);
        if (accYear) {
            accYear.values = accYear.values.concat(monthValues);
        } else {
            acc.push({
                name: monthData.year,
                values: monthValues,
            });
        }
        return acc;
    }, []);
}

export function regionsCoverageRateDiff(selectedIndicator, selectedRegions) {
    return coverageRateDiff(selectedIndicator, selectedRegions, 'region', monthlyRegionsValues);
}

export function districtsCoverageRateDiff(selectedIndicator, selectedDistricts) {
    return coverageRateDiff(selectedIndicator, selectedDistricts, 'district', monthlyDistrictsValues);
}
/*
 * For performance reason we expect monthlyDistricsValues to be already ordered.
 */
function coverageRateDiff(selectedIndicator, selectedDistricts, ouLabel, allMonthlyData) {
    const allMonthsValueAccumulator = {};
    const findPreviousYearMonthValues = (monthData) => {
        const yearMinusOne = monthData.year - 1;
        const previousYear = allMonthsValueAccumulator[yearMinusOne];
        return previousYear && previousYear[monthData.month];
    };

    return allMonthlyData.reduce((acc, monthData) => {
        const previousYearMonthValues = findPreviousYearMonthValues(monthData);
        const monthValues = getMonthValues(selectedIndicator, selectedDistricts, ouLabel, monthData);
        const monthValuesWithCoverageRateDiff = () => monthValues.map(monthValue => {
            const previousYearMonthDistrict = previousYearMonthValues.find(previousYearMonth => previousYearMonth.regionOrDistrict === monthValue.regionOrDistrict);
            return ({
                ...monthValue,
                coverageRateDiff: Number((monthValue.coverageRate - (previousYearMonthDistrict.coverageRate / monthValue.coverageRate)).toFixed(2)),
            });
        });

        allMonthsValueAccumulator[monthData.year] = {
            ...allMonthsValueAccumulator[monthData.year],
            [monthData.month]: monthValues
        };

        const yearAcc = acc.find(year => year.name === monthData.year);
        if (previousYearMonthValues && yearAcc) {
            yearAcc.values = yearAcc.values.concat(monthValuesWithCoverageRateDiff());
        } else if (previousYearMonthValues) {
            acc.push({
                name: monthData.year,
                values: monthValuesWithCoverageRateDiff(),
            });
        }
        return acc;
    }, []);
}