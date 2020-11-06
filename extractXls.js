import xlsx from 'node-xlsx';
import _ from 'lodash';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workSheetsFromFile = xlsx.parse(`${__dirname}/data.xls`);
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

function findDistrictsValues(sheet, indicatorsRange) {
    return _.reduce(sheet.data.slice(ignoredFirstRows), (result, districtCells, index) => {
        result[districtCells[1]] = {
            region: districtCells[0],
            district: districtCells[1],
            ..._.reduce(indicatorsRange, (indicatorsValue, range, indicator) => {
                indicatorsValue[indicator] = _.sum(districtCells.slice(range.start, range.end));
                return indicatorsValue;
            }, {}),
        };
        return result;
    }, {});
}

function findDistricsValues() {
    return workSheetsFromFile.map((sheet, index) => {
        const indicatorsRange = findIndicatorsRange(sheet);
        const districtsValues = findDistrictsValues(sheet, indicatorsRange);
        return {
            districtsValues,
            year: `20${sheet.name.split('_')[1]}`,
            month: (index % 12) + 1,
       };
    });
}

function findRegionsAndDistricts() {
    const districtRows = _.head(workSheetsFromFile).data.slice(ignoredFirstRows);
    return districtRows.reduce((regionsAndDistricts, row) => {
        if (!regionsAndDistricts[row[0]]) {
            regionsAndDistricts[row[0]] = [row[1]];
        } else {
            regionsAndDistricts[row[0]].push(row[1]);
        }
        return regionsAndDistricts;
    }, {});
}

writeFileSync(`${__dirname}/src/data/districts.json`, JSON.stringify(findDistricsValues()));
writeFileSync(`${__dirname}/src/data/regions.json`, JSON.stringify(findRegionsAndDistricts()));