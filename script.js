 // Set up voice recognition
 const speakButton = document.getElementById('speakButton');
 const speechOutput = document.getElementById('speechOutput');
 const resultElement = document.getElementById('result');

 // Check if browser supports Speech Recognition
 if ('webkitSpeechRecognition' in window) {
     const recognition = new webkitSpeechRecognition();
     recognition.lang = 'en-US';

     speakButton.addEventListener('click', () => {
         recognition.start(); // Start voice recognition
     });

     recognition.onresult = (event) => {
         const transcript = event.results[0][0].transcript;
         speechOutput.textContent = transcript; // Display the captured voice command
         sendVoiceData(transcript); // Send the command to the backend
     };

     recognition.onerror = (event) => {
         resultElement.textContent = 'Error in speech recognition: ' + event.error;
     };
 } else {
     alert('Speech Recognition not supported in this browser');
 }

 // Function to send voice data to Flask backend
 function sendVoiceData(transcript) {
     const data = {
         command: transcript,
         vehicle: "Car123",  // Example vehicle data
         mileage: 20000
     };

     fetch('http://127.0.0.1:5000/check-vehicle-health', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
     })
     .then(response => response.json())
     .then(data => {
         console.log('Success:', data);
         resultElement.textContent = `Vehicle Health: ${data.message}`;
     })
     .catch((error) => {
         console.error('Error:', error);
         resultElement.textContent = 'Error fetching vehicle health';
     });
 }

 // File upload functionality
 function uploadFile() {
     const fileInput = document.getElementById('fileInput');
     const file = fileInput.files[0];

     const formData = new FormData();
     formData.append('file', file);

     fetch('http://127.0.0.1:5000/upload-file', {
         method: 'POST',
         body: formData
     })
     .then(response => response.json())
     .then(data => {
         if (data.status === 'Success') {
             const content = data.content;
             document.getElementById('fileContent').textContent = content;
         } else {
             alert('Error: ' + data.message);
         }
     })
     .catch(error => {
         console.error('Error:', error);
     });
 }

 // Ask AI function
 function askQuestion() {
     const question = document.getElementById('question').value;
     const fileContent = document.getElementById('fileContent').textContent;

     fetch('http://127.0.0.1:5000/ask-question', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({
             question: question,
             content: fileContent
         })
     })
     .then(response => response.json())
     .then(data => {
         if (data.status === 'Success') {
             document.getElementById('answer').textContent = data.message;
         } else {
             alert('Error: ' + data.message);
         }
     })
     .catch(error => {
         console.error('Error:', error);
     });
 }