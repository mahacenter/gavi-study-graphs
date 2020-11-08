import xlsx from 'node-xlsx';
import _ from 'lodash';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workSheetsFromFile = xlsx.parse(`${__dirname}/data.xls`);
const COLUMNS = {REGION: 0, DISTRICT: 1, TARGET_POP: 3};
const ignoredFirstColumns = 3;
const ignoredFirstRows = 2;

function findIndicatorsRange(sheet) {
    const headers = _.head(sheet.data).slice(ignoredFirstColumns);

    let lastHeader = undefined;
    const indicatorsRange = _.reduce(headers, (result, header, index) => {
        if (_.isEmpty(header) && lastHeader) {
            result[lastHeader].end++;
        } else if (!_.isEmpty(header)) {
            lastHeader = header;
            result[header] = {
                start: index + ignoredFirstColumns,
                end: index + ignoredFirstColumns + 1,
            };
        }
        return result;
    }, {});
    return indicatorsRange;
}

function findDistrictIndicatorsValues(indicatorsRange, districtCells) {
    return _.reduce(indicatorsRange, (indicatorsValue, range, indicator) => {
        const indicatorRangeSum = _.sum(districtCells.slice(range.start, range.end));
        indicatorsValue[indicator] = {
            value: indicatorRangeSum,
            coverageRate: Number((indicatorRangeSum / (districtCells[COLUMNS.TARGET_POP] / 12)).toFixed(2)), // 12 months
        };
        return indicatorsValue;
    }, {});
}

function findDistricsValuesForRange(sheet, indicatorsRange) {
    return _.reduce(sheet.data.slice(ignoredFirstRows), (result, districtCells) => {
        if (isGhanaOrUndefinedDistrict(districtCells)) {
            return result;
        }

        result[districtCells[COLUMNS.DISTRICT]] = {
            region: districtCells[COLUMNS.REGION],
            district: districtCells[COLUMNS.DISTRICT],
            ...findDistrictIndicatorsValues(indicatorsRange, districtCells),
        };
        return result;
    }, {});
}

function findMonthlyDistricsValues() {
    return workSheetsFromFile.map((sheet, index) => {
        const indicatorsRange = findIndicatorsRange(sheet);
        const districtsValues = findDistricsValuesForRange(sheet, indicatorsRange);
        return {
            districtsValues,
            year: Number(`20${sheet.name.split('_')[1]}`),
            month: (index % 12) + 1,
       };
    });
}

function isGhanaOrUndefinedDistrict(row) {
    return _.isEmpty(row[COLUMNS.DISTRICT]) || row[COLUMNS.DISTRICT].toLowerCase() === 'ghana';
}

function findRegionsAndDistricts() {
    const districtRows = _.head(workSheetsFromFile).data.slice(ignoredFirstRows);
    return districtRows.reduce((regionsAndDistricts, row) => {
        if (isGhanaOrUndefinedDistrict(row)) {
            return regionsAndDistricts;
        }
        if (!regionsAndDistricts[row[COLUMNS.REGION]]) {
            regionsAndDistricts[row[COLUMNS.REGION]] = [];
        }
        regionsAndDistricts[row[COLUMNS.REGION]].push(row[COLUMNS.DISTRICT]);
        return regionsAndDistricts;
    }, {});
}

function findIndicators() {
    const indicatorsRange = findIndicatorsRange(_.head(workSheetsFromFile));
    return Object.keys(indicatorsRange);
}


writeFileSync(`${__dirname}/src/data/monthlyDistricsValues.json`, JSON.stringify(findMonthlyDistricsValues()));
writeFileSync(`${__dirname}/src/data/regions.json`, JSON.stringify(findRegionsAndDistricts()));
writeFileSync(`${__dirname}/src/data/indicators.json`, JSON.stringify(findIndicators()));