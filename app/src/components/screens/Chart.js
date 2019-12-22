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

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.nbDays === nextProps.nbDays && this.props.isPortrait === this.props.isPortrait) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  componentWillReceiveProps(newProps) {
      // this.setState({
      //     nbDays: newProps.nbDays,
      //     isPortrait: newProps.isPortrait
      // })

  }

  render() {
      return this.renderChart(this.props.data)
  }






  renderChart(data){

    var start = Date.now();




    data_values = []
    var data_indicator_values = []
    var data_indicator_dates =[]

    data_dates = []
    // data2_values = []

    // data1_indicators_dates = []
    // data1_indicators_values = []
    // data2_indicators_values = []
    //
     data_axis_dates = []
    //
    // data1_axis_values = []
    // data2_axis_values = []

    var indic = this.state.isPortrait ? 50 : 100
    var axis = this.state.isPortrait ? 10 : 20



    let stepLine = 1
    let stepIndicators = Math.round(Math.max(1,Object.keys(data[0].data).length/indic))
    let stepAxis = Math.round(Math.max(1,Object.keys(data[0].data).length/axis))


     // let stepLine = 1 * this.state.nbDays
     // let stepIndicators = 2 * this.state.nbDays
     // let stepAxis = 8 * this.state.nbDays > 10

    value_mins=[]
    value_maxs=[]

    for( i=0;i<data.length;i++){
      value_mins.push(100000000)
      value_maxs.push(-100000)
      data_values.push([])
      data_indicator_values.push([])

    }

    // var value_min1 = 10000000
    // var value_min2 = 10000000
    //
    // var value_max1 = 0
    // var value_max2 = 0



    var index = 0;
    // data1_dates.push("sddsa")
    // data1_values.push(0)
    // data2_values.push(0)
    //
    // data1_indicators_dates.push("sddsa")
    // data1_indicators_values.push(0)
    // data2_indicators_values.push(0)

    for (var key in data[0].data) {
      var timeFormatted  = moment(key,'DD/MM/YYYY HH:mm').format('DD/MM HH:mm');//moment(key).format()
        if(index % stepLine == 0){
           data_dates.push(timeFormatted)
           for( i=0;i<data.length;i++){
              data_values[i].push(parseInt(data[i].data[key]))
              if(parseInt(data[i].data[key]) < value_mins[i]){
                 value_mins[i] = parseInt(data[i].data[key])
              }else if(parseInt(data[i].data[key]) >= value_maxs[i]){
                value_maxs[i] = parseInt(data[i].data[key])
              }
           }






         // if(index % stepLine == 0){
         //   data1_indicators_dates.push(timeFormatted)
         //   data1_indicators_values.push(parseInt(data1[key]))
         //   data2_indicators_values.push(parseInt(data2[key]))
         // }
         //
         // if(index % stepAxis == 0){
         //   data1_axis_dates.push(timeFormatted)
         //   data1_axis_values.push(parseInt(data1[key]))
         //   data2_axis_values.push(parseInt(data2[key]))
         //
         //
         // }

         // if(parseInt(data1[key]) < value_min1){
         //    value_min1 = parseInt(data1[key])
         //    min1 = key
         // }
         //
         // if(parseInt(data1[key]) > value_max1){
         //   value_max1 = parseInt(data1[key])
         //   max1 = key
         // }
         //
         // if(parseInt(data2[key]) < value_min2){
         //   value_min2 = parseInt(data2[key])
         //   min2 = key
         // }
         //
         // if(parseInt(data2[key]) > value_max2){
         //   value_max2 = parseInt(data2[key])
         //   max2 = key
         // }



       }

       if(index % stepAxis == 0){
         data_axis_dates.push(timeFormatted)
         // data1_axis_values.push(parseInt(data1[key]))
         // data2_axis_values.push(parseInt(data2[key]))
       }

       if(index % stepIndicators == 0){
         data_indicator_dates.push(timeFormatted)
         for( i=0;i<data.length;i++){
            data_indicator_values[i].push(parseInt(data[i].data[key]))
         }
       }


       index++




         // console.log(min1+" "+max1)
    }

    baseHeight = this.state.isPortrait? 230: Dimensions.get('window').height - 170
    margins = []
    heights = []
    factors = []

    min = value_mins[0]
    max = value_maxs[0]
    for(i=0;i<value_mins.length;i++){
       if(value_mins[i] < min){
          min = value_mins[i]
       }else if(value_maxs[i] >= max){
          max = value_maxs[i]
       }

    }

    var total_range = max - min
    for(i=0;i<value_mins.length;i++){
        range = value_maxs[i] - value_mins[i]
        factors[i] = baseHeight/total_range
        heights[i] = range * factors[i]
        margins[i] = (max - value_maxs[i]) * factors[i]
    }



    // var range1 = value_max1 - value_min1
    // var range2 = value_max2 - value_min2
    //
    // var min = value_min1 < value_min2 ? value_min1 : value_min2
    // var max = value_max1 < value_max2 ? value_max2 : value_max1
    //
    //
    // console.log("range1 "+range1+" "+range2)
    //
    // var height1 = baseHeight * range1 /total_range
    // var height2 = baseHeight * range2 /total_range
    //
    // var marginTop1    = (max - value_max1) * baseHeight / total_range
    // var marginTop2    = (max - value_max2) * baseHeight / total_range



    all_data = [min,max]

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









   // range2Smaller = range2 < range1
   // smallHeight = baseHeight * (range2Smaller ? (range2 / range1) : (range1 / range2))
   // if(isNaN(smallHeight)){
   //    smallHeight = 0
   // }


   colors = []
   for(i=0;i<data.length;i++){
     colors.push(data[i].color)
   }





    // const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]

    const axesSvg = { fontSize: 10, fill: 'black' };
    const axesXSvg = { fontSize: 10, fill: 'black', rotation: 90, originY:35,y:30};
    const verticalContentInset = { top: 3, bottom: 3 }
    const horizontalContentInset = { left: 0, right: 0 }

    const xAxisHeight = 70






   const screenWidth = Math.round(Dimensions.get('window').width);





   str = []

   for(i=0;i<data.length;i++){
     if(this.props.chart_displayed[i]){
       str.push(<LineChart
                       style={{position:'absolute', height: heights[i],left:0, right:0, top: margins[i]}}
                       data={data_values[i]}
                       contentInset={verticalContentInset}
                       svg={{ stroke: colors[i] , strokeWidth:2}}>
                       <Decorator
                         strokeColor = {colors[i]}
                         fillColor = {'#FFFFFFFF'}
                         stepIndicators = {stepIndicators}
                       />
                   </LineChart>)
    }
   }

   var grid_data = []
   for(var i=0;i<data_axis_dates.length;i++){
     grid_data[i] = min + (max - min) * Math.random()
   }


    return( <View style={{ height: baseHeight + 110, padding: 20, flexDirection: 'row' }}
                          onLayout={(event) =>{
                            let isPortrait = Dimensions.get('window').width < Dimensions.get('window').height
                            // this.props.navigation.setParams({header: null});
                            this.setState({  isPortrait : isPortrait})
                          }}>
              <YAxis
                  data={all_data}
                  style={{ marginBottom: xAxisHeight }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={{ flex: 1}}>
                      {str}
                      <LineChart
                                      style={{position:'absolute', height: baseHeight,left:0, right:0, top: 0}}
                                      data={grid_data}
                                      contentInset={verticalContentInset}
                                      svg={{ stroke: '#00000000' }}>
                                      {this.renderGrid()}

                       </LineChart>

                      <TooltipComponent
                          style={{position:'absolute', height: baseHeight, left:0, right:0,top: 0}}
                          height={baseHeight}
                          dataX={data_indicator_dates}
                          dataY={data_indicator_values}
                          margins = {margins}
                          value_mins = {value_mins}
                          value_maxs = {value_maxs}
                          factors = {factors}
                          heights = {heights}
                          colors= {colors}
                          />



                  </View>
                  <XAxis
                      style={{ height: xAxisHeight}}
                      data={data_axis_dates}
                      formatLabel={(index) => {return data_axis_dates[index]}}
                      contentInset={horizontalContentInset}
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

  renderGrid(stepAxis){
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
    return <CustomGrid belowChart={true}/>
  }


}

const Decorator = ({ x, y, data, strokeColor, fillColor, stepIndicators }) => {
        return data.map((value, index) => {
            return  index % stepIndicators == 0 ? <Circle
                  key={ index }
                  cx={ x(index) }
                  cy={ y(value) }
                  r={ 1.5 }
                  stroke={ strokeColor }
                  fill={ fillColor }


              />:null



        })
    }



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#ccff32' },
  text: { margin: 6 },
  pickerContainer: {flexDirection:'row', alignItems:'center',justifyContent:'center',width: 300,height:40}
});




export default Chart
