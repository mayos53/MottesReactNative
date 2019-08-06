import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { sizeWidth,sizeHeight} from '../utils/Size';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {login} from '../redux/login/LoginAction';
import {navigateToPage} from '../../NavigationAction';
import {saveToken, getToken} from '../utils/Store';

import {
      StackActions,NavigationActions
    } from 'react-navigation';




class Login extends React.Component {

  componentWillReceiveProps(newProps) {
      if(newProps.error == null){
          this.handleToken()
      }else{
          this.setState({error:newProps.error})
      }

  }



  constructor() {
    super();
    this.state = {}
    this.onPressLogin = this.onPressLogin.bind(this);
    this.handleToken()


  }

  handleToken(){
    getToken().then((token)=>{
        if(token != null){
          const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Home' })],
            });
          this.props.navigation.dispatch(resetAction);
        }
    })

  }


  render() {



    const { navigation } = this.props;
    let errorText = this.state.error && <Text style={styles.labelError}>Wrong credentials</Text>
    return (
      <View style={styles.container}>
          <Text style={styles.label}>username</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input}
                      onChangeText={(text) => this.setState({username:text})}
            />
          </View>
          <Text style={styles.label}>password</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input}
                       onChangeText={(text) => this.setState({password:text})}/>
          </View>
          {errorText}
          <Button title="Login"
                  style={styles.button}
                  onPress={this.onPressLogin}
          />

      </View>
    );
  }


  onPressLogin(){
    // if(this.state == null || this.state.username == null){
    //     this.props.login("appdeveloper", "1234")
    // }else{
        this.props.login(this.state.username, this.state.password)
    // }
    // const { navigate } = this.props.navigation;
    // setTimeout(function(){ navigate("Home") }, 2000)

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

  labelError:{
    width: sizeWidth(80),
    color: 'red'
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
  }


});


const mapStateToProps = state => ({
    error: state.login.error,
    token: state.login.token
});



function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({login}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
