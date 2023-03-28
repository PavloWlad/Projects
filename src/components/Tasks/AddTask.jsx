import React, { useState } from 'react';
import axios from 'axios';

import addSvg from '../../assets/img/add.svg'; 

const AddTask = ({ event, onAddTask}) => {
  const [visibleForm, setFormVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(''); 

  const toggleFormVisible = () => {
    setFormVisible(!visibleForm);
    setInputValue('');
  };

  const addTask = () => {
    const obj = {
      eventId: event.id,
      text: inputValue,
      completed: false
    };

    if (!inputValue) {
      alert('Введите название задачи!')
      return;
    }

    setIsSending(true);
    axios
      .post('http://localhost:4000/tasks', obj)
      .then(({ data }) => {
        onAddTask(event.id, data);
        toggleFormVisible();
      })
      .catch(e => {
        alert('Не удалось добавить задачу!');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="tasks__form">
      {!visibleForm ? (
        <div onClick={toggleFormVisible} className="tasks__form-new">
          <img src={addSvg} alt="Add icon" />
          <span>Новая задача</span>
        </div>
      ) : (
        <div className="tasks__form-block">
          <input
            style={{borderColor: event.color.hex, backgroundColor: '#e2dfdf06' }}
            value={inputValue}
            className="field-tasks"
            type="text"
            placeholder="Текст задачи..."
            onChange={e => setInputValue(e.target.value)}
          />
          <button 
            style={{backgroundColor: event.color.hex }} 
            disabled={isSending} 
            onClick={addTask} 
            className="button">
            {isSending ? 'Добавление...' : 'Добавить задачу'}
          </button>
          <button onClick={toggleFormVisible} className="button button--grey">
            Отмена
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTask;