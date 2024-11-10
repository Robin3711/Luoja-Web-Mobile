import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeScreen: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    homeScreenButtonsView: {
        display: 'flex',
        backgroundColor: 'lightgrey',
        minWidth: '50%',
        minHeight: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    homeScreenButton: {
        backgroundColor: 'white',
        minWidth: '50%',
        minHeight: '20%',
        margin: '2%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    drawerButtonView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    drawerButton: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
    },
    safeAreaView: {
        flex: 1,
    },
});