import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {
  roomSearch,
  roomRequestJoin,
  roomRequestCancelJoin,
} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Gap} from '@components';

const searchRoom = () => {
  const [idRoom, setIdRoom] = useState('');
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [roomInfo, setRoomInfo] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined | null
  >(null);

  const navigation = useNavigation();

  const searchHandler = () => {
    roomSearch({idRoom}).then(a => {
      setRoomInfo(a);
      setLoadingRequest(false);
    });
  };

  const roomRequestHandler = () => {
    console.log(roomInfo);
    setLoadingRequest(true);

    if (roomInfo?.status === 'requested') {
      roomRequestCancelJoin({
        idRoom: roomInfo?.data?.idRoom,
      }).then(a => {
        searchHandler();
      });
      return;
    }
    if (roomInfo?.status === 'member') {
      navigation.navigate('chat', {item: {idRoom}});
      return;
    } else {
      roomRequestJoin({idRoom: roomInfo?.data?.idRoom}).then(a => {
        searchHandler();
      });
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerOption}>
        <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
          <IconEntypo name="chevron-left" size={30} />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>Search Room's ID</Text>
      </View>
      <View style={styles.searchSection}>
        <IconMaterial
          name="meeting-room"
          size={25}
          style={{marginHorizontal: 10}}
        />
        <TextInput
          onChangeText={e => setIdRoom(e)}
          value={idRoom}
          placeholder="Room's id"
          placeholderTextColor="#777"
          autoCapitalize="none"
          style={{padding: 0, margin: 0, flex: 1, color: '#000'}}
        />
        <TouchableOpacity onPress={() => searchHandler()}>
          <IconFeather name="search" size={25} style={{marginHorizontal: 10}} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchResult}>
        {roomInfo?.data ? (
          <>
            <Image
              source={
                roomInfo?.data?.photoURL === undefined
                  ? require('../../../../assets/avatar/ava.jpg')
                  : {uri: roomInfo?.data?.photoURL}
              }
              style={styles.profileAva}
            />
            <Gap height={20} />
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              {roomInfo?.data?.name || 'name'}
            </Text>
            <Gap height={20} />
            <TouchableOpacity
              disabled={loadingRequest}
              onPress={() => roomRequestHandler()}
              style={{
                backgroundColor: loadingRequest
                  ? '#aaa'
                  : roomInfo.status === 'requested'
                  ? '#cc0000'
                  : roomInfo.status === 'member'
                  ? '#aaa'
                  : '#1A92DA',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
              }}>
              <Text style={{color: '#fff'}}>
                {roomInfo.status === 'requested'
                  ? 'cancel'
                  : roomInfo.status === 'member'
                  ? 'joined'
                  : 'join'}
              </Text>
            </TouchableOpacity>
          </>
        ) : roomInfo === undefined ? (
          <View>
            <Text>Room's ID not found</Text>
          </View>
        ) : (
          <View>
            <Text>Search Room's ID</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default searchRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    backgroundColor: 'yellow',
    justifyContent: 'center',
  },
  headerOption: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 80,
    alignItems: 'center',
  },
  profileAva: {height: 120, width: 120, borderRadius: 30},

  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  searchResult: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
