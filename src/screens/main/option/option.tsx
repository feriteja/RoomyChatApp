import {CusLogFormInput, Gap} from '@components';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import DocumentPicker from 'react-native-document-picker';
import {updateProfile, validUsername} from '@firebaseFunc';
import {launchImageLibrary} from 'react-native-image-picker';

const option = ({route}: any) => {
  const {data} = route.params;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(data.name);
  const [userName, setUserName] = useState(data?.username || '');
  const [userNameValid, setUserNameValid] = useState<undefined | boolean>(
    false,
  );
  const [openedPick, setOpenedPick] = useState(false);
  const [signature, setSignature] = useState(data.signature || '');
  const [phone, setPhone] = useState(data.phone);
  const [photo, setPhoto] = useState<string>(
    data.photoURL || '../../../assets/avatar/ava.jpg',
  );
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const navigation = useNavigation();

  const documentPick = async () => {
    try {
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

  const onConfirmHandler = () => {
    setLoading(true);
    updateProfile({
      file: photo,
      name,
      phone,
      signature,
      userName,
    }).then(a => {
      setLoading(false);
      a === 'success' ? navigation.navigate('profile') : setErrorMessage(a);
    });
  };

  useEffect(() => {
    validUsername({username: userName}).then(a => setUserNameValid(a));
  }, [userName]);

  return (
    <View style={styles.container}>
      <Modal animationType="fade" transparent={true} visible={loading}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#444444aa',
          }}>
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <Text>Wait</Text>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconEntypo name="chevron-left" size={30} />
          </TouchableOpacity>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Edit Profile</Text>
        </View>
        <TouchableOpacity onPress={() => onConfirmHandler()}>
          <IconEntypo name="check" size={30} color="#23527C" />
        </TouchableOpacity>
      </View>
      <View style={styles.editable}>
        <Gap height={20} />
        {errorMessage && (
          <>
            <Text
              style={{
                color: '#cc0000',
                fontSize: 18,
              }}>
              {errorMessage}
            </Text>
            <Gap height={20} />
          </>
        )}

        <Pressable
          style={{justifyContent: 'center', alignItems: 'center'}}
          disabled={openedPick}
          onPress={() => {
            setOpenedPick(true);
            documentPick();
          }}>
          <Image source={{uri: photo}} style={styles.profileAva} />
          <Gap height={10} />
          <Text style={{fontSize: 16}}>Change Profile Photo</Text>
        </Pressable>
        <Gap height={20} />
        <View
          style={{
            alignSelf: 'stretch',
          }}>
          <CusLogFormInput
            defaultValue={userName}
            placeholder="username"
            value={a => setUserName(a)}
            type="email"
            valid={userNameValid}
          />
          <View
            style={{
              position: 'absolute',
              height: 1.6,
              backgroundColor: userName?.length > 0 ? 'transparent' : '#000',
              alignSelf: 'stretch',
              bottom: 14,
              zIndex: -1,
              left: 0,
              right: 0,
            }}
          />
        </View>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={a => setName(a)}
          placeholderTextColor="#aaa"
          style={styles.textInput}
        />
        <TextInput
          placeholder="Signature"
          value={signature}
          onChangeText={a => setSignature(a)}
          placeholderTextColor="#aaa"
          style={styles.textInput}
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={a => setPhone(a)}
          placeholderTextColor="#aaa"
          style={styles.textInput}
        />
      </View>
    </View>
  );
};

export default option;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 80,
  },
  editable: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAva: {height: 120, width: 120, borderRadius: 30},
  textInput: {
    color: '#000',
    paddingHorizontal: 10,
    margin: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    alignSelf: 'stretch',
  },
});
