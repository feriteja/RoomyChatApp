import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    auth().currentUser
      ? navigation.reset({index: 0, routes: [{name: 'home'}]})
      : navigation.reset({index: 0, routes: [{name: 'auth'}]});
  }, []);

  return (
    <View>
      <Text>hello</Text>
    </View>
  );
};

export default splash;

const styles = StyleSheet.create({});
