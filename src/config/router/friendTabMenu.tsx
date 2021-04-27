import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PendingFriend, FriendRequested, FriendList} from '@screens';

const Tab = createMaterialTopTabNavigator();

const friendTabMenu = () => {
  return (
    <Tab.Navigator tabBarOptions={{labelStyle: {textTransform: 'none'}}}>
      <Tab.Screen
        name="friendList"
        component={FriendList}
        options={{
          tabBarLabel: 'Friend List',
          tabBarIcon: () => <Text>sdsa</Text>,
        }}
      />
      <Tab.Screen
        name="requested"
        component={FriendRequested}
        options={{
          tabBarLabel: 'Friend Request',
          tabBarIcon: () => <Text>sdsa</Text>,
        }}
      />
      <Tab.Screen
        name="requesting"
        component={PendingFriend}
        options={{
          tabBarLabel: 'Pending',
          tabBarIcon: () => <Text>sdsa</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default friendTabMenu;
