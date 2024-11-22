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
    },
    quizContainer: {
        flex: 1,
        backgroundColor: '#e1f0ff',
        paddingHorizontal: 20,
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
        width: '40%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
    },
    loginInput: {
        width: '100%',
        height: '5%',
        marginVertical: '5%',
        borderColor: 'gray',
        borderWidth: 1,
    },

    /* -- Cursor -- */
    cursorLabel: {
        fontSize: 20,
        marginVertical: '1%',
    },
    cursorSliderView: {
        width: '100%',
        marginVertical: '1%',
    },

    /* --Difficulty -- */
    difContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    difButtonGroupContainer: {
        height: 60,
        width: '70%',
        borderRadius: 30,
    },
    difButtonStyle: {

        borderRadius: 30,

        alignItems: 'center',
        justifyContent: 'center',
    },
    difSelectedButtonStyle: {
        backgroundColor: '#404989',
    },
    difTextStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    difSelectedTextStyle: {
        color: '#fff',
    },

    /* -- Quiz -- */
    quizId: {
        fontWeight: 'bold',
        color: '#4b4f60',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    quizQuestionContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    quizQuestionNumberContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    quizQuestionNumber: {
        fontSize: 36,
        color: '#4b4f60',
        marginBottom: 5,
    },
    quizQuestionText: {
        fontSize: 18,
        color: '#4b4f60',
        textAlign: 'center',
        fontWeight: '400',
        fontStyle: 'italic',
        marginBottom: 20,
    },
    quizAnswersContainer: {
        width: '100%',
        alignItems: 'center',
    },
    quizAnswerButton: {
        width: '90%',
        minHeight: 70,
        borderRadius: 15,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    quizAnswerButtonDefault: {
        backgroundColor: '#4b7ed6',
    },
    quizAnswerButtonCorrect: {
        backgroundColor: '#87c34b',
    },
    quizAnswerButtonIncorrect: {
        backgroundColor: '#d65a4b',
    },
    quizAnswerText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
    },
    quizNextButton: {
        backgroundColor: '#a3d0ff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 30,
    },
    quizNextButtonText: {
        fontSize: 18,
        color: '#4b4f60',
        fontWeight: 'bold',
    },
    quizIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#87caff',
    },
    quizFeedbackContainer: {
        backgroundColor: '#4b4f60',
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
    quizProgressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    quizProgressCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quizProgressCircleFilled: {
        backgroundColor: '#4b7ed6',
    },
    quizProgressCircleEmpty: {
        backgroundColor: '#b8cce0',
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
        color: '#333'
    },

    /* -- Parameters -- */
    parametersView: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginHorizontal: '25%',
    },
    parametersText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    paramContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paramButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40%',
        width: '100%',
        fontSize: 20,
        backgroundColor: 'gray',
        borderRadius: 40,
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
        fontSize: 16,
    },
    paramCenteredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    paramModalView: {
        width: '90%',
        height: '80%',
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
    paramDefaultGridButton: {
        marginHorizontal: 40,
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#76c7c0',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        width: 400,
    },
    paramGridButton: {
        flex: 1,
        marginHorizontal: 40,
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#76c7c0',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        width: 400,
    },
    paramGridButtonText: {
        fontSize: 12,
        textAlign: 'center',
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

    /* -- Quiz Creation -- */
    quizCreationView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    quizCreationChildVIew: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '25%',
        width: '100%',
    },
    quizCreationBottomButtonsView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quizCreationLeftView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
    },
    quizCreationRightView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
    },

    /* -- Quiz Radio Button Selector -- */

    difficultyRadioSelectorView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    difficultyRadioSelectorButton: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        borderRadius: 40,
        marginHorizontal: '5%',
        paddingVertical: '2%',
        paddingHorizontal: '5%',
    },
    difficultyRadioSelectorButtonText: {
        fontSize: 20,
    },
    selectedDifficultyRadioSelectorButton: {
        backgroundColor: 'lightgrey',
    },
    selectedDifficultyRadioSelectorButtonText: {
        color: 'white',
    },

    /* -- Search Quiz -- */
    searchQuizView: {
        flex: 1, // S'assure que cette vue prend tout l'espace disponible
        flexDirection: 'column',
        justifyContent: 'space-between', // Ajoute de l'espacement entre les enfants
        alignItems: 'center',
    },
    searchParameterView: {
        flex: 1, // Permet une répartition uniforme
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // S'assure que les paramètres occupent la largeur disponible
    },
    filterView: {
        flex: 1, // S'assure que les filtres s'étendent correctement
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '2%',
    },
    filterInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: '5%',
    },
    scrollView: {
        flex: 1, // Permet au ScrollView de s'étendre sur l'espace restant
        width: '100%', // S'assure que le contenu est bien aligné
    },

    /* -- BrewPresentation -- */
    QuizInformationView: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
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
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
    },
});
