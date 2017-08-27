const canvasTiles = document.getElementById('board-tiles').getContext('2d')

const LINETICKNESS = 3
const BOARDSIZE = 5
const CONSECUTIVETILESFORWIN = 4
// TODO: board can only be square --> unify BOARDWIDTH and BOARDHEIGHT
const BOARDWIDTH = 300
const BOARDHEIGHT = 300

// TODO: board class
var board

function initBoard(){
  board = []
  for(let i = 0; i < BOARDSIZE; i++){
    board.push([])
    for(let j = 0; j < BOARDSIZE; j++){
      board[i].push(" ")
    }
  }
}

initBoard()

// draw separating lines
function drawLines(){
  let numberOfLinesToDraw = BOARDSIZE * 2 - 2
  let lineSpacing = BOARDWIDTH / (numberOfLinesToDraw/2 + 1)
  for(let i = 0; i < numberOfLinesToDraw; i++){
    if(i < numberOfLinesToDraw/2){
      // veritcal lines
      canvasTiles.fillRect(lineSpacing * (i + 1),0, LINETICKNESS, BOARDHEIGHT)
    }else{
      // horizontal lines
      canvasTiles.fillRect(0,lineSpacing * (i - numberOfLinesToDraw/2 + 1), BOARDWIDTH, LINETICKNESS)
    }
  }
}

drawLines()

//
var moveType = 'x'

document.getElementById('board-tiles').addEventListener("mouseup", function(e){
  addMove(moveType, e.offsetX, e.offsetY)
  if(checkIfWon(board)){
    alert(moveType + ' won the game!')
    canvasTiles.clearRect(0,0,BOARDWIDTH, BOARDHEIGHT)
    drawLines()
    initBoard()
  }
  moveType = moveType === 'x' ? 'y' : 'x'
})

function addMove(type, x, y){
  // check args
  type = type.toLowerCase()
  if (type !== 'x' && type !== 'y') throw new Error('Not a valid type, use "x" or "y"')
  if (!x || !y || x < 0 || x > BOARDWIDTH || y < 0 || y > BOARDWIDTH) throw new Error('Not \
valid coordinates provided, x and y should be in the range of the board. Got: x: ' + x + ', y: ' + y)

  boardX = parseInt(x / BOARDHEIGHT * BOARDSIZE)
  boardY = parseInt(y / BOARDWIDTH * BOARDSIZE)
  //console.log(boardX, boardY)
  board[boardY][boardX] = type
  //console.log(board)
  // TODO: check if move can be executed
  let tileSize = BOARDHEIGHT / BOARDSIZE
  if(type === 'x'){
    drawX(boardX *tileSize + tileSize/2, boardY*tileSize + tileSize/2)
  }else{
    drawO(boardX*tileSize + tileSize/2, boardY*tileSize + tileSize/2)
  }
}


function checkIfWon(board, secondRun){
  function check(rowString){
    seekedX = Array(CONSECUTIVETILESFORWIN + 1).join('x')
    seekedY = Array(CONSECUTIVETILESFORWIN + 1).join('y')
    if(rowString.indexOf(seekedX) !== -1 || rowString.indexOf(seekedY) !== -1){
      return true
    }
  }

  for(let i = 0; i < board.length; i++){
    // verticall check done by this code on the second run (the list is flipped)
    let resHorizontal = board[i].join('')
    if(check(resHorizontal)) return true
  }

  // check diagonals
  var diagonalCoords = [0,0]
  for(let i = board.length-1; i > - board.length; i --){

    if(i < 0){
      diagonalCoords = [0, i + board.length]
    }else{
      diagonalCoords = [i, 0]
    }

    var res = ''
    // console.log(diagonalCoords)
    // console.log(board[diagonalCoords[0]])
    for(let j = diagonalCoords[0]; j < board[diagonalCoords[0]].length; j++){
      res += board[diagonalCoords[0]][diagonalCoords[1]]
      diagonalCoords = [diagonalCoords[0] + 1, diagonalCoords[1] + 1]
      // exit if out of range
      if(!board[diagonalCoords[0]] || !board[diagonalCoords[0]][diagonalCoords[1]]) break
    }
    //console.log(res)
    if(check(res)) return true
    if(!secondRun) return checkIfWon(transpose(board), true)
  }
  return false
}

// https://stackoverflow.com/questions/4492678/swap-rows-with-columns-transposition-of-a-matrix-in-javascript/13241545#13241545
// transpose array and flip its rows horizontally
function transpose(a) {
    let transposed = Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
    return transposed.map(function(r){
      return r.reverse()
    })
}

// TODO: X and O sizes based on place in the square
function drawX(x, y) {
  // https://stackoverflow.com/questions/12835531/draw-x-word-use-canvas-html
  canvasTiles.beginPath()
  canvasTiles.lineWidth = LINETICKNESS
  canvasTiles.moveTo(x - 20, y - 20)
  canvasTiles.lineTo(x + 20, y + 20)

  canvasTiles.moveTo(x + 20, y - 20)
  canvasTiles.lineTo(x - 20, y + 20)
  canvasTiles.stroke();
}

function drawO(x,y){
  canvasTiles.beginPath();
  canvasTiles.lineWidth = LINETICKNESS
  canvasTiles.arc(x,y,27,0,2*Math.PI);
  canvasTiles.stroke();
}
