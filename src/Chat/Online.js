import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

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
  componentDidMount(){
    global.socket.on('user online', (users) => {
      users = users.filter(user => {
        return user.id_user != global.user.id;
      });
      
      this.setState({
        user_online: users
      });
    });
    global.socket.emit('get user online');
  }

  render() {
    return (
      <ScrollView>
        {
          this.state.user_online.map((user, i) => (
            <ListItem
              onPress={() => {
                this.props.navigation.navigate('Message', { user});
              }}
              key={i}
              title={user.name}
              rightIcon={{name: 'chevron-right'}}
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