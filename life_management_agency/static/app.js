document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const showDetailsCheckbox = document.getElementById('showDetails');
    const agentDetails = document.getElementById('agentDetails');
    const agentList = document.getElementById('agentList');
    const clearChatButton = document.getElementById('clearChat');
    const achievementGrid = document.getElementById('achievementGrid');

    // Progress Tracking State
    let progressState = {
        streak: 0,
        dailyGoals: {
            completed: 0,
            total: 5
        },
        weeklyChallenge: 0,
        achievements: [],
        stats: {
            tasksDone: 0,
            points: 0,
            badges: 0,
            level: 1
        }
    };

    // Achievement Definitions
    const achievements = {
        firstChat: { icon: '💬', name: 'First Chat' },
        streakStarter: { icon: '🔥', name: '3 Day Streak' },
        goalAchiever: { icon: '🎯', name: 'Complete Goals' },
        levelUp: { icon: '⭐', name: 'Level Up' },
        weeklyMaster: { icon: '🏆', name: 'Weekly Master' },
        socialButterfly: { icon: '🦋', name: 'Social Star' }
    };

    // WebSocket connection
    let ws = null;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_INTERVAL = 3000;

    // Initialize WebSocket Connection
    function initializeWebSocket() {
        if (ws && ws.readyState !== WebSocket.CLOSED) return;

        ws = new WebSocket('ws://localhost:8001');
        
        ws.onopen = () => {
            console.log('WebSocket connected');
            addMessage('system', 'Connected to Life Management Agency');
            reconnectAttempts = 0;
            updateAgentList([
                { name: "Master Agent", status: "active" },
                { name: "Knowledge Agent", status: "idle" },
                { name: "Health Agent", status: "idle" },
                { name: "Lifestyle Agent", status: "idle" },
                { name: "Social Media Agent", status: "idle" },
                { name: "Personal Coach Agent", status: "idle" },
                { name: "Family Coach Agent", status: "idle" }
            ]);
        };

        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                handleAgentResponse(response);
            } catch (error) {
                console.error('Error parsing message:', error);
                addMessage('system', 'Error processing server response');
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                addMessage('system', `Disconnected from server. Attempting to reconnect (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
                reconnectAttempts++;
                setTimeout(initializeWebSocket, RECONNECT_INTERVAL);
            } else {
                addMessage('system', 'Failed to connect to server after multiple attempts. Please refresh the page to try again.');
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            addMessage('system', 'Connection error occurred');
        };
    }

    // Handle Agent Response
    function handleAgentResponse(response) {
        // Remove loading message
        const loadingMessage = document.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        if (response.status === 'success') {
            if (response.data.message) {
                addMessage('agent', response.data.message);
            }
            
            // Update agent statuses if provided
            if (response.data.agents) {
                updateAgentList(response.data.agents);
            }

            // Handle progress updates
            if (response.data.progress) {
                updateProgress(response.data.progress);
            }

            // Check for achievements
            if (response.data.achievements) {
                handleAchievements(response.data.achievements);
            }
        } else {
            addMessage('system', `Error: ${response.error}`);
        }

        // Re-enable input and send button
        userInput.disabled = false;
        sendButton.disabled = false;
    }

    // Progress Update Functions
    function updateProgress(progress) {
        // Update streak
        if (progress.streak !== undefined) {
            progressState.streak = progress.streak;
            document.querySelector('.streak-count').textContent = progress.streak;
        }

        // Update daily goals
        if (progress.dailyGoals) {
            progressState.dailyGoals = progress.dailyGoals;
            const percentage = (progress.dailyGoals.completed / progress.dailyGoals.total) * 100;
            document.querySelector('.progress-item:nth-child(1) .progress-fill').style.width = `${percentage}%`;
            document.querySelector('.progress-item:nth-child(1) .progress-text').textContent = 
                `${progress.dailyGoals.completed}/${progress.dailyGoals.total} Completed`;
        }

        // Update weekly challenge
        if (progress.weeklyChallenge !== undefined) {
            progressState.weeklyChallenge = progress.weeklyChallenge;
            document.querySelector('.progress-item:nth-child(2) .progress-fill').style.width = 
                `${progress.weeklyChallenge}%`;
            document.querySelector('.progress-item:nth-child(2) .progress-text').textContent = 
                `${progress.weeklyChallenge}% Complete`;
        }

        // Update stats
        if (progress.stats) {
            progressState.stats = progress.stats;
            document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = 
                progress.stats.tasksDone;
            document.querySelector('.stat-item:nth-child(2) .stat-value').textContent = 
                progress.stats.points;
            document.querySelector('.stat-item:nth-child(3) .stat-value').textContent = 
                progress.stats.badges;
            document.querySelector('.stat-item:nth-child(4) .stat-value').textContent = 
                progress.stats.level;
        }
    }

    // Achievement Functions
    function handleAchievements(newAchievements) {
        newAchievements.forEach(achievementId => {
            if (!progressState.achievements.includes(achievementId) && 
                achievements[achievementId]) {
                progressState.achievements.push(achievementId);
                addAchievement(achievementId);
                showAchievementNotification(achievementId);
            }
        });
    }

    function addAchievement(achievementId) {
        const achievement = achievements[achievementId];
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement-item';
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
        `;
        achievementGrid.appendChild(achievementElement);
    }

    function showAchievementNotification(achievementId) {
        const achievement = achievements[achievementId];
        const notification = document.createElement('div');
        notification.className = 'message system-message';
        notification.innerHTML = `
            <div class="message-content">
                <p>🎉 Achievement Unlocked: ${achievement.name} ${achievement.icon}</p>
            </div>
        `;
        chatMessages.appendChild(notification);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Message Handling
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add Loading Message
    function addLoadingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message loading-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="loading-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <p>Processing your request...</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Update Agent List
    function updateAgentList(agents) {
        if (!showDetailsCheckbox.checked) return;
        
        agentList.innerHTML = '';
        agents.forEach(agent => {
            const agentDiv = document.createElement('div');
            agentDiv.className = 'agent-item';
            agentDiv.innerHTML = `
                <div class="agent-status">
                    <span>${agent.name}</span>
                    <span class="status-indicator status-${agent.status}"></span>
                </div>
            `;
            agentList.appendChild(agentDiv);
        });
    }

    // Send Message
    function sendMessage(message) {
        if (!message.trim()) return;

        if (ws && ws.readyState === WebSocket.OPEN) {
            // Add user message
            addMessage('user', message);
            
            // Clear input and disable
            userInput.value = '';
            userInput.disabled = true;
            sendButton.disabled = true;
            
            // Add loading message
            addLoadingMessage();
            
            // Send message to server
            ws.send(JSON.stringify({
                type: 'request',
                agent: 'master',
                content: {
                    message: message
                },
                metadata: {}
            }));
        } else {
            addMessage('system', 'Not connected to server. Please wait for reconnection...');
        }
    }

    // Clear Chat
    function clearChat() {
        chatMessages.innerHTML = '';
        addMessage('system', 'Chat history cleared');
    }

    // Event Listeners
    sendButton.addEventListener('click', () => {
        sendMessage(userInput.value);
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    showDetailsCheckbox.addEventListener('change', (e) => {
        agentDetails.style.display = e.target.checked ? 'block' : 'none';
    });

    clearChatButton.addEventListener('click', clearChat);

    // Initialize WebSocket connection
    initializeWebSocket();
});
