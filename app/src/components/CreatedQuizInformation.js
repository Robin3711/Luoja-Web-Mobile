import React, {useEffect, useState} from 'react';
import { Text, View } from 'react-native';
import { getQuizAverage } from '../utils/api';
import { getThemeLabel, getPlatformStyle } from '../utils/utils';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const styles = getPlatformStyle();

export default function CreatedQuizInformation({quizId, category, difficulty, date, status, title}) {
    const [loading, setLoading] = useState(true);
    const [average, setAverage] = useState(75);
    const [themeName, setThemeName] = useState("any");
    const [statusStr, setStatus] = useState("privé");
    useEffect(() => {
        async function fetchParty() {
            setLoading(false);
            if (category !== 0){
                setThemeName(getThemeLabel(category));
            }
            let scoreTemp = getQuizAverage(quizId);
            setAverage(scoreTemp);
            if(status === "true"){
                setStatus("public");
            }
        }
        fetchParty();
    }, [category, status, quizId]);

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    
    
    return (
        <View style={styles.historyQuizInformationView}>
            <Text style={styles.historyQuizInformationText}>{title}</Text>
            <Text style={styles.historyQuizInformationText}>{themeName}</Text>
            <Text style={styles.historyQuizInformationText}>{difficulty}</Text>
            <Text style={styles.historyQuizInformationText}>{statusStr}</Text>
            <Text style={styles.historyQuizInformationText}>{date}</Text>
            <Text style={styles.historyQuizInformationText}>Pourcentage de réussite : {average} %</Text>
        </View>
    );
}