# 🚀 Axiom

> **Master Computer Science, One Problem at a Time**

Axiom is a comprehensive, interactive educational platform designed to accelerate learning in computer science, data science, and competitive programming. It's an all-in-one environment where computer science students, software engineers, data scientists, and competitive programmers can:
- Master fundamental algorithms and data structures through hands-on coding challenges
- Learn from curated research papers across Machine Learning, Biology, Chemistry, and Electrical Engineering
- Solve real-world problems with guided learning tracks (College, GATE, Placement, Vibe)
- Compete on global leaderboards and track progress with detailed analytics
- Build a strong foundation through structured problem-solving exercises
- Earn points, badges, and climb the ranking system

The platform combines a sophisticated browser-based code editor, sandboxed Python execution environment, and a rich educational content library to create an unparalleled hands-on learning experience.

---

## 🌟 Key Features

### 📚 Interactive Papers Browser & Explorer
Explore a meticulously curated collection of foundational and cutting-edge research papers across multiple scientific domains:

**Machine Learning Track:**
- Foundational algorithms (Backpropagation, Cross-Entropy Loss, Gradient Descent)
- Neural network architectures (CNNs, RNNs, Vision Transformers)
- Attention mechanisms and Transformer models (Self-Attention, Multi-Head Attention)
- Optimization techniques (Adam, SGD with momentum, Learning Rate Scheduling)
- State-of-the-art models (GPT, BERT, ResNet)

**Biology & Chemistry Track:**
- Protein structure prediction (AlphaFold, protein folding)
- ChemBERTa - Chemistry language models
- Single-cell transcriptomics and genomic analysis (scVI)
- Molecular graph generation and molecular property prediction
- CRISPR sequence matching and gene editing
- Phylogenetic tree generation

**Electrical Engineering & Hardware Track:**
- Circuit simulation (SPICE modeling)
- Digital logic design (RISC-V architecture, Chisel HDL)
- Power systems modeling and analysis
- Signal processing fundamentals
- Analog circuit design

**Key Capabilities:**
- Dynamic paper filtering by difficulty, tags, and domain
- Visual representations of complex concepts (molecular structures, circuit diagrams, phylogenetic trees)
- Direct links to original papers and repositories
- Task-based learning with implementation challenges

### 💻 Advanced In-Browser Coding Environment
A full-featured, zero-setup Python development environment powered by industry-standard tools:

**Editor & IDE:**
- Monaco Editor integration with syntax highlighting, IntelliSense, and code completion
- Multi-file editing support with tab management
- Keyboard shortcuts and vim/emacs keybindings support
- Line numbering, bracket matching, and real-time error detection

**Sandboxed Python Runtime:**
- Pyodide - WebAssembly-based Python 3.12 runtime
- No local Python installation required
- Full access to scientific computing libraries: NumPy, Pandas, Scikit-learn, SciPy
- Support for data visualization (Matplotlib integration)
- Instant code execution in the browser
- Isolated execution environment ensures security

**Testing & Feedback:**
- Built-in unit test framework (pytest-compatible assertions)
- Real-time test execution with instant feedback
- Custom evaluation metrics and benchmarks
- Console output capture and error reporting
- Execution time tracking
- Memory usage monitoring

### 📖 Paper Reader Component
An integrated paper reader that allows you to:
- View research papers directly in the platform
- Seamless navigation between reading and coding sections
- Context-aware problem descriptions extracted from papers
- Citation tracking and reference linking

### 📊 Structured Learning Tracks & Progression System
Comprehensive learning paths designed to build skills progressively from basics to advanced:

**ML150 Fundamentals:**
- 150 carefully curated machine learning interview-style questions
- Covers data structures, algorithms, statistical concepts
- Progressive difficulty: Beginner → Intermediate → Advanced
- Real-world problem scenarios and implementation challenges

