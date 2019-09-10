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







export class Measurements extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? '': navigation.state.params.title,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

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
    this.setUnit(this.props.navigation.getParam("unit_index"))
  }

  componentWillReceiveProps(newProps) {


  }

  render() {


    console.log("loading "+this.props.loading)
    data1 = null
    data2 = null
    if(this.props.data != null && !Array.isArray(this.props.data.data)){
        data1 = this.props.data.data["1"].data;
        data2 = this.props.data.data["2"].data;
    }
    return  <View onLayout={(event) =>{
                            let isPortrait = Dimensions.get('window').width < Dimensions.get('window').height
                            // this.props.navigation.setParams({header: null});
                            this.setState({  isPortrait : isPortrait})
                          }}>
               {this.renderHeader()}
               {this.props.loading?
                    this.renderLoading():
                      ((data1 == null || data2 == null)?
                          null :
                          (this.state.isChart?
                              this.renderChart(data1, data2):
                              this.renderTable(data1, data2)))}
               {this.renderUnitsChooser()}
             </View>

  }

  fetchMeasurements(){
    this.props.getMeasurements(this.state.unitId, this.state.nbDays);
  }

  renderHeader(){
    return this.state.isPortrait ? <View style={{flex:1, flexDirection:"row", marginTop:10, marginBottom:30}}>
        {this.renderPicker()}
        {this.renderChooseView()}
     </View> : null
  }



  renderLoading(){
    return <Text>Loading</Text>
  }

 renderTable(data1, data2){
    keys = []
    for (var key in data1) {
       keys.push(key)
    }

    rows = []
    keys.forEach(function(key) {
        rows.push([key, data1[key], data2[key]] )
    })
    var head = ['Date and time','1\n15cm.','2\n30cm.']
    return (
        <View style={{height:370, marginBottom:20, marginTop:20}}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#000000'}}>
              <Row data={head} style={styles.head} textStyle={styles.text}/>
            </Table>
            <ScrollView>
            <Table borderStyle={{borderWidth: 1, borderColor: '#000000  '}}>
              <Rows data={rows.reverse()} textStyle={styles.text}/>
            </Table>
          </ScrollView>
        </View>
      )
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

    const Decorator = ({ x, y, data, strokeColor, fillColor, onPress }) => {
            return data.map((value, index) => {
                return  <G width={20} height={20}
                    onPress= {
                      () =>
                      {
                        onPress(index,value)
                      }
                    }>
                  <Rect
                     key={ index }
                     x={ x(index) - 10 }
                     y={ y(value) - 10}
                     height={ 20 }
                     width={20}
                     fill={ '#00000000' }


                 />
                  <Circle
                      key={ index }
                      cx={ x(index) }
                      cy={ y(value) }
                      r={ 2 }
                      stroke={ strokeColor }
                      fill={ fillColor }


                  />

                </G>


            })
        }




   const screenWidth = Math.round(Dimensions.get('window').width);




    return(
          <View style={{ height: 370, padding: 20, flexDirection: 'row' }}>
              <YAxis
                  data={all_data}
                  style={{ marginBottom: xAxisHeight }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                  <View>


                      <LineChart
                          style={{height: range2Smaller? baseHeight: smallHeight}}
                          data={data1_axis_values}
                          contentInset={verticalContentInset}
                          svg={{ stroke: '#00000000' }}>
                          {this.renderGrid(range2Smaller, stepAxis)}
                      </LineChart>

                      <LineChart
                          style={{height: range2Smaller? baseHeight: smallHeight, marginTop:-(range2Smaller? baseHeight: smallHeight)}}
                          data={data2_axis_values}
                          contentInset={verticalContentInset}
                          svg={{ stroke: '#00000000' }}>
                          {this.renderGrid(!range2Smaller, stepAxis)}
                      </LineChart>

                      <LineChart
                          style={{height: range2Smaller? baseHeight: smallHeight, marginTop:-(range2Smaller? baseHeight: smallHeight)}}
                          data={data1_indicators_values}
                          contentInset={verticalContentInset}
                          svg={{ stroke: '#006600' }}
                      >
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
                          <Tooltip
                              tooltipX={this.state.tooltipX}
                              tooltipY={this.state.tooltipY}
                              data2={data1_indicators_dates}
                              index={this.state.tooltipIndex}
                              color='#006600'
                              />

                      </LineChart>




                        <LineChart
                            pointerEvents='none'
                            style={{height: range2Smaller? baseHeight: smallHeight, marginTop:-(range2Smaller? baseHeight: smallHeight)}}
                            data={data2_indicators_values}
                            contentInset={verticalContentInset}
                            svg={{ stroke: '#56FF78' }}
                        >
                                <Decorator
                                   strokeColor='#56FF78'
                                   fillColor = '#CDFFD1'
                                   onPress= {(index,value) =>
                                            this.setState({
                                              tooltipX2: index,
                                              tooltipY2: value,
                                              tooltipIndex2: index,
                                              tooltipX: null,
                                            })
                                          }

                                   />
                              <Tooltip
                                tooltipX={this.state.tooltipX2}
                                tooltipY={this.state.tooltipY2}
                                data2={data1_indicators_dates}
                                index={this.state.tooltipIndex2}
                                color='#56FF78'

                                />

                        </LineChart>




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

  renderUnitsChooser(){

    let units = this.props.navigation.getParam("units")
    let data = units.map( (unit) => {
            return <Picker.Item key={unit.unit_id} value={unit.unit_id} label={unit.unit_full_name} />
        });

      return        <Picker
            style ={{alignSelf:'center', marginTop: 20, height: 50, width: 300 }}
            selectedValue={this.state.unitId}
            onValueChange={(itemValue, itemIndex) => {
                         this.setUnit(itemIndex)
                    }}>

            {data}


        </Picker>

  }

  setUnit(index){
    if(this.state.unitIndex != index){
        let units = this.props.navigation.getParam("units")
        this.props.navigation.setParams({title: units[index].unit_full_name})
        this.setState({unitId: units[index].unit_id, unitIndex:index, tooltipX:undefined, tooltipX2:undefined},
        () => {
            this.fetchMeasurements()
          })
    }
  }



  renderPicker(){
    return (<View style = {styles.pickerContainer}>
        <Picker
         selectedValue={this.state.nbDays}
         style={{height: 50, width: 90}}
         onValueChange={(itemValue, itemIndex) =>{
                  this.setState({nbDays: itemValue, tooltipX:undefined },()=>{
                      this.fetchMeasurements()
                    })
              }
         }>
             <Picker.Item label="1" value="1" />
             <Picker.Item label="3" value="3" />
             <Picker.Item label="6" value="6" />
             <Picker.Item label="10" value="10" />
             <Picker.Item label="14" value="14" />

         </Picker>
         <Text>{strings.days}</Text>
    </View>)
  }

  renderChooseView(){
    var text = this.state.isChart? strings.table : strings.chart
    var icon = this.state.isChart? require('../../../res/images/table.png') :
                                   require('../../../res/images/graph.png')
    return <TouchableOpacity style={{flex:1, alignItems:'center', width:80, height:40}} onPress= {()=>{
            this.setState({isChart: !this.state.isChart}
            )
        }}>
                <Image source={icon} ></Image>
                <Text> {text} </Text>
          </TouchableOpacity>
  }

}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#ccff32' },
  text: { margin: 6 },
  pickerContainer: {flexDirection:'row', alignItems:'center',justifyContent:'center',width: 300,height:40}
});


const mapStateToProps = state => ({
  data: state.measurements.data,
  loading: state.measurements.loading,
  error: state.measurements.error
});

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({getMeasurements}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Measurements)
