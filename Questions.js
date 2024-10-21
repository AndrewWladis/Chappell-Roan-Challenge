import { View, Text, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react'
import styles from './Styles'
import lyrics from './lyrics';

async function getQuestions() {
    let now = new Date();
    let num = Math.floor(((((now.getDay() + 3) * (now.getDate() + now.getMonth() + 1)) + (now.getMonth() * 3)) * 2) / 10)


    let allSongs = [
        "Good Luck, Babe!",
        "Good Hurt",
        "Die Young",
        "Sugar High",
        "Pink Pony Club",
        "California",
        "Casual",
        "Naked in Manhattan",
        "My Kink is Karma",
        "Femininomenon",
        "Red Wine Supernova",
        "HOT TO GO!",
        "Coffee",
        "Super Graphic Ultra Modern Girl"
    ];

    const lyricsArray = []
    const quizList = []

    lyrics.forEach(albumData => {
        const songs = albumData.songs;
        songs.forEach(songData => {
            const songLyrics = songData.lyrics;
            songLyrics.forEach(lyric => {
                lyricsArray.push([lyric, songData.song]);
            });
        });
    });
    
    let j = Math.ceil(num / 100);
    
    console.log(lyricsArray.length / num);
    for (let i = num; i < lyricsArray.length; i += num) {
        if (quizList.length < 10) {
            const item = {
                quote: {
                    quote: lyricsArray[i][0],
                    author: lyricsArray[i][1]
                },
                options: []
            };
            
            let supportingSongs = [];
            while (supportingSongs.length < 2) {
                if (Math.ceil(num / 13) > allSongs.length) {
                    supportingSongs = ['loml', 
                                       'All Too Well (10 Minute Version) [From The Vault]', 
                                       'no body, no crime'];
                }
    
                if (j >= allSongs.length) {
                    j = Math.ceil(num / 22);
                }
    
                supportingSongs.push(allSongs[j]);
                j += Math.ceil(num / 22);
            }
    
            supportingSongs.splice(lyricsArray[i][0].length % 3, 0, item.quote.author);
            item.options = supportingSongs;
    
            quizList.push(item);
        } else {
            break;
        }
    }
    console.log(JSON.stringify(quizList));
    return JSON.stringify(quizList);
}

function Questions({ setScreen, setScore }) {
    const [externalData, setExternalData] = useState([])
    const [color, setColors] = useState('normal');
    const [isLoad, setLoad] = useState(true);
    const [quoteOpacity, setQuoteOpacity] = useState(1)
    const [questionNumber, setQuestionNumber] = useState(1);
    const [questionArr, setQuestionArr] = useState('');
    const [timer, setTimer] = useState(15);
    const [quote, setQuote] = useState({
        quote: {
            quote: 'Loading...',
            author: 'Andy Wladis'
        },
        options: ['Loading...', 'Loading...', 'Loading...', 'Loading...']
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer => timer - 1);

            if (timer <= 0) {
                isAnswer('Andy');
                clearInterval(interval);
                setTimer(0)
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isAnswer, timer]);

    useEffect(() => {
        if (externalData.length > 0) {
            if (quote.quote.quote != 'Loading..') {
                setQuoteOpacity(1)
                setTimer(13)
            } else {
                setQuoteOpacity(0)
            }
        }
    }, [quote]);

    useEffect(() => {
        if (externalData.length > 0) {
            if (isLoad) {
                setQuote(externalData[0])
                setLoad(false)
            }

            getData();
        }
    }, [externalData])

    useEffect(() => {
        const fetchQuestions = async () => {
            const data = await getQuestions();
            setExternalData(JSON.parse(data));
        };

        fetchQuestions();
    }, [])


    function blankState() {
        setQuote({
            quote: {
                quote: 'Loading..',
                author: 'Andy Wladis'
            },
            options: [' ', ' ', ' ', ' ']
        });
    }

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('@questionNumber', value.toString())
        } catch (e) {
            // saving error
        }
    }

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@questionNumber')
            const date = await AsyncStorage.getItem('@date')
            if (date !== date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()) {
                storeData("1")
                setQuestionNumber(1)
            } else {
                setQuestionNumber(Number(value));
            }
        } catch (e) {
            // error reading value
        }
    }

    const isAnswer = (ele) => {
        if (color === 'normal' && quote.quote.author != 'Andy Wladis') {
            if (ele === quote.quote.author) {
                setColors('#5bde6a')
                setQuestionArr(questionArr + '✅');
            } else {
                setColors('#fc746a')
                setQuestionArr(questionArr + '❌');
            }
            if (questionNumber < 10) {
                setTimeout(() => {
                    setColors('normal')
                    blankState()
                    setQuote(externalData[questionNumber])
                    setQuestionNumber(questionNumber + 1);
                    storeData(questionNumber)

                }, 1500)
            } else {
                setTimeout(() => {
                    setScore('✅' + questionArr)
                    setScreen('GameOver')
                }, 1000)
            }
        }
    }

    const returnColor = (num) => {
        if (color === 'normal') {
            return "#e8e8e8";
        } else {
            return color;
        }
    }

    return (
        <>
            {
                (externalData.length > 0) ? (
                    <View style={styles.questionContainer}>
                        <View style={styles.headerContainer}>
                            <View style={styles.headerContent}>
                                <Text style={styles.questionNumber}>Track #{questionNumber}</Text>
                                <Text style={[styles.timer]}>{timer}</Text>
                            </View>
                            <Text style={[styles.quote, { opacity: quoteOpacity }]}>"{quote.quote.quote}"</Text>
                        </View>
                        {quote.options.map((element, index) => (
                            <TouchableOpacity onPress={() => { isAnswer(element) }} key={index}>
                                {(element === quote.quote.author && color === '#fc746a') ? (
                                    <View style={[styles.option, { backgroundColor: '#5bde6a' }]}>
                                        <Text style={styles.optionText}>{element}</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.option, { backgroundColor: returnColor(index), }]}>
                                        <Text style={styles.optionText}>{element}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.questionLoadingContainer}>
                        <Text style={styles.quoteTTPD}>LOADING...</Text>
                    </View>
                )
            }
        </>
    )
}

export default Questions