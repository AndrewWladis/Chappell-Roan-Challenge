import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Share } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as StoreReview from 'expo-store-review';
import styles from './Styles'

function GameOver({ score, setScreen, theme }) {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        StoreReview.requestReview();

        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    `Score on ${(date.getMonth() + 1) + '/' + date.getDate()}: ${score.match(/✅/g).length}/10 \n ${score} \n from Chappell Roan Challenge, now on iOS`,
                //put link to app store here later
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <LinearGradient colors={theme} style={styles.gameOverScreen}>
            <Text style={styles.score}>{score.match(/✅/g).length}/10</Text>
            <Text style={styles.date}> on {date.toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => onShare()} style={styles.startButton}>
                <Text style={[styles.startButtonText, { fontFamily: 'chappell' }]}>share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setScreen('Home') }} style={styles.startButton}>
                <Text style={[styles.startButtonText, { fontFamily: 'chappell' }]}>Back home</Text>
            </TouchableOpacity>
            <Text style={[styles.creditText, { fontFamily: 'chappell' }]}>Created by @andywl27 on insta</Text>
        </LinearGradient>
    )
}

export default GameOver
