import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
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
import {getProfileByUsername, requestFriend} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Gap} from '@components';

const firendSearch = () => {
  const [firendId, setFirendId] = useState('');
  const [userInfo, setUserInfo] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined | null
  >(null);

  const navigation = useNavigation();

  const searchHandler = () => {
    getProfileByUsername({username: firendId}).then(a => setUserInfo(a));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerOption}>
        <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
          <IconEntypo name="chevron-left" size={30} />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
          Search Friend's UserID
        </Text>
      </View>
      <View style={styles.searchSection}>
        <IconFeather name="user" size={25} style={{marginHorizontal: 10}} />
        <TextInput
          onChangeText={e => setFirendId(e)}
          value={firendId}
          placeholder="Friend's id"
          placeholderTextColor="#777"
          autoCapitalize="none"
          style={{padding: 0, margin: 0, flex: 1, color: '#000'}}
        />
        <TouchableOpacity onPress={() => searchHandler()}>
          <IconFeather name="search" size={25} style={{marginHorizontal: 10}} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchResult}>
        {userInfo ? (
          <>
            <Image
              source={
                userInfo?.photoURL === undefined
                  ? require('../../../../assets/avatar/ava.jpg')
                  : {uri: userInfo?.photoURL}
              }
              style={styles.profileAva}
            />
            <Gap height={20} />
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              {userInfo?.name || 'name'}
            </Text>
            <Text style={{fontSize: 18}}>{userInfo?.signature || ''}</Text>
            <Gap height={20} />
            <TouchableOpacity
              onPress={() => requestFriend({targetUid: userInfo?.uid})}
              style={{
                backgroundColor: '#1A92DA',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
              }}>
              <Text style={{color: '#fff'}}>Add friend</Text>
            </TouchableOpacity>
          </>
        ) : userInfo === undefined ? (
          <View>
            <Text>UserID not found</Text>
          </View>
        ) : (
          <View>
            <Text>Search your friend's UserID</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default firendSearch;

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
