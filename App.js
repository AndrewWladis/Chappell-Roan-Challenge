import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Styles'
import Home from './Home'
import Questions from './Questions'
import GameOver from './GameOver'
import Unlimited from './Unlimited'
import Style from './Style'
import React, { useEffect, useState } from 'react';
import { useFonts, loadAsync } from 'expo-font';

export default function App() {
  const [screen, setScreen] = useState('Home')
  const [date, setDate] = useState(new Date());
  const [theme, setTheme] = useState(["#f05146", "#611711"]);
  const [score, setScore] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);


  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useFonts({
    'chappell': require('./assets/chappelroa.otf'),
  });

  useEffect(() => {
    loadAsync({
      'chappell': require('./assets/chappelroa.otf'),
    })
    .then(() => {
      setFontLoaded(true)
    })
  }, [])

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem('chappellRoanTheme');
      if (value !== null) {
        setTheme(value.split(','))
      }
    })().catch(err => {
      console.error(err);
    });
  }, []);

  function returnScreen() {
    switch (screen) {
      case 'Home':
        return <Home setScreen={setScreen} theme={theme} />
        break;
      case 'Questions':
        return <Questions setScreen={setScreen} setScore={setScore} />
        break;
      case 'Unlimited':
        return <Unlimited setScreen={setScreen} />
        break;
      case 'GameOver':
        return <GameOver setScreen={setScreen} score={score} theme={theme} />
        break;
      case 'Style':
        return <Style setScreen={setScreen} setTheme={setTheme} theme={theme} />
        break;
      default:
        return <Home setScreen={setScreen} theme={theme} />
        break;
    }
  }

  return (
    <View style={styles.home}>
      {returnScreen()}
    </View>
  )
}
