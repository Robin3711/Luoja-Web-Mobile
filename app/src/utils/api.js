import { getPlatformAPI, setToken } from "./utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'html-entities';

export async function createQuiz(questionCount, theme, difficulty) {
    try {

        let url = `${await getPlatformAPI()}/quizFast?amount=${questionCount}`;

        if (theme !== 'none') {
            url += `&category=${theme}`;
        }

        if (difficulty !== 'none') {
            url += `&difficulty=${difficulty}`;
        }

        const response = await fetch(url);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getNewGameId(quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/game/${quizId}/restart`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCurrentQuestion(quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/game/${quizId}/question`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCurrentAnswer(answer, quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/game/${quizId}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answer),
        });

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error('Erreur lors de l\'envoi de la réponse', data);
        }
    } catch (error) {
        console.error('Erreur réseau', error);
    }
}

export async function getCurrentInfos(quizId) {
    try {

        let url = `${await getPlatformAPI()}/game/${quizId}/infos`;

        const response = await fetch(url);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createParty(quizId) {
    try{

        let url = `${await getPlatformAPI()}/quiz/${quizId}/play`;
        
        const response = await fetch(url);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function userRegister(email, password) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            await setToken(data.token);
        } else {
            throw new Error("Erreur lors de l'inscription");
        }
    } catch (error) {
        throw new Error("Erreur réseau");
    }
}

export async function userLogin(email, password) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            await setToken(data.token);
        } else {
            throw new Error("Erreur lors de la connexion");
        }
    } catch (error) {
        throw new Error("Erreur réseau");
    }
}

export async function getUserInfos() {
    try {
        const response = await fetch(`${await getPlatformAPI()}/user/infos`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        const data = await response.json();

        return data.user;
    }
    catch (error) {
        throw new Error("Erreur réseau");
    }
}

export async function getQuestions(amount, category, difficulty) {
    try{
        let url = `https://opentdb.com/api.php?amount=${amount}`;

        if (category) {
            url += `&category=${category}`;
        }

        if (difficulty) {
            url += `&difficulty=${difficulty}`;
        }

        const response = await fetch(url);

        const data = await response.json();

        if (data.response_code !== 0) {
            throw new Error("Erreur lors de la récupération des questions");
        }

        data.results.forEach((item) => {
            item.question = decode(item.question);
            item.correct_answer = decode(item.correct_answer);
            item.incorrect_answers = item.incorrect_answers.map((answer) => decode(answer));
        });

        return data.results;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}

export async function saveQuiz(title, theme, difficulty, quizQuestions){
    try{
        let url = `${await getPlatformAPI()}/quiz?title=${title}`;

        if(theme !== 'none'){
            url += `&category=${theme}`;
        }

        if(difficulty !== 'none'){
            url += `&difficulty=${difficulty}`;
        }

        const questions = quizQuestions.map(question => {
            return {
                text: question.question,
                correctAnswer: question.correct_answer,
                incorrectAnswers: question.incorrect_answers,
            };
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': await AsyncStorage.getItem('token'),
            },
            body: JSON.stringify({questions: questions}),
        });

        const data = await response.json();

        return data;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}

export async function publishQuiz(quizId){
    try{
        console.log(`${await getPlatformAPI()}/quiz/${quizId}/publish`);
        const response = await fetch(`${await getPlatformAPI()}/quiz/${quizId}/publish`, {
            method: 'GET',
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        const data = await response.json();

        return data;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}