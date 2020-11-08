import _ from "lodash";
import monthlyDistricsValues from "./monthlyDistricsValues.json";

function getMonthValues(selectedIndicator, selectedDistricts, monthData) {
    return _.reduce(monthData.districtsValues, (yearValuesAcc, districtValues) => {
        if (!selectedDistricts.includes(districtValues.district)) {
            return yearValuesAcc;
        }
        return [
            ...yearValuesAcc,
            {
                month: monthData.month,
                regionOrDistrict: districtValues.district,
                ...districtValues[selectedIndicator],
            }
        ];
    }, []);
}

export function indicatorYearsValues(selectedIndicator, selectedDistricts) {
    return monthlyDistricsValues.reduce((acc, monthData) => {
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

/*
 * For performance reason we expect monthlyDistricsValues to be already ordered.
 */
export function indicatorCoverageRateDiff(selectedIndicator, selectedDistricts) {
    const allMonthsValueAccumulator = {};
    const findPreviousYearMonthValues = (monthData) => {
        const yearMinusOne = monthData.year - 1;
        const previousYear = allMonthsValueAccumulator[yearMinusOne];
        const previousYearMonthValues = previousYear && previousYear[monthData.month];
        return previousYearMonthValues;
    };

    return monthlyDistricsValues.reduce((acc, monthData) => {
        const previousYearMonthValues = findPreviousYearMonthValues(monthData);
        const monthValues = getMonthValues(selectedIndicator, selectedDistricts, monthData);
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