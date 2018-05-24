import _ from 'lodash';

import { getAchievedFromUnit, getAchievedFromAssignment } from './utils';

function exportContent(title, type, encodedContent) {
  const link = document.createElement('a');

  link.setAttribute('href', encodeURI(encodedContent));
  link.setAttribute('download', `${title}.${type}`);
  link.innerHTML = `downloading ${title} ${type}`;

  document.body.appendChild(link);

  link.click();
  link.remove();
}

export function exportUnitToCSV(unit) {
  // build up csv
  let csvContent = 'data:text/csv;charset=utf-8,';
  let totalWeighting = 0;

  // add the title
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

  let total = getAchievedFromUnit(unit);
  if (unit.double) total /= 2;

  csvContent += `total, ${totalWeighting},${total.toFixed(2)},${total.toFixed(2)}\r\n`;

  exportContent(unit.title || 'export', 'csv', csvContent);
}

export default exportUnitToCSV;
