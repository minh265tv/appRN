import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import uuid from 'uuid/v1';

let messages = [];

let scrollViewRef = null;

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

  }

  componentDidMount() {
    this.socket = global.socket;

    firebase.notifications().onNotificationOpened((notificationOpen) => {
      firebase.notifications().removeDeliveredNotification(notificationOpen.notification._notificationId);
      const user = notificationOpen.notification._data;
      this.props.navigation.navigate('Message', { user });
    });

    this.socket.on('send message', (data) => {
      if (data.id_sender == this.props.navigation.getParam('user').id_user) {
        messages.push(data);
        this.setState({
          messages: messages
        });
        setTimeout(() => {
          scrollViewRef.scrollToEnd();
        }, 1);
      } else {
        const notification = new firebase.notifications.Notification()
          .setNotificationId(uuid())
          .setTitle(data.name_sender)
          .setBody(data.message)
          .setData({
            id_user: data.id_sender,
            name: data.name_sender
          });
        notification
          .android.setChannelId('message')
          .android.setSmallIcon('ic_launcher');

        firebase.notifications().displayNotification(notification);
      }
    });

    this.socket.on('my message', (data) => {
      messages.push(data);
      this.setState({
        messages: messages
      });
      setTimeout(() => {
        scrollViewRef.scrollToEnd();
      }, 1);
    });
  }

  handleSendMess() {
    if (this.state.inputMess != '') {
      global.socket.emit('send message',
        {
          id_user: this.props.navigation.getParam('user').id_user,
          name_sender: global.user.name,
          id_sender: global.user.id,
          message: this.state.inputMess
        });
      this.setState({
        inputMess: '',
      });
    }

  }

  componentWillUnmount() {
    messages = [];
    this.setState({
      messages: []
    })
    console.log(this.state.messages);
    this.socket.removeListener('my message');
    this.socket.removeListener('send message');
    this.socket.on('send message', (data) => {
      const notification = new firebase.notifications.Notification()
        .setNotificationId(uuid())
        .setTitle(data.name_sender)
        .setBody(data.message)
        .setData({
          id_user: data.id_sender,
          name: data.name_sender
        });
      notification
        .android.setChannelId('online')
        .android.setSmallIcon('ic_launcher');

      firebase.notifications().displayNotification(notification);
    });
    this.socket = undefined;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView ref={(e) => {
          scrollViewRef = e;
        }} style={{ flex: 0.7 }}>
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
    flex: 0.15,
  },
  yourMess: {
    backgroundColor: 'rgba(43, 166, 203, 0.5)',
    alignSelf: 'flex-end',
    fontSize: 17,
    padding: 7,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 5,
    borderRadius: 13,
    maxWidth: '60%'
  },
  theirMess: {
    backgroundColor: 'rgba(43, 166, 203, 0.5)',
    alignSelf: 'flex-start',
    fontSize: 17,
    padding: 7,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
    borderRadius: 13,
    maxWidth: '60%'
  }
});