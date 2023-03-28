import React from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import removeSvg from '../../assets/img/remove.svg';

import Marker from '../Markers';

import './Event.scss'; 

const Event = ({
  items,
  isRemovable,
  onClick,
  onRemove,
  onClickItem,
  activeItem}) => {

  let history = useHistory();

  const removeEvent = item => {
    if (window.confirm('Вы действительно хотите удалить событие?')) {
      axios.delete('http://localhost:4000/events/' + item.id).then(() => {
        onRemove(item.id);
        return history.push('/');
      });
    }
  };

  return (
    <ul onClick={onClick} className="planir__event">
      {items.map((item, index) => (
        <li className="butoon"
          key={index}
          className={classNames(item.className, {
            active: item.active
              ? item.active
              : activeItem && activeItem.id === item.id
          })}
          onClick={onClickItem ? () => onClickItem(item) : null}
        >
          <i>{item.icon ? item.icon : <Marker color={item.color.name} />}</i>
          <span>
            {item.name}
          </span>
          {isRemovable && (
            <img
              className="planir__event__remove-icon"
              src={removeSvg}
              alt="Remove icon"
              onClick={() => removeEvent(item)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default Event;