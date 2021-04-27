import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Auth from './auth';
import BottomNav from './bottomNav';
import {
  Chat,
  CreateRoom,
  FriendSearch,
  Option,
  RoomInvite,
  RoomOption,
  SearchRoom,
  Splash,
} from '../../screens';

const Stack = createStackNavigator();

const index = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="auth" component={Auth} />
        <Stack.Screen name="home" component={BottomNav} />
        <Stack.Screen name="createRoom" component={CreateRoom} />
        <Stack.Screen name="searchRoom" component={SearchRoom} />
        <Stack.Screen name="roomOption" component={RoomOption} />
        <Stack.Screen name="roomInvite" component={RoomInvite} />
        <Stack.Screen name="chat" component={Chat} />
        <Stack.Screen name="option" component={Option} />
        <Stack.Screen name="friendSearch" component={FriendSearch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default index;
