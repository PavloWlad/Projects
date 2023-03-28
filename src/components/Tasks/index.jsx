import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import editSvg from '../../assets/img/pen.svg';

import './Task.scss'; 

import AddTask from './AddTask'; 
import Task from './Task';
import Date from '../Date';
import AddDate from '../Date/AddDate'


const Tasks = ({
  event,
  onEditTitle,
  onAddTask,
  onRemoveTask,
  onEditTask,
  onCompleteTask,
  withoutEmpty,
  onAddDate,
  onRemoveDate
}) => {
  const editTitle = () => {
    const newTitle = window.prompt('Название события', event.name);

    if (newTitle) {
      onEditTitle(event.id, newTitle);
      axios
        .patch('http://localhost:4000/events/' + event.id, {
          name: newTitle
        })
        .catch(() => {
          alert('Не удалось обновить название события!');
        });
    }
  };

  return (
    <div className="tasks">
      <div className="tasks-date">
        <Link to={`/events/${event.id}`}>
          <h2 style={{ color: event.color.hex }} className="tasks__title">
            {event.name}
            <Link><img onClick={editTitle} src={editSvg} alt="Edit icon" /></Link>
          </h2>
        </Link>

        <div className="tasks-date__event-date">
          {event.date &&
            event.date.map(date => (
              <Date
                key={date.id}
                event={event} 
                onRemove={onRemoveDate}
                {...date}
              />
            ))}
          <AddDate key={event.id} event={event} onAddDate={onAddDate} />
        </div>
      </div>

      <div className="tasks__items">
        {!withoutEmpty && event.tasks && !event.tasks.length && (
          <h2 style={{ color: event.color.hex }}>Задачи отсутствуют!</h2>
        )}
        {event.tasks &&
          event.tasks.map(task => (
            <Task
              key={task.id}
              event={event}
              onEdit={onEditTask}
              onRemove={onRemoveTask}
              onComplete={onCompleteTask}
              {...task}
            />
          ))}
        <AddTask key={event.id} event={event} onAddTask={onAddTask} />
      </div>
    </div>
  );
};

export default Tasks;