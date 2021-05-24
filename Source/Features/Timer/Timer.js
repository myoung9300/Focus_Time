import React, { useState } from 'react';
import { View, StyleSheet, Text, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useKeepAwake } from 'expo-keep-awake';

import { colors } from '../../Utils/colors';
import { spacing } from '../../Utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';

const DEFAULT_TIME = 0.1;

export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  useKeepAwake();

  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  const [isStarted, setisStarted] = useState(false);
  const [progess, setprogress] = useState(1);
  const onProgress = (progress) => {
    setprogress(progress);
  };

  const Vibrate = () => {
    if (Platform.OS === 'ios') {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 10000);
    } else {
      Vibration.vibrate(10000);
    }
  };
  const onEnd = () => {
    Vibrate();
    setMinutes(DEFAULT_TIME);
    setprogress(1);
    setisStarted(false);
    onTimerEnd();
  };

  const changeTime = (min) => {
    setMinutes(min);
    setprogress(1);
    setisStarted(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.Countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <ProgressBar
        progress={progess}
        color={colors.black}
        style={{ height: 10 }}
      />
      <View style={styles.buttonWrapper}>
        <Timing onChangeTime={changeTime} />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}> We are focusing on:</Text>
        <Text style={styles.task}> {focusSubject}</Text>
      </View>
      <View style={styles.buttonWrapper}>
        {isStarted ? (
          <RoundedButton title="Pause" onPress={() => setisStarted(false)} />
        ) : (
          <RoundedButton title="Start" onPress={() => setisStarted(true)} />
        )}
      </View>
      <View style={styles.clearButton}>
        <RoundedButton
          title="-"
          size={50}
          onPress={() => clearSubject()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.black,
    textAlign: 'center',
  },
  task: {
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  Countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 0.3,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    flex: 0.1,
    paddingBottom: 25,
    paddingLeft: 25,
  },
});
