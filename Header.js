import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

function Header({title}) {
    //console.log(title);
    return(
      <View style={styles.header}>
        <Text style={styles.text}>{title}</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    header: {
      flex: 1,
      backgroundColor: 'yellow',
    },
  
    text: {
      fontSize: 32,
    },
  
  });

  export default Header;