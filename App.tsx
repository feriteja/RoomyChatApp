import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Router from './src/config/router';
import {enableScreens} from 'react-native-screens';
import {Provider} from 'react-redux';
import Store from './src/config/redux/store';
// enableScreens();

const App = () => {
  return (
    <Provider store={Store}>
      <View style={{flex: 1}}>
        <Router />
      </View>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
