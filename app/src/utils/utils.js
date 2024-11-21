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

export function getThemeName(themeNumber) {
    // use a dictionary to map themeNumber to themeName
    const themeNames = {
        9: 'General Knowledge',
        10: 'Entertainment: Books',
        11: 'Entertainment: Film',
        12: 'Entertainment: Music',
        13: 'Entertainment: Musicals & Theatres',
        14: 'Entertainment: Television',
        15: 'Entertainment: Video Games',
        16: 'Entertainment: Board Games',
        17: 'Science & Nature',
        18: 'Science: Computers',
        19: 'Science: Mathematics',
        20: 'Mythology',
        21: 'Sports',
        22: 'Geography',
        23: 'History',
        24: 'Politics',
        25: 'Art',
        26: 'Celebrities',
        27: 'Animals',
        28: 'Vehicles',
        29: 'Entertainment: Comics',
        30: 'Science: Gadgets',
        31: 'Entertainment: Japanese Anime & Manga',
        32: 'Entertainment: Cartoon & Animations'
    };
    return themeNames[themeNumber];
}