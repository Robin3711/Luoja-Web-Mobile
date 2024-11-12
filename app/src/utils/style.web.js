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
    textInput: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
    }
});

export const quizStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e1f0ff',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    quizId: {
        fontWeight: 'bold',
        color: '#4b4f60',
        fontSize: 14,
        alignSelf: 'flex-end',
        marginTop: 10,
        marginBottom: 20,
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    questionNumberContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    questionNumber: {
        fontSize: 36,
        color: '#4b4f60',
        marginBottom: 5,
    },
    questionText: {
        fontSize: 18,
        color: '#4b4f60',
        textAlign: 'center',
        fontWeight: '400',
        fontStyle: 'italic',
        marginBottom: 20,
    },
    answersContainer: {
        width: '100%',
        alignItems: 'center',
    },
    answerButton: {
        width: '90%',
        minHeight: 70,
        borderRadius: 15,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    answerButtonDefault: {
        backgroundColor: '#4b7ed6',
    },
    answerButtonCorrect: {
        backgroundColor: '#87c34b',
    },
    answerButtonIncorrect: {
        backgroundColor: '#d65a4b',
    },
    answerText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#a3d0ff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 30,
    },
    nextButtonText: {
        fontSize: 18,
        color: '#4b4f60',
        fontWeight: 'bold',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#87caff',
    },
    feedbackContainer: {
        backgroundColor: '#4b4f60',
        padding: 15,
        borderRadius: 10,
        marginVertical: 15,
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    progressCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCircleFilled: {
        backgroundColor: '#4b7ed6',
    },
    progressCircleEmpty: {
        backgroundColor: '#b8cce0',
    },
});