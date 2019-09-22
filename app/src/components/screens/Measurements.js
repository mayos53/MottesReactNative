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
import Chart from './Chart'

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

    return <Chart data1={data1}
                  data2={data2}
                  nbDays = {this.state.nbDays}
                  isPortrait= {this.state.isPortrait}/>


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
        this.setState({unitId: units[index].unit_id, unitIndex:index, tooltipX:undefined, tooltipY:undefined, tooltipX2:undefined, tooltipY2:undefined},
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
