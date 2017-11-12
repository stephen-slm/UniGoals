import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

export default function Table(props) {
  if (!_.isNil(props.unit.content)) {
    return (
      <table className="pt-table .modifier">
        <thead>
        <tr>
          <th>Name</th>
          <th>Weighting</th>
          <th>% Achieved</th>
        </tr>
        </thead>
        <tbody>
          {_.map(props.unit.content, (content) => (
            <tr>
              <td>{content.name}</td>
              <td>{content.weighting}</td>
              <td>{content.achieved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}


Table.propTypes = {
  unit: PropTypes.shape().isRequired,
};
