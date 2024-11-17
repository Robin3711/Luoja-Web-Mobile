import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    /* -- Containers -- */
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cursorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    quizContainer: {
        flex: 1,
        backgroundColor: '#e1f0ff',
        padding: 20,
        alignItems: 'center',
    },

    /* -- Home Screen -- */
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

    /* -- Drawer -- */
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

    /* -- Text Input -- */
    textInput: {
        width: '60%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
    },
    loginInput: {
        width: '100%',
        minHeight: '5%',
        marginVertical: '5%',
        borderColor: 'gray',
        borderWidth: 1,
    },

    /* -- Cursor -- */
    cursorLabel: {
        fontSize: 20,
        marginBottom: 20,
    },
    cursorSliderView: {
        width: '100%',
        marginVertical: '1%',
    },

    /* -- Quiz -- */
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
        fontSize: 16,
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

    /* -- Parameters -- */
    parametersView: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'flex-start',
        margin: '5%',
    },
    parametersText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    /* -- Account & Login -- */
    accountView: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountLoginView: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '10%',
    },
    accountLoginButton: {
        display: 'flex',
        flexDirection: 'column',
        height: '5%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        borderRadius: 40,
        marginVertical: '5%',
    },
    loginView: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '10%',
    },
    loginButton: {
        display: 'flex',
        flexDirection: 'column',
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        borderRadius: 40,
        marginVertical: '5%',
    },

    /* -- Create Quiz Button -- */
    createQuizButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '5%',
        width: '100%',
        fontSize: 20,
        marginTop: '5%',
        backgroundColor: 'gray',
        borderRadius: 40,
    },
});
