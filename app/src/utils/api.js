export async function createQuiz(questionCount, theme, difficulty) {
    try {
        const response = await fetch(`https://api.luoja.fr/quiz?amount=${questionCount}&category=${theme}&difficulty=${difficulty}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
