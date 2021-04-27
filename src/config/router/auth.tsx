import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Register, Login, Forgot, Verify} from '../../screens';

const Stack = createStackNavigator();

const auth = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="forgot" component={Forgot} />
      <Stack.Screen name="verify" component={Verify} />
    </Stack.Navigator>
  );
};

export default auth;
