import { decode } from 'html-entities';
import { getPlatformAPI, setToken, hasToken } from "./utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventSource from "react-native-sse";
import { toast } from './utils';
import { COLORS } from '../css/utils/color';

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

export async function createGame(quizId, gameMode, difficulty) {
    try {
        const headers = {};

        if (await hasToken()) {
            headers['token'] = await AsyncStorage.getItem('token');
        }

        let url = `${await getPlatformAPI()}/quiz/${quizId}/play`;

        if (gameMode && difficulty) {
            url += `?gameMode=${gameMode}&difficulty=${difficulty}`;
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
            type: "text",
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
            type: q.type,
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
            type: q.type,
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

        const response = await fetch(`${await getPlatformAPI()}/quiz/list?${parameters}`);

        if (!response.ok) await handleResponseError(response);

        return (await response.json()).quizs;
    }
    catch (error) {
        throw error;
    }
}

export async function uploadImage(file) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/uploads`, {
            method: 'POST',
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
            body: file,
        });

        return await response;

    } catch (error) {
        throw error;
    }
}

export async function downloadAllImages() {
    try {
        const response = await fetch(`${await getPlatformAPI()}/downloadall`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function downloadImage(id) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/download/${id}`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        return await response.blob();
    } catch (error) {
        throw error;
    }
}

export async function listenTimer(gameId, setRemainingTime, setSelectedAnswer, setLoading) {
    try {
        const apiBaseUrl = await getPlatformAPI();
        const token = await AsyncStorage.getItem('token');

        // Create an EventSource instance
        const eventSource = new EventSource(`${apiBaseUrl}/game/${gameId}/timer?token=${token}`);

        // Handle the 'message' event
        eventSource.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                const time = data.time;

                setRemainingTime(time);

                if (time === 0) {
                    setSelectedAnswer(true);
                    setLoading(true);
                    eventSource.close(); // Close the connection
                } else if (time === 1) {
                    setLoading(true);
                } else {
                    setLoading(false);
                }
            } catch (parseError) {
                console.error('Error parsing event data:', parseError);
                eventSource.close();
            }
        });

        // Handle errors
        eventSource.addEventListener('error', (error) => {
            console.error('EventSource error:', error);
            eventSource.close();
        });

        // Optionally return the event source if needed elsewhere
        return eventSource;
    } catch (error) {
        console.error('Error setting up EventSource:', error);
        throw error;
    }
}

export async function createRoom({ quizId, playerCount, teams, gameMode, difficulty }) {
    try {
        let response;

        switch (gameMode) {
            case "scrum":
                response = await fetch(`${await getPlatformAPI()}/room/${quizId}/create?playerCount=${playerCount}&gameMode=${gameMode}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': await AsyncStorage.getItem('token'),
                    },
                });
                break;
            case "team":
                response = await fetch(`${await getPlatformAPI()}/room/${quizId}/create?playerCount=${playerCount}&gameMode=${gameMode}&difficulty=${difficulty}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': await AsyncStorage.getItem('token'),
                    },
                    body: JSON.stringify({ teams }),
                });
                break;
            default:
                break;
        }

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        throw error;
    }

}

export async function joinRoom(roomId) {
    try {
        const apiBaseUrl = await getPlatformAPI();
        const token = await AsyncStorage.getItem('token');

        // Create an EventSource instance
        const eventSource = new EventSource(`${apiBaseUrl}/room/${roomId}/join?token=${token}`);

        // Event listeners
        eventSource.addEventListener('open', () => {
            toast("info", 'Connected to room: ' + roomId, '', 2000, COLORS.toast.text.blue);
        });

        eventSource.addEventListener('error', (error) => {
            console.error('EventSource error:', error);
            eventSource.close();
        });

        return eventSource;
    } catch (error) {
        toast("error", 'Error joining room:' + roomId, '', 2000, COLORS.toast.text.red);
        throw error;
    }
}

export async function joinTeam(roomId, teamName) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/room/${roomId}/joinTeam?teamName=${teamName}&token=${await AsyncStorage.getItem('token')}`);

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        throw error;
    }

}

export async function startRoom(roomId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/room/${roomId}/start`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        toast("error", error, '', 2000, COLORS.toast.text.red);
    }
}

export async function getCurrentRoomQuestion(roomId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/room/${roomId}/question`, {
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

export async function getCurrentRoomAnswer(answer, roomId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/room/${roomId}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': await AsyncStorage.getItem('token'),
            },
            body: JSON.stringify({ answer }),
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

export async function getRoomScores(roomId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/room/${roomId}/scores`, {
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

export async function uploadAudio(file) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/uploads`, {
            method: 'POST',
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
            body: file,
        });

        return await response;

    } catch (error) {
        throw error;
    }
}

export async function downloadAllAudios() {
    try {
        const response = await fetch(`${await getPlatformAPI()}/downloadall`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        console.error(error);
    }
}

export async function downloadAudio(id) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/download/${id}`, {
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        return await response.blob();
    } catch (error) {
        throw error;
    }
}

export async function deleteFile(id) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'token': await AsyncStorage.getItem('token'),
            },
        });

        if (!response.ok) await handleResponseError(response);

        return await response;
    } catch (error) {
        throw error;
    }
}

export async function generateAnswers(question, theme) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/ai/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': await AsyncStorage.getItem('token'),
            },
            body: JSON.stringify({ question, theme }),
        });

        if (!response.ok) await handleResponseError(response);

        return await response.json();
    }
    catch (error) {
        throw error;
    }
}