import React from 'react';
import axios from 'axios';

import datePng from '../../assets/img/date.png';

import './Date.scss'; 

const AddDate = ({ event, onAddDate}) => {
  const addDate = () => {
    const addDate = window.prompt('Введите дату события!');
  
    const obj = {
      eventId: event.id,
      value: addDate
    };
  
    if (!addDate) {
      return;
    }
    const check = window.confirm('Хотите отправить напоминание о событии на почту?');
    if (check === true) {
      const good = window.prompt('Введите E-mail!');
      if (good) {
        alert('Напоминанеи придет на адресс ' + good + ' за день до даты события!')
      }
      if (good === true){
        return axios
        .post('http://localhost:4000/date', obj)
        .then(({ data }) => {
          onAddDate(event.id, data);
        })
        .catch(e => {
          alert('Не удалось добавить дату!');
        })
      }
    }  
    
      axios
      .post('http://localhost:4000/date', obj)
      .then(({ data }) => {
        onAddDate(event.id, data);
      })
      .catch(e => {
        alert('Не удалось добавить дату!');
      })

    };

  return (
    <div className="date">
       <div className="date__add">
        <img onClick={addDate} src={datePng} alt="icon"/>
       </div>
    </div>
  );
};

export default AddDate;