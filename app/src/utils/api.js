import { decode } from 'html-entities';
import { getPlatformAPI, setToken, hasToken } from "./utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleResponseError = async (response) => {
    let errorMessage = 'Une erreur est survenue';


    try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
    }
    catch {
        errorMessage = response.statusText || errorMessage;
    }

    const error = new Error('Une erreur est survenue');

    error.status = response.status;

    error.message = errorMessage;

    throw error;
};

export async function createQuiz(questionCount, theme, difficulty) {
    try {
        let url = `${await getPlatformAPI()}/quizFast?amount=${questionCount}`;

        if (theme !== null) {
            url += `&category=${theme}`;
        }

        if (difficulty !== null) {
            url += `&difficulty=${difficulty}`;
        }

        const headers = {};

        if (await hasToken()) {
            headers['token'] = await AsyncStorage.getItem('token');
        }

        const response = await fetch(url, { headers });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;
    }
    catch (error) {
        throw error;
    }
}

export async function restartGame(gameId) {
    try {
        const headers = {};

        if (await hasToken()) {
            headers['token'] = await AsyncStorage.getItem('token');
        }

        const response = await fetch(`${await getPlatformAPI()}/game/${gameId}/restart`, { headers });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

export async function getCurrentQuestion(quizId) {
    try {
        const headers = {};

        if (await hasToken()) {
            headers['token'] = await AsyncStorage.getItem('token');
        }

        const response = await fetch(`${await getPlatformAPI()}/game/${quizId}/question`, { headers });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCurrentAnswer(answer, quizId) {
    try {
        let token = null;

        if (await hasToken()) {
            token = await AsyncStorage.getItem('token');
        }

        const response = await fetch(`${await getPlatformAPI()}/game/${quizId}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token
            },
            body: JSON.stringify(answer),
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getGameInfos(gameId) {
    try {
        const headers = {};

        if (await hasToken()) {
            headers['token'] = await AsyncStorage.getItem('token');
        }

        let url = `${await getPlatformAPI()}/game/${gameId}/infos`;

        const response = await fetch(url, { headers });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;
    }
    catch (error) {
        throw error;
    }
}

export async function getQuizAverage(quizId) {
    try {
        let url = `${await getPlatformAPI()}/game/${quizId}/score`

        const response = await fetch(url, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;
    }
    catch (error) {
        throw error;
    }
}

export async function createParty(quizId) {
    try {
        const headers = {};

        if (await hasToken()) {
            headers['token'] = await AsyncStorage.getItem('token');
        }

        let url = `${await getPlatformAPI()}/quiz/${quizId}/play`;

        const response = await fetch(url, { headers });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;
    }
    catch (error) {
        throw error;
    }
}

export async function getQuizInfos(quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/quiz/${quizId}/retrieve`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;
    }
    catch (error) {
        throw error;
    }
}

export async function userRegister(name, password) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, password }),
        });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        await setToken(data.token);
    }
    catch (error) {
        throw error;
    }
}

export async function userLogin(name, password) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, password }),
        });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        await setToken(data.token);
    }
    catch (error) {
        throw error;
    }
}

export async function getUserInfos() {
    try {
        const response = await fetch(`${await getPlatformAPI()}/user/infos`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        return (await response.json()).user;
    }
    catch (error) {
        throw error;
    }
}

export async function getUserGame() {
    try {
        const response = await fetch(`${await getPlatformAPI()}/quiz/user/Game`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;
    }
    catch (error) {
        throw error;
    }
}
export async function getQuestions(amount, category, difficulty) {
    try {
        let url = `https://opentdb.com/api.php?amount=${amount}`;

        if (category) url += `&category=${category}`;

        if (difficulty) url += `&difficulty=${difficulty}`;

        const response = await fetch(url);

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        if (data.response_code !== 0) throw new Error("Erreur lors de la récupération des questions");

        data.results.forEach((item) => {
            item.question = decode(item.question);
            item.correct_answer = decode(item.correct_answer);
            item.incorrect_answers = item.incorrect_answers.map(decode);
        });

        const questions = data.results.map((item) => ({
            text: item.question,
            trueFalse: item.incorrect_answers.length === 1,
            correctAnswer: item.correct_answer,
            incorrectAnswers: item.incorrect_answers,
        }));

        return questions;
    }
    catch (error) {
        throw error;
    }
}

export async function saveQuiz(title, category, difficulty, quizQuestions) {
    try {
        let url = `${await getPlatformAPI()}/quiz?title=${title}`;

        if (category !== null) url += `&category=${category}`;

        if (difficulty !== null) url += `&difficulty=${difficulty}`;

        const questions = quizQuestions.map((q) => ({
            text: q.text,
            correctAnswer: q.correctAnswer,
            incorrectAnswers: q.incorrectAnswers,
        }));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': await AsyncStorage.getItem('token'),
            },
            body: JSON.stringify({ questions }),
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

export async function editQuiz(quizId, title, category, difficulty, quizQuestions) {
    try {
        let url = `${await getPlatformAPI()}/quiz/${quizId}/edit?title=${title}`;

        if (category !== null) url += `&category=${category}`;

        if (difficulty !== null) url += `&difficulty=${difficulty}`;

        const questions = quizQuestions.map((q) => ({
            text: q.text,
            correctAnswer: q.correctAnswer,
            incorrectAnswers: q.incorrectAnswers,
        }));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': await AsyncStorage.getItem('token'),
            },
            body: JSON.stringify({ questions }),
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function cloneQuiz(quizId) {
    try {
        const headers = {};

        if (await hasToken()) {
            headers['token'] = await AsyncStorage.getItem('token');
        }

        let url = `${await getPlatformAPI()}/quiz/${quizId}/clone`;

        const response = await fetch(url, { headers });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;

    } catch (error) {
        throw error;
    }
}



export async function publishQuiz(quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/quiz/${quizId}/publish`, {
            method: 'GET',
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

export async function getCreatedQuiz() {
    try {
        const response = await fetch(`${await getPlatformAPI()}/quiz/user/Create`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        const data = await response.json();

        return data;
    }
    catch (error) {
        throw error;
    }
}

export async function getQuizAutoComplete(title, theme, difficulty) {
    try {
        let parameters = '';

        if (title) parameters += `title=${title}`;

        if (theme !== null && theme) parameters += `&category=${theme}`;

        if (difficulty) parameters += `&difficulty=${difficulty}`;

        const response = await fetch(`https://api.luoja.fr/quiz/list?${parameters}`);

        if (!response.ok) await handleResponseError(response);

        return (await response.json()).quizs;
    }
    catch (error) {
        throw error;
    }
}