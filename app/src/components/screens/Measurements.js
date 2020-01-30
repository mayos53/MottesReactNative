import React from 'react';
import { Picker, ScrollView, StyleSheet, Text, TextInput, View, Button, FlatList,TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { sizeWidth,sizeHeight,width} from '../utils/Size';
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
import * as Progress from 'react-native-progress';








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
      this.state = {nbDays: 6,
                    isChart:true,
                    isPortrait : Dimensions.get('window').width <= Dimensions.get('window').height,
                    chart_displayed:[],
                    offsetDays:0
                  }
      // this.onSwipeLeft.bind(this);
      // this.onSwipeRight.bind(this);

      // this.props.navigation.setParams({fullsscreen: !this.state.isPortrait});


  }

  componentDidMount() {
    this.setUnit(this.props.navigation.getParam("unit_index"))
  }

  componentWillReceiveProps(newProps) {
    chart_displayed = []
    if(newProps.data != null && !Array.isArray(newProps.data.data)){
      for(var d in newProps.data.data){
        chart_displayed.push(true)
      }
    }
    this.setState({chart_displayed:chart_displayed})

  }

  render() {

    console.log("loading "+this.props.loading)
    data = []
    var colors = ['#006601','#5CFF82', '#023399','#128DD9', '#986601','#FFCC02','#FF3400','#9933CC','#000000','#000000']

    if(this.props.data != null && !Array.isArray(this.props.data.data)){
      let nbData = Object.keys(this.props.data.data).length;
      for(i=0;i<12;i++){
          if(this.props.data.data[""+(i+1)+""] != null){
              data.push({...this.props.data.data[""+(i+1)+""],
                         color:colors[i]})
          }

      }

    }
    return  <View style={{flex:1,flexDirection:'column'}} onLayout={(event) =>{
                            let isPortrait = Dimensions.get('window').width < Dimensions.get('window').height
                            // this.props.navigation.setParams({header: null});
                            this.setState({  isPortrait : isPortrait})
                          }}>
               {this.props.loading?null:this.renderHeader()}
               {this.props.loading?
                    this.renderLoading():
                      (data.length == 0)?
                          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                              <Text style={{fontSize:20}}> {strings.no_data}</Text>
                          </View>:
                          (this.state.isChart?
                              this.renderChart(data):
                              this.renderTable(data))}
               {data.length != 0 && this.state.isChart? this.renderLegend(data):null}
               {this.renderUnitsChooser()}
             </View>

  }

  renderLegend(data){

    if(!this.state.isPortrait){
      return null
    }


    var rows = []
    for(var i=0;i < data.length; i+=2){
      rows.push(<View style={{flex:1, flexDirection:'row', height:20,justifyContent:'space-around'}}>



      {i<=data.length-1   ? this.renderLegendItem(i):null}
      {i+1<=data.length-1 ? this.renderLegendItem(i+1):null}

          </View>)


    }

    return <View style={{height: (data.length/2 +(data.length % 2 != 0)) * 30,borderColor:'grey',borderWidth:1,marginLeft:20,marginRight:20,padding:5, justifyContent:'center'}}>
        {rows}
    </View>
  }

  renderLegendItem(index){
    return <TouchableOpacity key={index} onPress={()=>this.onPressLegend(index)}><Text style={{fontSize:13, textStyle: this.state.chart_displayed[index] ? 'bold':'normal',marginBottom:5,color:this.state.chart_displayed[index] ? data[index].color:'#cccccc'}}> {'◊ '+data[index].name} </Text></TouchableOpacity>
  }

  onPressLegend(index){
      this.state.chart_displayed[index] = !this.state.chart_displayed[index]
      this.setState({
          chart_displayed: this.state.chart_displayed
      })
  }

  fetchMeasurements(){
    this.props.getMeasurements(this.state.unitId, this.state.nbDays, this.state.offsetDays);
  }

  renderHeader(){
    let units = this.props.navigation.getParam("units")
    var leftImage = this.state.offsetDays < 0 ? require('../../../res/images/1leftarrow.png') :
                                               require('../../../res/images/gray_leftarrow.png')
    var rightImage = require('../../../res/images/1rightarrow.png')


    return this.state.isPortrait ?
    <View style={{flexDirection:"row", marginTop:10,height:30}}>
        <TouchableOpacity style={{padding:10,marginLeft:10}} onPress={()=>{this.onSwipeLeft()}}>
          <Image source={leftImage}/>
        </TouchableOpacity>
        {this.renderPicker()}
        <Text>{strings.nbDays}</Text>
        {this.renderChooseView()}
        <View style={{flex:1}}>
          <TouchableOpacity onPress={()=>{
              this.fetchMeasurements();
          }}>
              <Text style={styles.button}>{strings.refresh}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{padding:10,marginRight:10}} onPress={()=>{this.onSwipeRight()}}>
          <Image source={rightImage}/>
        </TouchableOpacity>
     </View> : null
  }



  renderLoading(){
    return <View style={{flex:1, alignItems:'center',justifyContent:'center'}}><Progress.Circle size={100} borderWidth={3} borderColor={'#006601'} indeterminate={true} /></View>

  }

 renderTable(data){
    var keys = []
    for (var key in data[0].data) {
       keys.push(key)
    }

    var rows = []
    keys.forEach(function(key) {
        row = [key]
        for(i=0;i<data.length;i++){
          row.push(data[i].data[key])
        }
        rows.push(row)
    })
    var head = ['Date and time']
    for(i=0;i<data.length;i++){
      head.push(data[i].name)
    }
    return (
        <View style={{height:360, marginBottom:20, marginTop:20}}>
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


  renderChart(data){


    return  <Chart data={data}
                   chart_displayed = {this.state.chart_displayed}
                   nbDays = {this.state.nbDays}
                   isPortrait= {this.state.isPortrait}/>
  }

  onSwipeRight() {
    this.setState({offsetDays: --this.state.offsetDays},
    () => {
        this.fetchMeasurements()
      })
  }

  onSwipeLeft() {
    if(this.state.offsetDays < 0){
      this.setState({offsetDays: ++this.state.offsetDays},
      () => {
          this.fetchMeasurements()
        })
    }

  }

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
    if(this.state.unitId == null){
      return null
    }

    if(!this.state.isPortrait){
      return null
    }

    let units = this.props.navigation.getParam("units")
    let data = units.map( (unit) => {
            return { value:unit.unit_id, label:unit.unit_full_name}
        });


      return  <View style = {{marginLeft:20,marginBottom:20}}>
      <RNPickerSelect
                style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                      top: 10,
                      right: 12,
                    },
                  }}
                                value={this.state.unitId}
                onValueChange={(itemValue, itemIndex) => {
                        if(itemIndex > 0){
                            this.setUnit(itemIndex-1)
                        }
                    }}
                    items = {data}
                  />
                  </View>




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
        <RNPickerSelect
         useNativeAndroidPickerStyle={false}
         value={this.state.nbDays}
         style={{
             ...pickerSelectStyles,
             iconContainer: {
               top: 10,
               right: 12,
             },
             inputIOS:{
               fontSize:18,
               color:'blue'
             }
           }}
         items={[{label:"1 "+strings.days,value:1},
                  {label:"3 "+strings.days,value:3},
                  {label:"6 "+strings.days,value:6},
                  {label:"10 "+strings.days,value:10},
                  {label:"14 "+strings.days,value:14}
              ]}
         onValueChange={(itemValue, itemIndex) =>{
                  this.setState({nbDays: itemValue, tooltipX:undefined },()=>{
                      this.fetchMeasurements()
                    })
              }
         }>

         </RNPickerSelect>

    </View>)
  }

  renderChooseView(){
    var text = this.state.isChart? strings.table : strings.chart
    var icon = this.state.isChart? require('../../../res/images/table.png') :
                                   require('../../../res/images/graph.png')
    return <TouchableOpacity style={{alignItems:'center', marginLeft:30, marginRight:30, height:40}} onPress= {()=>{
            this.setState({isChart: !this.state.isChart}
            )
        }}>
                <Image source={icon} ></Image>
                <Text> {text} </Text>
          </TouchableOpacity>
  }

}


const pickerSelectStyles = StyleSheet.create({
      inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'blue',
      paddingRight: 30, // to ensure the text is never behind the icon
      },
      inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'blue',
      paddingRight: 30, // to ensure the text is never behind the icon
      },
});


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#ccff32' },
  text: { margin: 6 },
  pickerContainer: { marginLeft:20, width: 100,height:40,justifyContent:'center'},
  button:{padding:sizeWidth(2),
    textAlign:'center',
    borderWidth:1,
    alignSelf:'center',
    backgroundColor:'green',
    color:'white'
}});


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