**Data Science Core:**
- **NumPy Essentials** (50+ exercises): Array manipulation, linear algebra, broadcasting, vectorization
- **Pandas Mastery** (60+ exercises): DataFrames, data cleaning, grouping, merging, time-series analysis
- **Extra Pandas Topics** (advanced): Advanced indexing, multi-level operations, performance optimization
- Scaffolded problem sets with incremental complexity

**Domain-Specific Fundamentals:**
- Bio-chemistry fundamentals (sequence analysis, structure prediction basics)
- Hardware and EE fundamentals (circuit analysis, digital logic basics)
- NLP fundamentals (tokenization, embeddings, language modeling)

**Key Features:**
- **Daily Streaks**: Maintain consistent learning habits with daily challenge tracking
- **Progress Tracking**: Visual dashboards showing completion rates, time invested, and skill areas
- **Adaptive Difficulty**: Problems adjust based on your performance and learning history
- **Skill Maps**: Visual representation of prerequisite relationships between topics
- **Certificates**: Completion certificates for major learning tracks

### 🏆 Global Leaderboard & Social Features
Compete with the global community:
- **Global Rankings**: Ranked by problems solved, points earned, and streak count
- **Domain Leaderboards**: Separate rankings for each scientific domain
- **Monthly Challenges**: Special themed competitions with bonus points
- **User Profiles**: Public profiles showcasing your achievements, badges, and solve history
- **Skill Endorsements**: Community validation of your expertise areas
- **Discussion Forums**: Per-paper and per-problem discussion communities (future feature)

### 🎁 Referral Program & Community Growth
Grow the community and earn rewards:
- **Unique Referral Codes**: Each user gets a personalized referral code
- **Referral Rewards**: Earn 50 bonus points for each successful referral
- **Invite Links**: Shareable links for easy signup (e.g., `/auth/signup?ref=YOUR_CODE`)
- **Referral Tracking**: See all users you've referred with their join dates
- **Referral Leaderboard**: Top referrers ranked by number of successful invites and total points
- **Referral Stats Dashboard**: View your referral metrics, bonus points earned, and community impact

### 🔐 Robust Authentication & User Management System
Enterprise-grade user authentication and data management:

**Security:**
- JWT (JSON Web Tokens) for secure, stateless authentication
- bcryptjs with configurable salt rounds for password hashing
- Secure HTTP-only cookies for token storage
- CSRF protection on all state-changing operations
- Rate limiting on authentication endpoints

**User Accounts:**
- Email/password authentication with email verification
- OAuth integration support (Google, GitHub - future feature)
- Password reset with secure token-based recovery
- Session management with automatic timeout
- Account deletion with data purge options

**User Profiles:**
- Customizable user profiles with avatar, bio, location
- Public profile URLs for sharing achievements
- Profile privacy settings
- Account settings and preferences

### 📈 Analytics & Progress Dashboard
Comprehensive analytics to track your learning journey:
- **Problem Statistics**: Total problems solved, solve rate by difficulty and domain
- **Time Analytics**: Average solve time, time distribution across domains
- **Performance Metrics**: Success rate, common error patterns, weak areas
- **Learning Path Analytics**: Recommended next topics based on performance
- **Historical Data**: Submission history with code snapshots and test results
- **Export Options**: Download your learning data and certificates

### 🎖️ Achievements & Badge System
Motivational gamification elements:
- **Badges**: Unlock badges for milestones (first 5 solves, 50 solves, 100 solves, etc.)
- **Domain Mastery**: Complete all problems in a domain to earn domain badges
- **Speed Runner**: Solve a problem under specific time limits
- **Streak Master**: Maintain 7-day, 30-day, 100-day streaks
- **Reviewer Badge**: Review other users' solutions and provide feedback

### 📱 Responsive Design & Accessibility
Works seamlessly across all devices:
- Mobile-optimized interface for on-the-go learning
- Responsive code editor and problem viewers
- Tablet-optimized layouts
- Dark mode for reduced eye strain
- Accessibility features (keyboard navigation, screen reader support)

---

## 🛠️ Technology Stack

Axiom is built with a modern, high-performance, scalable technology stack designed for educational excellence:

