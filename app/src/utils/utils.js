import { Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import {
    Amphora,
    Atom,
    Book,
    BookOpen,
    Calculator,
    Car,
    Clapperboard,
    Cone,
    Crown,
    Drama,
    Earth,
    Gamepad2,
    Globe,
    JapaneseYen,
    Laptop,
    Microscope,
    Music,
    Palette,
    Spade,
    Sparkle,
    Squirrel,
    Tv,
    Volleyball,
    Vote,
} from 'lucide-react-native';

export const iconSize = Platform.OS === 'web' ? 30 : 18;

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

export const formatReadableDate = (isoDate) => {
    const date = new Date(isoDate);
  
    // Obtenir les parties de la date
    const day = date.getDate().toString().padStart(2, '0'); // Jour avec un 0 devant si < 10
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois (0-indexé)
    const year = date.getFullYear();
  
    // Optionnel : Format d'heure
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`; // Format DD/MM/YYYY HH:mm
  };  

export function getThemeLabel(value) {
    return themeOptions.find(option => option.value === value)?.label;
}

export const themeOptions = [
    { label: 'General Knowledge', value: 9, icon: <Globe color="black" size={iconSize} /> },
    { label: 'Entertainment: Books', value: 10, icon: <Book color="black" size={iconSize} /> },
    { label: 'Entertainment: Film', value: 11, icon: <Clapperboard color="black" size={iconSize} /> },
    { label: 'Entertainment: Music', value: 12, icon: <Music color="black" size={iconSize} /> },
    { label: 'Entertainment: Musicals & Theatres', value: 13, icon: <Drama color="black" size={iconSize} /> },
    { label: 'Entertainment: Television', value: 14, icon: <Tv color="black" size={iconSize} /> },
    { label: 'Entertainment: Video Games', value: 15, icon: <Gamepad2 color="black" size={iconSize} /> },
    { label: 'Entertainment: Board Games', value: 16, icon: <Spade color="black" size={iconSize} /> },
    { label: 'Science & Nature', value: 17, icon: <Atom color="black" size={iconSize} /> },
    { label: 'Science: Computers', value: 18, icon: <Laptop color="black" size={iconSize} /> },
    { label: 'Science: Mathematics', value: 19, icon: <Calculator color="black" size={iconSize} /> },
    { label: 'Mythology', value: 20, icon: <Amphora color="black" size={iconSize} /> },
    { label: 'Sports', value: 21, icon: <Volleyball color="black" size={iconSize} /> },
    { label: 'Geography', value: 22, icon: <Earth color="black" size={iconSize} /> },
    { label: 'History', value: 23, icon: <Crown color="black" size={iconSize} /> },
    { label: 'Politics', value: 24, icon: <Vote color="black" size={iconSize} /> },
    { label: 'Art', value: 25, icon: <Palette color="black" size={iconSize} /> },
    { label: 'Celebrities', value: 26, icon: <Sparkle color="black" size={iconSize} /> },
    { label: 'Animals', value: 27, icon: <Squirrel color="black" size={iconSize} /> },
    { label: 'Vehicles', value: 28, icon: <Car color="black" size={iconSize} /> },
    { label: 'Entertainment: Comics', value: 29, icon: <BookOpen color="black" size={iconSize} /> },
    { label: 'Science: Gadgets', value: 30, icon: <Microscope color="black" size={iconSize} /> },
    { label: 'Entertainment: Japanese Anime & Manga', value: 31, icon: <JapaneseYen color="black" size={iconSize} /> },
    { label: 'Entertainment: Cartoon & Animations', value: 32, icon: <Cone color="black" size={iconSize} /> },
];

export const difficultyOptions = [
    { label: 'Toute difficulté', value: 'none' },
    { label: 'Facile', value: 'easy' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Difficile', value: 'hard' },
];
