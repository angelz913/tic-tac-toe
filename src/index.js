import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}


class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square value={this.props.values[i]} onClick={() => this.props.onClick(i)}/>
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        values: Array(9).fill(null)
      }],
      currentPlayer: 'X',
      winner: null,
      stepIdx: 0
    }
  }
  
  onClickSquare(i) {
    // Create shallow copies of the current states
    const history = this.state.history.slice(0, this.state.stepIdx + 1);
    const values = history[history.length - 1].values.slice();
    // If winner already exists or the ith square is occupied
    if (this.determineWinner(values) || values[i]) {
      return;
    }
    values[i] = this.state.currentPlayer;
    history.push({ values: values });
    this.setState({
      history: history,
      currentPlayer: this.state.currentPlayer === 'X' ? 'O' : 'X',
      stepIdx: history.length - 1
    });
  }

  determineWinner(values) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (values[a] && values[a] === values[b] && values[a] === values[c]) {
        return values[a];
      }
    }
    return null;
  }

  onClickStepBtn(step) {
    this.setState({
      stepIdx: step,
      currentPlayer: step % 2 === 0 ? 'X' : 'O'
    });
  }

  render() {
    const history = this.state.history;
    const stepIdx = this.state.stepIdx;
    let status;
    const winner = this.determineWinner(history[stepIdx].values);
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + this.state.currentPlayer;
    }

    const moves = history.map((elem, step) => {
      const label = step ? 'Go to step #' + step : 'Go to start of game';
      return <li key={step}><button onClick={() => this.onClickStepBtn(step)}>{label}</button></li>
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board values={history[stepIdx].values} onClick={i => this.onClickSquare(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
