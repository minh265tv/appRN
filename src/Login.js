import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput , Button} from 'react-native';
import axios from 'axios';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      username: '',
      password: '',
      error: []
    })
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(){
    if(this.state.username == '' || this.state.password == ''){
      this.setState({
        error: ['Please fill username or password']
      });
    }else{
      axios.post('http://10.0.3.2:8000/api/login',{
        name: this.state.username,
        password: this.state.password
      })
      .then(res => {
        global.token = res.data.token;
        this.props.navigation.navigate('Home');
      })
      .catch(err => {
        var err = err.response.data;
        if(!Array.isArray(err)){
          let tmp = [];
          for(key in err) {
            if(err.hasOwnProperty(key)) {
                tmp.push(err[key][0]);
            }
          }
          var err = tmp;
        }
        
        this.setState({
          error: err
        })
        console.log(this.state.error)
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        {this.state.error.map((err,i) => {
          return <Text key={i} style={styles.error}>{err}</Text>
        })}
        <TextInput
          placeholder='Username' value={this.state.username}
          style={styles.input}
          onChangeText={e => {
            this.setState({
              username: e
            })
          }}
        />
        <TextInput
          placeholder='Password' value={this.state.password}
          style={styles.input} secureTextEntry={true}
          onChangeText={e => {
            this.setState({
              password: e
            })
          }}
        />
        <Button onPress={this.handleLogin} title='Login' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 10,
    width: 200,
    padding: 5
  },
  title: {
    fontSize: 50,
    color: 'tomato',
    fontWeight: 'bold',
    marginBottom: 20
  },
  error: {
    color: 'red',
    marginBottom: 5,
  }
});