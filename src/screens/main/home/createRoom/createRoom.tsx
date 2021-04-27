import {CusLogFormInput} from '@components';
import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {validRoomId, createRoomChat} from '@firebaseFunc';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';

const createRoom = () => {
  const [idRoom, setIdRoom] = useState('');
  const [roomName, setRoomName] = useState('');
  const [idRoomValid, setIdRoomValid] = useState<boolean | undefined>(false);
  const [photo, setPhoto] = useState<string>('');
  const [openedPick, setOpenedPick] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const documentPick = async () => {
    try {
      setOpenedPick(true);
      await launchImageLibrary(
        {mediaType: 'photo', maxWidth: 200, maxHeight: 200, quality: 0.5},

        res => {
          if (res.didCancel) return setOpenedPick(false);
          setPhoto(res.uri);
        },
      );
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    validRoomId({idRoom: idRoom}).then(a => setIdRoomValid(a));
  }, [idRoom]);

  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000055',
          }}>
          <ActivityIndicator size="large" color="#ca0000" />
        </View>
      )}
      <View
        style={[
          styles.header,
          {justifyContent: 'space-between', paddingHorizontal: 20},
        ]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => navigation.goBack()}>
            <IconEntypo name="chevron-left" size={30} />
          </TouchableOpacity>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Create Room</Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              createRoomChat({
                file: photo,
                idRoom: idRoom,
                name: roomName,
              }).then(a => {
                a === 'success'
                  ? navigation.replace('chat', {item: {idRoom}})
                  : setErrorMessage(a);
                setLoading(false);
              });
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            disabled={openedPick}
            onPress={() => documentPick()}>
            {photo.length > 0 ? (
              <Image
                source={{uri: photo}}
                style={{
                  height: 80,
                  width: 80,
                  marginRight: 10,
                  borderRadius: 10,
                  alignSelf: 'baseline',
                }}
              />
            ) : (
              <IconEntypo
                name="plus"
                size={80}
                style={{
                  backgroundColor: '#a5b9fa',
                  alignSelf: 'baseline',
                  marginRight: 10,
                  borderRadius: 10,
                  borderWidth: 0.4,
                  elevation: 1,
                }}
              />
            )}
          </TouchableOpacity>

          <Text>Room's photo</Text>
        </View>
        <TextInput
          placeholder="room name"
          placeholderTextColor="#666"
          onChangeText={a => setRoomName(a)}
          style={[styles.textInput, {marginBottom: 0, paddingBottom: 5}]}
        />
        <View
          style={{
            alignSelf: 'stretch',
          }}>
          <CusLogFormInput
            defaultValue={idRoom}
            placeholder="idRoom"
            value={a => setIdRoom(a)}
            type="email"
            valid={idRoomValid}
          />
          <View
            style={{
              position: 'absolute',
              height: 1.6,
              backgroundColor: idRoom?.length > 0 ? 'transparent' : '#000',
              alignSelf: 'stretch',
              bottom: 14,
              zIndex: -1,
              left: 0,
              right: 0,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default createRoom;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    elevation: 6,
  },
  container: {flex: 1},
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textInput: {
    color: '#000',
    margin: 0,
    borderBottomWidth: 1.6,
  },
});
