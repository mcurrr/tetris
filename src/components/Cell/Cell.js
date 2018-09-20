import React, { PureComponent } from 'react';
import { Motion, spring } from 'react-motion';
import { toNumber, map, split } from 'lodash';

import './Cell.css';


class Cell extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { new: false }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ new: nextProps.type && !this.props.type })
  }

  renderCell = styles => {
    const { id, type } = this.props;

    return (
        <div
            style={styles}
            onClick={() => this.props.onChange({ id, type })}
            className={`cell a-${type} ${id ? '' : 'invisible'}`}
        >
            {type}
        </div>
    )
  }

  render() {
    const { oldId, id, type } = this.props;

    if (!id) return null;

    const [top, left] = map(split(id, ':'), x => toNumber(x) * 50);
    const [oldTop, _] = oldId ? map(split(oldId, ':'), x => toNumber(x) * 50) : [0, 0];

    const defaultTop = this.state.new ? -1000 : oldTop;

    return this.state.new || oldId
        ?   <Motion
                defaultStyle={{ top: defaultTop }}
                style={{ top: spring(top) }}
            >
                {({ top }) => this.renderCell({ top, left })}
            </Motion>
        : this.renderCell({ top, left })
  }
}

export default Cell;
