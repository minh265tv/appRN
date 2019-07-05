import React, { Component } from 'react';
import { TextInput, View, TouchableNativeFeedback, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import io from 'socket.io-client';
import axios from 'axios';

export default class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      addTodoItem: '',
      listTodo: []
    });
    this.getTodo = this.getTodo.bind(this);
    this.AddTodo = this.AddTodo.bind(this);

  }

  componentDidMount() {
    this.getTodo();
    global.socket = io('http://10.0.3.2:3000');
  
      axios.get('http://10.0.3.2:8000/api/auth/user', 
      {
        headers: { 'Authorization': `Bearer ${global.token}` }
      })
      .then(res => {
        global.user = res.data.result;
        global.socket.emit('add user', {user: global.user});
        global.socket.on('change todo',() => {
          this.getTodo();
        });
      })
      .catch(err => console.log(err.response));
  }

  getTodo() {
    axios.get('http://10.0.3.2:8000/api/todos',
      {
        headers: { 'Authorization': `Bearer ${global.token}` }
      })
      .then(res => {
        const list = res.data.map((todo) => {
          return <View key={todo.id} style={{ flexDirection: 'row', padding: 20 }}>
            <Text>{todo.content}</Text>
            <Text>
              {todo.status == 0 ? ' - Waiting' : ' - Done'}
            </Text>
            <TouchableNativeFeedback onPress={() => {
              this.DelTodo(todo.id)
            }}>
              <View style={styles.delTodo} >
                <Icon name="highlight-off" size={30} color="#01a699" />
              </View>
            </TouchableNativeFeedback>
            {
              todo.status == 0 && 
              <TouchableNativeFeedback onPress={() => {
                this.UpdTodo(todo.id)
              }}>
                <View style={styles.UpdTodo} >
                  <Icon name="done" size={30} color="#01a699" />
                </View>
              </TouchableNativeFeedback>
            }
          </View>
        })
        this.setState({
          listTodo: list
        })

      })
      .catch(err => console.log(err.response));
  }

  AddTodo() {
    if (this.state.addTodoItem != '') {
      axios.post('http://10.0.3.2:8000/api/todos',
        {
          content: this.state.addTodoItem
        },
        {
          headers: { 'Authorization': `Bearer ${global.token}` },
        })
        .then(res => {
          this.getTodo();
          global.socket.emit('add todo');
          this.setState({
            addTodoItem: ''
          })
        })
        .catch(err => console.log(err.response));
    }
  }

  UpdTodo(id) {
    axios.put(`http://10.0.3.2:8000/api/todos/${id}`,
      {

      },
      {
        headers: { 'Authorization': `Bearer ${global.token}` }
      })
      .then(res => {
        this.getTodo();
        global.socket.emit('updt todo');
      })
      .catch(err => console.log(err.response));
  }

  DelTodo(id) {
    axios.delete(`http://10.0.3.2:8000/api/todos/${id}`,
      {
        headers: { 'Authorization': `Bearer ${global.token}` }
      })
      .then(res => {
        this.getTodo();
        global.socket.emit('del todo');
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <View >
        <TouchableNativeFeedback onPress={() => {
          this.AddTodo();
        }}>
          <View style={styles.btnSearch}>
            <Icon name='file-upload' size={50} />
          </View>
        </TouchableNativeFeedback>
        <TextInput style={styles.search}
          value={this.state.addTodoItem} placeholder='Add Todo'
          onChangeText={(e) => {
            this.setState({
              addTodoItem: e
            })
          }}
        />
        {
          this.state.listTodo
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  search: {
    marginLeft: 20,
    width: '70%',
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
  },
  btnSearch: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 60
  },
  delTodo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 40,
  },
  UpdTodo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    position: 'absolute',
    bottom: 10,
    right: 50,
    height: 40,
  }
});