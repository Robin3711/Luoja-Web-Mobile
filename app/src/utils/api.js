import { getPlatformAPI } from "./utils";

export async function createQuiz(questionCount, theme, difficulty) {
    try {

        let url = `${await getPlatformAPI()}/quiz?amount=${questionCount}`;

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

export async function getCurrentQuestion(quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/quiz/${quizId}/question`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCurrentAnswer(answer, quizId) {
    try {
        const response = await fetch(`${await getPlatformAPI()}/quiz/${quizId}/answer`, {
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

        let url = `${await getPlatformAPI()}/quiz/${quizId}/infos`;

        const response = await fetch(url);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


