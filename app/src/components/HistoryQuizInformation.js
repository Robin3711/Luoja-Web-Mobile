import React, {useEffect, useState} from 'react';
import { Text, View } from 'react-native';
import { getCurrentInfos } from '../utils/api';
import { getThemeName, getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function HistoryQuizInformation({partyId}) {
    const [party, setParty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [themeName, setThemeName] = useState("any");
    useEffect(() => {
        async function fetchParty() {
            const data = await getCurrentInfos(partyId);
            setParty(data);
            setLoading(false);
            if (data.Category !== 0){
                setThemeName(getThemeName(data.Category));
            }
            console.log(party.results);
            for (let i = 0; i < party.results.length; i++) {
                if (party.results[i] === true) {
                    setScore(score + 1);
                }
            }
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