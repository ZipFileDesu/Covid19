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
    screenHeight = Dimensions.get("window").height;
    total_chart = {
      labels: [], 
      datasets: [
          { 
              data: [],
              strokeWidth: 2,
							color: (opacity = 1) => `rgba(255,0,0, ${opacity})`,
          },
          {
            data: [],
            strokeWidth: 2,
						color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          },
      ],
  };
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
    countryIsChanged: false,
    loaded: false,
    load_failed: false,
    error_msg: "",
    country: "ALL",
  };

  constructor(props){
    super(props);
    console.log("Test of constructor");
  }

  async componentDidMount(){
    console.log("Test of mount");
    await this.getData().then(() => {
      }).catch((error) => {
        this.setState({...this.state, spinner: false, loading: false, loaded: false, load_failed: true, error_msg: error.toString()});
    });
    console.log("Mount Complete");
  }

  changeCountry(sel_country){
    this.total_chart = {
      labels: [], 
      datasets: [
          { 
              data: [],
              strokeWidth: 2,
							color: (opacity = 1) => `rgba(255,0,0, ${opacity})`,
          },
          {
            data: [],
            strokeWidth: 2,
						color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          },
      ],
  };
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
    this.date_statistic_reversed = []

    /*state = {
      json: null,
      loading: true,
      spinner: true,
      countryIsChanged: false,
      loaded: false,
      load_failed: false,
      error_msg: "",
      country: "ALL",
    };

    this.setState({
      ...this.state,
      loading: true,
      spinner: true,
      countryIsChanged: false,
      loaded: false,
      load_failed: false,
      country: sel_country,
    });*/

    this.setState({
      ...this.state,
        spinner: true,
        countryIsChanged: true,
        loaded: true,
        loading: true,
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
        this.parseData(json);
        this.setState({...this.state, json: json, loading: false, loaded: true, spinner: false});
        //this.parseData(json);
        //this.setState({json: json, loading: true, loaded: true, spinner: false});
        //return json;
    }
    catch (error){
        throw new Error(error);
    }
  }

  parseData(json) {
    var flatData = [];
    if(this.countries.length == 0) {
      json.countries.forEach(
            i => {
                this.countries.push({label: i.toUpperCase(), value: i.toUpperCase(),});
            }
        );
        this.countries.unshift({label: "ALL", value: "ALL", selected: true});
    }
    if (this.state.country == "ALL") {
        //var countries = Object.keys(json.countries);
        var keys = Object.keys(json.data);
        json_data_len = keys.length;
        //this.confirmed_sum = this.state.json.scale.casesConfirmed.max;
        //this.death_sum = this.state.json.scale.deaths.max;
        keys.forEach(
        i => {
          var record = json.data[i];
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
            this.date_statistic.push({date_value: date, confirmed: this.confirmed_sum, deaths: this.deaths_sum});
            //this.confirmed_sum += i.confirmed;
            //this.death_sum += i.deaths;
            this.confirmed_chart.labels.push(date);
            this.confirmed_chart.datasets[0].data.push(this.confirmed_sum);
            this.death_chart.labels.push(date);
            this.death_chart.datasets[0].data.push(this.deaths_sum);
            this.total_chart.labels.push(date);
            this.total_chart.datasets[0].data.push(this.confirmed_sum);
            this.total_chart.datasets[1].data.push(this.deaths_sum);
        }
      );
    }
    else {
        var keys = Object.keys(json.data);
        keys.forEach(
        i => {
          var record = json.data[i][this.state.country];
          if (record != undefined) {
            this.date_statistic.push({date_value: record.date_value, confirmed: record.confirmed, deaths: record.deaths});
            this.confirmed_sum = record.confirmed;
            this.deaths_sum = record.deaths;
            this.confirmed_chart.labels.push(record.date_value);
            this.confirmed_chart.datasets[0].data.push(record.confirmed);
            this.death_chart.labels.push(record.date_value);
            this.death_chart.datasets[0].data.push(record.deaths);

            this.total_chart.labels.push(record.date_value);
            this.total_chart.datasets[0].data.push(record.confirmed);
            this.total_chart.datasets[1].data.push(record.deaths);
          }
        }
      );
    }
    this.date_statistic_reversed = this.date_statistic.reverse();
      console.log(flatData);
    //this.setState({spinner: false});
  }
  
  render(){
    if(this.state.loading == true && this.state.countryIsChanged == false){
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
    else if (this.state.countryIsChanged == true){
      this.parseData(this.state.json);
    }

    if(this.state.load_failed == true){
      alert("Failed with " + this.state.error_msg);
        return (
          <View style={styles.container}>
            <Text>{this.state.error_msg}</Text>
            <Button title="Restart" onPress={() => {RNRestart.Restart();}}></Button>
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
            onChangeItem={item => {
              this.changeCountry(item.value);
              this._leftView.scrollToEnd({ animated: true });
            }}
        />

        <ScrollView 
          horizontal={true}
          ref={scrollView => { this._leftView = scrollView }}
          onContentSizeChange={() => this._leftView.scrollToEnd({animated: true})}>
        <LineChart
            data={this.total_chart}
            width={this.screenWidth * 15}
            height={this.screenHeight / (3 / 2)}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2 // optional, default 3
              }}
            verticalLabelRotation={45}
            style={{
                marginVertical: 8,
                borderRadius: 8
              }
            }
        />

        </ScrollView>
        <Button style={styles.button_details} title="Details" onPress={() => this.props.navigation.navigate('Details', {
            json: this.date_statistic_reversed,
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
  },

  button_details: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  }
});

export default Tracker;