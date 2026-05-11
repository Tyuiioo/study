async function testChat() {
    try {
        const response = await fetch("https://study-yxi5.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Hello",
                goal: "General academic improvement",
                logs: []
            })
        });

        const status = response.status;
        const text = await response.text();
        console.log(`Status: ${status}`);
        console.log(`Response: ${text}`);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testChat();
