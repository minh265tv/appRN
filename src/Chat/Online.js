import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'react-native-firebase';
import uuid from 'uuid/v1';


export default class Online extends Component {

  static navigationOptions = {
    headerTitle: 'User Online',
  }
  constructor(props) {
    super(props);
    this.state = ({
      user_online: []
    });

  }
  componentDidMount() {
    this.socket = global.socket;

    firebase.notifications().onNotificationOpened((notificationOpen) => {
        firebase.notifications().removeDeliveredNotification(notificationOpen.notification._notificationId);
        const user = notificationOpen.notification._data;
        this.props.navigation.navigate('Message', { user });
    });

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

    this.socket.on('user online', (users) => {
      users = users.filter(user => {
        return user.id_user != global.user.id;
      });

      this.setState({
        user_online: users
      });
    });
    global.socket.emit('get user online');

  }

componentWillUnmount(){
  firebase.notifications().removeAllDeliveredNotifications();
}

  render() {
    return (
      <ScrollView>
        {
          this.state.user_online.map((user, i) => (
            <ListItem
              onPress={() => {
                this.socket.removeListener('send message');
                this.props.navigation.navigate('Message', { user });
              }}
              key={i}
              title={user.name}
              rightIcon={{ name: 'chevron-right' }}
            />
          ))
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  list_user: {
    margin: 20,
  }
});