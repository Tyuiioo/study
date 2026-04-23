let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    const { createClient } = supabase;
    supabaseClient = createClient(
        "https://gvauqjavaszfdzuhkwuq.supabase.co",
        "sb_publishable_6yhOFp0a_MfJxxTk3YGmhw_ffZtFbuw"
    );
}
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) alert(error.message);
    else window.location.href = "dashboard.html";
}
async function checkAuth() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        window.location.href = "index.html";
    }
}
async function saveData(study, insta, other, score, subject) {
    const { data: userData } = await supabaseClient.auth.getUser();
    const user = userData.user;

    const { error } = await supabaseClient
        .from("logs")
        .insert([
            {
                study,
                insta,
                other,
                score,
                subject,
                user_id: user.id
            }
        ]);

    if (error) {
        console.log(error);
        alert("Error saving data");
    } else {
        alert("Saved!");
    }
}
async function loadHistory() {
    const { data: userData } = await supabaseClient.auth.getUser();
    const user = userData.user;

    const { data, error } = await supabaseClient
        .from("logs")
        .select("*")
        .eq("user_id", user.id);

    let html = "";

    data.forEach(d => {
        html += `<p>${d.subject} - ${d.score}%</p>`;
    });

    document.getElementById("history").innerHTML = html;
}
// ==================== GOAL SYSTEM ====================
const GOALS = {
    // ========== ICSE (HARDER) ==========
    "ICSE_7": {
        name: "ICSE Class 7",
        targetHours: 10,
        dailyTarget: 5,
        scoreMultiplier: 0.95,
        description: "7th standard ICSE foundation",
        recommendedTime: "1.5-2 hours per subject"
    },
    "ICSE_8": {
        name: "ICSE Class 8",
        targetHours: 12,
        dailyTarget: 6,
        scoreMultiplier: 1.0,
        description: "8th standard ICSE curriculum",
        recommendedTime: "2-2.5 hours per subject"
    },
    "ICSE_9": {
        name: "ICSE Class 9",
        targetHours: 14,
        dailyTarget: 7,
        scoreMultiplier: 1.05,
        description: "9th standard pre-board ICSE",
        recommendedTime: "2.5-3 hours per subject"
    },
    "ICSE_10": {
        name: "ICSE Class 10",
        targetHours: 16,
        dailyTarget: 8,
        scoreMultiplier: 1.10,
        description: "10th standard board ICSE (HARDER)",
        recommendedTime: "3-3.5 hours per subject"
    },

    // ========== CBSE (EASIER) ==========
    "CBSE_7": {
        name: "CBSE Class 7",
        targetHours: 8,
        dailyTarget: 4,
        scoreMultiplier: 0.85,
        description: "7th standard CBSE foundation",
        recommendedTime: "1-1.5 hours per subject"
    },
    "CBSE_8": {
        name: "CBSE Class 8",
        targetHours: 10,
        dailyTarget: 5,
        scoreMultiplier: 0.90,
        description: "8th standard CBSE curriculum",
        recommendedTime: "1.5-2 hours per subject"
    },
    "CBSE_9": {
        name: "CBSE Class 9",
        targetHours: 12,
        dailyTarget: 6,
        scoreMultiplier: 0.95,
        description: "9th standard pre-board CBSE",
        recommendedTime: "2-2.5 hours per subject"
    },
    "CBSE_10": {
        name: "CBSE Class 10",
        targetHours: 14,
        dailyTarget: 7,
        scoreMultiplier: 1.0,
        description: "10th standard board CBSE (EASIER)",
        recommendedTime: "2.5-3 hours per subject"
    },

    // ========== CBSE SENIOR (CLASS 11-12) ==========
    "CBSE_11": {
        name: "CBSE Class 11",
        targetHours: 16,
        dailyTarget: 10,
        scoreMultiplier: 1.15,
        description: "11th standard foundation building",
        recommendedTime: "3-4 hours per subject"
    },
    "CBSE_12": {
        name: "CBSE Class 12",
        targetHours: 18,
        dailyTarget: 12,
        scoreMultiplier: 1.25,
        description: "12th standard final exams",
        recommendedTime: "3.5-4 hours per subject"
    },

    // ========== COMPETITIVE EXAMS ==========
    "JEE_MAINS": {
        name: "JEE Mains",
        targetHours: 20,
        dailyTarget: 14,
        scoreMultiplier: 1.40,
        description: "Engineering entrance exam",
        recommendedTime: "4-5 hours per subject"
    },
    "JEE_ADVANCED": {
        name: "JEE Advanced",
        targetHours: 22,
        dailyTarget: 15,
        scoreMultiplier: 1.60,
        description: "Elite IIT preparation",
        recommendedTime: "5-6 hours per subject"
    }
};

// ==================== USER STATE ====================
function getCurrentUser() {
    let user = JSON.parse(localStorage.getItem("user")) || null;
    return user;
}

function getCurrentGoal() {
    let user = getCurrentUser();
    if (user && user.goal) {
        return GOALS[user.goal];
    }
    return null;
}

