import React, {useEffect, useState} from 'react';
import { Text, View } from 'react-native';
import { getQuizAverage } from '../utils/api';
import { getThemeLabel, getPlatformStyle, formatReadableDate } from '../utils/utils';

const styles = getPlatformStyle();

export default function CreatedQuizInformation({quizId, category, difficulty, date, status, title}) {
    const [loading, setLoading] = useState(true);
    const [average, setAverage] = useState("aucune donnée");
    const [themeName, setThemeName] = useState("any");
    const [statusStr, setStatus] = useState("privé");
    const [dateStr, setDate] = useState("any");
    useEffect(() => {
        async function fetchParty() {
            setLoading(false);
            if (category !== 0){
                setThemeName(getThemeLabel(category));
            }
            getQuizAverage(quizId).then((score) => {
                if (score.score === null){
                    score.score = "aucune donnée";
                } else {
                    setAverage(score.score);
                }
                
            });
            if(status === "true"){
                setStatus("public");
            }
            let dateTemp = formatReadableDate(date);
            setDate(dateTemp);
        }
        fetchParty();
    }, [category, status, quizId, date]);

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
            <Text style={styles.historyQuizInformationText}>Pourcentage de réussite : {average}</Text>
        </View>
    );
}