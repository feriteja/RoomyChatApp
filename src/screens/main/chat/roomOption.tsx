import {useNavigation} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RoomMemberList, RoomRequestedList, RoomBannedList} from '@components';
import {myUid} from '@firebaseFunc';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconAnt from 'react-native-vector-icons/AntDesign';

const roomOption = ({route}: {route: any}) => {
  const {item} = route.params;

  useEffect(() => {}, []);

  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconEntypo name="chevron-left" size={30} />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item?.name}</Text>
          </View>
        </TouchableOpacity>
        {item?.admin === myUid() && (
          <TouchableOpacity
            onPress={() => navigation.navigate('roomInvite', {item})}>
            <IconAnt name="adduser" size={25} style={{fontWeight: 'bold'}} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Request</Text>
        </View>
        <View style={styles.sectionDetail}>
          <RoomRequestedList
            admin={item?.admin === myUid()}
            idRoom={item?.idRoom}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Member</Text>
        </View>
        <View style={styles.sectionDetail}>
          <RoomMemberList
            admin={item?.admin === myUid()}
            idRoom={item?.idRoom}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Banned</Text>
        </View>
        <View style={styles.sectionDetail}>
          <RoomBannedList
            admin={item?.admin === myUid()}
            idRoom={item?.idRoom}
          />
        </View>
      </View>
    </View>
  );
};

export default roomOption;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 80,
  },
  content: {paddingHorizontal: 20},
  section: {
    paddingVertical: 5,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  sectionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionDetail: {
    backgroundColor: '#fdfdfd',
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    elevation: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