### Frontend Architecture
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router for optimal server-side rendering and client-side interactivity
- **React**: [React 19](https://react.dev/) with modern hooks and concurrent rendering
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) - Professional-grade editor with full IDE capabilities
- **Styling**: 
  - Vanilla CSS with CSS modules for scoped styling
  - Inline styles for dynamic theming
  - Glassmorphism and brutalist design patterns
  - Dark mode as primary theme with light mode fallback
  - CSS animations and transitions for smooth UX

### Backend & Runtime
- **Runtime**: Node.js 20+ for server-side logic
- **Python Environment**: [Pyodide](https://pyodide.org/) - WebAssembly-based Python 3.12 runtime
- **Scientific Libraries**: NumPy, Pandas, SciPy, Scikit-learn, Matplotlib (available in Pyodide)
- **API Design**: RESTful APIs with JSON request/response format

### Database & ORM
- **Database**: [MongoDB](https://www.mongodb.com/) (Atlas for cloud, local for development)
- **ORM**: [Mongoose](https://mongoosejs.com/) for elegant MongoDB object modeling
- **Data Models**: 
  - User schema with authentication metadata and referral tracking
  - Progress tracking schema for each domain
  - Submission history with code snapshots
  - Leaderboard aggregation collection

### Authentication & Security
- **Authentication**: JWT (JSON Web Tokens) with HS256 signing algorithm
- **Password Hashing**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) with 10 salt rounds
- **Environment Variables**: Secure secrets management via .env.local
- **Rate Limiting**: Express rate limiting on auth endpoints (5 requests per 15 minutes)
- **CORS**: Configured for production domains

### DevOps & Tooling
- **Version Control**: Git with GitHub integration
- **Build Tool**: Next.js built-in build optimization
- **Package Manager**: npm for dependency management
- **Linting**: ESLint for code quality
- **TypeScript**: Full type safety with strict mode enabled
- **Deployment**: Vercel (recommended) or any Node.js-compatible platform

### Additional Libraries
- **HTTP Client**: Native fetch API for client-side requests
- **Date Handling**: Native Date objects with custom utilities
- **UUID Generation**: nanoid for unique ID generation (future feature)

---

## 📂 Project Structure

```
axiom/
├── src/
│   ├── app/                           # Next.js App Router - Pages and Layouts
│   │   ├── api/                       # Backend API routes
│   │   │   ├── auth/                  # Authentication endpoints
│   │   │   │   ├── callback/          # OAuth callback handler
│   │   │   │   ├── signin/            # Sign-in endpoint
│   │   │   │   └── signup/            # Sign-up endpoint
│   │   │   ├── referrals/             # Referral program API
│   │   │   │   ├── leaderboard/       # Top referrers leaderboard endpoint
│   │   │   │   └── stats/             # User referral stats endpoint
│   │   │   ├── reviews/               # Code review API
│   │   │   ├── submit/                # Problem submission endpoint
│   │   │   └── users/                 # User profile endpoints
│   │   ├── auth/                      # Auth-related pages
│   │   │   ├── login/                 # Login page
│   │   │   └── signup/                # Signup page
│   │   ├── college/                   # College track
│   │   ├── gate/                      # GATE exam track
│   │   ├── placement/                 # Placement track
│   │   ├── vibe/                      # Vibe Lab track
│   │   ├── leaderboard/               # Global leaderboard page
│   │   ├── referrals/                 # Referral program page
│   │   ├── papers/                    # Papers module
│   │   │   ├── [slug]/                # Individual paper detail page
│   │   │   │   ├── page.tsx           # Paper overview
│   │   │   │   ├── reader/            # Paper reader component
│   │   │   │   └── problems/[taskSlug]/  # Problem implementation pages
│   │   │   └── page.tsx               # Papers browser main page
│   │   ├── profile/[username]/        # User profile pages
│   │   ├── reviews/                   # Code review browsing page
│   │   ├── tracks/                    # Tracks/domains flowchart page
│   │   ├── about/                     # About page
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout wrapper
│   │   └── page.tsx                   # Home page
│   │
│   ├── components/                    # Reusable React components
│   │   ├── AuthProvider.tsx           # Authentication context provider
│   │   ├── CodingTerminal.tsx         # Core Monaco + Pyodide environment
│   │   ├── Footer.tsx                 # Footer component
│   │   ├── Navbar.tsx                 # Navigation bar with auth state
│   │   ├── OpenPaperReader.tsx        # Paper reader UI wrapper
│   │   ├── PapersBrowser.tsx          # Papers grid with filtering
│   │   ├── PaperVisual.tsx            # Visual representations for papers
│   │   ├── ResearchSection.tsx        # Research content section
│   │   ├── SolveSection.tsx           # Problem-solving interface
│   │   ├── Toast.tsx                  # Toast notifications
│   │   ├── TracksSection.tsx          # Tracks/domains overview
│   │   └── [track-specific]/          # College, GATE, Placement, Vibe components
│   │
│   ├── data/                          # Static content and specifications
│   │   ├── bioPapers.ts               # Biology & Chemistry papers data
│   │   ├── domainPapers.ts            # Electrical engineering papers
│   │   ├── papers.ts                  # Core ML papers with tasks
│   │   ├── problems.ts                # Problem specifications
│   │   └── [track-data]/              # College, GATE, Placement, Vibe data
│   │
│   ├── lib/                           # Utility functions and helpers
│   │   ├── mongodb.ts                 # MongoDB connection handler
│   │   ├── auth.ts                    # Authentication utilities
│   │   ├── usePyodide.ts              # Pyodide React hook
│   │   ├── supabase/                  # Supabase client utilities
│   │   └── [other utilities]          # Additional helpers
│   │
│   └── models/                        # Mongoose schemas
│       └── User.ts                    # User database schema
│
├── public/                            # Static assets
│   └── data/                          # Public data resources
│
├── scripts/                           # Build and data processing scripts
├── node_modules/                      # npm dependencies
├── .env.local                         # Environment variables (not in git)
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Project metadata and dependencies
├── package-lock.json                  # Dependency lock file
├── eslint.config.mjs                  # ESLint configuration
└── README.md                          # This file
```

---

## 🎨 Design Philosophy & Aesthetics

Axiom adheres to a **minimalist, brutalist-inspired design** philosophy emphasizing:

**Visual Design:**
- Monochromatic grayscale base (pure blacks, whites, grays)
- Subtle, purpose-driven color accents:
  - **Cyan (#06B6D4)**: Interactive elements, hover states, active indicators
  - **Purple (#8B5CF6)**: ML domain highlighting
  - **Green (#10B981)**: Biology/Chemistry domain highlighting
  - **Blue (#3B82F6)**: Success states and confirmations
  - **Orange (#F97316)**: Hardware/Electrical domain highlighting
  - **Red (#EF4444)**: Error states and warnings

**Typography:**
- Clean, modern sans-serif fonts (system font stack)
- Generous line-height for readability
- Clear hierarchy with consistent font sizing

**Layout Principles:**
- Generous whitespace and breathing room
- Card-based layouts with subtle shadows (glassmorphism)
- Responsive grid systems
- Dark mode as primary experience

**User Experience:**
- Fast, snappy interactions with CSS transitions
- Loading states and skeleton screens
- Clear visual feedback for all actions
- Accessible color contrasts (WCAG AA compliant)
- Keyboard-first navigation

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.0.0 or higher (check with `node --version`)
- **npm**: v10.0.0 or higher (comes with Node.js)
- **MongoDB**: Local instance or MongoDB Atlas cloud account
- **Git**: For cloning the repository
- **Text Editor**: VS Code recommended for development

### 1. Clone the Repository
```bash
git clone https://github.com/Srinidhi0604/axiom.git
cd axiom
```

### 2. Install Dependencies
```bash
npm install
```
This will install all required packages including Next.js, React, Monaco Editor, Mongoose, and all other dependencies.

### 3. Configure Environment Variables
Create a `.env.local` file in the project root with your configuration:

```env
# MongoDB Connection
# For local MongoDB: mongodb://localhost:27017/axiom
# For MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/axiom
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/axiom

# JWT Secret - Generate a strong random string (minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_key_with_minimum_32_characters_for_security

# Optional: API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

**Security Note**: Never commit `.env.local` to version control. It contains sensitive credentials.

### 4. Set Up MongoDB
**Option A: Local MongoDB**
```bash
# On macOS with Homebrew:
brew install mongodb-community
brew services start mongodb-community

# On Windows, download from: https://www.mongodb.com/try/download/community
# And follow the installation wizard

# Verify connection:
mongosh "mongodb://localhost:27017"
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free tier cluster
3. Whitelist your IP address
4. Create a database user
5. Get your connection string and add to `.env.local`

### 5. Run the Development Server
```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000). 

Open your browser and you'll see:
- Home page with project overview
- Papers browser showing available ML research papers
- College, GATE, Placement, and Vibe tracks
- Login/signup for new users
- Leaderboard and referral pages

### 6. Build for Production
```bash
npm run build
npm start
```

This creates an optimized production build and starts the server.

---

## 📚 API Documentation

### Authentication Endpoints

**POST** `/api/auth/signup`
- Register a new user account
- Body: `{ email, password, name }`
- Returns: JWT token and user object

**POST** `/api/auth/signin`
- Login to existing account
- Body: `{ email, password }`
- Returns: JWT token and user object

**POST** `/api/auth/logout`
- Logout and invalidate token
- Requires: Authorization header

### Problem Submission

**POST** `/api/submit`
- Submit solution for a problem
- Body: `{ paperId, problemSlug, code, language }`
- Returns: `{ passed: boolean, testResults: [], score: number }`

### User Profile

**GET** `/api/users/[username]`
- Fetch user profile and statistics
- Returns: User object with solve counts, badges, streaks

**PUT** `/api/users/[username]`
- Update user profile
- Body: `{ bio, avatar, settings }`
- Returns: Updated user object

### Leaderboard

**GET** `/api/leaderboard`
- Query parameters: `domain`, `limit`, `offset`
- Returns: Sorted array of users with rankings

---

## 🧪 Testing & Development

### Run Tests
```bash
npm run test
```

### Code Quality Checks
```bash
npm run lint
```

### Type Checking
TypeScript is configured in strict mode. Check for type errors:
```bash
npx tsc --noEmit
```

---

## 🔧 Configuration & Customization

### Adding New Papers
1. Add paper metadata to `src/data/papers.ts`
2. Define problem tasks with code skeletons
3. Write comprehensive test cases
4. Add visual representations in `src/data/bioPapers.ts` or `src/data/domainPapers.ts`

### Adding Track Content
1. Create data file in `src/data/[track-name].ts`
2. Define problem structures and metadata
3. Register routes in `src/app/[track-name]/`
4. Add components in `src/components/[track-name]/`

### Customizing Styling
- Global styles: `src/app/globals.css`
- Component-specific styles: Inline or CSS modules in component files
- Color theme: Modify color constants in CSS

---

## 🐛 Troubleshooting

### MongoDB Connection Errors
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is running: `brew services start mongodb-community` (macOS) or check Windows services
- Verify connection string in `.env.local`
- Check firewall settings if using MongoDB Atlas

### Pyodide Loading Issues
```
Error: Pyodide failed to load
```
**Solution**:
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for specific error
- Ensure CORS is properly configured

### Port 3000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000    # Windows

# Or use a different port:
PORT=3001 npm run dev
```

### Build Failures
```bash
# Clear Next.js cache
rm -rf .next/

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 📖 Learning Resources

### For Contributors
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MongoDB & Mongoose](https://mongoosejs.com)
- [Pyodide Guide](https://pyodide.org)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)

### For Users
- Each track has structured learning paths
- Problems include detailed descriptions and hints
- Code examples provided in problem skeletons
- Referral system for community building
- Leaderboards for motivation and tracking

---

## 🤝 Contributing

We welcome contributions from the community! Here are ways you can contribute:

### Report Issues
- Found a bug? Open an issue on GitHub with:
  - Steps to reproduce
  - Expected vs actual behavior
  - Your environment (OS, Node version, browser)
  - Screenshots if applicable

### Add Papers & Problems
- Follow the structure in `src/data/papers.ts` or track-specific data files
- Include:
  - Comprehensive problem description
  - Working solution with explanations
  - Test cases covering edge cases
  - Visual representations where applicable
- Submit a pull request with detailed description

### Improve Documentation
- Clarify ambiguous explanations
- Add examples and use cases
- Improve error messages
- Contribute translation files

### Enhance UI/UX
- Fix accessibility issues
- Improve responsive design
- Suggest design improvements
- Optimize performance

---

## 🎯 Learning Tracks Overview

Axiom offers four comprehensive learning tracks tailored to different goals:

### 📚 **College Track**
- University curriculum aligned content
- Data Structures & Algorithms fundamentals
- Core Computer Science concepts
- Interview preparation materials
- Academic problem sets aligned with syllabus

### 🏆 **GATE Track**
- Comprehensive GATE examination preparation
- Subject-wise organized problems
- Full-length mock tests
- Performance analytics and weak area identification
- Previous year question papers with solutions

### 💼 **Placement Track**
- Interview-focused problem solving
- Company-specific coding challenges
- System design fundamentals
- Behavioral interview preparation
- Real-world problem scenarios

### 🎨 **Vibe Lab**
- Creative problem-solving challenges
- Experimental coding puzzles
- Community-driven problem sets
- Innovation and exploration focused
- Cutting-edge algorithmic concepts

---

## 🎯 Roadmap

### Upcoming Features
- **Discussion Forums**: Community discussions per problem and track
- **Advanced Analytics**: In-depth performance analytics and recommendations
- **AI-Powered Hints**: ML-based hint generation for stuck users
- **Mobile App**: Native iOS/Android applications
- **Video Explanations**: Video tutorials for complex concepts
- **Collaborative Coding**: Real-time collaborative problem solving
- **Code Review System**: Peer code reviews with feedback
- **Mock Interview Platform**: Live mock interview with mentors

### Future Domains & Tracks
- Web Development track
- DevOps & Cloud Engineering track
- System Design Advanced track
- Competitive Programming track
- Quantum Computing fundamentals
- Advanced Distributed Systems
- Cybersecurity & Ethical Hacking
- Blockchain & Smart Contracts

---

## 📊 Performance & Analytics

### Optimization Strategies
- Server-side rendering for critical pages
- Code splitting and lazy loading components
- Image optimization with next/image
- CSS-in-JS with minimal runtime overhead
- Pyodide caching for faster cold starts

### Monitoring
- Real User Monitoring (RUM) on production
- Error tracking with Sentry (future)
- Performance metrics with Web Vitals
- User behavior analytics

---

## 📞 Support & Community

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: support@axiom.dev (future)
- **Twitter**: [@AxiomHQ](https://twitter.com) (future)
- **Discord Community**: Join our server for live discussions (future)

---

## 👨‍💼 Authors & Credits

**Creator**: Srinidhi ([@Srinidhi0604](https://github.com/Srinidhi0604))

### Special Thanks
- The research community for publishing open-access papers
- Next.js and React teams for excellent frameworks
- MongoDB for database infrastructure
- Pyodide developers for WASM Python runtime
- All contributors and community members

---

## 📝 License

This project is licensed for educational purposes. While the code is open-source and available on GitHub, the curated problem sets, paper content, and specific implementations may have restrictions. 

For more details, see the LICENSE file in the repository.

---

## ⭐ Show Your Support

If you find Axiom helpful, please:
- Star the repository on GitHub ⭐
- Share it with peers and colleagues
- Contribute improvements and new content
- Provide feedback and suggestions

---

**Made with ❤️ for learners worldwide**

Axiom - Master Computer Science, One Problem at a Time 🚀

<!-- Minor docs update -->
