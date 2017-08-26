const canvasTiles = document.getElementById('board-tiles').getContext('2d')

const LINETICKNESS = 3
const BOARDSIZE = 10
// TODO: board can only be square --> unify BOARDWIDTH and BOARDHEIGHT
const BOARDWIDTH = 300
const BOARDHEIGHT = 300
let numberOfLinesToDraw = BOARDSIZE * 2 - 2
let lineSpacing = BOARDWIDTH / (numberOfLinesToDraw/2 + 1)

// TODO: board class

// draw separating lines
for(let i = 0; i < numberOfLinesToDraw; i++){
  if(i < numberOfLinesToDraw/2){
    // veritcal lines
    canvasTiles.fillRect(lineSpacing * (i + 1),0, LINETICKNESS, BOARDHEIGHT)
  }else{
    // horizontal lines
    canvasTiles.fillRect(0,lineSpacing * (i - numberOfLinesToDraw/2 + 1), BOARDWIDTH, LINETICKNESS)
  }
}

//

document.getElementById('board-tiles').addEventListener("mouseup", function(e){
  addMove('x', e.offsetX, e.offsetY)
  // TODO: if move was executed, check if the game was won or not
  // TODO: logic if the game is won
  // TODO: change the move type
})

var board = [['','',''],['','',''],['','','']]

function addMove(type, x, y){
  // check args
  type = type.toLowerCase()
  if (type !== 'x' && type !== 'y') throw new Error('Not a valid type, use "x" or "y"')
  if (!x || !y || x < 0 || x > BOARDWIDTH || y < 0 || y > BOARDWIDTH) throw new Error('Not \
valid coordinates provided, x and y should be in the range of the board. Got: x: ' + x + ', y: ' + y)

  boardX = parseInt(x / BOARDHEIGHT * BOARDSIZE)
  boardY = parseInt(y / BOARDWIDTH * BOARDSIZE)
  console.log(boardX, boardY)
  // TODO: check if move can be executed
  let tileSize = BOARDHEIGHT / BOARDSIZE
  if(type === 'x'){
    drawX(boardX *tileSize + tileSize/2, boardY*tileSize + tileSize/2)
  }else{
    drawO(boardX*tileSize + tileSize/2, boardY*tileSize + tileSize/2)
  }
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
