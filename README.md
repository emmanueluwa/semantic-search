# AI Semantic Search Application

A full-stack application that enables semantic search capabilities using AI technologies. Built with Next.js, Pinecone Vector Database, Langchain, and OpenAI's ChatGPT.

## 🚀 Features

- Semantic search functionality powered by AI
- Vector-based document storage and retrieval
- Real-time query processing
- Modern, responsive user interface
- Integration with OpenAI's ChatGPT

## 🛠️ Technologies Used

- **Frontend**: Next.js
- **Vector Database**: Pinecone
- **AI/ML**:
  - Langchain
  - OpenAI ChatGPT
- **API**: Next.js API Routes

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js installed
- An OpenAI API key
- A Pinecone account and API key

## 🔧 Installation

1. Clone the repository

```bash
git clone https://github.com/emmanueluwa/semantic-search
cd semantic-search
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:

```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

````

## 🚦 Getting Started

**Start the Development Server**

```bash
npm run dev
````

Visit `http://localhost:3000` to see the application.

## 📚 Key Components

### Vector Processing

- Document transformation
- Vector storage and retrieval
- Semantic search implementation

### API Routes

- `/api/read`: Handle search queries
- `/api/setup`: Initialize and configure system

## 🎯 Usage

1. Place your file into the src/documents folder
2. Start the application
3. Click the "create new indexes and embeddings" button
4. Use the search bar to input queries
5. Click the "ask a question button"
6. View semantically relevant results

## 👏 Acknowledgments

- OpenAI for ChatGPT
- Pinecone for vector database
- Langchain for AI capabilities
- Vercel for Next.js framework
