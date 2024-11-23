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
        width: '100%',
        marginTop: 20,
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
        width: '80%',
        marginVertical: 10,
    },

    /* -- Difficulty -- */
    difContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    difButtonGroupContainer: {
        height: 50,
        width: '100%',
        borderRadius: 30,
    },
    difButtonStyle: {
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 80,
    },
    difSelectedButtonStyle: {
        backgroundColor: '#404989',
    },
    difTextStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    difSelectedTextStyle: {
        color: '#fff',
    },

    /* -- Quiz -- */
    quizId: {
        fontWeight: 'bold',
        color: '#7c8ca3',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
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
        width: 130,
        height: 90,
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
    quizBarView: {
        flexDirection: 'row',
    },
    quizBarTextView: {
        fontSize: 14,
    },

    /* -- EndScreen-- */
    scoreContainer: {
        alignItems: 'center',
        marginVertical: 30,
        paddingHorizontal: 15,
    },
    scoreTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    endContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    /* -- Parameters -- */
    parametersView: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '5%',
    },
    parametersText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    /* -- Paramètres Modal -- */
    paramContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paramButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '25%',
        width: '75%',
        fontSize: 18,
        backgroundColor: 'gray',
        borderRadius: 30,
    },
    paramOpenButton: {
        backgroundColor: '#4CAF50',
    },
    paramButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    paramSelectedTheme: {
        marginTop: 20,
        fontSize: 14,
    },
    paramCenteredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    paramModalView: {
        width: '90%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    paramModalButton: {
        marginTop: 15,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    paramModalButtonClose: {
        backgroundColor: '#2196F3',
    },
    paramModalTextStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    paramGridButton: {
        flex: 1,
        marginHorizontal: '10%',
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#76c7c0',
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        width: '80%',

    },
    paramDefaultGridButton: {
        marginHorizontal: '5%',
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#76c7c0',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '70%',
    },
    paramGridButtonText: {
        fontSize: 17,
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',

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
        marginHorizontal: '40%',
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
        marginHorizontal: '20%',
    },
    loginButton: {
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

    /* -- Search Quiz -- */
    searchQuizView: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    searchParameterView: {
    },
    filterView: {
        display: 'flex',
        justifyContent: 'center',
    },
    filterInput: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
    },

    /* -- BrewPresentation -- */
    QuizInformationView: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    QuizInformationText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    QuizInformationButton: {
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
});