function setGoal(goalId) {
    let user = JSON.parse(localStorage.getItem("user")) || {};
    user.goal = goalId;
    user.goalSetDate = new Date().toISOString();
    localStorage.setItem("user", JSON.stringify(user));
}

// ==================== DATA SAVING ====================
function saveData(study, insta, other, score, subject) {
    let data = JSON.parse(localStorage.getItem("logs")) || [];
    let today = new Date().toISOString().split('T')[0];
    let user = getCurrentUser();
    let goal = getCurrentGoal();
    
    data.push({
        date: today,
        study: study,
        insta: insta,
        other: other,
        score: score,
        subject: subject,
        goal: user ? user.goal : null,
        timestamp: new Date().getTime()
    });
    
    localStorage.setItem("logs", JSON.stringify(data));
}

// ==================== SCORING SYSTEM ====================
async function calculate() {
    let study = parseFloat(document.getElementById("study").value) || 0;
    let insta = parseFloat(document.getElementById("insta").value) || 0;
    let other = parseFloat(document.getElementById("other").value) || 0;
    let subject = document.getElementById("subject").value;

    let total = study + insta + other;
    let baseScore = total > 0 ? (study / total) * 100 : 0;
    
    let goal = getCurrentGoal();
    let multiplier = goal ? goal.scoreMultiplier : 1.0;
    let finalScore = Math.min(baseScore * multiplier, 100);

    saveData(study, insta, other, finalScore, subject);

    let suggestions = getSuggestion({
        study, insta, other, subject, score: finalScore, goal: goal
    });

    // Get AI tips from backend
    let aiTips = [];
    try {
        const response = await fetch('http://localhost:3000/ai', {
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
                logs: JSON.parse(localStorage.getItem("logs")) || []
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Handle new backend response format
            if (data.tips && Array.isArray(data.tips)) {
                aiTips = data.tips.slice(0, 5);
            } else if (data.choices && data.choices[0]) {
                // Fallback for old format
                const aiResponse = data.choices[0].message.content;
                aiTips = aiResponse.split('\n').filter(tip => tip.trim().length > 0).slice(0, 5);
            } else {
                throw new Error('Invalid response format');
            }
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('AI API error:', error);
        // Show error message - no fallback to local suggestions
        aiTips = [`⚠️ AI Service Error: ${error.message}`, "Please try again in a few moments or check if the server is running."];
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
}

// ==================== LOADING DATA ====================
function loadHistory() {
    let data = JSON.parse(localStorage.getItem("logs")) || [];
    let html = "";

    if (data.length === 0) {
        document.getElementById("history").innerHTML = "<p class='empty-msg'>No data yet. Start tracking!</p>";
        return;
    }

    data.forEach(d => {
        const bar = createBar(d.score);
        html += '<div class="history-item"><strong>' + d.date + '</strong><span class="score-badge">' + d.score.toFixed(1) + '%</span>' + bar + '</div>';
    });

    document.getElementById("history").innerHTML = html;
}

function createBar(score) {
    const color = score >= 85 ? '#10b981' : score >= 70 ? '#eab308' : '#ef4444';
    return '<div class="mini-bar"><div style="width: ' + Math.min(score, 100) + '%; height: 100%; background: ' + color + '; border-radius: 2px;"></div></div>';
}

function loadDashboard() {
    let user = getCurrentUser();
    let goal = getCurrentGoal();
    let data = JSON.parse(localStorage.getItem("logs")) || [];

    if (goal) {
        document.getElementById("currentGoal").innerText = "GOAL: " + goal.name + " | " + goal.recommendedTime;
    }

    if (data.length === 0) {
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
    for (let i = data.length - 1; i > 0; i--) {
        if (data[i].score >= 70) streak++;
        else break;
    }
    document.getElementById("streak").innerText = "STREAK: " + streak + " days";

    let last7 = data.slice(-7);
    let avgScore = last7.reduce((a, b) => a + b.score, 0) / last7.length;
    document.getElementById("weeklyAvg").innerText = "Weekly Avg: " + avgScore.toFixed(1) + "%";
}

function loadChart() {
    let data = JSON.parse(localStorage.getItem("logs")) || [];

    if (data.length === 0) return;

    let labels = data.map(d => d.date);
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
async function signup() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Fill in all fields!");
        return;
    }

    let user = { email: email, timestamp: new Date().getTime() };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "goals.html";
}



function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("logs");
    window.location.href = "index.html";
}

function selectGoal(goalId) {
    setGoal(goalId);
    window.location.href = "dashboard.html";
}

// ==================== SUGGESTIONS ====================
function getSuggestion(data) {
    let { study, insta, other, subject, score, goal } = data;
    let suggestions = [];

    if (insta + other > study) {
        suggestions.push("ALERT: Distraction > Study. Cut phone usage!");
    }

    let minStudy = goal ? goal.dailyTarget : 6;
    if (study < minStudy) {
        suggestions.push("NOTICE: Study " + minStudy + "+ hours for your goal.");
    }

    if (score >= 85) {
        suggestions.push("EXCELLENT: Outstanding performance!");
    } else if (score >= 70) {
        suggestions.push("GOOD: Keep pushing!");
    } else {
        suggestions.push("WARNING: Increase focus, reduce distractions.");
    }

    if (subject === "Math") {
        suggestions.push("MATH: Practice 15+ problems daily.");
    }
    if (subject === "Physics") {
        suggestions.push("PHYSICS: Numericals + concepts equally.");
    }
    if (subject === "Chemistry") {
        suggestions.push("CHEMISTRY: Reactions & formulas mastery.");
    }
    if (subject === "Biology") {
        suggestions.push("BIOLOGY: Diagrams + theory balance.");
    }
    if (subject === "English") {
        suggestions.push("ENGLISH: Read daily, write essays.");
    }
    if (subject === "History") {
        suggestions.push("HISTORY: Timeline + context important.");
    }
    if (subject === "Geography") {
        suggestions.push("GEOGRAPHY: Maps + data analysis key.");
    }

    return suggestions;
}

function getAISuggestions(data) {
    let { study, insta, other, subject, score, goal } = data;
    let aiTips = [];
    
    if (study === 0) {
        aiTips.push("START: Begin with 30-min Pomodoro session!");
        aiTips.push("FOCUS: Use Pomodoro. 25min work, 5min break.");
    } else if (study < 3) {
        aiTips.push("INCREASE: Study longer today. Build momentum!");
        aiTips.push("BREAK: Take 5min breaks every 50 mins.");
    } else if (study < 6) {
        aiTips.push("GOOD: Active recall + spaced repetition.");
        aiTips.push("HYDRATE: Drink water every hour!");
    } else {
        aiTips.push("AMAZING: You're crushing it! Keep going!");
        aiTips.push("LEVEL UP: Teach concepts to others.");
    }

    if (goal) {
        let goalName = goal.name;
        if (goalName.includes("ICSE")) {
            aiTips.push("ICSE: Concept clarity crucial. Practice variations!");
            aiTips.push("TIME: " + goal.recommendedTime + " per subject recommended.");
        } else if (goalName.includes("CBSE")) {
            if (goalName.includes("10")) {
                aiTips.push("CBSE: Focus on NCERT. Board exam patterns.");
            } else if (goalName.includes("11") || goalName.includes("12")) {
                aiTips.push("BOARD: Revision + past papers essential.");
                aiTips.push("TIME: " + goal.recommendedTime + " per subject.");
            } else {
                aiTips.push("CBSE: Strong fundamentals foundation.");
            }
        } else if (goalName.includes("JEE")) {
            if (goalName.includes("Mains")) {
                aiTips.push("JEE: Previous year papers daily practice!");
            } else {
                aiTips.push("JEE ADVANCED: Elite level. Problem solving!");
            }
            aiTips.push("TIME: " + goal.recommendedTime + " per subject.");
        }
    }

    if (insta + other > 2) {
        aiTips.push("DISTRACTION: App blockers during study hours!");
    }

    if (score >= 85) {
        aiTips.push("MOMENTUM: Maintain this streak!");
    } else if (score < 50) {
        aiTips.push("RESET: Small daily progress wins!");
    }

    return aiTips.slice(0, 5);
}

// ==================== CHAT FUNCTION ====================
async function sendChat() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message to chat
    addChatMessage('You', message);
    input.value = '';

    try {
        const goal = getCurrentGoal();
        const logs = JSON.parse(localStorage.getItem("logs")) || [];

        const response = await fetch('https://study-yxi5.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                goal: goal ? goal.name : 'General',
                logs
            })
        });

        if (response.ok) {
            const data = await response.json();
            addChatMessage('AI Coach', data.response);
        } else {
            addChatMessage('AI Coach', `Error: API returned ${response.status}. Please try again.`);
        }
    } catch (error) {
        console.error('Chat error:', error);
        addChatMessage('AI Coach', `Connection error: ${error.message}`);
    }
}

function addChatMessage(sender, message) {
    const chatDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '10px';
    messageDiv.style.padding = '8px';
    messageDiv.style.borderRadius = '5px';
    
    if (sender === 'You') {
        messageDiv.style.background = 'rgba(16, 185, 129, 0.2)';
        messageDiv.style.textAlign = 'right';
    } else {
        messageDiv.style.background = 'rgba(59, 130, 246, 0.2)';
        messageDiv.style.textAlign = 'left';
    }
    
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatDiv.appendChild(messageDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Auto-load on page load
window.addEventListener('DOMContentLoaded', function() {
    let path = window.location.pathname;
    if (path.includes('dashboard.html')) {
        loadDashboard();
        setTimeout(loadChart, 100);
    } else if (path.includes('history.html')) {
        loadHistory();
        setTimeout(loadChart, 100);
    }
    
    // Temporarily disable auth check
    // let user = getCurrentUser();
    // if (!user && !path.includes('index.html') && !path.includes('goals.html')) {
    //     window.location.href = 'index.html';
    // }
});

