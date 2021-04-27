import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SVG, {Path} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
  interpolateColor,
  interpolateColors,
} from 'react-native-reanimated';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface props {
  placeholder: string;
  type?: 'normal' | 'password' | 'email';
  value: (a: string) => void;
  defaultValue?: string;
  valid: undefined | boolean;
  [props: string]: any;
}

const cusLogFormInput: React.FC<props> = ({
  placeholder = 'placeholder',
  type = 'normal',
  valid = null,
  value,
  defaultValue = '',
  ...props
}) => {
  const [textValue, setTextValue] = useState(defaultValue);
  const [showState, setShowState] = useState(false);
  const [hidePassword, setHidePassword] = useState(type === 'password');

  const validValue = useSharedValue(0);
  const curvedPath = useSharedValue(0);
  const strokeOffset = useSharedValue(-380);

  const propsPath = useAnimatedProps(() => {
    const path = `m 0 0 h 310 c 20 ${curvedPath.value} 20 ${curvedPath.value} 40 0 h 40 `;

    const strokeColor = interpolateColor(
      validValue.value,
      [-1, 0, 1],
      ['#cc0000', '#777', '#00c851'],
    );

    return {
      d: path,
      stroke: strokeColor,
      strokeDashoffset: strokeOffset.value,
    };
  });

  const springConfig = {damping: 100, stiffness: 800};

  const onNotFocus = () => {
    curvedPath.value = withSequence(
      withSpring(10, springConfig),
      withSpring(-6, springConfig),
      withSpring(5, springConfig),
      withSpring(0, springConfig),
    );
    setShowState(true);
    if (textValue.length < 1) {
      valid = false;
    }
  };

  const setOffsetStroke = () => {
    textValue.length > 0
      ? (strokeOffset.value = withTiming(-760, {duration: 700}))
      : (strokeOffset.value = withTiming(-380, {duration: 700}));
  };

  const valueValid = () => {
    valid === true ? (validValue.value = 1) : (validValue.value = -1);
  };

  useEffect(() => {
    value(textValue);
    setOffsetStroke();
    valueValid();
  }, [textValue, valid]);

  return (
    <View style={{alignSelf: 'stretch'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TextInput
          {...props}
          value={textValue}
          onChangeText={e => setTextValue(e)}
          autoCapitalize={
            type === 'email' || type === 'password' ? 'none' : undefined
          }
          onEndEditing={() => onNotFocus()}
          placeholder={placeholder}
          secureTextEntry={hidePassword}
          placeholderTextColor="#777"
          style={{
            width: 300,
            margin: 0,
            paddingBottom: 0,
            color: '#000',
            marginBottom: 0,
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <IconEntypo
            name={valid ? 'check' : 'cross'}
            size={25}
            style={{
              position: 'absolute',
              right: 40,
              opacity: showState ? 1 : 0,
            }}
          />
          <TouchableOpacity
            style={{opacity: 1}}
            onPress={() => setHidePassword(prev => !prev)}>
            <IconEntypo
              name={hidePassword ? 'eye-with-line' : 'eye'}
              size={25}
              style={{
                paddingHorizontal: 5,
                opacity: textValue.length > 0 && type === 'password' ? 1 : 0,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <SVG viewBox="0 0 380 10" style={{height: 19}}>
        <AnimatedPath
          animatedProps={propsPath}
          strokeWidth={2}
          strokeDasharray={[380, 380]}
        />
      </SVG>
    </View>
  );
};

export default cusLogFormInput;

const styles = StyleSheet.create({});
