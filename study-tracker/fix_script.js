const fs = require('fs');
let code = fs.readFileSync('d:/study-tracker/script.js', 'utf8');

// 1. Remove the first duplicate chunk (lines 10 to 69)
code = code.replace(/async function login\(\) {[\s\S]*?document\.getElementById\("history"\)\.innerHTML = html;\n}/, '');

// 2. Replace USER STATE and DATA SAVING
code = code.replace(/\/\/ ==================== USER STATE ====================[\s\S]*?localStorage\.setItem\("logs", JSON\.stringify\(data\)\);\n}/, `// ==================== USER STATE ====================
async function getCurrentUser() {
    const { data } = await supabaseClient.auth.getUser();
    return data.user;
}

async function getCurrentGoal() {
    let user = await getCurrentUser();
    if (user && user.user_metadata && user.user_metadata.goal) {
        return GOALS[user.user_metadata.goal];
    }
    return null;
}

async function setGoal(goalId) {
    const { data, error } = await supabaseClient.auth.updateUser({
        data: { goal: goalId }
    });
    if (error) console.error("Error setting goal:", error);
}

// ==================== DATA SAVING ====================
async function saveData(study, insta, other, score, subject) {
    const user = await getCurrentUser();
    if (!user) return;

    const { error } = await supabaseClient
        .from("log")
        .insert([{
            study: study,
            insta: insta,
            other: other,
            score: score,
            subject: subject,
            user_id: user.id
        }]);

    if (error) {
        console.error("Error saving data:", error);
        alert("Error saving data!");
    } else {
        alert("Saved!");
    }
}`);

// 3. Replace calculate()
code = code.replace(/async function calculate\(\) {[\s\S]*?document\.getElementById\("result"\)\.innerHTML = output;\n}/, `async function calculate() {
    let study = parseFloat(document.getElementById("study").value) || 0;
    let insta = parseFloat(document.getElementById("insta").value) || 0;
    let other = parseFloat(document.getElementById("other").value) || 0;
    let subject = document.getElementById("subject").value;

    let total = study + insta + other;
    let baseScore = total > 0 ? (study / total) * 100 : 0;
    
    let goal = await getCurrentGoal();
    let multiplier = goal ? goal.scoreMultiplier : 1.0;
    let finalScore = Math.min(baseScore * multiplier, 100);

    await saveData(study, insta, other, finalScore, subject);

    let suggestions = getSuggestion({
        study, insta, other, subject, score: finalScore, goal: goal
    });

    let logsData = [];
    const user = await getCurrentUser();
    if (user) {
        const { data } = await supabaseClient
            .from("log")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5);
        logsData = data || [];
    }

    // Get AI tips from backend
    let aiTips = [];
    try {
        const response = await fetch('https://study-yxi5.onrender.com/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                study,
                insta,
                other,
                score: finalScore,
                subject,
                goal: goal ? goal.name : 'General',
                logs: logsData
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.tips && Array.isArray(data.tips)) {
                aiTips = data.tips.slice(0, 5);
            } else if (data.choices && data.choices[0]) {
                const aiResponse = data.choices[0].message.content;
                aiTips = aiResponse.split('\\n').filter(tip => tip.trim().length > 0).slice(0, 5);
            } else {
                throw new Error('Invalid response format');
            }
        } else {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
    } catch (error) {
        console.error('AI API error:', error);
        aiTips = [\`⚠️ AI Service Error: \${error.message}\`, "Please try again in a few moments or check if the server is running."];
    }

    let output = '<div class="result-box">';
    output += '<p class="score-display">SCORE: ' + finalScore.toFixed(1) + '%</p>';
    
    suggestions.forEach(s => {
        output += '<p class="suggestion">' + s + '</p>';
    });
    
    output += '<div class="ai-tips"><h3>AI STUDY TIPS:</h3>';
    aiTips.forEach(tip => {
        output += '<p class="ai-tip">' + tip + '</p>';
    });
    output += '</div></div>';

    document.getElementById("result").innerHTML = output;
}`);

