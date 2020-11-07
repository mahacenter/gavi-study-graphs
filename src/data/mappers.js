import _ from "lodash";
import monthlyDistricsValues from "./monthlyDistricsValues.json";

export function indicatorYearsValues(indicator, districts) {
    return monthlyDistricsValues.reduce((acc, monthData) => {
        const monthValues = _.reduce(monthData.districtsValues, (yearValuesAcc, districtValues) => {
            if (!districts.includes(districtValues.district)) {
                return yearValuesAcc;
            }
            return [
                ...yearValuesAcc,
                {
                    month: monthData.month,
                    regionOrDistrict: districtValues.district,
                    value: districtValues[indicator],
                }
            ];
        }, []);
        const accYear = acc.find(year => year.name === monthData.year);
        if (accYear) {
            accYear.values = accYear.values.concat(monthValues);
        } else {
            acc.push({
                name: monthData.year,
                values: monthValues,
            })
        }
        return acc;
    }, []);
}