import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// Squareコンポーネントの定義
function Square(props) {
  
    return (
      <button 
      className="square" 
      onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}


// Bordコンポーネントの定義
class Board extends React.Component {

  // マス目を表示させる関数（Squereコンポーネントを呼び出します）
  renderSquare(i) {
    return (
    <Square 
    value={this.props.squares[i]} 
    onClick={() => this.props.onClick(i)}
    />
    );
  }

  

  // Boardコンポーネントのrender
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


// Gameコンポーネントの定義
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [
          {
          squares: Array(9).fill(null),
        }
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  // onClickイベントで最終的に呼び出される関数
  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }else{
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      })
    }
  }

  jumpTo(step){
    this.setState({
      xIsNext: (step%2) === 0,
      stepNumber: step,
    })
  }

  // Gameコンポーネントのrenders
  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move)=>{
      const desc = move ? 'Go to Move #' + move : 'Go to Game Start';
        
      return(
        <li key={move}>
          <button onClick={()=> this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );

    })

    let status;

    if (winner){
      status = 'Winner: '+ winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  // 三目並べの全勝ちパターンの配列番号
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

  // squaresに当てはめる
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 勝ちの場合は勝った方の記号を返す
      return squares[a];
    }
  }
  // 勝者がいない時はnullを返す
  return null;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
