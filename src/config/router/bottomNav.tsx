import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Profile, FriendList, Home} from '@screens';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {Text, TouchableOpacity, View} from 'react-native';
import friendTabMenu from './friendTabMenu';

const BottomNav = createBottomTabNavigator();

const bottomNav = () => {
  return (
    <BottomNav.Navigator
      tabBarOptions={{
        activeBackgroundColor: '#cccccc',
      }}
      initialRouteName="home">
      <BottomNav.Screen
        name="home"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused, color}) => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconMaterial
                  color={color}
                  name="chat-bubble-outline"
                  size={focused ? 25 : 15}
                />
                <Text>Rooms</Text>
              </View>
            );
          },
        }}
      />
      <BottomNav.Screen
        name="friendTabMenu"
        component={friendTabMenu}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused, color}) => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconMaterial
                  name="group"
                  size={focused ? 25 : 15}
                  color={color}
                />
                <Text>Friends</Text>
              </View>
            );
          },
        }}
      />
      <BottomNav.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused, color}) => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconMaterial
                  name="chat-bubble-outline"
                  size={focused ? 25 : 15}
                  color={color}
                />
                <Text>Profile</Text>
              </View>
            );
          },
        }}
      />
    </BottomNav.Navigator>
  );
};

export default bottomNav;
