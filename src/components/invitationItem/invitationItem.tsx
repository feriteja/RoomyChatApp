import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getRoomHeadInfo} from '@firebaseFunc';
import IconEntypo from 'react-native-vector-icons/Entypo';

interface props {
  idRoom: string;
  userActionAcceptInvite: (idRoom: string) => void;
  userActionRejectInvite: (idRoom: string) => void;
}

const invitationItem: React.FC<props> = ({
  idRoom,
  userActionAcceptInvite,
  userActionRejectInvite,
}) => {
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    getRoomHeadInfo({idRoom}).then(a => setRoomInfo(a?.roomInfo));
  }, []);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: roomInfo?.photoURL}}
          style={{height: 60, width: 60, borderRadius: 10}}
        />
        <Text style={{alignSelf: 'center', marginLeft: 10, fontSize: 14}}>
          {roomInfo?.name}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => userActionAcceptInvite({idRoom})}>
          <View style={styles.section2}>
            <IconEntypo name="check" size={20} />
            <Text style={{fontSize: 13}}>Accept</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => userActionRejectInvite({idRoom})}>
          <View style={[styles.section2, {backgroundColor: '#cc0000'}]}>
            <IconEntypo name="cross" size={20} />
            <Text style={{fontSize: 13}}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default invitationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5cd85c',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
