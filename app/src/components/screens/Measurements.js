import React from 'react';
import { Picker, ScrollView, StyleSheet, Text, TextInput, View, Button, FlatList,TouchableOpacity } from 'react-native';
import { sizeWidth,sizeHeight} from '../utils/Size';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMeasurements } from "../redux/measurements/MeasurementsAction";
import { Table, Row, Rows } from 'react-native-table-component';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import { G, Line, Circle, Path, Rect } from 'react-native-svg'
import {Dimensions } from "react-native";





export class Measurements extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.unit_name}`,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
    });

  constructor() {
      super();
      this.state = {nbDays: 1, isChart:true}
  }

  componentDidMount() {
    const { navigation } = this.props;
    const unitId  = navigation.getParam("unit_id")


    this.props.getMeasurements(unitId,this.state.nbDays);
  }

  componentWillReceiveProps(newProps) {
    // if(newProps.error){
    //     const { navigate } = this.props.navigation;
    //     navigate("Login",{error:true})
    // }
  }

  render() {

    return (

      this.renderList()

    );
}

renderList(){
  data1 = null
  data2 = null
  if(this.props.data != null && !Array.isArray(this.props.data.data)){
      data1 = this.props.data.data["1"].data;
      data2 = this.props.data.data["2"].data;
  }
  return (<View>
      <View style={flexDirection="row",justifyContent="center"}>
          {this.renderPicker()}
          {this.renderChooseView()}
       </View>
       {this.props.loading?
            this.renderLoading():
              ((data1 == null || data2 == null)?
                  null :
                  (this.state.isChart?
                      this.renderChart(data1, data2):
                      this.renderTable(data1, data2)))}
   </View>)


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
        <View>
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

    data1_values = []
    data1_dates = []
    data2_values = []


    let stepLine = 1 * this.state.nbDays
    let stepIndicators = 4 * this.state.nbDays
    let stepAxis = 16 * this.state.nbDays

    var min1 = 10000000
    var min2 = 10000000

    var max1 = 0
    var max2 = 0

    for (var key in data1) {
         data1_dates.push(key)
         data1_values.push(parseInt(data1[key]))
         data2_values.push(parseInt(data2[key]))

         if(parseInt(data1[key]) < min1){
            min1 = parseInt(data1[key])
         }

         if(parseInt(data1[key]) > max1){
            max1 = parseInt(data1[key])
         }

         if(parseInt(data2[key]) < min2){
            min2 = parseInt(data2[key])
         }

         if(parseInt(data2[key]) > max2){
            max2 = parseInt(data2[key])
         }
         // console.log(min1+" "+max1)
    }


   baseHeight = 230
   range1 = max1 - min1
   range2 = max2 - min2

   range2Smaller = range2 < range1
   smallHeight = baseHeight * (range2Smaller ? (range2 / range1) : (range1 / range2))
   if(isNaN(smallHeight)){
      smallHeight = 0
   }


    console.log("small height "+smallHeight)














    // const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]

    const axesSvg = { fontSize: 10, fill: 'grey' };
    const axesXSvg = { fontSize: 10, fill: 'black', rotation: 90, originY:35, y:30};
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 100

    const Decorator1 = ({ x, y, data }) => {
            return data.map((value, index) => {
                return (index % stepIndicators != 0) ? null :
                <Circle
                    key={ index }
                    cx={ x(index) }
                    cy={ y(value) }
                    r={ 2 }
                    stroke={ '#006600' }
                    fill={ '#8DB388' }


                />
            })
        }

    const Decorator2 = ({ x, y, data }) => {
            return data.map((value, index) => {
                return (index % stepIndicators != 0) ? null :
                <Circle
                    key={ index }
                    cx={ x(index) }
                    cy={ y(value) }
                    r={ 2 }
                    stroke={ '#56FF78' }
                    fill={ '#CDFFD1' }


                />
            })
        }



   const screenWidth = Math.round(Dimensions.get('window').width);




    return(
        <View style={{ height: 370, padding: 20, flexDirection: 'row' }}>
            <YAxis
                data={data1_values.concat(data2_values)}
                style={{ marginBottom: xAxisHeight }}
                contentInset={verticalContentInset}
                svg={axesSvg}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <View style= {{flex: 1}}>
                    <LineChart
                        style={{height: range2Smaller? baseHeight: smallHeight}}
                        data={data1_values}
                        contentInset={verticalContentInset}
                        svg={{ stroke: '#006600' }}
                    >
                        <Decorator1/>
                        {this.renderGrid(range2Smaller, stepAxis)}

                    </LineChart>

                    <LineChart
                        style={{height: range2Smaller? smallHeight: baseHeight, marginTop:-smallHeight}}
                        data={data2_values}
                        contentInset={verticalContentInset}
                        svg={{ stroke: '#56FF78' }}
                    >
                        <Decorator2/>
                        {this.renderGrid(!range2Smaller, stepAxis)}

                    </LineChart>

                </View>
                <XAxis
                    style={{ height: xAxisHeight}}
                    data={data2_values}
                    formatLabel={(index) => {return (index % stepAxis != 0) ? "": data1_dates[index]}}
                    svg={axesXSvg}
                />
            </View>
        </View>
      )
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
                    return (index % stepAxis != 0) ? null :
                    <Line
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

  renderPicker(){
    return (<View style = {styles.pickerContainer}>
        <Picker
         selectedValue={this.state.nbDays}
         style={{height: 50, width: 100}}
         onValueChange={(itemValue, itemIndex) =>{
                  this.setState({nbDays: itemValue})
                  this.props.getMeasurements(this.props.navigation.getParam("unit_id"), itemValue);
              }
         }>
             <Picker.Item label="1" value="1" />
             <Picker.Item label="3" value="3" />
             <Picker.Item label="6" value="6" />
             <Picker.Item label="10" value="10" />
             <Picker.Item label="14" value="14" />

         </Picker>
         <Text>Days</Text>
    </View>)
  }

  renderChooseView(){
    var text = this.state.isChart? "Table" : "Chart"
    return <TouchableOpacity onPress= {()=>{
            this.setState({isChart: !this.state.isChart})
        }}>
              <Text> {text} </Text>
          </TouchableOpacity>
  }

}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#ccff32' },
  text: { margin: 6 },
  pickerContainer: {flexDirection:'row', alignItems:'center',justifyContent:'center',width: 300}
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
