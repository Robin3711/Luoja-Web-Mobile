import { Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useFonts, LobsterTwo_400Regular, LobsterTwo_700Bold, LobsterTwo_700Bold_Italic } from '@expo-google-fonts/dev';
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

export async function getPlatformAPI() {
    if (apiUrl == null) {
        if (Platform.OS === 'web') {
            // Vérifie si l'application tourne sur Expo Metro Web
            if (Constants.debugMode) {
                apiUrl = 'http://localhost:3000';
                return apiUrl;
            } else {
                const response = await fetch('/get-api-url');
                const data = await response.json();
                apiUrl = data.apiUrl;
            }
        } else {
            apiUrl = 'http://localhost:3000';
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
    { label: 'Facile', value: 'easy' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Difficile', value: 'hard' },
];

export function loadFont() {
    let [fontsLoaded] = useFonts({
        LobsterTwo_400Regular,
        LobsterTwo_700Bold,
        LobsterTwo_700Bold_Italic,
    });

    if (!fontsLoaded) {
        return null;
    }
}