// Speech recognition
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

//Ripple effect for mic icon
const micRippleEffect = document.createElement('style');
micRippleEffect.innerHTML = `
    @keyframes ripple {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        }
    }
    .mic-active {
        animation: ripple 1.5s infinite;
                border: 2px solid red;

    }
`;

document.head.appendChild(micRippleEffect);

document.addEventListener('mouseup', (event) => {

    const selection = window.getSelection();
    const selectedText = selection.toString().trim()
    const selectedTextBeforeTrim = selection.toString();

    if (selectedText !== '') {
        // Bubble div
        const range = selection.getRangeAt(0).getBoundingClientRect();
        const bubble = document.createElement('div');
        bubble.style.position = 'absolute';
        bubble.style.width = '80px';
        bubble.style.height = 'max-content';
        bubble.style.backgroundColor = 'white';
        bubble.style.padding = '10px';
        bubble.style.borderRadius = '10px';
        bubble.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.5)';
        bubble.style.zIndex = '9999';
        bubble.style.top = `${window.scrollY + range.top + range.height}px`;
        bubble.style.left = `${window.scrollX + range.left + range.width / 2}px`;
        bubble.style.transform = 'translate(-50%, 10px)';
        bubble.style.display = 'flex';
        bubble.style.justifyContent = 'space-between';
        bubble.style.alignItems = 'center';

        // Mic div
        const micDiv = document.createElement('div');
        micDiv.style.display = 'flex';
        micDiv.style.justifyContent = 'between';
        micDiv.style.gap = '15px';
        micDiv.style.alignItems = 'center';
        micDiv.style.justifyContent = 'center';
        micDiv.style.width = '30px';
        micDiv.style.height = '30px';
        micDiv.style.backgroundColor = 'white';
        micDiv.style.borderRadius = '50%';
        micDiv.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.5)';
        micDiv.style.cursor = 'pointer';

        // Mic icon
        const micImage = document.createElement('img');
        micImage.src = chrome.runtime.getURL('icons/mic.svg');
        micImage.style.width = '20px';
        micImage.style.height = '20px';

        micDiv.appendChild(micImage);
        bubble.appendChild(micDiv);

        // Close Button div
        const closeButton = document.createElement('div');
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = 'max-content';
        closeButton.style.height = 'max-content';
        closeButton.style.borderRadius = '50%';
        closeButton.style.display = 'flex';
        closeButton.style.justifyContent = 'center';
        closeButton.style.alignItems = 'center';

        // Close button icon
        const closeIcon = document.createElement('img');
        closeIcon.src = chrome.runtime.getURL('icons/x-solid.svg');
        closeIcon.style.width = '20px';
        closeIcon.style.height = '20px';
        closeIcon.style.padding = '5px';
        closeButton.onmouseover = () => {
            closeButton.style.backgroundColor = 'rgba(0,0,0,0.1)';
        }
        closeButton.onmouseout = () => {
            closeButton.style.backgroundColor = 'transparent';
        }
        closeButton.appendChild(closeIcon);

        closeButton.onclick = () => {
            document.body.removeChild(bubble);
            if (recognition) {
                recognition.stop();
                micDiv.classList.remove('mic-active');
            }
        }

        bubble.appendChild(closeButton);

        micDiv.onclick = () => {
            // Add animation to mic icon
            micDiv.classList.add('mic-active');

            let finalTranscript = '';

            recognition.start();

            recognition.onresult = (event) => {
                const results = event.results;
                for (let i = event.resultIndex; i < results.length; i++) {
                    if (results[i].isFinal) {
                        finalTranscript += results[i][0].transcript;
                    }
                }
            }

            recognition.onspeechend = () => {
                micDiv.classList.remove('mic-active');
                console.log('Speech has ended.');
                recognition.stop();
            };

            recognition.onerror = (event) => {
                micDiv.classList.remove('mic-active');
                console.error('Speech recognition error:', event.error);
                recognition.stop();
            }

            recognition.onend = () => {
                micDiv.classList.remove('mic-active');
                console.log('Final Transcript:', finalTranscript);
                console.log('Selected Text:', selectedTextBeforeTrim);

                // Send the final transcript and selected text to the background script
                chrome.runtime.sendMessage({ eventType: 'speechToText', transcript: finalTranscript, selectedText: selectedTextBeforeTrim });

                recognition.stop();
            }
        }

        document.body.appendChild(bubble);

        selection.removeAllRanges();
    }
});
