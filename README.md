# 🚀 Modern Todo App

A beautiful, feature-rich todo application built with modern web technologies. This app includes advanced features like priority management, categories, due dates, search, filtering, and analytics.

## ✨ Features

### 🎯 Core Functionality
- **Create, Read, Update, Delete** todos with full CRUD operations
- **Priority levels** (Low, Medium, High) with color-coded indicators
- **Due dates** with overdue detection and smart date formatting
- **Categories and tags** for better organization
- **Rich descriptions** for detailed task information

### 🎨 Modern UI/UX
- **Beautiful, responsive design** with Tailwind CSS
- **Smooth animations** powered by Framer Motion
- **Dark/light mode** ready design system
- **Mobile-first** responsive layout
- **Accessible** components with proper ARIA labels

### 🔍 Advanced Features
- **Real-time search** with debounced input
- **Advanced filtering** by status, priority, category
- **Analytics dashboard** with productivity insights
- **Statistics overview** with charts and progress indicators
- **Overdue task detection** with visual indicators

### 🛠 Technical Excellence
- **TypeScript** for type safety
- **Zustand** for lightweight state management
- **React Hook Form** with Zod validation
- **SQLite** database with proper indexing
- **RESTful API** with comprehensive error handling
- **Rate limiting** and security headers

## 🏗 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Hook Form** with Zod validation
- **React Router** for navigation
- **Lucide React** for icons
- **date-fns** for date manipulation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** database
- **UUID** for unique identifiers
- **CORS, Helmet, Morgan** for security and logging
- **Rate limiting** for API protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd modern-todo-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

## 📁 Project Structure

```
modern-todo-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Zustand store
│   │   ├── lib/           # Utilities and API
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # Server entry point
│   └── package.json
└── package.json           # Root package.json
```

## 🎯 Usage

### Creating Todos
1. Click the "Add Todo" button
2. Fill in the title (required)
3. Add optional description, priority, due date, category, and tags
4. Click "Create Todo"

### Managing Todos
- **Complete**: Click the circle icon next to any todo
- **Edit**: Click the pencil icon to modify a todo
- **Delete**: Click the trash icon to remove a todo
- **Search**: Use the search bar to find specific todos
- **Filter**: Use the filters to narrow down todos by status, priority, or category

### Analytics
- Navigate to the "Analytics" tab to view productivity insights
- See completion rates, priority breakdowns, and category statistics
- Track overdue tasks and overall progress

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run install:all      # Install all dependencies

# Frontend (client/)
npm run dev:client       # Start frontend only
npm run build           # Build for production
npm run preview         # Preview production build

# Backend (server/)
npm run dev:server      # Start backend only
npm run build          # Build TypeScript
npm run start          # Start production server
```

### Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
```

### Database

The app uses SQLite for simplicity. The database file (`todo.db`) will be created automatically when you first run the server.

## 🎨 Customization

### Styling
- Modify `client/tailwind.config.js` for theme customization
- Update `client/src/index.css` for global styles
- Component-specific styles are in each component file

### Features
- Add new todo fields in `server/src/types/todo.ts`
- Update database schema in `server/src/database.ts`
- Modify API routes in `server/src/routes/todos.ts`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Render)
```bash
cd server
npm run build
# Deploy with environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular todo apps
- Designed for productivity and user experience

---

**Happy coding! 🎉**