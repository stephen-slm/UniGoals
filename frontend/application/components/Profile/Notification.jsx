import React from 'react';
import PropTypes from 'prop-types';

export default function Notification(props) {
  return (
    <pre>
      <h5>{props.title}</h5>
      <p>{props.content}</p>
    </pre>
  );
}


Notification.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
