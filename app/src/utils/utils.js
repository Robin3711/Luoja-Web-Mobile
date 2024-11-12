import { Platform } from 'react-native';

export function getPlatformStyle() {
    if (Platform.OS === 'web') {
        const styles = require('./style.web.js');
    } else {
        const styles = require('./style.mobile.js');
    }

    return styles;
}

export const quizStyle = Platform.select({
    web: require('./style.web').quizStyle,
    default: require('./style.mobile').quizStyle,
});