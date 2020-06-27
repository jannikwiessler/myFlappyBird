import React, { Component } from 'react';
import { StyleSheet, Text, View , StatusBar, Alert, TouchableOpacity, Image} from 'react-native';
import Constants from './Constants';
import { GameEngine } from 'react-native-game-engine'
import Matter from 'matter-js';
import Bird from './Bird';
import Pipe1 from './Pipe1';
import Floor from './floor';
import Physics from './Physics';
import Images from './assets/Images';
// remember: there are no specific data types as strings doubles int....

export default class App extends Component {
  constructor(props){
    super(props);
    this.gameEngine = null;
    this.entities = this.setupWorld(); // entities get result of setupWorld

    this.state = {
      running: true,
    }
  }

  setupWorld = () => { // setupWorld is property with lambda expression: setupWorld itself becomes the method. () no paras to pass to fcn
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;
    world.gravity.y = 0.0;

    let bird = Matter.Bodies.rectangle(
        Constants.MAX_WIDTH / 2,
        Constants.MAX_HEIGHT / 2,
        Constants.BIRD_WIDTH,
        Constants.BIRD_HEIGHT
    );

    let floor1 = Matter.Bodies.rectangle( 
        Constants.MAX_WIDTH / 2, 
        Constants.MAX_HEIGHT - 50, 
        Constants.MAX_WIDTH + 4, 
        80, 
        { isStatic: true}
    );
    let floor2 = Matter.Bodies.rectangle( 
      Constants.MAX_WIDTH + Constants.MAX_WIDTH / 2, 
      Constants.MAX_HEIGHT - 50, 
      Constants.MAX_WIDTH + 4, 
      80, 
      { isStatic: true}
    );

    Matter.World.add(world, [bird, floor1, floor2]);

    Matter.Events.on(engine, "collisionStart", (event) =>{
      let pairs = event.pairs;

      this.gameEngine.dispatch({type: "game-over"}); 
    });

    return{ // retun the object with phyiscs, ...etc
      physics: { engine: engine, world: world},
      floor1: {body: floor1, renderer: Floor},
      floor2: {body: floor2, renderer: Floor},
      bird: { body: bird, pose: 1, renderer: Bird },
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
        <Image source={Images.backgroundNight} style={styles.backgroundImage} resizeMode="stretch" />
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
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT
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
