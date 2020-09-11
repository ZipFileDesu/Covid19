/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CreateStackNavigator, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Details from './Details';
import Tracker from './Tracker';
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();
//const Tab = createBottomTabNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Covid Tracker' component={ Tracker } 
          options={{
            headerRight: () => (
              <Icon
              name="refresh"
              size={40}
              color="#000000"
                onPress={() => {RNRestart.Restart();}}
                title="Info"
              />
            ),
          }}/>
          <Stack.Screen name='Details' component={ Details } />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  styleA: {
    flex: 1,
    backgroundColor: 'pink',
  },

  styleB: {
    flex: 1,
    backgroundColor: 'blue',
  },

  styleC: {
    flex: 1,
    backgroundColor: 'red',
  },

  styleD: {
    flex: 1,
    backgroundColor: 'white',
  }
});

export default App;