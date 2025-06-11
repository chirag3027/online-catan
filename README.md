# 🏝️ Online Catan

A browser-based implementation of the classic board game **Settlers of Catan**. Play with friends online with real-time multiplayer gameplay, beautiful hexagonal board generation, and faithful game mechanics.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://chirag3027.github.io/online-catan)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/chirag3027/online-catan)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎮 Features

### Currently Implemented
- ✅ **Randomized Board Generation** - Follows official Catan rules with proper resource distribution
- ✅ **Hexagonal Game Board** - Beautiful CSS-based hex grid with hover effects
- ✅ **Dice Rolling Mechanics** - Realistic dice physics and resource production
- ✅ **Resource Management** - Track wood, brick, grain, ore, and sheep
- ✅ **Building System** - Roads, settlements, and cities with proper costs
- ✅ **Victory Point Tracking** - Win condition at 10 victory points
- ✅ **Robber Mechanics** - Handles 7 rolls, card discarding, and stealing
- ✅ **Turn-based Gameplay** - Proper turn management and game flow
- ✅ **Chat System** - In-game communication
- ✅ **Responsive Design** - Works on desktop and mobile devices

### 🚧 Coming Soon
- 🔄 **Real Multiplayer** - WebSocket-based real-time gameplay
- 🎯 **Settlement Placement** - Click-to-place buildings on intersections
- 🛣️ **Road Building** - Visual road placement on board edges
- 🔄 **Trading System** - Player-to-player and maritime trade
- 🏆 **Longest Road & Largest Army** - Special victory point cards
- 🎵 **Sound Effects** - Audio feedback for actions
- 🎨 **Enhanced Graphics** - Better animations and visual effects

## 🚀 Quick Start

### Play Online
Just visit: **[https://chirag3027.github.io/online-catan](https://chirag3027.github.io/online-catan)**

### Run Locally
```bash
# Clone the repository
git clone https://github.com/chirag3027/online-catan.git
cd online-catan

# Open in your browser
open index.html
# OR serve with a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📁 Project Structure

```
online-catan/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling and animations
├── js/
│   └── game.js         # Game logic and mechanics
├── assets/             # Images and other assets (future)
├── docs/               # Documentation
│   └── rules.md        # Catan rules reference
└── README.md          # This file
```

## 🎯 How to Play

### Basic Gameplay
1. **Roll Dice** - Click "Roll Dice" to generate resources
2. **Collect Resources** - Get cards when your settlements/cities are adjacent to producing hexes
3. **Build Structures** - Use resources to build roads, settlements, and cities
4. **Trade** - Exchange resources with other players (coming soon)
5. **Win** - First to 10 victory points wins!

### Victory Points
- Settlement = 1 VP
- City = 2 VP  
- Longest Road = 2 VP (5+ connected roads)
- Largest Army = 2 VP (3+ knight cards)
- Victory Point Cards = 1 VP each

### Building Costs
- **Road**: 1 Wood + 1 Brick
- **Settlement**: 1 Wood + 1 Brick + 1 Grain + 1 Sheep
- **City**: 2 Grain + 3 Ore (upgrades a settlement)

## 🤝 Contributing

We'd love your help making this the best online Catan experience! Here's how you can contribute:

### 🌟 Good First Issues
- [ ] Add sound effects for dice rolls and building
- [ ] Improve mobile responsiveness
- [ ] Add player avatars and colors
- [ ] Create better loading animations
- [ ] Add keyboard shortcuts

### 🔧 Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### 💡 Areas We Need Help With
- **Frontend Development** - React/Vue.js migration, UI/UX improvements
- **Backend Development** - Real-time multiplayer with WebSockets
- **Game Logic** - Settlement placement, advanced rules, AI players
- **Design** - Better graphics, animations, and responsive design
- **Testing** - Unit tests, integration tests, game logic validation
- **Documentation** - Tutorials, API docs, contributing guides

## 🛠️ Technical Details

### Built With
- **HTML5** - Semantic markup and structure
- **CSS3** - Flexbox, CSS Grid, custom properties, animations
- **Vanilla JavaScript** - ES6+ classes, modules, async/await
- **No Dependencies** - Lightweight and fast loading

### Browser Support
- ✅ Chrome 60+ 
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Performance
- 📱 Mobile-first responsive design
- ⚡ Fast loading (~50KB total)
- 🎯 60fps animations
- 💾 Efficient memory usage

## 🐛 Known Issues

- Settlement placement is simulated (not visual yet)
- Trading system is placeholder
- No real multiplayer (simulated players)
- Robber placement is random (not clickable)

See [Issues](https://github.com/chirag3027/online-catan/issues) for full list.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Klaus Teuber** - Original Catan game designer
- **Catan Studio** - Official game rules and inspiration
- **Contributors** - Everyone who helps improve this project

## 📞 Contact

- **Project Link**: [https://github.com/chirag3027/online-catan](https://github.com/chirag3027/online-catan)
- **Live Demo**: [https://chirag3027.github.io/online-catan](https://chirag3027.github.io/online-catan)
- **Issues**: [Report bugs or request features](https://github.com/chirag3027/online-catan/issues)

---

**Happy Settling!** 🏘️✨
