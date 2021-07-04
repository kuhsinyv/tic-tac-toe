import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

function Square(props) {
  const highlightSquareStyle = {
    background: '#FFBCBC',
  }
  return (
    <button
      className="square"
      style={props.isHighlightSquare? highlightSquareStyle : null}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isHighlightSquare={this.props.result?.includes(i)}
        onClick={() => this.props.onClick(i)}
        value={this.props.squares[i]}
      />
    );
  }

  render() {
    const ROW_NUMBER = 3;
    const COLUMN_NUMBER = 3;
    const squareValues = [];
    for (let r = 0; r < ROW_NUMBER; r++) {
      let row = [];
      for (let c = 0; c < COLUMN_NUMBER; c++) {
        row.push(r * ROW_NUMBER + c);
      }
      squareValues.push(row);
    }
    return (
      <div>
        {squareValues.map((row) => {
          return (
            <div className="board-row">
              {row.map((i) => {
                return this.renderSquare(i);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: [null, null], // [column, row]
      }],
      stepNumber: 0,
      xIsNext: true,
      winner: null,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = [Math.floor(i / 3) + 1, i % 3 + 1];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winner: (() => {
        for (let idx = 0; idx < squares.length; idx++) {
          if (squares[idx] === null) {
            return false;
          }
        }
        return true;
      })() ? '平局' : null,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);
    const winner = this.state.winner ?
      this.state.winner :
      (result ? current.squares[result[0]] : null);
    const currentButtonStyle = {
      fontWeight: 'bolder',
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + history[move].location + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button className="history"
            style={this.state.stepNumber === move ? currentButtonStyle : null}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    const steps = this.state.ascending ? moves : moves.reverse();
    const stepsDesc = '步骤记录'.concat(this.state.ascending ?
      '（顺序）' :
      '（逆序）');

    let status;
    if (winner) {
      if (winner === '平局') {
        status = winner;
      } else {
        status = 'Winner: ' + winner;
      }
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            result={result}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="next-player">{status}</div>
          <ol>
            <li>
              <button
                className="history"
                onClick={() => {
                  this.setState({
                    ascending: !this.state.ascending,
                  })
                }}
              >
                {stepsDesc}
              </button>
            </li>
            {steps}
          </ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
