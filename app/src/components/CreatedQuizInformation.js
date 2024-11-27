import React, {useEffect, useState} from 'react';
import { Text, View } from 'react-native';
import { getQuizAverage } from '../utils/api';
import { getThemeLabel, getPlatformStyle, formatReadableDate } from '../utils/utils';

const styles = getPlatformStyle();

export default function CreatedQuizInformation({quizId, category, difficulty, date, status, title, nbQuestions}) {
    const [loading, setLoading] = useState(true);
    const [average, setAverage] = useState("aucune donnée");
    const [themeName, setThemeName] = useState("any");
    const [statusStr, setStatus] = useState("privé");
    const [dateStr, setDate] = useState("any");
    const [nbPlayed, setNbPlayed] = useState(0);
    const [nbQuestionsStr, setNbQuestions] = useState("any");
    useEffect(() => {
        async function fetchParty() {
            setLoading(false);
            if (category !== 0){
                setThemeName(getThemeLabel(category));
            }
            getQuizAverage(quizId).then((data) => {
                console.log(data);
                if (data.score === null){
                    data.score = "aucune donnée";
                } else {
                    setAverage(data.score + "%");
                    
                }
                setNbPlayed(data.nombreDePartie);
            });
            if(status === "true"){
                setStatus("public");
            }
            let dateTemp = formatReadableDate(date);
            setDate(dateTemp);
            setNbQuestions(nbQuestions);
        }
        fetchParty();
    }, [category, status, quizId, date, nbQuestions]);

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    
    
    return (
        <View style={styles.historyQuizInformationView}>
            <Text style={styles.historyQuizInformationText}>{title}</Text>
            <Text style={styles.historyQuizInformationText}>{themeName}</Text>
            <Text style={styles.historyQuizInformationText}>{difficulty}</Text>
            <Text style={styles.historyQuizInformationText}>{statusStr}</Text>
            <Text style={styles.historyQuizInformationText}>{dateStr}</Text>
            <Text style={styles.historyQuizInformationText}>Nombre de questions : {nbQuestionsStr}</Text>
            <Text style={styles.historyQuizInformationText}>Réussite : {average}</Text>
            <Text style={styles.historyQuizInformationText}>Nombre de parties jouées : {nbPlayed}</Text>

        </View>
    );
}