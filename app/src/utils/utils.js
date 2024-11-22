import { Platform, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

let apiUrl = null;

export function getPlatformStyle() {

    if (Platform.OS === 'web') {
        const { width } = Dimensions.get('window');
        if (width > 1024) {
            const styles = require('./style.web.js');
        } else {
            const styles = require('./style.mobile.js');
        }
    } else {
        const styles = require('./style.mobile.js');
    }

    return styles;
}

export async function getPlatformAPI() {
    if (apiUrl == null) {
        if (Platform.OS === 'web') {
            // Vérifie si l'application tourne sur Expo Metro Web
            if (Constants.debugMode) {
                apiUrl = 'https://api.luoja.fr';
                return apiUrl;
            } else {
                const response = await fetch('/get-api-url');
                const data = await response.json();
                apiUrl = data.apiUrl;
            }
        } else {
            apiUrl = 'https://api.luoja.fr';
        }
    }
    return apiUrl;
}

export async function requireToken(navigation) {
    if (!await hasToken()) {
        navigation.navigate('login');
    }
}

export async function hasToken() {
    const token = await AsyncStorage.getItem('token');
    return token !== null;
}

export async function setToken(token) {
    try {
        await AsyncStorage.setItem('token', token);
    } catch (error) {
        console.error('Error setting token:', error);
    }
}

export async function removeToken() {
    try {
        await AsyncStorage.removeItem('token');
    } catch (error) {
        console.error('Error removing token:', error);
    }
}

export const themeOptions = [
    { label: 'General Knowledge', value: 9 },
    { label: 'Entertainment: Books', value: 10 },
    { label: 'Entertainment: Film', value: 11 },
    { label: 'Entertainment: Music', value: 12 },
    { label: 'Entertainment: Musicals & Theatres', value: 13 },
    { label: 'Entertainment: Television', value: 14 },
    { label: 'Entertainment: Video Games', value: 15 },
    { label: 'Entertainment: Board Games', value: 16 },
    { label: 'Science & Nature', value: 17 },
    { label: 'Science: Computers', value: 18 },
    { label: 'Science: Mathematics', value: 19 },
    { label: 'Mythology', value: 20 },
    { label: 'Sports', value: 21 },
    { label: 'Geography', value: 22 },
    { label: 'History', value: 23 },
    { label: 'Politics', value: 24 },
    { label: 'Art', value: 25 },
    { label: 'Celebrities', value: 26 },
    { label: 'Animals', value: 27 },
    { label: 'Vehicles', value: 28 },
    { label: 'Entertainment: Comics', value: 29 },
    { label: 'Science: Gadgets', value: 30 },
    { label: 'Entertainment: Japanese Anime & Manga', value: 31 },
    { label: 'Entertainment: Cartoon & Animations', value: 32 },
];

export const difficultyOptions = [
    { label: 'Facile', value: 'easy' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Difficile', value: 'hard' },
];