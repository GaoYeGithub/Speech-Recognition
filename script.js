document.addEventListener('DOMContentLoaded', () => {
  const btnStartRecord = document.getElementById('btnStartRecord');
  const btnStopRecord = document.getElementById('btnStopRecord');
  const btnPauseRecord = document.getElementById('btnPauseRecord');
  const btnResumeRecord = document.getElementById('btnResumeRecord');
  const btnClearText = document.getElementById('btnClearText');
  const btnSaveText = document.getElementById('btnSaveText');
  const btnExportPDF = document.getElementById('btnExportPDF');
  const btnPlayText = document.getElementById('playText');
  const toggleDarkMode = document.getElementById('toggleDarkMode');
  const speechRate = document.getElementById('speechRate');
  const text = document.getElementById('text');
  const wordCount = document.getElementById('wordCount');

  if (!btnStartRecord || !btnStopRecord || !btnPauseRecord || !btnResumeRecord || !btnClearText || !btnSaveText || !btnExportPDF || !btnPlayText || !toggleDarkMode || !speechRate || !text || !wordCount) {
    console.error('One or more elements are missing in the HTML.');
    return;
  }

  let recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-EN';
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const results = event.results;
    const sentence = results[results.length - 1][0].transcript;
    text.value += sentence;
    updateWordCount();
  };

  recognition.onend = (event) => {
    console.log('The microphone stops listening');
  };

  recognition.onerror = (event) => {
    console.log('Error occurred: ', event.error);
  };

  btnStartRecord.addEventListener('click', () => {
    recognition.start();
  });

  btnStopRecord.addEventListener('click', () => {
    recognition.abort();
  });

  btnPauseRecord.addEventListener('click', () => {
    recognition.stop();
  });

  btnResumeRecord.addEventListener('click', () => {
    recognition.start();
  });

  btnClearText.addEventListener('click', () => {
    text.value = '';
    updateWordCount();
  });

  btnSaveText.addEventListener('click', () => {
    const blob = new Blob([text.value], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = 'transcription.txt';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.style.display = 'none'; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  });

  btnExportPDF.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(text.value, 10, 10);
    doc.save('transcription.pdf');
  });

  btnPlayText.addEventListener('click', () => {
    readtext(text.value);
  });

  toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  speechRate.addEventListener('input', () => {
    readtext(text.value);
  });

  function readtext(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.volume = 1;
    speech.rate = speechRate.value;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  function updateWordCount() {
    const words = text.value.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = `Word Count: ${words.length}`;
  }
});
