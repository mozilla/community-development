import React from 'react';
import { Tooltip } from 'reactstrap';
import Score from './Score';
import Label from './Label';
import Info from './Info';
import ArrowDown from './ArrowDown';
import ArrowRight from './ArrowRight';

export default class extends React.Component {
  static displayName = 'KeyResult';

  constructor(props) {
    super(props);
    this.state = { tooltipOpen: false, collapseOpen: false };
  }

  collapse() {
    this.setState({ collapseOpen: !this.state.collapseOpen });
  }

  toggle() {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  getProgress() {
    const { progress } = this.props.result;

    if (!progress) {
      return 0;
    }

    if (typeof progress === 'number') {
      return progress;
    }

    const values = Object.values(progress);

    return values
      .reduce((acc, value) => acc + value, 0) / values.length;
  }

  getProgressLabel(progress = this.getProgress()) {
    if (!progress) {
      return 'danger';
    } else if (progress === 1) {
      return 'success';
    }

    return 'warning';
  }

  render() {
    const { result } = this.props;
    const scores = Object.keys(result.scoring);
    const index = scores.indexOf(result.score);
    const id = `info-${result.name.replace(/\s/g, '-')}`;
    const progress = this.getProgress() * 100;
    let status = 'empty';

    if (index !== -1) {
      if (scores[scores.length - 1] === result.score) {
        status = 'achieved';
      } else {
        status = 'in-progress';
      }
    }

    return (
      <div className="col-xs">
        <h3>
          {
            typeof this.props.result.progress === 'number' ? (
              <span>
                {result.name}&nbsp;
                <Label type={this.getProgressLabel(result.progress)}>
                  {
                    Math.floor(progress) === progress ?
                      progress :
                      progress.toFixed(2)
                  }%
                </Label>
              </span>
            ) : (
              <span className="collapser" onClick={() => this.collapse()}>
                {this.state.collapseOpen ? <ArrowDown /> : <ArrowRight />}
                {result.name}&nbsp;
                <Label type={this.getProgressLabel(result.progress)}>
                  {
                    Math.floor(progress) === progress ?
                      progress :
                      progress.toFixed(2)
                  }%
                </Label>
              </span>
            )
          }
          &nbsp;<Info id={id} />
          {result.description && (
            <Tooltip
              autohide={true}
              delay={0}
              target={id}
              isOpen={this.state.tooltipOpen}
              tether={{ constraints: [{ to: 'scrollParent', pin: true }] }}
              toggle={() => this.toggle()}>
              {result.description}
            </Tooltip>
          )}
        </h3>
        {typeof result.progress !== 'number' && (
          <div style={{ paddingBottom: 15, display: this.state.collapseOpen ? 'block' : 'none' }}>
            {
              Object
              .keys(result.progress)
              .map((item, key) => {
                const value = result.progress[item] * 100;

                return (
                  <div key={key} className="progress-list" style={{ paddingLeft: '5%' }}>
                    <Label type={this.getProgressLabel(result.progress[item])}>
                      {
                        Math.floor(value) === value ?
                          value :
                          value.toFixed(2)
                      }%
                    </Label>&nbsp;
                    <span style={{ fontSize: '.8rem' }}>{item}</span>
                  </div>
                );
              })
            }
          </div>
        )}
        <div className={`row scoring flex-items-xs-left ${status}`}>
          {scores.map((score, key) => (
            <Score
              key={key}
              id={`score-${result.name.replace(/\s/g, '-')}-${key}`}
              score={score}
              description={result.scoring[score]}
              achieved={key <= index} />
          ))}
        </div>
        <hr />
      </div>
    );
  }
}
