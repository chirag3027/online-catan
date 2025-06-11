/**
 * Online Catan - Main Game Class
 * A browser-based implementation of Settlers of Catan
 */

class CatanGame {
    constructor() {
        this.players = [];
        this.currentPlayer = 0;
        this.gamePhase = 'setup';
        this.board = this.generateBoard();
        this.isConnected = false;
        
        this.addSamplePlayers();
        this.initializeUI();
        this.simulateConnection();
    }

    /**
     * Generate a random Catan board following standard rules
     * @returns {Array} Board array with resource and number data
     */
    generateBoard() {
        // Standard Catan resource distribution
        const resourceTiles = [
            'brick', 'brick', 'brick',           // 3 brick
            'grain', 'grain', 'grain', 'grain',  // 4 grain
            'wood', 'wood', 'wood', 'wood',      // 4 wood
            'sheep', 'sheep', 'sheep', 'sheep',  // 4 sheep
            'ore', 'ore', 'ore',                 // 3 ore
            'desert'                             // 1 desert
        ];
        
        // Standard Catan number distribution (excluding desert)
        const numberTokens = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
        
        // Shuffle the resource tiles
        for (let i = resourceTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [resourceTiles[i], resourceTiles[j]] = [resourceTiles[j], resourceTiles[i]];
        }
        
        // Create the board
        const board = [];
        let desertIndex = -1;
        
        // First pass: assign resources
        for (let i = 0; i < 19; i++) {
            const resource = resourceTiles[i];
            if (resource === 'desert') {
                board.push({ resource: 'desert', number: null });
                desertIndex = i;
            } else {
                board.push({ resource, number: null }); // Numbers assigned later
            }
        }
        
        // Define adjacency map for the hexagonal board (3-4-5-4-3 pattern)
        const adjacencyMap = {
            0: [1, 3, 4], 1: [0, 2, 4, 5], 2: [1, 5, 6],
            3: [0, 4, 7, 8], 4: [0, 1, 3, 5, 8, 9], 5: [1, 2, 4, 6, 9, 10], 6: [2, 5, 10, 11],
            7: [3, 8, 12], 8: [3, 4, 7, 9, 12, 13], 9: [4, 5, 8, 10, 13, 14], 
            10: [5, 6, 9, 11, 14, 15], 11: [6, 10, 15],
            12: [7, 8, 13, 16], 13: [8, 9, 12, 14, 16, 17], 14: [9, 10, 13, 15, 17, 18], 
            15: [10, 11, 14, 18], 16: [12, 13, 17], 17: [13, 14, 16, 18], 18: [14, 15, 17]
        };
        
        // Assign numbers with constraint checking
        const availablePositions = [];
        for (let i = 0; i < 19; i++) {
            if (i !== desertIndex) {
                availablePositions.push(i);
            }
        }
        
        // Try to place numbers with 6/8 constraint
        let attempts = 0;
        let success = false;
        
        while (!success && attempts < 1000) {
            attempts++;
            const tempBoard = [...board];
            const tempNumbers = [...numberTokens];
            
            // Shuffle available positions
            const shuffledPositions = [...availablePositions];
            for (let i = shuffledPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
            }
            
            // Try to assign numbers
            success = true;
            for (let i = 0; i < shuffledPositions.length; i++) {
                const pos = shuffledPositions[i];
                const num = tempNumbers[i];
                
                // Check if placing this number violates 6/8 adjacency rule
                if (num === 6 || num === 8) {
                    const adjacent = adjacencyMap[pos] || [];
                    const hasAdjacentRedNumber = adjacent.some(adj => {
                        const adjNum = tempBoard[adj].number;
                        return (num === 6 && adjNum === 8) || (num === 8 && adjNum === 6);
                    });
                    
                    if (hasAdjacentRedNumber) {
                        success = false;
                        break;
                    }
                }
                
                tempBoard[pos].number = num;
            }
            
            if (success) {
                // Copy successful assignment back to board
                for (let i = 0; i < 19; i++) {
                    if (i !== desertIndex) {
                        board[i].number = tempBoard[i].number;
                    }
                }
            }
        }
        
        // If we couldn't find a valid configuration, just assign numbers randomly
        if (!success) {
            let numberIndex = 0;
            for (let i = 0; i < 19; i++) {
                if (i !== desertIndex) {
                    board[i].number = numberTokens[numberIndex++];
                }
            }
        }
        
        return board;
    }

