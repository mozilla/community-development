import React from 'react';
import { render } from 'react-dom';
import Objective from './components/Objective';
import data from './okrs.json';
import 'bootstrap/dist/css/bootstrap-flex.min.css';
import './global.css';

render((
  <div className="container-fluid">
    <div className="row">
      <div className="col-xs">
        <div className="title-container">
          <h1>Community Development Team OKR Dashboard</h1>
        </div>
      </div>
    </div>
    <div className="row">
      {data.objectives.map((objective, key) => (
        <Objective
          key={key}
          title={objective.name}
          keyResults={objective.results}
          goals={objective.okrs} />
      ))}
    </div>
  </div>
), document.getElementById('root'));
