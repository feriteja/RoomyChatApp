import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/core';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {Gap, InvitationItem} from '@components';
import {
  getProfileInfo,
  logout,
  listRoomInvitation,
  userActionAcceptInvite,
  userActionRejectInvite,
} from '@firebaseFunc';

import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import useSWR from 'swr';

const profile = () => {
  const {data: profilInfo} = useSWR(auth().currentUser?.uid || 'useID', key =>
    getProfileInfo({uid: key}),
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [invitationList, setInvitationList] = useState<
    FirebaseFirestoreTypes.DocumentData[] | undefined
  >([]);
  const [profileInfo, setProfileInfo] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined
  >(profilInfo);

  const [refresh, setRefresh] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProfileInfo({uid: auth().currentUser?.uid}).then(a =>
        setProfileInfo(a),
      );
    });

    return unsubscribe;
  }, [navigation]);

  const acceptHandler = (idRoom: string) => {
    userActionAcceptInvite({idRoom});
    console.log('invok');
    setRefresh(a => !a);
  };
  const rejectHandler = (idRoom: string) => {
    userActionRejectInvite({idRoom});

    setRefresh(a => !a);
  };

  // useEffect(() => {
  //   getProfileInfo({uid: auth().currentUser?.uid}).then(a => setProfileInfo(a));
  //   listRoomInvitation().then(a => setInvitationList(a));
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerOption}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconEntypo name="chevron-left" size={30} />
          </TouchableOpacity>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Profile</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <IconEntypo name="dots-three-horizontal" size={25} />
        </TouchableOpacity>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{flex: 1}}>
            <View
              style={{
                width: 200,
                backgroundColor: '#fafafa',
                borderRadius: 10,
                position: 'absolute',
                right: 20,
                top: 40,
              }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderBottomWidth: 0.5,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate('option', {data: profileInfo});
                }}>
                <Text>Edit profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  logout().then(a =>
                    navigation.reset({index: 0, routes: [{name: 'auth'}]}),
                  );
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderBottomWidth: 0.5,
                }}>
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <View style={styles.userInfo}>
        {profileInfo ? (
          <>
            <Image
              source={
                profileInfo?.photoURL === undefined
                  ? require('../../../assets/avatar/ava.jpg')
                  : {uri: profileInfo?.photoURL}
              }
              style={styles.profileAva}
            />
            <Gap height={20} />
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              {profileInfo?.name || 'name'}
            </Text>
            <Text style={{fontSize: 18}}>{profileInfo?.signature || ''}</Text>
          </>
        ) : (
          <Text>Loading</Text>
        )}
      </View>
      <Gap height={40} />
      <View style={styles.content}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Invitation</Text>
        <Gap height={20} />
        <FlatList
          extraData={refresh}
          keyExtractor={(a, i) => i + 'invitation'}
          data={invitationList}
          renderItem={({item, index}) => {
            return (
              <InvitationItem
                userActionAcceptInvite={acceptHandler}
                userActionRejectInvite={rejectHandler}
                idRoom={item?.idRoom}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  userInfo: {
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerOption: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileAva: {height: 120, width: 120, borderRadius: 30},
});
