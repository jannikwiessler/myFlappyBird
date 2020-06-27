import React, { Component } from 'react';
import { StyleSheet, Text, View , StatusBar, Alert, TouchableOpacity} from 'react-native';
import Constants from './Constants';
import { GameEngine } from 'react-native-game-engine'
import Matter from 'matter-js';
import Bird from './Bird';
import Wall from './Wall';
import Floor from './floor';
import Physics from './Physics';
// remember: there are no specific data types as strings doubles int....

export const randomBeetween = (min, max) => {
  return Math.floor(Math.random() * (max - min +1) + min);
}

export const generatePipes = () => {
  let topPipeHeight = randomBeetween(100, Constants.MAX_HEIGHT / 2 - 100);
  let bottomPipeHeight = Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE;

  let sizes = [topPipeHeight, bottomPipeHeight];

  if (Math.random() < 0.5){
    sizes = sizes.reverse();
  }

  return sizes;

}

export default class App extends Component {
  constructor(props){
    super(props);
    this.gameEngine = null;
    this.entities = this.setupWorld(); // entities get result of setupWorld

    this.state = {
      running: true
    }

  }

  setupWorld = () => { // setupWorld is property with lambda expression: setupWorld itself becomes the method. () no paras to pass to fcn
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;

    let bird = Matter.Bodies.rectangle(Constants.MAX_WIDTH/4, Constants.MAX_HEIGHT / 2, 50, 50);
    let floor = Matter.Bodies.rectangle( Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 50, Constants.MAX_WIDTH, 50, { isStatic: true});
    let ceiling = Matter.Bodies.rectangle( Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true});

    let [pipe1Height, pipe2Height] = generatePipes();
    let pipe1 = Matter.Bodies.rectangle( Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2), pipe1Height / 2, Constants.PIPE_WIDTH, pipe1Height, { isStatic: true});
    let pipe2 = Matter.Bodies.rectangle( Constants.MAX_WIDTH - (Constants.PIPE_WIDTH / 2), Constants.MAX_HEIGHT - (pipe2Height / 2), Constants.PIPE_WIDTH, pipe2Height, { isStatic: true});

    let [pipe3Height, pipe4Height] = generatePipes();
    let pipe3 = Matter.Bodies.rectangle( Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2), pipe3Height / 2, Constants.PIPE_WIDTH, pipe3Height, { isStatic: true});
    let pipe4 = Matter.Bodies.rectangle( Constants.MAX_WIDTH * 2 - (Constants.PIPE_WIDTH / 2), Constants.MAX_HEIGHT - (pipe4Height / 2), Constants.PIPE_WIDTH, pipe4Height, { isStatic: true});

    Matter.World.add(world, [bird, floor, ceiling, pipe1, pipe2, pipe3, pipe4]);

    Matter.Events.on(engine, "collisionStart", (event) =>{
      let pairs = event.pairs;

      this.gameEngine.dispatch({type: "game-over"}); 
    });

    return{ // retun the object with phyiscs, ...etc
      physics: { engine: engine, world: world },
      bird: { body: bird, size: [50, 50], color: 'red', renderer: Bird },
      floor: {body: floor, size: [Constants.MAX_WIDTH, 50], color: 'green', renderer: Wall},
      ceiling: {body: ceiling, size: [Constants.MAX_WIDTH, 50], color: 'green', renderer: Wall},
      pipe1: {body: pipe1, size: [Constants.PIPE_WIDTH, pipe1Height], color: 'green', renderer: Wall},
      pipe2: {body: pipe2, size: [Constants.PIPE_WIDTH, pipe2Height], color: 'green', renderer: Wall},
      pipe3: {body: pipe3, size: [Constants.PIPE_WIDTH, pipe3Height], color: 'green', renderer: Wall},
      pipe4: {body: pipe4, size: [Constants.PIPE_WIDTH, pipe4Height], color: 'green', renderer: Wall}
    }
  }

  onEvent = (e) => {
    if (e.type == "game-over"){
      this.setState({
        running: false
      })
    }
  }

  reset = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => { this.gameEngine = ref; }}
          style = {styles.gameContainer}
          systems = {[Physics]}
          running =  {this.state.running}
          onEvent = {this.onEvent}
          entities = {this.entities}>
          <StatusBar hidden = {true}/>
        </GameEngine>
        {!this.state.running && <TouchableOpacity onPress={this.reset} style={styles.fullscreenButton}>
          <View style={styles.fullScreen}>
            <Text style={styles.gameOverText}>Game Over</Text> 
          </View>
        </TouchableOpacity>
        }
      </View>
    ) 
  }
}

// curly brackets creats anonym objects which do not have class - kind of structs !
const styles = StyleSheet.create({ // global in this app.js file (a js file is called 'module')
  container: { 
    flex: 1,
    backgroundColor: '#ffff',
  //  alignItems: 'center',
  //  justifyContent: 'center',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  fullscreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameOverText: {
    color: 'white',
    fontSize: 48
  }
});
