import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Image, Picker } from 'react-native';
import { sizeWidth,sizeHeight} from '../utils/Size';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {login, checkSession} from '../redux/login/LoginAction';
import {navigateToPage} from '../../NavigationAction';
import {saveToken, getToken} from '../utils/Store';
import {strings} from '../utils/Strings';



import {
      StackActions,NavigationActions
    } from 'react-navigation';




class Login extends React.Component {

  componentWillReceiveProps(newProps) {
      if(newProps.error == null){
          this.handleToken(false)
      }else{
          this.setState({error:newProps.error})
      }
}



  constructor() {
    super();
    this.state = {}
    this.onPressLogin = this.onPressLogin.bind(this);
    this.handleToken(true)
  }

  handleToken(firstTime){
    getToken().then((token)=>{
        if(token != null){
          console.log("first time "+firstTime)
          if(firstTime){
              this.props.checkSession(token)
          }else{
              const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
              this.props.navigation.dispatch(resetAction);
          }
        }
    })

  }


  render() {



    const { navigation } = this.props;
    let errorText = this.state.error && <Text style={styles.labelError}>Wrong credentials</Text>
    return (

      <View style={styles.container}>

          <Image style= {{marginBottom:20}} source={require('../../../res/images/mottes.png')}/>
          <Text style={styles.label}>{strings.username}</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input}
                      onChangeText={(text) => this.setState({username:text})}
            />
          </View>
          <Text style={styles.label}>{strings.password}</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input}
                       onChangeText={(text) => this.setState({password:text})}/>
          </View>
          {errorText}
          <Button title={strings.login}
                  style={styles.button}
                  onPress={this.onPressLogin}
          />

          <View style ={{marginTop: 30, alignItems:'center'}}>
            <Text style ={{marginTop: 20}}>{strings.choose_language}</Text>
            <Picker
                selectedValue={strings.getLanguage()}
                style={{ height: 50, width: 200 }}
                onValueChange={(itemValue, itemIndex) => {
                          strings.setLanguage(itemValue)
                          this.setState({language: itemValue})
                        }}>
                <Picker.Item label="🇬🇧 English" value="en" />
                <Picker.Item label="🇮🇱 Hebrew" value="iw" />
                <Picker.Item label="🇪🇸  Spanish" value="es" />
                <Picker.Item label="🇫🇷  Français" value="fr" />
                <Picker.Item label="🇮🇹 Italiano" value="it" />
                <Picker.Item label="🇷🇺 русский" value="ru" />


            </Picker>
          </View>

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
        ...bindActionCreators({login, checkSession}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
