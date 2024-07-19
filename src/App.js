import React, { Component } from 'react';
import './App.css';
import Task from './pages/task_page';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div>
        <Task/>
      </div>
    );
  }
}

export default App;
