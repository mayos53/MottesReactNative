import React from 'react';
import { Picker, ScrollView, StyleSheet, Text, TextInput, View, Button, FlatList,TouchableOpacity } from 'react-native';
import { sizeWidth,sizeHeight} from '../utils/Size';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMeasurements } from "../redux/measurements/MeasurementsAction";
import { Table, Row, Rows } from 'react-native-table-component';



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
      this.state = {nbDays: 1}
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
      this.props.loading? <Text>Loading</Text> :
      this.renderList()

    );
}

renderList(){
  if(this.props.data != null && !Array.isArray(this.props.data.data)){

      let data1 = this.props.data.data["1"].data;
      let data2 = this.props.data.data["2"].data;

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
            <View style = {styles.pickerContainer}>
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
            </View>

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

  }else{
    return null
  }
}

}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#ccff32' },
  text: { margin: 6 },
  pickerContainer: {flexDirection:'row', alignItems:'center',justifyContent:'center'}
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
