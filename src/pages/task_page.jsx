import React, { useState, useEffect } from 'react';
import '../styles.css';

const Task = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priorityLevel, setPriorityLevel] = useState(2);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('incomplete');
  const [tasks, setTasks] = useState([]);

  // editing
  const [editTaskId, setEditTaskId] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriorityLevel, setEditPriorityLevel] = useState(2);
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState('Incomplete');

  const handleSubmit = async (e) => {
    e.preventDefault();
    addTask();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriorityLevel(2);
    setDueDate('');
    setStatus('Incomplete');
    setEditTaskId(null);
    setIsEditing(false);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/list_tasks', {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (response.status === 200) {
        console.log('success')
        console.log(result);
        setTasks(result.task);
      } else {
        console.log('error')
      }
    } catch (err) {
      console.log('Something went wrong, try again')
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask() {
    var params = JSON.stringify({
      title: title,
      description: description,
      priority_level: priorityLevel,
      due_date: dueDate,
      status: status,
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/add_task', {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: params,
      });
      const result = await response.json();

      if (response.status === 201) {
        console.log('success')
        console.log(result);
        window.location.reload();
      } else {
        console.log('error')
      }
    } catch (err) {
      console.log('Something went wrong, try again')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_task/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log('Task deleted successfully');
        fetchTasks();
        window.location.reload();
      } else {
        console.log('Error deleting task');
      }
    } catch (err) {
      console.log('Something went wrong while deleting the task:', err);
    }
  };

  const setEditData = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriorityLevel(task.priority_level);
    setEditDueDate(task.due_date.split('T')[0]);
    setEditStatus(task.status);
    setIsEditing(true);

  };

  const updateTask = async () => {
    const params = JSON.stringify({
      title: editTitle,
      description: editDescription,
      priority_level: editPriorityLevel,
      due_date: editDueDate,
      status: editStatus,
    });

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update_task/${editTaskId}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: params,
      });
      const result = await response.json();

      if (response.status === 200) {
        console.log('Task updated successfully:', result);
        resetForm();
        window.location.reload();
        fetchTasks();
      } else {
        console.log('Error updating task:', result.message);
      }
    } catch (err) {
      console.log('Something went wrong while updating the task:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    updateTask();
  };

  return (
    <div className="row">
      <div className="title">Task Management Tool</div>
      <div className="col-4">
        <form className='task-form' onSubmit={handleSubmit}>
          <h4 className="card-task-title">Add Task</h4>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input required value={title} onChange={(event) => setTitle(event.target.value)} type="text" className="form-control" id="title" placeholder='Enter Task Title' />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea required value={description} onChange={(event) => setDescription(event.target.value)} className="form-control" id="description" rows="3" placeholder="Enter Task Description"></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select value={priorityLevel} onChange={(event) => setPriorityLevel(event.target.value)} className="form-control" id="priority">
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="form-control" id="priority">
              <option value="Incomplete">Incomplete</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <input required value={dueDate} onChange={(event) => setDueDate(event.target.value)} type="date" className="form-control" id="dueDate" />
          </div>
          <button type="submit" className="btn btn-primary">Add Task</button>
        </form> <br /><br />

        {isEditing && (
          <div className="edit-task-form" id='edit-task'>
            <h4 className="card-task-title">Update Task</h4>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label htmlFor="editTitle" className="form-label">Title</label>
                <input required value={editTitle} onChange={(event) => setEditTitle(event.target.value)} type="text" className="form-control" id="editTitle" placeholder='Enter Task Title' />
              </div>
              <div className="mb-3">
                <label htmlFor="editDescription" className="form-label">Description</label>
                <textarea required value={editDescription} onChange={(event) => setEditDescription(event.target.value)} className="form-control" id="editDescription" rows="3" placeholder="Enter Task Description"></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="editPriority" className="form-label">Priority</label>
                <select value={editPriorityLevel} onChange={(event) => setEditPriorityLevel(event.target.value)} className="form-control" id="editPriority">
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="editStatus" className="form-label">Status</label>
                <select value={editStatus} onChange={(event) => setEditStatus(event.target.value)} className="form-control" id="editStatus">
                  <option value="Incomplete">Incomplete</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="editDueDate" className="form-label">Due Date</label>
                <input required value={editDueDate} onChange={(event) => setEditDueDate(event.target.value)} type="date" className="form-control" id="editDueDate" />
              </div>
              <button type="submit" className="btn btn-primary">Update Task</button> &nbsp;&nbsp;
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </form>
          </div>
        )}
      </div>

      <div className="col-8">
        <div className="added-title">Added Tasks</div>
        {tasks.length > 0 ? (
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id}>
                <h5>{task.title}</h5>
                <p>{task.description}</p>
                <p className={`priority-${task.priority_level === 1 ? 'high' : task.priority_level === 2 ? 'medium' : 'low'}`}>
                  Priority: {task.priority_level === 1 ? 'High' : task.priority_level === 2 ? 'Medium' : 'Low'}
                </p>
                <p className={`status-${task.status.toLowerCase()}`}>
                  Status: {task.status}
                </p>
                <p>Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
                <button className="btn btn-warning" onClick={() => setEditData(task)}>Edit</button> &nbsp;&nbsp;
                <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='no-task'>No task available, kindly add task to view them</p>
        )}
      </div>
    </div>
  );
};

export default Task;