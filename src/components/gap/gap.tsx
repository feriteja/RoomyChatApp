import React from 'react';
import {View, Text} from 'react-native';

interface props {
  height?: number;
  width?: number;
}

const gap: React.FC<props> = ({height = 0, width = 0}) => {
  return <View style={{height, width}} />;
};

export default gap;
