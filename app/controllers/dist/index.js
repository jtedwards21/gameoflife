//First you have to check all the squares, creating a table to at last substitute for the old table
//Every round you will have to re-initialize the substitute table


var height = 6;
var width = 6;

var getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var setBoard = function(table){
  for(var i = 0; i < table.length; i++){
    var v = getRandomInt(0,2);
    table[i] = {value: v, number: i}
    
  }
  return table;
}







var Square = React.createClass({
  toggleState(){
    var n = this.props.number
    this.props.toggleState(n);
  },
  render() {
    var style;
    if(this.props.value == 1){
      style={backgroundColor: "red"}
    } else {
	style={backgroundColor: "black"}
    }
    return(
      <div>
        <div style={style} onClick={this.toggleState} className="square"></div>
      </div>
    )
  }
})




var Row = React.createClass({
  toggleState(n){
    this.props.toggleState(n);
  },
  render(){
    var squares = this.props.squares;
    var that = this;
    squares = squares.map(function(s){
	return <Square key={s.number} toggleState={that.toggleState} value={s.value} number={s.number} />
    })

    return(
      <div className="board-row">
        {squares}
      </div>
    )
  }
})




var Board = React.createClass({
  toggleState(n){
     console.log(n);
    
  },
  getTopSquare(i){
    var j = i - this.props.height;
    return this.state.table[j]
  },
  getBottomSquare(i){
    var j = i -this.props.height;
    return this.state.table[j]
  },
  checkSquare(i, table){
  //Check the number of neighbors
  var n = 0;
  var left = i - 1;
  var right = i + 1;
  var top = i - this.state.height;
  var bottom = i + this.state.height;
  var topRight = top + 1;
  var topLeft = top - 1;
  var bottomRight = bottom + 1;
  var bottomLeft = bottom - 1; 
  if(i%this.state.width !== 0){ if(table[left].value == 1){n++}}
  if(i%(this.state.width - 1) !== 0){if(table[right].value == 1){n++}}
  if(i-this.state.width >= 0 && i%this.state.width !== 0){if(table[topLeft].value == 1){n++}}
  if(i-this.state.width >= 0 && i%(this.state.width - 1) !== 0){if(table[topRight].value == 1){n++}}
  if(i+this.state.width < this.state.table.length && i%this.state.width !== 0){if(table[bottomLeft].value == 1){n++}}
  if(i+this.state.width < (this.state.table.length - 1) && i%(this.state.width - 1) !== 0){if(table[bottomRight].value == 1){console.log(i);n++}}
  if(i-this.state.width >= 0){if(table[top].value == 1){n++}}
  if(i+this.state.width < this.state.table.length){if(table[bottom].value == 1){n++}}
  if(table[i].value == 1){
    if(n < 2){return 0}
    if(n > 1 && n < 4){return 1}
    if(n > 3){return 0}
  }
  if(table[i].value == 0){
    if(n == 3){return 1}
    else{return 0}
  }
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
  refreshBoard(){
    var t = this.state.table;
    var newTable = this.state.table;
    for(var i = 0; i < t.length; i++){
	var result = this.checkSquare(i, t);
        newTable[i].value = result;
    }
    this.setState({table:newTable});
  },
  componentDidMount(){
    //setInterval(this.refreshBoard, this.state.interval);
  },
  getInitialState(){
    var t = this.makeArray(this.props.height,this.props.width);
    return{table: t, height: this.props.height, width: this.props.width, play:true, interval: 3000}
  },
  updateDimensions(h,w){
    var t = this.makeArray(h, w);
    this.setState({table: t, height: h, width: w, play:false})
  },
  start(){
  //Begin the Game Play true
  this.setState({play:true});
  },
  render(){
    var full = this.state.table;
    console.log(full);
    var rows = [];

    ///What's strange seems to be here
    for(var i = 0; i < this.state.width;i++){
      var startSquare = i * this.state.width;
      
      var endSquare = startSquare + Number(this.state.width)
      console.log(endSquare);
      rows.push(full.slice(startSquare, endSquare));
    }
    console.log(rows);
    var that = this;
    rows = rows.map(function(r, i){
	return <Row key={i} toggleState={that.toggleState} squares={r} />
     })
    if(this.state.play == false){rows = [];}
    return <div id="container"><DimensionsButtons start={this.start} updateDimensions={this.updateDimensions} /><div id="board">{rows}</div></div>
  }
});

//Props: UpdateDimensions method
var DimensionsButtons = React.createClass({
  getInitialState(){
    return{height: 6, width: 6}
  },
  start(){
    this.props.start();
  },
  setDimensions(){
    var h = this.state.height;
    var w = this.state.width;
    this.props.updateDimensions(h, w);
  },
  handleHeightChange(e){
    this.setState({height: e.target.value});
  },
  handleWidthChange(e){
    this.setState({width: e.target.value})
  },
  render(){return(
     <div>
	<label>Height</label><input type="text" onChange={this.handleHeightChange} value={this.state.height} />
	<label>Width</label><input type="text" onChange={this.handleWidthChange} value={this.state.width} />
	<div onClick={this.setDimensions} className="btn btn-large btn-default">Click</div>
	<div onClick={this.start} className="btn btn-large btn-default">Start</div>
     </div>)
  }
})

ReactDOM.render(
  <Board height={height} width={width}/>,
  document.getElementById('container')
)
