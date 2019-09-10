import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList,TouchableOpacity } from 'react-native';
import { sizeWidth,sizeHeight} from '../utils/Size';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUnits } from "../redux/units/UnitsAction";
import {strings} from '../utils/Strings';




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
      this.props.loading? <Text>Loading</Text> :
      <FlatList
          data= {this.props.units}
          renderItem={({item,index}) => {
            return(
                <TouchableOpacity onPress={() => this._onPress(item,index)}>
                    <Text style={styles.item} >{item.unit_full_name}</Text>
                </TouchableOpacity>
              )
          }
      }/>
    );
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

  button:{
    marginTop: sizeHeight(1),
    width: sizeWidth(80)
  },

  item:{
    padding: sizeWidth(5)
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
