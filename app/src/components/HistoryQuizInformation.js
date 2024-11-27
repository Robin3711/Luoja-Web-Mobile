import React, {useEffect, useState} from 'react';
import { Text, View } from 'react-native';
import { getGameInfos } from '../utils/api';
import { getThemeLabel, getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function HistoryQuizInformation({partyId}) {
    const [party, setParty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [themeName, setThemeName] = useState("any");
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
        }
        fetchParty();
    }, [partyId]);

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    
    
    return (
        <View style={styles.historyQuizInformationView}>
            <Text style={styles.historyQuizInformationText}>Partie : {partyId}</Text>
            <Text style={styles.historyQuizInformationText}>Thème : {themeName}</Text>
            <Text style={styles.historyQuizInformationText}>Difficulté : {party.Difficulty}</Text>
            <Text style={styles.historyQuizInformationText}>Date : {party.CreateDate}</Text>
            <Text style={styles.historyQuizInformationText}>Résultat : {score}</Text>
        </View>
    );
}