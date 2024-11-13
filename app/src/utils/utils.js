import { Platform } from 'react-native';

export function getPlatformStyle() {

    console.log('Platform.OS: ', Platform.OS);

    if (Platform.OS === 'web') {
        const styles = require('./style.web.js');
    } else {
        const styles = require('./style.mobile.js');
    }

    return styles;
}