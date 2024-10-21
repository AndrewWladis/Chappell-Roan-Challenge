import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './Styles'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = ({ setScreen, theme }) => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@date');
            if (value === date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()) {
                Alert.alert('You already played today', 'Please check back in tomorrow for a new round of questions.');
            } else {
                setScreen('Questions')
                await AsyncStorage.setItem('@date', date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear());
            }
        } catch (e) {
            // error reading value
        }
    }

    const startUnlimited = async () => {
        setScreen('Unlimited')
    }

    return (
        <LinearGradient colors={theme} style={styles.homeContent}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { fontFamily: 'chappell' }]}>Chappell Roan Challenge</Text>
                <Text style={styles.date}>
                    {date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' })}
                </Text>
            </View>
            <TouchableOpacity onPress={() => getData()} style={styles.startButton}>
                <Text style={[styles.startButtonText, { fontFamily: 'chappell' }]}>START GAME</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startUnlimited()} style={styles.startButton}>
                <Text style={[styles.startButtonText, { fontFamily: 'chappell' }]}>UNLIMITED</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('Style')} style={styles.startButton}>
                <Text style={[styles.startButtonText, { fontFamily: 'chappell' }]}>Style</Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}

export default Home