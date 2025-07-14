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

// Function to split text into chunks
function splitIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = []
  let start = 0
  
  while (start < text.length) {
    const end = start + chunkSize
    let chunk = text.slice(start, end)
    
    // Try to break at sentence boundaries
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.')
      const lastNewline = chunk.lastIndexOf('\n')
      const breakPoint = Math.max(lastPeriod, lastNewline)
      
      if (breakPoint > start + chunkSize * 0.7) {
        chunk = chunk.slice(0, breakPoint + 1)
      }
    }
    
    chunks.push(chunk.trim())
    start = end - overlap
  }
  
  return chunks.filter(chunk => chunk.length > 50) // Filter out very short chunks
}

// Function to extract text from different file types
async function extractText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  
  if (file.type === 'application/pdf') {
    try {
      const pdfBuffer = Buffer.from(buffer)
      
      // Convert buffer to string and look for text patterns
      const bufferString = pdfBuffer.toString('utf8', 0, Math.min(pdfBuffer.length, 50000))
      
      // Look for text content in PDF format
      // PDF text is often found between BT (begin text) and ET (end text) markers
      const textMatches = bufferString.match(/BT[\s\S]*?ET/g) || []
      
      // Also look for readable text patterns that are likely actual content
      const readableText = bufferString.match(/[A-Za-z0-9\s]{20,}/g) || []
      
      // Combine and clean up the text
      let extractedText = ''
      
      // Process text between BT/ET markers
      for (const match of textMatches) {
        // Extract text content from PDF text objects
        const textContent = match.replace(/BT|ET/g, '').replace(/[^\x20-\x7E]/g, ' ').trim()
        if (textContent.length > 10) {
          extractedText += textContent + ' '
        }
      }
      
      // Add readable text patterns
      for (const text of readableText) {
        if (text.length > 20 && !text.includes('stream') && !text.includes('endstream')) {
          extractedText += text + ' '
        }
      }
      
      // Clean up the text
      extractedText = extractedText.replace(/\s+/g, ' ').trim()
      
      if (extractedText.length < 50) {
        throw new Error('Could not extract readable text from PDF. Please ensure the PDF contains text (not just images).')
      }
      
      return extractedText
    } catch (error) {
      console.error('PDF parsing error:', error)
      throw new Error('Failed to parse PDF file. Please ensure it contains readable text.')
    }
  } else if (file.type === 'text/plain') {
    const text = new TextDecoder().decode(buffer)
    return text
  } else {
    throw new Error('Unsupported file type')
  }
}

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

    const formData = await request.formData()
    const file = formData.get('file') as File
    console.log('check file', file) 

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and TXT files are supported' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Extract text from file
    const text = await extractText(file)
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text content found in file' },
        { status: 400 }
      )
    }
    console.log('check text', text)
    // Split text into chunks
    const chunks = splitIntoChunks(text)
    console.log('check chunks', chunks)
    if (chunks.length === 0) {
      return NextResponse.json(
        { error: 'No valid text chunks found' },
        { status: 400 }
      )
    }

    // Generate embeddings for all chunks
    const embeddingPromises = chunks.map(chunk =>
      openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: chunk,
      }).catch(error => {
        console.error('OpenAI API error:', error)
        if (error.code === 'insufficient_quota') {
          throw new Error('OpenAI API quota exceeded. Please check your billing and try again later.')
        }
        throw new Error('Failed to generate embeddings. Please try again.')
      })
    )

    const embeddingResponses = await Promise.all(embeddingPromises)
    
    // Prepare vectors for Pinecone
    const documentId = `doc_${Date.now()}`
    const vectors = chunks.map((chunk, index) => ({
      id: `${documentId}_chunk_${index}`,
      values: embeddingResponses[index].data[0].embedding,
      metadata: {
        document_id: documentId,
        document_title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        source_type: 'GENERAL', // Can be enhanced with file type detection
        upload_date: new Date().toISOString(),
        chunk_index: index,
        chunk_text: chunk,
        total_chunks: chunks.length,
        file_type: file.type,
        file_size: file.size
      }
    }))

    // Upsert vectors to Pinecone
    await index.upsert(vectors)

    return NextResponse.json({
      success: true,
      document_id: documentId,
      filename: file.name,
      chunks: chunks.length,
      total_chunks: chunks.length,
      message: `Successfully processed ${chunks.length} chunks from ${file.name}`
    })

  } catch (error) {
    console.error('Upload API error:', error)
    
    // Provide specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes('OpenAI API quota exceeded')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please check your billing and try again later.' },
          { status: 429 }
        )
      } else if (error.message.includes('Failed to parse PDF')) {
        return NextResponse.json(
          { error: 'Failed to parse PDF file. Please ensure it contains readable text.' },
          { status: 400 }
        )
      } else if (error.message.includes('Could not extract readable text')) {
        return NextResponse.json(
          { error: 'Could not extract readable text from PDF. Please ensure the PDF contains text (not just images).' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to process document. Please try again.' },
      { status: 500 }
    )
  }
} 