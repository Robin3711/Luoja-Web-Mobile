import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function Home() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
             <Button title='Open Drawer' onPress={() => navigation.openDrawer()}>Open drawer</Button>
            <Button title='Open Right Drawer' onPress={() => navigation.getParent().openDrawer()}>Open right drawer</Button>
        </View>
        );
}