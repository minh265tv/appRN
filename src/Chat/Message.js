import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Input, Icon, ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

let messages = [];

export default class Message extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('user').name,
    };
  };

  constructor(props) {
    super(props);
    this.state = ({
      inputMess: '',
      messages: []
    });
    this.handleSendMess = this.handleSendMess.bind(this);

    global.socket.on('send message', (data) => {
      if (data.id_sender == this.props.navigation.getParam('user').id_user) {
        messages.push(data);
        this.setState({
          messages: messages
        });
      }
    });

    global.socket.on('my message', (data) => {
      messages.push(data);
      this.setState({
        messages: messages
      });
    });

  }

  handleSendMess() {
    if (this.state.inputMess != '') {
      global.socket.emit('send message',
        {
          id_user: this.props.navigation.getParam('user').id_user,
          id_sender: global.user.id,
          message: this.state.inputMess
        });
      this.setState({
        inputMess: '',
      });
    }

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{flex:0.8}}>
          {
            this.state.messages.map((msg, i) => {
              return msg.sender == 1 ? <Text key={i} style={styles.yourMess}>{msg.message}</Text>
                : <Text key={i} style={styles.theirMess} >{msg.message}</Text>
            })
          }
        </ScrollView>
        <View style={styles.sendMess}>
          <Input placeholder='Write Something' value={this.state.inputMess}
            onChangeText={e => {
              this.setState({
                inputMess: e
              });
            }}
            rightIcon={
              <TouchableOpacity onPress={() => {
                this.handleSendMess();
              }}>
                <View>
                  <Icon name='send' />
                </View>
              </TouchableOpacity>
            } />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sendMess: {
    flex: 0.11,
  },
  yourMess: {
    backgroundColor: 'rgba(43, 166, 203, 0.5)',
    alignSelf: 'flex-end',
    fontSize: 17,
    padding: 7,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 5,
    borderRadius: 13
  },
  theirMess: {
    backgroundColor: 'rgba(43, 166, 203, 0.5)',
    alignSelf: 'flex-start',
    fontSize: 17,
    padding: 7,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
    borderRadius: 13
  }
});