import React from 'react';
import classNames from 'classnames';

import './Marker.scss';

const Marker = ({ color, onClick, className }) => (
  <i
    onClick={onClick}
    className={classNames('marker', { [`marker--${color}`]: color }, className)}>
  </i>
);

export default Marker;