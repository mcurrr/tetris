import React, { Component } from 'react';
import { map } from 'lodash';

import Cell from '../Cell/Cell';
import { removeCell, fillArray, dropDownArray } from '../../utils';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      array: props.array,
      refilled: true
    }
  }

  refill = () => {
    const { array } = this.state;
    const refilled = fillArray(array);
    this.setState({ array: refilled, refilled: true });
  }

  onChange = cell => {
    if (!cell || !cell.id || !this.state.refilled) return;

    this.setState({ refilled: false });

    const { array } = this.state;
    const trimmed = removeCell(array, cell.id, cell.type);
    const dropped = dropDownArray(trimmed);

    this.setState({ array: dropped }, () => setTimeout(this.refill, 1000));
  }

  render() {
    const { array, refilled } = this.state;

    return (
      <div className={`app ${!refilled ? 'blocked' : ''}`}>
        {map(array, (row, index) =>
        <div key={index}>
          {map(row, (cell, anotherIndex) =>
            <Cell
              key={anotherIndex}
              onChange={this.onChange}
              {...cell}
            />
          )}
        </div>)}
      </div>
    );
  }
}

export default App;
