import React, { Component } from 'react';
import { View, Image } from 'react-native'
//import FastImage from 'react-native-fast-image';
import Images from './assets/Images'
import Constants from './Constants'

export default class Brid extends Component{
    render(){
        //const width = this.props.body.bounds.max.x - this.props.body.bounds.min.x;
        //const height = this.props.body.bounds.max.y - this.props.body.bounds.min.y;
        // dont use as this will make the bird size change. we need resizeMode stretch what will make the bird flicker

        const width = Constants.BIRD_WIDTH;
        const height = Constants.BIRD_HEIGHT;
        
        
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        let image = Images['bird' + this.props.pose];

        return (
            <Image
                style={{
                    position: 'absolute',
                    top: y,
                    left: x,
                    width: width,
                    height: height
                }} 
                //resizeMode="stretch" // this will flicker
                source={image} />

        )
        
    }
}