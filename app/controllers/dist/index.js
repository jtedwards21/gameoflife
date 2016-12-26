//First you have to check all the squares, creating a table to at last substitute for the old table
//Every round you will have to re-initialize the substitute table


var size = 6;

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
    var j = i - this.state.size;
    return this.state.table[j]
  },
  getBottomSquare(i){
    var j = i -this.state.size;
    return this.state.table[j]
  },
  checkSquare(i, table){
  //Check the number of neighbors
  var n = 0;
  var left = i - 1;
  var right = i + 1;
  var top = i - this.state.size;
  var bottom = i + this.state.size;
  var topRight = top + 1;
  var topLeft = top - 1;
  var bottomRight = bottom + 1;
  var bottomLeft = bottom - 1; 
  if(i%this.state.size !== 0){ if(table[left].value == 1){n++}}
  if(i%(this.state.size - 1) !== 0){if(table[right].value == 1){n++}}
  if(i-this.state.size >= 0 && i%this.state.size !== 0){if(table[topLeft].value == 1){n++}}
  if(i-this.state.size >= 0 && i%(this.state.size - 1) !== 0){if(table[topRight].value == 1){n++}}
  if(i+this.state.size < this.state.table.length && i%this.state.size !== 0){if(table[bottomLeft].value == 1){n++}}
  if(i+this.state.size < (this.state.table.length - 1) && i%(this.state.size - 1) !== 0){if(table[bottomRight].value == 1){console.log(i);n++}}
  if(i-this.state.size >= 0){if(table[top].value == 1){n++}}
  if(i+this.state.size < this.state.table.length){if(table[bottom].value == 1){n++}}
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
    if(this.state.play == true){
      var t = this.state.table;
      var newTable = this.state.table;
      for(var i = 0; i < t.length; i++){
	  var result = this.checkSquare(i, t);
          newTable[i].value = result;
      }
      this.setState({table:newTable});
    }
  },
  componentDidMount(){
    setInterval(this.refreshBoard, this.state.interval);
  },
  getInitialState(){
    var t = this.makeArray(this.props.size, this.props.size);
    return{widgetSize: this.props.size, table: t, size: this.props.size, play:true, interval: 400}
  },
  handleSizeChange(e){
    this.setState({widgetSize: e.target.value});
  },
  start(){
    this.setState({play:true});
  },
  stop(){
    this.setState({play:false});
  },
  reset(){
    var t = this.makeArray(this.state.widgetSize, this.state.widgetSize);
    this.setState({size: this.state.widgetSize, table: t, play: false});
  },
  render(){
    var full = this.state.table;
    var rows = [];

    for(var i = 0; i < this.state.size;i++){
      var startSquare = i * this.state.size;
      
      var endSquare = startSquare + Number(this.state.size)
      console.log(endSquare);
      rows.push(full.slice(startSquare, endSquare));
    }

    var that = this;

    rows = rows.map(function(r, i){
	return <Row key={i} toggleState={that.toggleState} squares={r} />
     })


    var dimensions = <Dimensions widgetSize={this.state.widgetSize}  handleSizeChange={this.handleSizeChange} />
    var buttonContainer = <ButtonContainer play={this.state.play}　stop={this.stop}  reset={this.reset} start={this.start}/>
    return (
	      <div id="container">
	        {dimensions}{buttonContainer}
	        <div id="board">{rows}</div>
	      </div>
    )
  }
});


var Dimensions = React.createClass({
  getInitialState(){
    return{height: 6, width: 6}
  },
  render(){
	return (
        <div id="dimensions">
	  <label>Size:</label><input type="text" onChange={this.props.handleSizeChange} value={this.props.widgetSize} />
        </div>
            )
  }
})

var ButtonContainer = React.createClass({
  getInitialState(){
    return {}
  },
  handleClick(){
    if(this.props.play == true){
      this.props.stop();
    }
    else if(this.props.play == false){
	this.props.start();
    }
  },
  render(){
    var buttonText;
    if(this.props.play == true) {buttonText = "Stop"}
    else if(this.props.play == false) {buttonText = "Start"}
    return (
	<div id="buttonContainer">
	  <div onClick={this.handleClick} className="btn btn-large btn-default">{buttonText}</div>
	  <div onClick={this.props.reset} className="btn btn-large btn-default">Reset</div>
	</div>
    )
  }
});

ReactDOM.render(
  <Board size={size} />,
  document.getElementById('container')
)
