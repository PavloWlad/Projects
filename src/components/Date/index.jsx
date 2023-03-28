import React from 'react';
 
import removeSvg from '../../assets/img/remove.svg';

import './Date.scss'; 

const Date = ({ event, value, onRemove, id}) => {


  return (
    <div  className="date">
      <div style={{ borderColor: event.color.hex }} className="date__block">
        <p style={{ color: event.color.hex }}>
          {value}
        </p>
        <div  className="date__block__wrap-img">
          <img className="remove-date" src={removeSvg} onClick={() => onRemove(event.id, id)} alt="remove-icon" />
        </div>
      </div>
    </div>
  );
};

export default Date;