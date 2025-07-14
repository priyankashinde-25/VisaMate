import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'

// Initialize OpenAI and Pinecone
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
})

const index = pinecone.index(process.env.PINECONE_INDEX_NAME!)

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // Check if Pinecone is configured
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_INDEX_NAME) {
      return NextResponse.json(
        { error: 'Pinecone configuration is incomplete' },
        { status: 500 }
      )
    }

    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Generate embedding for the user's question
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: message,
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    // Search Pinecone for relevant documents
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    })

    // Extract relevant context from search results
    const relevantContexts = searchResponse.matches
      .filter(match => match.score && match.score > 0.7) // Only use highly relevant matches
      .map(match => ({
        document_title: match.metadata?.document_title || 'Unknown Document',
        source_type: match.metadata?.source_type || 'GENERAL',
        upload_date: match.metadata?.upload_date || new Date().toISOString(),
        chunk_text: match.metadata?.chunk_text || '',
        score: match.score
      }))

    // If no relevant context found, respond with "I don't know"
    if (relevantContexts.length === 0) {
      return NextResponse.json({
        answer: "I don't have enough information to provide a reliable answer to your question. Please try rephrasing your question or upload relevant documents to get more accurate responses.",
        sources: []
      })
    }

    // Prepare context for the LLM
    const contextText = relevantContexts
      .map(ctx => `Source: ${ctx.document_title}\nContent: ${ctx.chunk_text}`)
      .join('\n\n')

    // Create conversation history for context
    const conversationHistory = history
      .slice(-3) // Keep last 3 messages for context
      .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
      .join('\n')

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are VisaMate, an immigration and visa assistant. You help users with questions about H-1B, F-1, OPT, and other visa processes.

IMPORTANT GUIDELINES:
1. Base your answers ONLY on the provided context from official sources
2. If the context doesn't contain enough information, say "I don't have enough information" rather than guessing
3. Always cite your sources clearly
4. Be clear about limitations and recommend consulting legal professionals for specific cases
5. Provide step-by-step guidance when possible
6. Use a helpful, professional tone

Context from official sources:
${contextText}

Current conversation:
${conversationHistory}

User question: ${message}

Please provide a clear, accurate answer based on the context above. Include source citations and any relevant disclaimers.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const answer = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.'

    return NextResponse.json({
      answer,
      sources: relevantContexts.map(ctx => ({
        document_title: ctx.document_title,
        source_type: ctx.source_type,
        upload_date: ctx.upload_date,
        chunk_text: ctx.chunk_text
      }))
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Provide specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please check your billing and try again later.' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 