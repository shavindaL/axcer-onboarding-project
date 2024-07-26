const WEB_SOCKET_URL = "wss://kv1uis0gti.execute-api.us-east-1.amazonaws.com/prod";

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension Installed');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log(msg);

    if (msg.eventType === 'speechToText') {

        console.log('Event Type:', msg.eventType, 'Data:', msg);

        try {
            let webSocket = new WebSocket(WEB_SOCKET_URL);

            webSocket.onopen = (event) => {
                console.log('Connected to the server socket');
                console.log('Event:', event.target);

                console.log('Sending message to the server socket');
                // Send the message to the server
                webSocket.send(JSON.stringify({
                    "action": "sendmessage", "data": {
                        transcript: msg.transcript,
                        selectedText: msg.selectedText
                    }
                }));
            };

            webSocket.onmessage = (event) => {
                const { message } = JSON.parse(event.data);

                chrome.tts.speak(message);
            };



            webSocket.onclose = () => {
                console.log('Disconnected from the server socket');
            };

            webSocket.onerror = (error) => {
                console.log('WebSocket Error:', error);
            };

        } catch (error) {
            console.log("Error", error);
        }

    }
})



