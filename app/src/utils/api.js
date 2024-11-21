import { getPlatformAPI, setToken } from "./utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
