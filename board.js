function Board(size, consecutiveTilesForWin, sizePixels){
  this.size = size
  this.consecutiveTilesForWin = consecutiveTilesForWin
  this.sizePixels = sizePixels
  this.lineThickness = 3
  this.nextToMove = 'x'

  this.init = function(){
    if(this.boardCanvasElement){
      document.body.removeChild(this.boardCanvasElement)
    }
    var canvas = document.createElement("canvas")
    this.boardCanvasElement = canvas
    canvas.height = this.sizePixels
    canvas.width = this.sizePixels
    this.canvasContext = this.boardCanvasElement.getContext('2d')
    document.body.appendChild(canvas)

    this.board = this.generateCleanBoard(this.sizePixels)
    this.drawSeparatorLines()
    this.boardCanvasElement.addEventListener("mouseup", function(e){
      this.move(e.offsetX, e.offsetY)
    }.bind(this))
  }

  this.generateCleanBoard = function(){
    this.canvasContext.clearRect(0,0,this.sizePixels, this.sizePixels)
    let board = []
    for(let i = 0; i < this.size; i++){
      board.push([])
      for(let j = 0; j < size; j++){
        board[i].push(" ")
      }
    }
    return board
  }

  this.drawSeparatorLines = function(){
    let numberOfLinesToDraw = this.size * 2 - 2
    let lineSpacing = this.sizePixels / (numberOfLinesToDraw/2 + 1)
    for(let i = 0; i < numberOfLinesToDraw; i++){
      if(i < numberOfLinesToDraw/2){
        // veritcal lines
        this.canvasContext.fillRect(lineSpacing * (i + 1),0, this.lineThickness, this.sizePixels)
      }else{
        // horizontal lines
        this.canvasContext.fillRect(0,lineSpacing * (i - numberOfLinesToDraw/2 + 1), this.sizePixels, this.lineThickness)
      }
    }
  }
  this.move = function(clickPixelX, clickPixelY){
    // check args
    type = this.nextToMove.toLowerCase()
    if (type !== 'x' && type !== 'y') throw new Error('Not a valid type, use "x" or "y"')
    if (!clickPixelX || !clickPixelY || clickPixelX < 0 || clickPixelX > this.sizePixels || clickPixelY < 0 || clickPixelY > this.sizePixels) throw new Error('Not \
  valid coordinates provided, x and y should be in the range of the board. Got: x: ' + x + ', y: ' + y)

    this.addMove(type, clickPixelX, clickPixelY)

    if(this.checkIfWon(this.board)){
      alert(this.nextToMove + ' won the game!')
      this.init()
    }
    this.nextToMove = this.nextToMove === 'x' ? 'y' : 'x'
  }

  this.addMove = function(type, clickPixelX, clickPixelY){

    // calculate which tile of the board did get the click
    boardX = parseInt(clickPixelX / this.sizePixels * this.size)
    boardY = parseInt(clickPixelY / this.sizePixels * this.size)
    // TODO: check if move can be executed
    this.board[boardY][boardX] = type

    let tileSize = this.sizePixels / this.size
    if(type === 'x'){
      this.drawX(boardX *tileSize + tileSize/2, boardY*tileSize + tileSize/2)
    }else{
      this.drawO(boardX*tileSize + tileSize/2, boardY*tileSize + tileSize/2)
    }
  }

  this.checkIfWon = function(board, secondRun){
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
    }
    if(!secondRun) return this.checkIfWon(this.transpose(board), true)
    return false
  }

  this.transpose = function(a) {
      let transposed = Object.keys(a[0]).map(function(c) {
          return a.map(function(r) { return r[c]; });
      });
      return transposed.map(function(r){
        return r.reverse()
      })
  }

  // TODO: X and O sizes based on place in the square
  this.drawX = function(x, y) {
    // https://stackoverflow.com/questions/12835531/draw-x-word-use-canvas-html
    this.canvasContext.beginPath()
    this.canvasContext.lineWidth = this.lineThickness
    this.canvasContext.moveTo(x - 20, y - 20)
    this.canvasContext.lineTo(x + 20, y + 20)

    this.canvasContext.moveTo(x + 20, y - 20)
    this.canvasContext.lineTo(x - 20, y + 20)
    this.canvasContext.stroke();
  }

  this.drawO = function(x,y){
    this.canvasContext.beginPath();
    this.canvasContext.lineWidth = this.lineThickness
    this.canvasContext.arc(x,y,27,0,2*Math.PI);
    this.canvasContext.stroke();
  }
}
