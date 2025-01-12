import { COLORS } from "./color";

const center = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const fontFamily={
    arial: "'Arial', sans-serif",
    lobster: {
        cursive : "'LobsterTwo_400Regular'",
        italic : "'LobsterTwo_700Bold_Italic'",
    }
}

//mix max pour les tailles : 'clamp(16px, 10vw, 48px)'
export const FONT={
    luoja:{
        fontFamily: fontFamily.lobster.italic,
        color: COLORS.text.blue.dark,
        position: 'absolute',
        top: '2vh',
        fontSize: 150,
        fontWeight: 'bold',
    },
    title:{
        fontFamily: fontFamily.lobster.italic,
        textAlign: 'center',
        marginBottom: "10px",
        color: COLORS.text.blue.dark,
        fontSize: 75,
    },
    button:{
        fontFamily: fontFamily.lobster.cursive,
        fontSize: '200%',
        color: COLORS.text.blue.dark,
        height: '100vh',
        ...center
    },
    text:{
        fontFamily: fontFamily.lobster.cursive,
        fontSize: 30,
        color: COLORS.text.blue.dark,
        ...center
    },
    paragraphe:{
        fontFamily: fontFamily.arial,
        fontSize: 17,
        color: COLORS.text.blue.dark,
        textAlign: 'center',
        ...center
    },
    TextInput:{
        flex: 1,
        height: '70%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        ...center
    },
    error:{
        fontSize: 18,
        color: 'red',
        ...center
    }
}