// 4. Replace loadHistory() and loadDashboard() and loadChart()
code = code.replace(/\/\/ ==================== LOADING DATA ====================[\s\S]*?\/\/ ==================== AUTH FUNCTIONS ====================/, `// ==================== LOADING DATA ====================
async function loadHistory() {
    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabaseClient
        .from("log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    let html = "";

    if (!data || data.length === 0) {
        document.getElementById("history").innerHTML = "<p class='empty-msg'>No data yet. Start tracking!</p>";
        return;
    }

    data.forEach(d => {
        const bar = createBar(d.score);
        const dateStr = new Date(d.created_at).toISOString().split('T')[0];
        html += '<div class="history-item"><strong>' + dateStr + ' | ' + (d.subject || 'N/A') + '</strong><span class="score-badge">' + d.score.toFixed(1) + '%</span>' + bar + '</div>';
    });

    document.getElementById("history").innerHTML = html;
}

function createBar(score) {
    const color = score >= 85 ? '#10b981' : score >= 70 ? '#eab308' : '#ef4444';
    return '<div class="mini-bar"><div style="width: ' + Math.min(score, 100) + '%; height: 100%; background: ' + color + '; border-radius: 2px;"></div></div>';
}

async function loadDashboard() {
    let user = await getCurrentUser();
    let goal = await getCurrentGoal();

    if (!user) return;

    const { data, error } = await supabaseClient
        .from("log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

    if (goal) {
        document.getElementById("currentGoal").innerText = "GOAL: " + goal.name + " | " + goal.recommendedTime;
    }

    if (!data || data.length === 0) {
        document.getElementById("todayScore").innerText = "Today's Score: No data";
        return;
    }

    let last = data[data.length - 1];
    document.getElementById("todayScore").innerText = "Today's Score: " + last.score.toFixed(1) + "%";

    document.getElementById("progressBar").style.width = Math.min(last.score, 100) + "%";
    
    const color = last.score >= 85 ? '#10b981' : last.score >= 70 ? '#eab308' : '#ef4444';
    document.getElementById("progressBar").style.background = color;

    let goalMsg = "";
    if (goal) {
        let goalTarget = goal.dailyTarget * goal.scoreMultiplier;
        if (last.score >= 90) {
            goalMsg = "EXCELLENT: Exceeded target!";
        } else if (last.score >= goalTarget) {
            goalMsg = "TARGET MET: Great job!";
        } else {
            goalMsg = "Daily Target: " + goalTarget.toFixed(0) + "% | Need " + (goalTarget - last.score).toFixed(1) + "% more";
        }
    }
    document.getElementById("goalMsg").innerText = goalMsg;

    let streak = 1;
    for (let i = data.length - 2; i >= 0; i--) {
        if (data[i].score >= 70) streak++;
        else break;
    }
    document.getElementById("streak").innerText = "STREAK: " + streak + " days";

    let last7 = data.slice(-7);
    let avgScore = last7.reduce((a, b) => a + b.score, 0) / last7.length;
    document.getElementById("weeklyAvg").innerText = "Weekly Avg: " + avgScore.toFixed(1) + "%";
}

async function loadChart() {
    let user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabaseClient
        .from("log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

    if (!data || data.length === 0) return;

    let labels = data.map(d => new Date(d.created_at).toISOString().split('T')[0]);
    let scores = data.map(d => d.score);

    const ctx = document.getElementById('myChart');
    
    if (ctx && typeof Chart !== 'undefined') {
        try {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Score %',
                        data: scores,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            labels: { color: '#fff', font: { size: 14, weight: 'bold' } }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { color: '#fff', font: { size: 12 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        },
                        x: {
                            ticks: { color: '#fff', font: { size: 12 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        }
                    }
                }
            });
        } catch(e) {
            console.error('Chart error:', e);
        }
    }
}

// ==================== AUTH FUNCTIONS ====================
`);

// 5. Replace AUTH FUNCTIONS
code = code.replace(/\/\/ ==================== AUTH FUNCTIONS ====================[\s\S]*?function selectGoal\(goalId\) {[\s\S]*?window\.location\.href = "dashboard\.html";\n}/, `// ==================== AUTH FUNCTIONS ====================
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) alert(error.message);
    else window.location.href = "dashboard.html";
}

async function signup() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Fill in all fields!");
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert(error.message);
    } else {
        alert("Account created!");
        window.location.href = "goals.html";
    }
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}

async function checkAuth() {
    const { data } = await supabaseClient.auth.getUser();
    if (!data.user) {
        window.location.href = "index.html";
    }
}

async function selectGoal(goalId) {
    await setGoal(goalId);
    window.location.href = "dashboard.html";
}
`);

// 6. Replace sendChat
code = code.replace(/async function sendChat\(\) {[\s\S]*?addChatMessage\('AI Coach', \`Connection error: \$\{error\.message\}\`\);\n    }\n}/, `async function sendChat() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message to chat
    addChatMessage('You', message);
    input.value = '';

    try {
        const goal = await getCurrentGoal();
        
        let logsData = [];
        const user = await getCurrentUser();
        if (user) {
            const { data } = await supabaseClient
                .from("log")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(5);
            logsData = data || [];
        }

        const response = await fetch('https://study-yxi5.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                goal: goal ? goal.name : 'General',
                logs: logsData
            })
        });

        if (response.ok) {
            const data = await response.json();
            addChatMessage('AI Coach', data.response);
        } else {
            addChatMessage('AI Coach', \`Error: API returned \${response.status}. Please try again.\`);
        }
    } catch (error) {
        console.error('Chat error:', error);
        addChatMessage('AI Coach', \`Connection error: \${error.message}\`);
    }
}`);

fs.writeFileSync('d:/study-tracker/script.js', code);
console.log('script.js updated successfully!');
