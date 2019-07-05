import React from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import {Icon} from 'react-native-elements'
import LoginScreen from '../Login';
import TodoScreen from '../Todo';
import OnlineScreen from '../Chat/Online';
import MessageScreen from '../Chat/Message';

const AppNavigation = createStackNavigator(
    {
        Login: {
            screen: LoginScreen
        },
        Home: createBottomTabNavigator(
            {
                Todo: {
                    screen: TodoScreen
                },
                Chat: createStackNavigator({
                    Online: {
                        screen: OnlineScreen
                    },
                    Message: {
                        screen: MessageScreen
                    }
                })
            },
            {
                defaultNavigationOptions: ({ navigation }) => ({
                    tabBarIcon: ({ focused, tintColor }) => {
                        const { routeName } = navigation.state;
                        let iconName;
                        if (routeName === 'Todo') {
                            iconName = `list`;
                        } else if (routeName === 'Chat') {
                            iconName = `forum`;
                        }
                        return <Icon name={iconName} size={25} color={tintColor} />;
                    },
                }),
                tabBarOptions: {
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                },
            }
        )
    },
    {
        headerMode: 'none'
    }
);

export default createAppContainer(AppNavigation);