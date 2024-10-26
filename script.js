async function uploadAudio() {
    const responseDiv = document.getElementById('response');
    const audioFile = document.getElementById('audioFile').files[0];
    const downloadBtn = document.getElementById('downloadBtn');

    if (!audioFile) {
        responseDiv.textContent = 'אנא בחר קובץ אודיו.';
        return;
    }

    responseDiv.textContent = 'מעבד את הבקשה...';
    downloadBtn.style.display = 'none';

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('response_format', 'verbose_json');
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
            let htmlContent = '';
            data.segments.forEach(segment => {
                htmlContent += `<p><strong>${segment.start}s</strong><br>${segment.text}</p>`;
            });
            responseDiv.innerHTML = htmlContent;
            downloadBtn.style.display = 'block';
            downloadBtn.onclick = () => downloadTranscription(data);
        } else {
            responseDiv.textContent = 'שגיאה בבקשה: ' + response.statusText;
        }
    } catch (error) {
        responseDiv.textContent = 'אירעה שגיאה: ' + error.message;
    }
}

function downloadTranscription(data) {
    let textContent = '';
    data.segments.forEach(segment => {
        textContent += `${segment.start}s: ${segment.text}\n`;
    });
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transcription.txt';
    link.click();
}
