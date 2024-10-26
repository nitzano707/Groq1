async function uploadAudio() {
    const responseDiv = document.getElementById('responseFrame');
    const audioFile = document.getElementById('audioFile').files[0];
    const downloadBtn = document.getElementById('downloadBtn');

    if (!audioFile) {
        responseDiv.srcdoc = '<p>אנא בחר קובץ אודיו.</p>';
        return;
    }

    responseDiv.srcdoc = '<p>מעבד את הבקשה...</p>';
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
                'Authorization': 'Bearer YOUR_GROQ_API_KEY' // יש להחליף במפתח ה-API האישי שלך
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            let htmlContent = '';
            data.segments.forEach(segment => {
                htmlContent += `<p><strong>${segment.start}s</strong><br>${segment.text}</p>`;
            });
            responseDiv.srcdoc = htmlContent;
            downloadBtn.style.display = 'block';
            downloadBtn.onclick = () => downloadTranscription(data);
        } else {
            responseDiv.srcdoc = `<p>שגיאה בבקשה: ${response.statusText}</p>`;
        }
    } catch (error) {
        responseDiv.srcdoc = `<p>אירעה שגיאה: ${error.message}</p>`;
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
