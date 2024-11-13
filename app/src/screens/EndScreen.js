import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getCurrentQuestion, getCurrentAnswer, getCurrentInfos } from '../utils/api';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function QuizScreen() {
    const route = useRoute();
    const { quizData } = route.params;
    const quizId = quizData.quizId;


    return (
        <View style={styles.quizContainer}>
            <Text>To</Text>
        </View>
    );
}
