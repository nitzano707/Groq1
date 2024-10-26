# עובד מצוין

async function uploadAudio() {
    const responseDiv = document.getElementById('response');
    const audioFile = document.getElementById('audioFile').files[0];

    if (!audioFile) {
        responseDiv.textContent = 'אנא בחר קובץ אודיו.';
        return;
    }

    responseDiv.textContent = 'מעבד את הבקשה...';

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('response_format', 'json');
    formData.append('language', 'he');

    try {
        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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' // יש להחליף במפתח ה-API האישי שלך
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            responseDiv.textContent = data.text;
        } else {
            responseDiv.textContent = 'שגיאה בבקשה: ' + response.statusText;
        }
    } catch (error) {
        responseDiv.textContent = 'אירעה שגיאה: ' + error.message;
    }
}
