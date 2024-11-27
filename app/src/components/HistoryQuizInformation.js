import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getGameInfos } from '../utils/api';
import { getThemeLabel, formatReadableDate } from '../utils/utils';

export default function HistoryQuizInformation({partyId}) {
    const [party, setParty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [themeName, setThemeName] = useState("any");
    const [date, setDate] = useState("any");
    useEffect(() => {
        async function fetchParty() {
            const data = await getGameInfos(partyId);
            setParty(data);
            setLoading(false);
            if (data.Category !== 0){
                setThemeName(getThemeLabel(data.Category));
            }
            let scoreTemp = 0;
            for (let i = 0; i < data.results.length; i++) {
                if (data.results[i] === true) {
                    scoreTemp++;
                }
            }
            setScore(scoreTemp);
            let dateTemp = formatReadableDate(data.CreateDate);
            setDate(dateTemp);
        }
        fetchParty();
    }, [partyId]);

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    
    
    return (
        <View style={styles.historyQuizInformationView}>
            <Text style={styles.historyQuizInformationText}>Partie : {partyId}</Text>
            <Text style={styles.historyQuizInformationText}>{themeName}</Text>
            <Text style={styles.historyQuizInformationText}>{party.Difficulty}</Text>
            <Text style={styles.historyQuizInformationText}>{date}</Text>
            <Text style={styles.historyQuizInformationText}>Résultat : {score}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    historyQuizInformationView: {
        margin: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    historyQuizInformationText: {
        fontSize: 16,
    },
});