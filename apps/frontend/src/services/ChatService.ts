// services/ChatService.ts

export const postMessage = async (message: string) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.answer;
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        throw error;
    }
};
