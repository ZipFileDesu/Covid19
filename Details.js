/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, FlatList } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationContainer } from '@react-navigation/native';
import { CreateStackNavigator, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

class Details extends Component {

  url = 'https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/2020-01-01/2020-08-31';

  //data = this.props.route.params.json.reverse();

  state = {
    json: null,
    spinner: true
  };

  constructor(props){
    super(props);
    console.log("Test of constructor");
  }

  componentDidMount(){
    console.log("Test of mount");
  }

  /*async getData() {
    try {
      var response = await fetch(this.url);
      var json = await response.json();
      console.log(json);
      this.setState({json: json.data, spinner: false});
    }
    catch (error){
      throw error;
    }
  }*/

  render(){
    //test = this.props.navigation.dangerouslyGetParent().getParam('test');
    /*var flatData = [];
    if (this.state.json !== null){
      var keys = Object.keys(this.state.json);
      keys.forEach(
        i => {
          var record = this.state.json[i].RUS;
          flatData.push(record);
        }
      );
      flatData.reverse();
      console.log(flatData);
    }
    else {
      try{
        this.getData();
      }
      catch (error) {
        alert("Failed with " + error);
      }
      return (
        <View>
          <Spinner
          visible={this.state.spinner}
          textContent={this.props.route.params.test}
          textStyle={styles.spinnerTextStyle}
        />
        </View>
      )
    }*/
    console.log(this.props.route.params.json);
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Country: {this.props.route.params.country} {"\n"}Confirmed: 
        {this.props.route.params.json[0].confirmed}, Deaths: {this.props.route.params.json[0].deaths} </Text>
        <FlatList
          ref={ (ref) => { this.flatList = ref; }}
          ItemSeparatorComponent={({leadingItem}) => {
            return <View style={styles.separator}></View>
          }
        }
          data={this.props.route.params.json}
          renderItem={({item, index}) => {
            console.log(item);
            console.log(item.date_value);
            return(<Text style={styles.item}>Date: {item.date_value} {"\n"}Confirmed: {item.confirmed}; Deaths: {item.deaths}</Text>)}}
          keyExtractor={i => i.date_value}
        >
        </FlatList>
      </View>
    );
  }
}

/*
        <Button title="Get data" onPress={
          () => {
          try{
            this.getData()
          }
          catch (error) {
            alert("Failed with " + error);
          }
        }
        } />
*/


const styles = StyleSheet.create({
  
  spinnerTextStyle: {
    color: '#FFF'
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  text: {
    fontSize: 32,
  },

  item: {
    fontSize: 24,
  },

  separator:{
    height: 2,
    backgroundColor: "black",
  }
});

export default Details;