import React from 'react';
import { Picker, ScrollView, StyleSheet, Text, TextInput, View, Button, FlatList,TouchableOpacity } from 'react-native';
import { sizeWidth,sizeHeight} from '../utils/Size';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMeasurements } from "../redux/measurements/MeasurementsAction";
import { Table, Row, Rows } from 'react-native-table-component';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import { Circle, Path } from 'react-native-svg'




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
    for (var key in data1) {
       data1_values.push(parseInt(data1[key]))
    }

    data1_dates = []
    for (var key in data1) {
       data1_dates.push(key)
    }

    data1_dates =  data1_dates.slice(1,6)




    // const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]
    const data = data1_values.slice(1,6)

    const axesSvg = { fontSize: 10, fill: 'grey' };
    const axesXSvg = { fontSize: 10, fill: 'black', rotation: 90};
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 200
    return(
        <View style={{ height: 470, padding: 20, flexDirection: 'row' }}>
            <YAxis
                data={data}
                style={{ marginBottom: xAxisHeight }}
                contentInset={verticalContentInset}
                svg={axesSvg}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <LineChart
                    style={{ flex: 1 }}
                    data={data}
                    contentInset={verticalContentInset}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                >
                    <Grid/>
                </LineChart>
                <XAxis
                    style={{ marginHorizontal: -10, height: xAxisHeight }}
                    data={data1_dates}
                    formatLabel={(index) => data1_dates[index]}
                    contentInset={{ left: 10, right: 10 }}
                    svg={axesXSvg}
                />
            </View>
        </View>
      )
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
