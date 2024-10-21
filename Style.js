import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Share } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Styles'

function Style({ setScreen, setTheme, theme }) {
    
    const themes = [
        {
            text: 'Red Supernova',
            value: ["#f05146", "#611711"]
        },
        {
            text: 'Pink Pony Club',
            value: ['#ff54aa', '#12090d']
        },
    ]

    const [checked, setChecked] = useState(0)

    useEffect(() => {
        if (theme === themes[0].value.join(',')) {
            setChecked(0)
        } else if (theme === themes[1].value.join(',')) {
            setChecked(1)
        }
    }, [])

    const setItem = async (value) => {
        try {
            await AsyncStorage.setItem('chappellRoanTheme', String(value[0] + ',' + value[1]));
        } catch (e) {
            // saving error
        }
    };

    return (
        <LinearGradient colors={theme} style={styles.homeContent}>
            <View style={styles.themeList}>
                {themes.map((font, index) => (
                    <View style={styles.row} key={index}>
                        {(checked === index) ? (
                            <>
                                <MaterialCommunityIcons name="star-four-points-outline" size={40} color="white" style={{ transform: [{ rotate: '-20deg' }] }} />
                                <Text style={[styles.themeFont, { fontFamily: "chappell", color: 'white' }]}> {font.text} </Text>
                            </>
                        ) : (
                            <TouchableOpacity onPress={() => { setChecked(index); setItem(font.value); setTheme(font.value) }} style={{ marginLeft: 40 }}>
                                <Text style={[styles.themeFont, { fontFamily: "chappell", color: 'white' }]}> {font.text} </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
                <TouchableOpacity onPress={() => setScreen('Home')} style={styles.startButton}>
                    <Text style={[styles.backHomeText, { fontFamily: 'chappell' }]}>Back Home</Text>
                </TouchableOpacity>
            </LinearGradient>
    )
}

export default Style