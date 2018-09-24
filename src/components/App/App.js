import React, { Component } from 'react';
import { includes, isEmpty } from 'lodash';
import { fromEvent, Subject, empty, timer } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

import Cell from '../Cell/Cell';
import { removeCell, fillArray, dropDownArray } from '../../utils';
import './App.css';


class App extends Component {
  pauser = null;

  constructor(props) {
    super(props);

    this.state = {
      array: props.array,
      refilled: true,
      paused: false
    }
  }

  componentDidMount() {
    this.subscribeKeyboard();
    this.subscribeTimer();
  }

  subscribeTimer = () => {
    const source = timer(1000, 1000);
    this.pauser = new Subject();
    const pausable = this.pauser.pipe(switchMap(paused =>
      paused ? empty() : source));

    pausable.subscribe(console.log);

    this.pauser.next(false);
  }

  subscribeKeyboard() {
    fromEvent(document, 'keydown')
      .pipe(
        map(event => +event.keyCode)
      )
      .subscribe(this.handleKeyboard);
  }

  handleKeyboard = code => {
    switch (code) {
      case 32: this.rotate();
        break;
      case 13:
      case 27: this.togglePause();
        break;
      default: this.move(code);
    }
  }

  rotate() {
    console.log('rotate');
  }

  togglePause = () => {
    const { paused } = this.state;
    console.log('pause toggle', !paused);
    this.setState({ paused: !paused });
    this.pauser.next(!paused);
  }

  move(code) {
    if (!includes([37, 38, 39, 40], code)) return;

    console.warn('move');
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
        {array.map((row, index) =>
        <div key={index}>
          {row.map((cell, anotherIndex) =>
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
