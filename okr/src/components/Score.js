import React from 'react';
import { Tooltip } from 'reactstrap';

export default class extends React.Component {
  static displayName = 'Score';

  constructor(props) {
    super(props);
    this.state = { tooltipOpen: false };
  }

  toggle() {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  render() {
    const { id, achieved, score, description } = this.props;

    return (
      <div className={achieved ? 'score achieved' : 'score'}>
        <div id={id}>{score}</div>
        {description && (
          <Tooltip
            autohide={true}
            delay={0}
            target={id}
            isOpen={this.state.tooltipOpen}
            tether={{ constraints: [{ to: 'scrollParent', pin: true }] }}
            toggle={() => this.toggle()}>
            {description}
          </Tooltip>
        )}
      </div>
    );
  }
}
