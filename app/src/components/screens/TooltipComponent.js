import React from 'react';
import { Picker, ScrollView, StyleSheet, Text, TextInput, View, Button, FlatList,TouchableOpacity } from 'react-native';
import { sizeWidth,sizeHeight} from '../utils/Size';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMeasurements } from "../redux/measurements/MeasurementsAction";
import { Table, Row, Rows } from 'react-native-table-component';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import {Svg, G, Line, Circle, Path, Rect } from 'react-native-svg'
import {Dimensions,Image} from "react-native";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Tooltip from './Tooltip'
import {strings} from '../utils/Strings';
import moment from 'moment';







export class TooltipComponent extends React.Component {


  constructor() {
      super();
      this.state={
          tooltipX: null,
          tooltipY: null,
          tooltipIndex:null,
          dataIndex:0,
          width:1,
          height:1

      }
  }
  // componentWillReceiveProps(newProps) {
  //     this.setState({
  //         tooltipX: newProps.tooltipX,
  //         tooltipY: newProps.tooltipY,
  //         tooltipIndex:newProps.tooltipIndex
  //
  //     })
  //
  // }

  render() {
    const verticalContentInset = { top: 10, bottom: 10 }
    const tooltipWidth = 110
    const tooltipHeight= 22

    var offsetX = 0
    var offsetY = 0
    if(this.state.x+tooltipWidth > this.state.width){
        --offsetX
    }

    if(this.state.y + tooltipHeight > this.state.height){
       --offsetY
    }

    return   <View style={{position:'absolute',height: this.props.height, left:0,right:0}}
                   onLayout={(event) =>{
                            this.setState({width: event.nativeEvent.layout.width,
                                           height: event.nativeEvent.layout.height
                                          })
                          }}>

                          <Svg width={this.state.width} height={this.state.height}>
                              <Rect
                                 x={0}
                                 y={0}
                                 height={this.state.height}
                                 width={this.state.width}
                                 fill={ '#00000000' }
                                 onPress= {(event) => {
                                     let res = this.findClosestPoint(event.nativeEvent.locationX, event.nativeEvent.locationY)
                                     this.setState(res)
                                   }
                                 }
                                 />

                                 <Tooltip
                                        x = {this.state.x}
                                        y = {this.state.y}
                                        width = {tooltipWidth}
                                        height = {tooltipHeight}
                                        offsetX= {offsetX}
                                        offsetY= {offsetY}
                                        tooltipX={this.state.tooltipX}
                                        tooltipY={this.state.tooltipY}
                                        data2= {this.props.dataX}
                                        index={this.state.tooltipIndex}
                                        color={this.props.colors[this.state.dataIndex]}
                                 />
                            </Svg>



               </View>

  }

  findClosestPoint(x, y){

    var index = Math.round(x * this.props.dataX.length / this.state.width)
    var value = y

    let range = 5

    // var startIndex = index - range/2 < 0 ? 0: (index - range/2)
    // var endIndex = index + range/2 > this.props.dataX.length - 1 ? this.props.dataX.length-1:(index + range/2)
    var minDistance = 100000
    var minIndex = -1
    var dataIndex = 0

    var indices = []

    indices[0] = index
    var i = 0;
    while(i<range/2){
      if(i> 0){
       indices[i] = index - i
      }
       if(i< this.props.dataX.length - 1){
         indices[i+1] = index + i
       }
     i++
    }
    for(var k=0;k<=indices.length;k++){
      i = indices[k]
      for(var j=0;j<this.props.dataY.length;j++){
          if(this.props.chart_displayed[j]){
            var value_calculated = this.props.value_maxs[j] - (value - this.props.margins[j]) / this.props.factors[j]
            var distance = Math.abs(this.props.dataY[j][i] - value_calculated)
            var threshold = 40/this.props.factors[j]
            if(distance < threshold && value_calculated >= this.props.value_mins[j] && value_calculated <= this.props.value_maxs[j] && distance < minDistance){
               minDistance = distance
               dataIndex = j
               minIndex = i
          }
        }
      }
    }
    let verticalContentInset = 0

  return  minIndex >=0 ?
          {
            tooltipX : minIndex,
            tooltipY : this.props.dataY[dataIndex][minIndex],
            x: minIndex * this.state.width / this.props.dataX.length,
            y: (this.props.value_maxs[dataIndex] - this.props.dataY[dataIndex][minIndex]) * this.props.factors[dataIndex] + this.props.margins[dataIndex] + verticalContentInset ,
            tooltipIndex: minIndex,
            dataIndex: dataIndex
          }:{
            tooltipX : null,
            tooltipY : null,
            tooltipIndex: null,
            dataIndex: null
          }



  }
}




const Decorator = ({ x, y, data, strokeColor, fillColor, onPress }) => {
        return data.map((value, index) => {
            return  <G width={20} height={baseHeight}
                onPress= {(event) => {
                    onPress(index, event.nativeEvent.locationY)
                  }
                }>
              <Rect
                 key={ index }
                 x={ x(index) - 10 }
                 y={0}
                 height={ baseHeight }
                 width={20}
                 fill={ '#00000000' }


             />




            </G>


        })
    }





const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#ccff32' },
  text: { margin: 6 },
  pickerContainer: {flexDirection:'row', alignItems:'center',justifyContent:'center',width: 300,height:40}
});

export default TooltipComponent;
