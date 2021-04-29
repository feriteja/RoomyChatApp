import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import IconMatCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import Message from '../../../data/dataMessage';
import {RoomItem} from '@components';
import {myUid, listUserRooms} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

const index = () => {
  const [roomsList, setRoomsList] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      listUserRooms().then(a => setRoomsList(a));
    });
    setRefresh(a => !a);

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      style={{flex: 1, backgroundColor: '#777'}}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('createRoom')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconFeather name="plus-square" size={25} color={'white'} />
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 22}}>
              Rooms
            </Text>
          </TouchableOpacity>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('searchRoom')}>
              <IconFeather
                name="search"
                size={20}
                color={'white'}
                style={{
                  backgroundColor: 'rgba(200,200,200,0.6)',
                  borderRadius: 99,
                  padding: 1,
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={[styles.botSection]}>
        {roomsList.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.idRoom}
              onPress={() => navigation.navigate('chat', {item, index})}>
              <RoomItem item={item} index={index} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSection: {
    // backgroundColor:'#FBFAFF'
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  botSection: {
    backgroundColor: '#FBFAFF',
    paddingHorizontal: 10,
    paddingVertical: 30,
    flex: 1,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    marginHorizontal: 5,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(200,200,200,0.7)',
    height: 40,
    borderRadius: 99,
  },
});
