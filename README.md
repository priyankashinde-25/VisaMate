# VisaMate - Personal Immigration & Visa Assistant

A Next.js RAG (Retrieval-Augmented Generation) application that helps immigrants and international students navigate complex visa processes by providing accurate, source-based answers to their questions.

## 🚀 Features

- **Document Upload**: Upload PDF and TXT files containing immigration information
- **RAG Chat Interface**: Ask questions and get answers based on uploaded documents
- **Source Attribution**: See exactly which documents your answers come from
- **Smart Chunking**: Intelligent text splitting with overlap for better context
- **Vector Search**: Semantic search through document embeddings
- **Professional UI**: Clean, modern interface with proper disclaimers

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Vector Database**: Pinecone (free tier)
- **AI/LLM**: OpenAI GPT-4 API
- **Embeddings**: OpenAI text-embedding-3-large
- **PDF Processing**: pdf-parse
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (free tier)

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn**
3. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/)
4. **Pinecone Account** - Sign up at [Pinecone](https://www.pinecone.io/)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=visamate-documents

# Application Configuration
NEXT_PUBLIC_APP_NAME=VisaMate
NEXT_PUBLIC_APP_DESCRIPTION=Personal Immigration & Visa Assistant
```

### 3. Pinecone Setup

1. Create a new Pinecone index:
   - Name: `visamate-documents`
   - Dimensions: `1536` (for text-embedding-3-large)
   - Metric: `cosine`
   - Pod Type: `p1.x1` (free tier)

2. Get your API key and environment from the Pinecone console

### 4. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
visamate/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/         # RAG chat endpoint
│   │   └── documents/    # Document upload endpoint
│   ├── upload/           # Upload page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main chat page
├── components/            # React components
│   ├── ChatInterface.tsx # Main chat component
│   ├── Header.tsx        # Navigation header
│   ├── Message.tsx       # Individual message display
│   ├── SourceCitation.tsx # Source attribution
│   └── Disclaimer.tsx    # Legal disclaimer
├── lib/                   # Utility functions
│   └── types.ts          # TypeScript interfaces
└── public/               # Static assets
```

## 🔧 API Endpoints

### POST `/api/chat`
Handles RAG queries and generates responses.

**Request:**
```json
{
  "message": "What are the steps for H-1B transfer?",
  "history": [
    {"role": "user", "content": "Previous question"},
    {"role": "assistant", "content": "Previous answer"}
  ]
}
```

**Response:**
```json
{
  "answer": "Based on USCIS guidelines...",
  "sources": [
    {
      "document_title": "USCIS H-1B FAQ",
      "source_type": "USCIS_FAQ",
      "upload_date": "2024-01-15T10:30:00Z",
      "chunk_text": "Relevant text excerpt..."
    }
  ]
}
```

### POST `/api/documents/upload`
Processes and stores uploaded documents.

**Request:** FormData with file

**Response:**
```json
{
  "success": true,
  "document_id": "doc_1234567890",
  "filename": "h1b-faq.pdf",
  "chunks": 15,
  "message": "Successfully processed 15 chunks from h1b-faq.pdf"
}
```

## 📚 Recommended Documents

For best results, upload these types of documents:

### H-1B Documents
- USCIS H-1B FAQ
- H-1B Transfer Guidelines
- H-1B Extension Procedures
- H-1B Cap Information

### F-1/OPT Documents
- USCIS F-1 FAQ
- OPT Application Guide
- STEM OPT Extension Information
- SEVP Portal Instructions

### General Immigration
- Embassy Appointment Guides
- Visa Application Instructions
- Policy Manuals
- Form Instructions

## 🔒 Security & Privacy

- No personal information is stored
- All data is encrypted in transit
- Source attribution ensures transparency
- Clear disclaimers about legal advice

## ⚠️ Important Disclaimers

1. **Not Legal Advice**: This tool provides information but does not constitute legal advice
2. **Source Verification**: Always verify information with official sources
3. **Professional Consultation**: Consult qualified immigration attorneys for specific cases
4. **Information Accuracy**: While we strive for accuracy, immigration laws change frequently

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_ENVIRONMENT`
- `PINECONE_INDEX_NAME`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🔄 Updates

Stay updated with the latest immigration information by regularly uploading new documents from official sources like USCIS, embassies, and government agencies.