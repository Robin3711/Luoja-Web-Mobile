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
        minWidth: '75%',
        minHeight: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    homeScreenButton: {
        backgroundColor: 'white',
        minWidth: '50%',
        minHeight: '5%',
        margin: '5%',
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
        width: '40%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
    },
    quizContainer: {
        flex: 1,
        backgroundColor: '#e1f0ff',
        padding: 20,
        alignItems: 'center',
    },
    quizId: {
        fontWeight: 'bold',
        color: '#7c8ca3',
        fontSize: 14,
        marginBottom: 15,
    },
    quizQuestionContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    quizQuestionNumberContainer: {
        marginVertical: 1,
        alignItems: 'center',
    },
    quizQuestionText: {
        fontSize: 18,
        color: '#4b4f60',
        textAlign: 'center',
        marginBottom: 5,
    },
    quizAnswersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    quizAnswerButton: {
        width: 150,
        height: 110,
        borderRadius: 8,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7c8ca3',
    },
    quizAnswerText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
    },
    quizFeedbackContainer: {
        backgroundColor: '#7c8ca3',
        padding: 15,
        borderRadius: 10,
        marginVertical: 15,
        alignItems: 'center',
    },
    quizFeedbackText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
    },
    quizNextButton: {
        backgroundColor: '#b8cce0',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
        marginTop: 20,
    },
    quizNextButtonText: {
        fontSize: 16,
        color: '#4b4f60',
        fontWeight: 'bold',
    },
});