//First you have to check all the squares, creating a table to at last substitute for the old table
//Every round you will have to re-initialize the substitute table

var height = 32;
var width = 32;

var getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var checkSquare = function(i, table, tableHeight){
  //Check the number of neighbors
  var n = 0;
  if(table[i-1] == 1){n++}
  if(table[i+1] == 1){n++}
  if(table[i - tableHeight - 1] == 1){n++}//Check Negative Block
  if(table[i - tableHeight + 1] == 1){n++}//Check Negative Block
  if(table[i + tableHeight - 1] == 1){n++}//Check Exceeds Block
  if(table[i + tableHeight + 1] == 1){n++}//Check Exceeds Block
  if(table[i - tableHeight] == 1){n++}//Check Negative Block
  if(table[i + tableHeight] == 1){n++}//Check Exceeds Block
  if(table[i] == 1){
    if(n < 2){return 0}
    if(n > 1 && n < 4){return 1}
    if(n > 3){return 0}
  }
  if(table[i] == 0){
    if(n == 3){return 1}
    else{return 0}
  }
}



var setBoard = function(table){
  for(var i = 0; i < table.length; i++){
    table[i] = getRandomInt(0,2)
    
  }
  return table;
}







var Square = React.createClass({
  render() {
    var style;
    if(this.props.value == 1){
      style={backgroundColor: "red"}
    } else {
	style={backgroundColor: "black"}
    }
    return(
      <div>
        <div style={style} className="square"></div>
      </div>
    )
  }
})




var Row = React.createClass({
  render(){
    var squares = this.props.squares;
    squares = squares.map(function(s){
	return <Square value={s} />
    })

    return(
      <div className="board-row">
        {squares}
      </div>
    )
  }
})




var Board = React.createClass({
  getTopSquare(i){
    var j = i - this.props.height;
    return this.state.table[j]
  },
  getBottomSquare(i){
    var j = i -this.props.height;
    return this.state.table[j]
  },
  makeArray(r, c){
    var table = []
    var nOfCells = r*c
    while(nOfCells > 0){
      table.push(0)
      nOfCells = nOfCells-1
    }
    setBoard(table)
    return table;
  },
  getInitialState(){
    var t = this.makeArray(this.props.height,this.props.width);
    return{table: t, height: this.props.height, width: this.props.width}
  },
  render(){
    var full = this.state.table;
    var rows = [];
    for(var i = 0; i < this.state.width;i++){
      var startSquare = i * this.state.width;
      rows.push(full.slice(startSquare, startSquare + this.state.width));
    }
    rows = rows.map(function(r){
	return <Row squares={r} />
     })
    console.log('l');
    return <div>{rows}</div>
  }
});

ReactDOM.render(
  <Board height={height} width={width}/>,
  document.getElementById('container')
)
