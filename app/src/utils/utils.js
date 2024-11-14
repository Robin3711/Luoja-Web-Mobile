import { Platform } from 'react-native';
import Constants from 'expo-constants';

let apiUrl = null;

export function getPlatformStyle() {

    if (Platform.OS === 'web') {
        const styles = require('./style.web.js');
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