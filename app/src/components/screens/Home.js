import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList,TouchableOpacity } from 'react-native';
import { width, height,sizeWidth,sizeHeight} from '../utils/Size';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUnits } from "../redux/units/UnitsAction";

import {strings} from '../utils/Strings';
import moment from 'moment';
import {saveToken} from "../utils/Store";
import { NavigationActions, StackActions } from 'react-navigation';










export class Home extends React.Component {

  static navigationOptions = {
    title: strings.units
  };



  componentDidMount() {

    this.props.getUnits();

  }

  componentWillReceiveProps(newProps) {
    // if(newProps.error){
    //     const { navigate } = this.props.navigation;
    //     navigate("Login",{error:true})
    // }
  }

  render() {

    return (
      this.props.loading? <Text>{strings.loading}</Text> :
      <View style={{flex:1}}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity onPress={()=>{
                this.props.getUnits();
            }}>
                <Text style={styles.button2}>{strings.refresh}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{
              saveToken(null)
              const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Login' })],
              });
              this.props.navigation.dispatch(resetAction);
            }}>
                <Text style={styles.button}>{strings.logout}</Text>
            </TouchableOpacity>
      </View>

          <View style={{flexDirection:'row',backgroundColor: '#ccff32'}}>
            <Text style={{textAlign:'center',padding:sizeWidth(2),width:3*width/4,borderWidth:1}} >{strings.unit_name}</Text>
            <Text style={{textAlign:'center',padding:sizeWidth(2),width:width/4,borderWidth:1}} >{strings.last_message}</Text>
          </View>

          <FlatList
              data= {this.props.units}
              renderItem={({item,index}) => {
                return(

                    <TouchableOpacity onPress={() => this._onPress(item,index)}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{textAlign:'left',padding:sizeWidth(5),width:3*width/4,borderWidth:1}} >{item.unit_full_name}</Text>
                          <Text style={{textAlign:'left',padding:sizeWidth(5),width:width/4,borderWidth:1}} >{this.formatDate(item.last_message)}</Text>
                        </View>
                    </TouchableOpacity>
                  )
              }
          }

          />



      </View>
    );
}

onPressLogout() {
    saveToken(null).then(()=>{
      const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
      this.props.navigation.dispatch(resetAction);
    })
    // this.props.navigation.navigate('Login')
}

formatDate(dateStr){
    if(dateStr != null && dateStr!= ""){
      today = moment().toDate()
      momentDate = moment(dateStr,'YYYY-MM-DD HH:mm:ss')
      date = momentDate.toDate()
      console.log(today)
      if(today.getDate() == date.getDate()
        && today.getMonth() == date.getMonth()
        && today.getFullYear() == date.getFullYear()){
            return momentDate.format("HH:mm")
        }else{
            return momentDate.format("DD/MM")
        }
    }
}

_onPress(item, index) {
   this.props.navigation.navigate('Measurements', {
     unit_id: item.unit_id,
     unit_name: item.unit_full_name,
     unit_index: index,
     units: this.props.units
   });
 }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  label:{
      width: sizeWidth(80),
  },

  inputContainer:{
    borderWidth:  sizeWidth(0.2),
    width: sizeWidth(80),
  },

  input:{
    width: sizeWidth(80),
  },


  item:{
    padding: sizeWidth(5),
    textAlign:'left'
  },

  button:{
    padding:sizeWidth(2),
    width:sizeWidth(20),
    textAlign:'center',
    borderWidth:1,
    margin:10,
    backgroundColor:'red',
    color:'white'
  },
  button2:{
    padding:sizeWidth(2),
    width:sizeWidth(20),
    textAlign:'center',
    borderWidth:1,
    margin:10,
    backgroundColor:'green',
    color:'white'
  }


});


const mapStateToProps = state => ({
  units: state.units.items,
  loading: state.units.loading,
  error: state.units.error
});

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({getUnits}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
