import React from 'react';
import KeyResult from './KeyResult';
import Label from './Label';

export default class extends React.Component {
  static displayName = 'Objective';

  render() {
    const { title, keyResults, goals } = this.props;
    let abs = 0;
    let length = keyResults.length;
    const totalScore = Math.round(100 * ((keyResults.reduce((score, keyResult) => {
      if (!keyResult.score) {
        return score;
      }

      if (keyResult.score.startsWith('+')) {
        abs += parseFloat(keyResult.score);
        length -= 1;
        return score;
      }

      return score + parseFloat(keyResult.score);
    }, 0) / length) + abs)) / 100;

    return (
      <div className="col-xs-12 col-md-3">
        <div className="objective">
          <h2>
            <Label type="info">{totalScore}</Label>
            {title}
          </h2>
          {goals.map((goal, key) => (
            <Label key={key}>{goal}</Label>
          ))}
          <hr />
          {keyResults.map((keyResult, key) => (
            <div className="row" key={key}>
              <KeyResult result={keyResult} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
