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
import TooltipComponent from './TooltipComponent'
import {strings} from '../utils/Strings';
import moment from 'moment';







export class Chart extends React.Component {



  constructor() {
      super();
      this.state = {nbDays: 1,
                    isChart:true,
                    isPortrait : Dimensions.get('window').width <= Dimensions.get('window').height
                  }
      // this.onSwipeLeft.bind(this);
      // this.onSwipeRight.bind(this);

      // this.props.navigation.setParams({fullsscreen: !this.state.isPortrait});


  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.nbDays === nextProps.nbDays && this.props.isPortrait === this.props.isPortrait
       && this.state.tooltipX === nextState.tooltipX) {
      return false;
    } else {
      return true;
    }
  }

  componentWillReceiveProps(newProps) {
      // this.setState({
      //     nbDays: newProps.nbDays,
      //     isPortrait: newProps.isPortrait
      // })

  }

  render() {
      return this.renderChart(this.props.data1, this.props.data2)
  }






  renderChart(data1, data2){

    var start = Date.now();




    data1_values = []
    data1_dates = []
    data2_values = []

    data1_indicators_dates = []
    data1_indicators_values = []
    data2_indicators_values = []

    data1_axis_dates = []

    data1_axis_values = []
    data2_axis_values = []



    let stepLine = 2 * this.state.nbDays
    let stepIndicators = 4 * this.state.nbDays
    let stepAxis = 16 * this.state.nbDays

    var value_min1 = 10000000
    var value_min2 = 10000000

    var value_max1 = 0
    var value_max2 = 0



    var index = 0;
    // data1_dates.push("sddsa")
    // data1_values.push(0)
    // data2_values.push(0)
    //
    // data1_indicators_dates.push("sddsa")
    // data1_indicators_values.push(0)
    // data2_indicators_values.push(0)

    for (var key in data1) {
        if(index % stepLine == 0){
           var timeFormatted  = moment(key,'DD/MM/YYYY HH:mm').format('DD/MM HH:mm');//moment(key).format()
           data1_dates.push(timeFormatted)
           data1_values.push(parseInt(data1[key]))
           data2_values.push(parseInt(data2[key]))



         if(index % stepLine == 0){
           data1_indicators_dates.push(timeFormatted)
           data1_indicators_values.push(parseInt(data1[key]))
           data2_indicators_values.push(parseInt(data2[key]))
         }

         if(index % stepAxis == 0){
           data1_axis_dates.push(timeFormatted)
           data1_axis_values.push(parseInt(data1[key]))
           data2_axis_values.push(parseInt(data2[key]))


         }

         if(parseInt(data1[key]) < value_min1){
            value_min1 = parseInt(data1[key])
            min1 = key
         }

         if(parseInt(data1[key]) > value_max1){
           value_max1 = parseInt(data1[key])
           max1 = key
         }

         if(parseInt(data2[key]) < value_min2){
           value_min2 = parseInt(data2[key])
           min2 = key
         }

         if(parseInt(data2[key]) > value_max2){
           value_max2 = parseInt(data2[key])
           max2 = key
         }



       }
       index++




         // console.log(min1+" "+max1)
    }

    all_data = data1_values.concat(data2_values)

    // data1_indicators_dates.push(max1)
    // data1_indicators_dates.unshift(min1)
    //
    // data1_indicators_values.push(value_max1)
    // data1_indicators_values.unshift(value_min1)
    //
    // data2_indicators_values.push(value_max2)
    // data2_indicators_values.unshift(value_min2)
    //
    // // console.log("max "+max1+" "+max2)
    // // console.log("data "+parseInt(data1[max1])+" "+parseInt(data2[max2]))
    //
    //
    // data1_axis_dates.push(max1)
    // data1_axis_dates.unshift(min1)
    //
    // data1_axis_values.push(value_max1)
    // data1_axis_values.unshift(value_min1)
    //
    // data2_axis_values.push(value_max2)
    // data2_axis_values.unshift(value_min2)


    // data1_axis_values.unshift(data1_values[min1])
    // data2_axis_values.unshift(data2_values[min2])






   baseHeight = 230
   range1 = value_max1 - value_min1
   range2 = value_max2 - value_min2

   console.log("range1 "+range1+" "+range2)


   range2Smaller = range2 < range1
   smallHeight = baseHeight * (range2Smaller ? (range2 / range1) : (range1 / range2))
   if(isNaN(smallHeight)){
      smallHeight = 0
   }





    // const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]

    const axesSvg = { fontSize: 10, fill: 'grey' };
    const axesXSvg = { fontSize: 10, fill: 'black', rotation: 90, originY:35,y:30};
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 100






   const screenWidth = Math.round(Dimensions.get('window').width);



   console.log('this.state.tooltipX '+this.state.tooltipX)
   console.log('this.state.tooltipY '+this.state.tooltipY)
    return( <View style={{ height: 370, padding: 20, flexDirection: 'row' }}>
              <YAxis
                  data={all_data}
                  style={{ marginBottom: xAxisHeight }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                  <View>
                      <LineChart
                          style={{height: baseHeight}}
                          data={data1_indicators_values}
                          contentInset={verticalContentInset}
                          svg={{ stroke: '#006600' }}>
                      </LineChart>

                      <TooltipComponent
                          marginTop={-baseHeight}
                          height={baseHeight}
                          tooltipX={this.state.tooltipX}
                          tooltipY={this.state.tooltipY}
                          dataX={data1_indicators_dates}
                          dataY={data1_indicators_values}
                          tooltipIndex={this.state.tooltipIndex}
                          color='#006600'
                          />

                  </View>
                  <XAxis
                      style={{ height: xAxisHeight}}
                      data={data1_axis_dates}
                      formatLabel={(index) => {return data1_axis_dates[index]}}
                      svg={axesXSvg}
                  />
              </View>
          </View>
      )
  }

  // onSwipeLeft() {
  //
  //   console.log('swipe left '+this.state.unitIndex)
  //   let units = this.props.navigation.getParam("units")
  //   if(this.state.unitIndex < units.length - 1){
  //       this.setUnit(this.state.unitIndex+1)
  //   }
  //
  // }
  //
  // onSwipeRight(gestureState) {
  //   console.log('swipe right '+this.state.unitIndex)
  //   if(this.state.unitIndex > 0){
  //       this.setUnit(this.state.unitIndex-1)
  //   }
  // }

  renderGrid(range2Smaller, stepAxis){
    const CustomGrid = ({x, y, data, ticks}) => (
        <G>
            {
                // Horizontal grid
                ticks.map(tick => (

                    <Line
                        key={tick}
                        x1={'0%'}
                        x2={'100%'}
                        y1={y(tick)}
                        y2={y(tick)}
                        stroke={'rgba(0,0,0,0.2)'}
                    />
                ))
            }
            {
                // Vertical grid
                data.map((value, index) => {
                    return <Line
                        key={index}
                        y1={'0%'}
                        y2={'100%'}
                        x1={x(index)}
                        x2={x(index)}
                        stroke={'rgba(0,0,0,0.2)'}
                        strokeDasharray={[2, 2]}
                    />
                })
            }
        </G>
    );
    return range2Smaller? <CustomGrid belowChart={true}/>: null
  }


}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#ccff32' },
  text: { margin: 6 },
  pickerContainer: {flexDirection:'row', alignItems:'center',justifyContent:'center',width: 300,height:40}
});




export default Chart
