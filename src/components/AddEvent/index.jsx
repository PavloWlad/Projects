import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Event from '../Events';
import Marker from '../Markers';

import closeSvg from '../../assets/img/close.svg'; 

import './AddEvent.scss'; 
import '../../components/Markers/Marker.scss'

const AddEvent = ({ colors, onAdd }) => {
  const [visiblePopup, setVisiblePopup] = useState(false); 
  const [selectedColor, selectColor] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (Array.isArray(colors)) {
      selectColor(colors[0].id);
    }
  }, [colors]);

  const onClose = () => {
    setVisiblePopup(false);
    setInputValue('');
    selectColor(colors[0].id);
  };

  const addEvent = () => {
    if (!inputValue) {
      alert('Введите название события!');
      return;
    }
    setIsLoading(true);
    axios
      .post('http://localhost:4000/events', {
        name: inputValue,
        colorId: selectedColor
      })
      .then(({ data }) => {
        const color = colors.filter(c => c.id === selectedColor)[0];
        const eventObj = { ...data, color, tasks: [] };
        onAdd(eventObj);
        onClose();
      })
      .catch(() => {
        alert('Ошибка при добавлении события!');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="add-event">
      {!visiblePopup ? (<Event
        onClick={() => setVisiblePopup(true)}
        items={[
          {
            className: 'event__add-button',
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1V15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 8H15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            name: 'Добавить событие'
          }
        ]}
      />) : (
        visiblePopup && (
          <div className="add-event__popup">
            <img
              onClick={onClose}
              src={closeSvg}
              alt="Close button"
              className="add-event__popup-close-btn"
            />
  
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="field-popup"
              type="text"
              placeholder="Название события..."
            />
  
            <div className="add-event__popup-colors">
              {colors.map(color => (
                <Marker
                  onClick={() => selectColor(color.id)}
                  key={color.id}
                  color={color.name}
                  className={selectedColor === color.id && 'active'}
                />
              ))}
            </div>
            <button onClick={addEvent} className="button">
              {isLoading ? 'Создается...' : 'Создать'}
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default AddEvent;