import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {logout} from '@firebaseFunc';

const verify = () => {
  useEffect(() => {
    logout();
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        Thanks for registering, please check your email message to verify
      </Text>
    </View>
  );
};

export default verify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
