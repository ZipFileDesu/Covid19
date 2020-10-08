/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, Text, Button, StyleSheet, ScrollView, FlatList, Dimensions, Dropdown } from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { NavigationContainer } from '@react-navigation/native';
import { CreateStackNavigator, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import RNRestart from 'react-native-restart';

class Tracker extends Component {

    //now = new Date();
    //url = 'https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/2020-01-01/2020-' + (now.getMonth + 1).toString() + "-" + (now.getDate).toString();
    screenWidth = Dimensions.get("window").width;
    confirmed_chart = {
        labels: [], 
        datasets: [
            { 
                data: [],
            }
        ],
    };
    death_chart = {
        labels: [], 
        datasets: [
            { 
                data: [],
            }
        ],
    };
    json_data_len = 0;
    confirmed_sum = 0;
    deaths_sum = 0;
    date_statistic = [];
    countries = [];

  state = {
    json: null,
    loading: true,
    spinner: true,
    loaded: false,
    load_failed: false,
    error_msg: "",
    country: "ALL",
  };

  constructor(props){
    super(props);
    console.log("Test of constructor");
  }

  componentDidMount(){
    console.log("Test of mount");
    this.getData().then(() => {
      }).catch((error) => {
        this.setState({...this.state, spinner: false, load_failed: true, error_msg: error.toString()});
    });
    this.parseData();
  }

  changeCountry(sel_country){
    this.confirmed_chart = {
        labels: [], 
        datasets: [
            { 
                data: [],
            }
        ],
    };
    this.death_chart = {
        labels: [], 
        datasets: [
            { 
                data: [],
            }
        ],
    };
    this.json_data_len = 0;
    this.confirmed_sum = 0;
    this.deaths_sum = 0;
    this.date_statistic = [];
    this.setState({
      ...this.state,
        spinner: true,
        loaded: true,
        load_failed: false,
        country: sel_country,
      });
    //this.countries = [];
  }

  async getData() {
    try {
        var now = new Date();
        var url = 'https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/2020-01-01/2020-' + (now.getMonth() + 1).toString() + "-" + (now.getDate() - 1).toString();
        var response = await fetch(url);
        var json = await response.json();
        console.log(json);
        //this.parseData(json);
        this.setState({json: json, loading: true, loaded: true, spinner: false});
    }
    catch (error){
        throw new Error(error);
    }
  }

  parseData() {
    var flatData = [];
    if(this.countries.length == 0) {
        this.state.json.countries.forEach(
            i => {
                this.countries.push({label: i.toUpperCase(), value: i.toUpperCase(),});
            }
        );
        this.countries.unshift({label: "ALL", value: "ALL", selected: true});
    }
    if (this.state.country == "ALL") {
        //var countries = Object.keys(json.countries);
        var keys = Object.keys(this.state.json.data);
        json_data_len = keys.length;
        //this.confirmed_sum = this.state.json.scale.casesConfirmed.max;
        //this.death_sum = this.state.json.scale.deaths.max;
        keys.forEach(
        i => {
          var record = this.state.json.data[i];
          flatData.push(record);
        }
      );
        flatData.forEach(
        i => {
            var date;
            this.confirmed_sum = 0;
            this.deaths_sum = 0;
            for (const [key, value] of Object.entries(i)) {
                date ? date : date = value.date_value;
                this.confirmed_sum += value.confirmed;
                this.deaths_sum += value.deaths;
            }
            this.date_statistic.unshift({date_value: date, confirmed: this.confirmed_sum, deaths: this.deaths_sum});
            //this.confirmed_sum += i.confirmed;
            //this.death_sum += i.deaths;
            this.confirmed_chart.labels.unshift(date);
            this.confirmed_chart.datasets[0].data.unshift(this.confirmed_sum);
            this.death_chart.labels.unshift(date);
            this.death_chart.datasets[0].data.unshift(this.deaths_sum);
        }
      );
    }
    else {
        var keys = Object.keys(this.state.json.data);
        keys.forEach(
        i => {
          var record = this.state.json.data[i][this.state.country];
          if (record != undefined) {
            this.date_statistic.unshift({date_value: record.date_value, confirmed: record.confirmed, deaths: record.deaths});
            this.confirmed_sum = record.confirmed;
            this.deaths_sum = record.deaths;
            this.confirmed_chart.labels.unshift(record.date_value);
            this.confirmed_chart.datasets[0].data.unshift(record.confirmed);
            this.death_chart.labels.unshift(record.date_value);
            this.death_chart.datasets[0].data.unshift(record.deaths);
          }
        }
      );
    }
      console.log(flatData);
    //this.setState({spinner: false});
  }
  
  render(){
    if(this.state.loading == true){
      return (
        <View>
          <Spinner
          visible={this.state.spinner}
          textContent={'Loading data...'}
          textStyle={styles.spinnerTextStyle}
        />
        </View>
      );
    }

    /*if (this.state.loaded == true){
        this.parseData();
    }
    else if (this.state.loaded == false){
        if(this.state.load_failed == false) {
            this.getData().then(() => {
            }).catch((error) => {
                this.setState({...this.state, spinner: false, load_failed: true, error_msg: error.toString()});
            });
        }
        else {
            alert("Failed with " + this.state.error_msg);
            return (
                <View style={styles.container}>
                    <Text>{this.state.error_msg}</Text>
                    <Button title="Restart" onPress={() => {RNRestart.Restart();}}></Button>
                </View>
            );
        }
        return (
            <View>
              <Spinner
              visible={this.state.spinner}
              textContent={'Loading data...'}
              textStyle={styles.spinnerTextStyle}
            />
            </View>
          );
    }*/

    //alert(this.death_sum);
    //return (<View></View>);
    return (
      <View style={styles.container}>
        <Text style={styles.header_text}>COVID TRACKER</Text>
        <Text style={styles.text}>Confirmed: {this.confirmed_sum}; Deaths: {this.deaths_sum}</Text>
        <ScrollView>
        <DropDownPicker
            items={this.countries}
            
            searchable={true}
            searchablePlaceholder="Search for an item"
            searchablePlaceholderTextColor="gray"
            seachableStyle={{}}
            searchableError={() => <Text>Not Found</Text>}
            
            defaultValue={this.state.country}
            containerStyle={{height: 40}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            dropDownMaxHeight={250}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item => this.changeCountry(item.value)}
        />
       
        <Text style={styles.center_text}>Confirmed</Text>

        <ScrollView 
          horizontal={true}
          ref={ref => {this.scrollView = ref}}
          onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
        <BarChart
            data={this.confirmed_chart}
            width={this.screenWidth + (json_data_len * 10)}
            height={200}
            chartConfig={{
                backgroundColor: "#FF0000",
                backgroundGradientFrom: "#FF0000",
                backgroundGradientTo: "#FE4A4A",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
              }}
            verticalLabelRotation={20}
            style={{
                marginVertical: 8,
                borderRadius: 8
              }
            }
        />

        </ScrollView>
        <Text style={styles.center_text}>Deaths</Text>
        <ScrollView horizontal>
        <BarChart
            data={this.death_chart}
            width={this.screenWidth + (json_data_len * 10)}
            height={200}
            chartConfig={{
                backgroundColor: "#000000",
                backgroundGradientFrom: "#000000",
                backgroundGradientTo: "#000000",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
              }}
            verticalLabelRotation={20}
            style={{
                marginVertical: 8,
                borderRadius: 8
              }
            }
        />
        </ScrollView>
        <Button title="Details" onPress={() => this.props.navigation.navigate('Details', {
            json: this.date_statistic,
            country: this.state.country,
        })}></Button>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  scroll: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  header_text: {
    fontSize: 32,
  },

  text: {
    fontSize: 20,
  },
  
  center_text: {
    fontSize: 20,
    justifyContent: "center", 
    alignItems: "center",
    flexDirection: 'row',
  },

  separator: {
    height: 2,
    backgroundColor: "black",
  }
});

export default Tracker;