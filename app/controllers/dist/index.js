//First you have to check all the squares, creating a table to at last substitute for the old table
//Every round you will have to re-initialize the substitute table


var size = 8;

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
    var thisClass;
    if(this.props.value == 1){
      thisClass="square square-on"
    } else {
	thisClass="square square-off"
    }
    return(
      <div>
        <div onClick={this.toggleState} className={thisClass}></div>
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
     var t = this.state.table.slice();
     var square = this.state.table[n];
     if(square.value == 1){
	square.value = 0;
     }
     else if (square.value == 0){
	square.value = 1;
     }
     t[square.number] = square;
     this.setState({table:t});
    
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
  if(i+this.state.size < (this.state.table.length - 1) && i%(this.state.size - 1) !== 0){if(table[bottomRight].value == 1){n++}}
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
      this.setState({table:newTable, generation: this.state.generation + 1});
    }
  },
  componentDidMount(){
    setInterval(this.refreshBoard, this.state.interval);
  },
  getInitialState(){
    var t = this.makeArray(this.props.size, this.props.size);
    return{widgetSize: this.props.size, table: t, size: this.props.size, play:true, interval: 400, generation: 0}
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
    this.setState({size: this.state.widgetSize, table: t, play: false, generation: 0});
  },
  clearBoard(){
    this.setState({play:false});
    var table = [];
    var nOfCells = size*size;
    while(nOfCells > 0){
      table.push(0)
      nOfCells = nOfCells-1
    }
    table = table.map(function(c, i){
      var square = {};
      square.number = i;
      square.value = c;
      return square;
    });
    this.setState({table: table, generation:0});
  },
  render(){
    var full = this.state.table;
    var rows = [];

    for(var i = 0; i < this.state.size;i++){
      var startSquare = i * this.state.size;
      
      var endSquare = startSquare + Number(this.state.size)
      rows.push(full.slice(startSquare, endSquare));
    }

    var that = this;

    rows = rows.map(function(r, i){
	return <Row key={i} toggleState={that.toggleState} squares={r} />
     })


    var dimensions = <Dimensions widgetSize={this.state.widgetSize}  handleSizeChange={this.handleSizeChange} />
    var buttonContainer = <ButtonContainer play={this.state.play}　clearBoard={this.clearBoard} stop={this.stop}  reset={this.reset} start={this.start}/>
    var generationCounter = <GenerationCounter value={this.state.generation} />
    return (
	      <div id="container">
	        <div id="board">{rows}</div>
	        <div id="controls">{dimensions}{buttonContainer}{generationCounter}</div>
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

var GenerationCounter = React.createClass({
  getInitialState(){
    return {};
  },
  render(){
    return (
	<div id="generation-counter">
	  <div>Generations:</div>
	　　<div>{this.props.value}</div>
	</div>
    )
  }
});

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
	  <div onClick={this.handleClick} className="my-btn">{buttonText}</div>
	  <div onClick={this.props.reset} className="my-btn">Reset</div>
	  <div onClick={this.props.clearBoard} className="my-btn">Clear</div>
	</div>
    )
  }
});

ReactDOM.render(
  <Board size={size} />,
  document.getElementById('content')
)
