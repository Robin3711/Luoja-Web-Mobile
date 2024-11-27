import { getPlatformAPI, setToken } from "./utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'html-entities';

const handleResponseError = async (response) => {
    let errorMessage = 'Une erreur est survenue';
    try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
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
        if (theme !== 'none') url += `&category=${theme}`;
        if (difficulty !== null) url += `&difficulty=${difficulty}`;
        const response = await fetch(url);
        if (!response.ok) await handleResponseError(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function restartGame(gameId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/game/${gameId}/restart`);
        if (!response.ok) await handleResponseError(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCurrentQuestion(quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/game/${quizId}/question`);
        if (!response.ok) await handleResponseError(response);
        return await response.json();
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
        if (!response.ok) await handleResponseError(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getGameInfos(gameId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/game/${gameId}/infos`);
        if (!response.ok) await handleResponseError(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createParty(quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/quiz/${quizId}/play`);
        if (!response.ok) await handleResponseError(response);
        return await response.json();
    } catch (error) {
        console.error(error);
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
    } catch (error) {
        console.error(error);
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
    } catch (error) {
        console.error(error);
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
    } catch (error) {
        console.error(error);
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
        return data.results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function saveQuiz(title, category, difficulty, quizQuestions) {
    try {
        let url = `${await getPlatformAPI()}/quiz?title=${title}`;
        if (category !== 'none') url += `&category=${category}`;
        if (difficulty !== null) url += `&difficulty=${difficulty}`;
        const questions = quizQuestions.map((q) => ({
            text: q.question,
            correctAnswer: q.correct_answer,
            incorrectAnswers: q.incorrect_answers,
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
        console.error(error);
        throw error;
    }
}

export async function editQuiz(quizId, title, category, difficulty, quizQuestions) {
    try {
        let url = `${await getPlatformAPI()}/quiz/${quizId}/edit?title=${title}`;
        if (category !== 'none') url += `&category=${category}`;
        if (difficulty !== null) url += `&difficulty=${difficulty}`;
        const questions = quizQuestions.map((q) => ({
            text: q.question,
            correctAnswer: q.correct_answer,
            incorrectAnswers: q.incorrect_answers,
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
        console.error(error);
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
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getQuizAutoComplete(title, theme, difficulty) {
    try {
        let parameters = '';
        if (title) parameters += `title=${title}`;
        if (theme !== 'none' && theme) parameters += `&category=${theme}`;
        if (difficulty) parameters += `&difficulty=${difficulty}`;
        const response = await fetch(`https://api.luoja.fr/quiz/list?${parameters}`);
        if (!response.ok) await handleResponseError(response);
        return (await response.json()).quizs;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
