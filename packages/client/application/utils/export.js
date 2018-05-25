import _ from 'lodash';

import {
  getAchievedFromUnit,
  getAchievedFromAssignment,
  getMaxAchievedFromUnits,
  getAverageFromUnits,
  getAchievedFromUnits,
} from './utils';

function exportContent(title, type, encodedContent) {
  const link = document.createElement('a');

  link.setAttribute('href', encodeURI(encodedContent));
  link.setAttribute('download', `${title}.${type}`);
  link.innerHTML = `downloading ${title} ${type}`;

  document.body.appendChild(link);

  link.click();
  link.remove();
}

function createUnitCsvContent(unit) {
  let csvContent = '';
  let totalWeighting = 0;

  // add the title, double, dropped
  csvContent += `title,${_.defaultTo(unit.title, 'exports')}\r\n`;
  csvContent += `double,${_.defaultTo(unit.double ? 'Yes' : 'No', 'No')}\r\n`;
  csvContent += `dropped,${_.defaultTo(unit.dropped ? 'Yes' : 'No', 'No')}\r\n`;
  csvContent += 'name,weighting,achieved,total\r\n';

  _.forEach(unit.content, (row) => {
    const totalAchieved = getAchievedFromAssignment(row).toFixed(2);
    const weighting = _.defaultTo(row.weighting, 0);
    const achieved = _.defaultTo(row.achieved, 0);
    const name = _.defaultTo(row.name, 'Section');

    csvContent += `${name},${weighting},${achieved},${totalAchieved}\r\n`;
    totalWeighting += Number(row.weighting);
  });

  let unitTotal = getAchievedFromUnit(unit);
  if (unit.double) unitTotal /= 2;

  csvContent += `total, ${totalWeighting},${unitTotal.toFixed(2)},${unitTotal.toFixed(2)}\r\n`;

  return csvContent;
}

function createYearCsvContent(year) {
  let csvContent = '';

  const average = getAverageFromUnits(year.units).toFixed(2);
  const max = getMaxAchievedFromUnits(year.units).toFixed(2);
  const total = getAchievedFromUnits(year.units).toFixed(2);

  csvContent += `year title, ${_.defaultTo(year.title, 'Year title')}\r\n`;

  // average, max, total
  csvContent += `average, ${_.defaultTo(average, '0')}\r\n`;
  csvContent += `max, ${_.defaultTo(max, '0')}\r\n`;
  csvContent += `total, ${_.defaultTo(total, '0')}\r\n\r\n`;

  _.forEach(year.units, (unit) => {
    csvContent += `${createUnitCsvContent(unit)}\r\n`;
  });

  return csvContent;
}

export function exportUnitToCSV(unit) {
  const csvContent = `data:text/csv;charset=utf-8,${createUnitCsvContent(unit)}`;
  exportContent(unit.title || 'export', 'csv', csvContent);
}

export function exportYearToCsv(year) {
  const csvContent = `data:text/csv/;charset=utf-8,${createYearCsvContent(year)}`;
  exportContent(_.defaultTo(year.title, 'export'), 'csv', csvContent);
}

export default exportUnitToCSV;
