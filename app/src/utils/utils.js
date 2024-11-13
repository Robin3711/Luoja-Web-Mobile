import { Platform } from 'react-native';

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

    if(apiUrl == null){
        if (Platform.OS === 'web') {
            const response = await fetch('/get-api-url');
            const data = await response.json();
            apiUrl = data.apiUrl;
        }
        else {
            apiUrl = 'https://api.luoja.fr';
        }
    }
    
    return apiUrl;
}