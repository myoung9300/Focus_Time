import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Focus } from './Source/Features/Focus/Focus';
import { FocusHistory } from './Source/Features/Focus/FocusHistory';
import { Timer } from './Source/Features/Timer/Timer';
import { colors } from './Source/Utils/colors';
import { spacing } from './Source/Utils/sizes';

export default function App() {
  console.log ("yolo")
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setfocusHistory] = useState([]);
  const STATUSES = {
    COMPLETE: 1,
    CANCELLED: 2,
  };
  const addFocusHistorySubjectWithStatus = (subject, status) => {
    setfocusHistory([...focusHistory, { key: String(focusHistory +1), subject, status }]);
  };
  const onClear = () => {
    setfocusHistory([]);
  };

  const saveFocusHistory = async () => {
    try {
      await AsyncStorage.setItem('focusHistory', JSON.stringify(focusHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHistory');

      if (history && JSON.parse(history).length) {
        setfocusHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

useEffect(() => {
  loadFocusHistory();
}, [])

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubjectWithStatus(focusSubject, STATUSES.COMPLETE);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            addFocusHistorySubjectWithStatus(focusSubject, STATUSES.CANCELLED);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{ flex:1}}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl : spacing.md,
    backgroundColor: colors.babyBlue,
  },
});