    /**
     * Initialize the user interface
     */
    initializeUI() {
        this.renderBoard();
        this.setupEventListeners();
        this.updateGameStatus();
    }

    /**
     * Get emoji icon for resource type
     * @param {string} resource - Resource type
     * @returns {string} Emoji icon
     */
    getResourceIcon(resource) {
        const icons = {
            grain: '🌾',
            wood: '🌲', 
            brick: '🧱',
            ore: '⛰️',
            sheep: '🐑',
            desert: '🏜️'
        };
        return icons[resource] || '❓';
    }

    /**
     * Get probability dots for dice number
     * @param {number} number - Dice number
     * @returns {string} Dot representation
     */
    getProbabilityDots(number) {
        const combinations = {
            2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6,
            8: 5, 9: 4, 10: 3, 11: 2, 12: 1
        };
        
        const dotCount = combinations[number] || 0;
        return '•'.repeat(dotCount);
    }

    /**
     * Render the hexagonal game board
     */
    renderBoard() {
        const hexGrid = document.getElementById('hexGrid');
        hexGrid.innerHTML = '';

        // Create hexagonal board layout (3-4-5-4-3 pattern)
        const rows = [
            { start: 0, count: 3 },   // Top row: 3 hexes
            { start: 3, count: 4 },   // Second row: 4 hexes  
            { start: 7, count: 5 },   // Middle row: 5 hexes
            { start: 12, count: 4 },  // Fourth row: 4 hexes
            { start: 16, count: 3 }   // Bottom row: 3 hexes
        ];

        rows.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'hex-row';
            
            for (let i = 0; i < row.count; i++) {
                const hexIndex = row.start + i;
                if (hexIndex < this.board.length) {
                    const hex = this.board[hexIndex];
                    const hexElement = document.createElement('div');
                    hexElement.className = `hex ${hex.resource}`;
                    hexElement.dataset.index = hexIndex;
                    
                    const isRedNumber = (hex.number === 6 || hex.number === 8);
                    const numberClass = isRedNumber ? 'hex-number red-number' : 'hex-number';
                    
                    hexElement.innerHTML = `
                        <div class="hex-inner">
                            <div class="hex-inner-1">
                                <div class="hex-inner-2">
                                    <div class="hex-content">
                                        <div class="resource-icon">${this.getResourceIcon(hex.resource)}</div>
                                        ${hex.number ? `
                                            <div class="${numberClass}">
                                                <div class="number">${hex.number}</div>
                                                <div class="dots">${this.getProbabilityDots(hex.number)}</div>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    rowElement.appendChild(hexElement);
                }
            }
            
            hexGrid.appendChild(rowElement);
        });
    }

    /**
     * Set up event listeners for UI elements
     */
    setupEventListeners() {
        document.getElementById('rollDice').addEventListener('click', () => this.rollDice());
        document.getElementById('endTurn').addEventListener('click', () => this.endTurn());
        document.getElementById('sendChat').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });

        // Building buttons
        document.getElementById('buildRoad').addEventListener('click', () => this.buildStructure('road'));
        document.getElementById('buildSettlement').addEventListener('click', () => this.buildStructure('settlement'));
        document.getElementById('buildCity').addEventListener('click', () => this.buildStructure('city'));
        document.getElementById('trade').addEventListener('click', () => this.openTradeDialog());
    }

    /**
     * Simulate connection to game server
     */
    simulateConnection() {
        setTimeout(() => {
            this.isConnected = true;
            const status = document.getElementById('connectionStatus');
            status.textContent = 'Connected';
            status.className = 'connection-status connected';
            this.addChatMessage('Connected to game server!', 'system');
        }, 2000);
    }

    /**
     * Add sample players for testing
     */
    addSamplePlayers() {
        const samplePlayers = [
            { name: 'You', resources: { wood: 2, brick: 3, grain: 1, ore: 0, sheep: 2 }, score: 0 },
            { name: 'Alice', resources: { wood: 1, brick: 1, grain: 2, ore: 1, sheep: 1 }, score: 0 },
            { name: 'Bob', resources: { wood: 3, brick: 0, grain: 1, ore: 2, sheep: 1 }, score: 0 },
            { name: 'Carol', resources: { wood: 1, brick: 2, grain: 0, ore: 1, sheep: 3 }, score: 0 }
        ];

        this.players = samplePlayers;
        this.renderPlayers();
    }

    /**
     * Render player information in the sidebar
     */
    renderPlayers() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';

        this.players.forEach((player, index) => {
            const playerElement = document.createElement('div');
            playerElement.className = `player ${index === this.currentPlayer ? 'active' : ''}`;
            
            const buildings = player.buildings || { roads: 0, settlements: 0, cities: 0 };
            
            playerElement.innerHTML = `
                <div>
                    <div class="player-name">${player.name} ${player.score >= 10 ? '👑' : ''}</div>
                    <div class="player-resources">
                        <span class="resource-count">🌾${player.resources.grain}</span>
                        <span class="resource-count">🌲${player.resources.wood}</span>
                        <span class="resource-count">🧱${player.resources.brick}</span>
                        <span class="resource-count">⛰️${player.resources.ore}</span>
                        <span class="resource-count">🐑${player.resources.sheep}</span>
                    </div>
                    <div style="font-size: 0.8rem; margin-top: 5px;">
                        🛣️${buildings.roads} 🏠${buildings.settlements} 🏛️${buildings.cities}
                    </div>
                </div>
                <div style="font-weight: bold; font-size: 1.1rem;">
                    ${player.score} VP
                </div>
            `;
            
            playersList.appendChild(playerElement);
        });
    }

    /**
     * Roll dice and handle resource production
     */
    rollDice() {
        if (!this.players || this.players.length === 0) return;
        
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const total = die1 + die2;

        document.getElementById('die1').textContent = die1;
        document.getElementById('die2').textContent = die2;

        const currentPlayerName = this.players[this.currentPlayer]?.name || 'Unknown';
        this.addChatMessage(`${currentPlayerName} rolled ${die1} + ${die2} = ${total}`, 'system');
        
        if (total === 7) {
            this.handleRobber();
        } else {
            this.distributeResources(total);
        }

        this.updateGameStatus();
    }

    /**
     * Distribute resources based on dice roll
     * @param {number} number - Dice total
     */
    distributeResources(number) {
        if (!this.players || this.players.length === 0) return;
        
        // Find all hexes with the rolled number
        const producingHexes = this.board
            .map((hex, index) => ({ hex, index }))
            .filter(({ hex }) => hex.number === number);
        
        if (producingHexes.length === 0) {
            this.addChatMessage(`No hexes produce resources for ${number}`, 'system');
            return;
        }

        // For simulation, give resources to players based on producing hexes
        let totalDistributed = 0;
        producingHexes.forEach(({ hex }) => {
            // Simulate each player having a chance to get resources from this hex
            this.players.forEach(player => {
                // 30% chance this player has a settlement on this hex (for simulation)
                if (Math.random() < 0.3) {
                    const resourceMap = {
                        'grain': 'grain',
                        'wood': 'wood', 
                        'brick': 'brick',
                        'ore': 'ore',
                        'sheep': 'sheep'
                    };
                    
                    const resource = resourceMap[hex.resource];
                    if (resource) {
                        player.resources[resource]++;
                        totalDistributed++;
                        this.addChatMessage(`${player.name} received 1 ${resource}`, 'system');
                    }
                }
            });
        });
        
        if (totalDistributed === 0) {
            this.addChatMessage(`No players collected resources from ${number}`, 'system');
        }
        
        this.renderPlayers();
    }

    /**
     * Handle robber activation when 7 is rolled
     */
    handleRobber() {
        // Step 1: Players with 8+ cards must discard half
        this.players.forEach(player => {
            const totalCards = Object.values(player.resources).reduce((sum, count) => sum + count, 0);
            if (totalCards >= 8) {
                const cardsToDiscard = Math.floor(totalCards / 2);
                let discarded = 0;
                
                // Randomly discard cards for simulation
                const resourceTypes = Object.keys(player.resources);
                while (discarded < cardsToDiscard) {
                    const randomResource = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
                    if (player.resources[randomResource] > 0) {
                        player.resources[randomResource]--;
                        discarded++;
                    }
                }
                
                if (cardsToDiscard > 0) {
                    this.addChatMessage(`${player.name} discarded ${cardsToDiscard} cards`, 'system');
                }
            }
        });

        // Step 2: Move robber (simulate by picking random non-desert hex)
        const nonDesertHexes = this.board
            .map((hex, index) => ({ hex, index }))
            .filter(({ hex }) => hex.resource !== 'desert');
        
        if (nonDesertHexes.length > 0) {
            const randomHex = nonDesertHexes[Math.floor(Math.random() * nonDesertHexes.length)];
            this.addChatMessage(`Robber moved to ${randomHex.hex.resource} (${randomHex.hex.number})`, 'system');
        }

        // Step 3: Steal a card (simulate)
        const currentPlayer = this.players[this.currentPlayer];
        const otherPlayers = this.players.filter((_, index) => index !== this.currentPlayer);
        
        if (otherPlayers.length > 0 && currentPlayer) {
            const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
            const targetResources = Object.keys(targetPlayer.resources).filter(
                resource => targetPlayer.resources[resource] > 0
            );
            
            if (targetResources.length > 0) {
                const stolenResource = targetResources[Math.floor(Math.random() * targetResources.length)];
                targetPlayer.resources[stolenResource]--;
                currentPlayer.resources[stolenResource]++;
                this.addChatMessage(`${currentPlayer.name} stole a card from ${targetPlayer.name}`, 'system');
            }
        }

        this.renderPlayers();
    }

    /**
     * End current player's turn
     */
    endTurn() {
        if (!this.players || this.players.length === 0) return;
        
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        const nextPlayerName = this.players[this.currentPlayer]?.name || 'Unknown';
        this.addChatMessage(`It's now ${nextPlayerName}'s turn`, 'system');
        this.renderPlayers();
        this.updateGameStatus();
    }

    /**
     * Build a structure (road, settlement, or city)
     * @param {string} type - Structure type
     */
    buildStructure(type) {
        if (!this.players || this.players.length === 0) return;
        
        const costs = {
            road: { wood: 1, brick: 1 },
            settlement: { wood: 1, brick: 1, grain: 1, sheep: 1 },
            city: { grain: 2, ore: 3 }
        };

        const cost = costs[type];
        const player = this.players[this.currentPlayer];
        
        if (!player) return;
        
        // Check if player has enough resources
        let canBuild = true;
        const missingResources = [];
        
        for (const [resource, amount] of Object.entries(cost)) {
            if (player.resources[resource] < amount) {
                canBuild = false;
                const needed = amount - player.resources[resource];
                missingResources.push(`${needed} ${resource}`);
            }
        }

        if (canBuild) {
            // Deduct resources
            for (const [resource, amount] of Object.entries(cost)) {
                player.resources[resource] -= amount;
            }
            
            // Add to player's buildings and score
            if (!player.buildings) {
                player.buildings = { roads: 0, settlements: 0, cities: 0 };
            }
            
            player.buildings[type === 'road' ? 'roads' : type === 'settlement' ? 'settlements' : 'cities']++;
            
            // Add victory points
            if (type === 'settlement') {
                player.score += 1;
            } else if (type === 'city') {
                player.score += 2;
                // Cities replace settlements, so we need to track this
                player.buildings.settlements = Math.max(0, player.buildings.settlements - 1);
            }
            
            // Check for victory
            if (player.score >= 10) {
                this.addChatMessage(`🎉 ${player.name} wins with ${player.score} victory points!`, 'system');
                this.gamePhase = 'ended';
            }
            
            this.addChatMessage(`${player.name} built a ${type}! (${player.score} VP)`, 'system');
            this.renderPlayers();
            this.updateGameStatus();
        } else {
            this.addChatMessage(`Cannot build ${type}! Missing: ${missingResources.join(', ')}`, 'system');
        }
    }

    /**
     * Open trade dialog (placeholder)
     */
    openTradeDialog() {
        this.addChatMessage('Trading feature coming soon!', 'system');
    }

    /**
     * Send a chat message
     */
    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message && this.players && this.players.length > 0) {
            const playerName = this.players[0]?.name || 'Player';
            this.addChatMessage(`${playerName}: ${message}`);
            input.value = '';
        }
    }

    /**
     * Add a message to the chat
     * @param {string} message - Message text
     * @param {string} type - Message type ('player' or 'system')
     */
    addChatMessage(message, type = 'player') {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type === 'system' ? 'system-message' : ''}`;
        messageElement.textContent = message;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Update the game status display
     */
    updateGameStatus() {
        const status = document.getElementById('gameStatus');
        if (this.players && this.players.length > 0 && this.players[this.currentPlayer]) {
            status.textContent = `${this.players[this.currentPlayer].name}'s turn - ${this.gamePhase} phase`;
        } else {
            status.textContent = 'Loading game...';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CatanGame();
});
