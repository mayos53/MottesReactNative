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
          tooltipIndex:null

      }
  }
  componentWillReceiveProps(newProps) {
      this.setState({
          tooltipX: newProps.tooltipX,
          tooltipY: newProps.tooltipY,
          tooltipIndex:newProps.tooltipIndex

      })

  }

  render() {

    return <LineChart
          style={{height: this.props.height, marginTop:this.props.marginTop}}
          data={this.props.dataY}
          svg={{ stroke: '#00000000' }}>
              <Tooltip
                  tooltipX={this.state.tooltipX}
                  tooltipY={this.state.tooltipY}
                  data2= {this.props.dataX}
                  index={this.state.tooltipIndex}
                  color='#006600'
                  />
              <Decorator strokeColor='#006600'
                         fillColor = '#8DB388'
                         onPress= {(index,value) =>


                                      this.setState({
                                        tooltipX: index,
                                        tooltipY: value,
                                        tooltipIndex: index,
                                        tooltipX2: null,
                                      })
                                    }

                             />
    </LineChart>


  }
}


const Decorator = ({ x, y, data, strokeColor, fillColor, onPress }) => {
        return data.map((value, index) => {
            return  <G width={20} height={20}
                onPress= {(event) => {
                    onPress(event,value)
                  }
                }>
              <Rect
                 key={ index }
                 x={ x(index) - 10 }
                 y={y(value)-10}
                 height={ 20 }
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
