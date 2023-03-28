import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, useHistory } from 'react-router-dom';

import { Events, AddEvent, Tasks } from './components';  

import logo from '../src/assets/img/logo.png';
import logoMobile from '../src/assets/img/logo-mobile.png';
import loadingTaskGif from '../src/assets/img/loading-task.gif';
import closeSvgMenu from '../src/assets/img/close-menu.png';
import menuSvg from '../src/assets/img/menu.png';

function App() {
  const [events, setEvents] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  let history = useHistory();

  useEffect(() => {
    axios
      .get('http://localhost:4000/events?_expand=color&_embed=tasks&_embed=date')
      .then(({ data }) => {
        setEvents(data);
      });
    axios.get('http://localhost:4000/colors').then(({ data }) => {
      setColors(data);
    });
  }, []);

  const onAddEvent = obj => {
    const newEvent = [...events, obj];
    setEvents(newEvent);
  };

  const onAddDate = (eventId, dateObj) => {
    const newEvent = events.map(item => {
      if (item.id === eventId) {
        item.date = [...item.date, dateObj];
      }
      return item;
    });
    setEvents(newEvent);
  };

  const onAddTask = (eventId, taskObj) => {
    const newEvent = events.map(item => {
      if (item.id === eventId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setEvents(newEvent);
  };

  const onEditTask = (eventId, taskObj) => {
    const newTaskText = window.prompt('Текст задачи', taskObj.text);

    if (!newTaskText) {
      return;
    }

    const newEvent = events.map(event => {
      if (event.id === eventId) {
        event.tasks = event.tasks.map(task => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }
      return event;
    });
    setEvents(newEvent);
    axios
      .patch('http://localhost:4000/tasks/' + taskObj.id, {
        text: newTaskText
      })
      .catch(() => {
        alert('Не удалось обновить задачу');
      });
  };

  const onRemoveTask = (eventId, taskId) => {
    if (window.confirm('Вы действительно хотите удалить задачу?')) {
      const newEvent = events.map(item => {
        if (item.id === eventId) {
          item.tasks = item.tasks.filter(task => task.id !== taskId);
        }
        return item;
      });
      setEvents(newEvent);
      axios.delete('http://localhost:4000/tasks/' + taskId).catch(() => {
        alert('Не удалось удалить задачу');
      });
    }
  };

  const onRemoveDate = (eventId, dateId) => {
    if (window.confirm('Вы действительно хотите удалить дату?')) {
      const newEvent = events.map(item => {
        if (item.id === eventId) {
          item.date = item.date.filter(date => date.id !== dateId);
        }
        return item;
      });
      setEvents(newEvent);
      axios.delete('http://localhost:4000/date/' + dateId).catch(() => {
        alert('Не удалось удалить дату!');
      });
    }
  };

  const onCompleteTask = (eventId, taskId, completed) => {
    const newEvent = events.map(event => {
      if (event.id === eventId) {
        event.tasks = event.tasks.map(task => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return event;
    });
    setEvents(newEvent);
    axios
      .patch('http://localhost:4000/tasks/' + taskId, {
        completed
      })
      .catch(() => {
        alert('Не удалось обновить задачу');
      });
  };

  const onEditEventTitle = (id, title) => {
    const newEvent = events.map(item => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setEvents(newEvent);
  };

  useEffect(() => {
    const eventId = history.location.pathname.split('events/')[1];
    if (events) {
      const event = events.find(event => event.id === Number(eventId));
      setActiveItem(event);
    }
  }, [events, history.location.pathname]);

  const menuOpen = () => {
    document.getElementById('planir').classList.add('active');
    document.getElementById('tasks').classList.add('active');
  }

  const menuClose = () => {
    document.getElementById('planir').classList.remove('active');
    document.getElementById('tasks').classList.remove('active');
  }

  return (
    <div className="planir">
       {events ? (<div id="planir" className="planir__sidebar">
        <img className="menu-close" onClick={menuClose} src={closeSvgMenu} alt="close"></img>
        <img className="logo" src={logo} alt="logo"></img>
        <Events
          onClickItem={event => {
            history.push(`/`);
            menuClose();
          }}
          items={[
            {
              active: history.location.pathname === '/',
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.96 8.10001H7.74001C7.24321 8.10001 7.20001 8.50231 7.20001 9.00001C7.20001 9.49771 7.24321 9.90001 7.74001 9.90001H12.96C13.4568 9.90001 13.5 9.49771 13.5 9.00001C13.5 8.50231 13.4568 8.10001 12.96 8.10001V8.10001ZM14.76 12.6H7.74001C7.24321 12.6 7.20001 13.0023 7.20001 13.5C7.20001 13.9977 7.24321 14.4 7.74001 14.4H14.76C15.2568 14.4 15.3 13.9977 15.3 13.5C15.3 13.0023 15.2568 12.6 14.76 12.6ZM7.74001 5.40001H14.76C15.2568 5.40001 15.3 4.99771 15.3 4.50001C15.3 4.00231 15.2568 3.60001 14.76 3.60001H7.74001C7.24321 3.60001 7.20001 4.00231 7.20001 4.50001C7.20001 4.99771 7.24321 5.40001 7.74001 5.40001ZM4.86001 8.10001H3.24001C2.74321 8.10001 2.70001 8.50231 2.70001 9.00001C2.70001 9.49771 2.74321 9.90001 3.24001 9.90001H4.86001C5.35681 9.90001 5.40001 9.49771 5.40001 9.00001C5.40001 8.50231 5.35681 8.10001 4.86001 8.10001ZM4.86001 12.6H3.24001C2.74321 12.6 2.70001 13.0023 2.70001 13.5C2.70001 13.9977 2.74321 14.4 3.24001 14.4H4.86001C5.35681 14.4 5.40001 13.9977 5.40001 13.5C5.40001 13.0023 5.35681 12.6 4.86001 12.6ZM4.86001 3.60001H3.24001C2.74321 3.60001 2.70001 4.00231 2.70001 4.50001C2.70001 4.99771 2.74321 5.40001 3.24001 5.40001H4.86001C5.35681 5.40001 5.40001 4.99771 5.40001 4.50001C5.40001 4.00231 5.35681 3.60001 4.86001 3.60001Z"
                    fill="white"
                  />
                </svg>
              ),
              name: 'Все события'
            }
          ]}
        />
          <Events
            items={events}
            onRemove={id => {
              const newEvents = events.filter(item => item.id !== id);
              setEvents(newEvents);
            }}
            onClickItem={event => {
              history.push(`/events/${event.id}`);
              menuClose();
            }}
            activeItem={activeItem}
            isRemovable
          />
        <AddEvent onAdd={onAddEvent} colors={colors} />
      </div>) : 
      (<div className="non"></div>)}

      {events ? (<div id="tasks" className="planir__tasks">
        <div className="top-bar">
          <img className="logo-mobile" src={logoMobile} alt="logo"></img>
          <img className="menu-open" src={menuSvg} alt="menu" onClick={menuOpen}></img>
        </div>
        <Route exact path="/">
          {events &&
            events.map(event => (
              <Tasks
                key={event.id}
                event={event}
                onAddTask={onAddTask}
                onAddDate={onAddDate}
                onEditTitle={onEditEventTitle}
                onRemoveTask={onRemoveTask}
                onRemoveDate={onRemoveDate}
                onEditTask={onEditTask}
                onCompleteTask={onCompleteTask}
                withoutEmpty
              />
            ))}
        </Route>
        <Route path="/events/:id">
          {events && activeItem && (
            <Tasks
              event={activeItem}
              onAddTask={onAddTask}
              onEditTitle={onEditEventTitle}
              onRemoveTask={onRemoveTask}
              onRemoveDate={onRemoveDate}
              onAddDate={onAddDate}
              onEditTask={onEditTask}
              onCompleteTask={onCompleteTask}
            />
          )}
        </Route>
      </div>) : (
      <div className="wrap">
        <div className="wrap__loading">
          <img src={loadingTaskGif} alt="logo"></img>
          <p>EVENT | PLANNER</p>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;