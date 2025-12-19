import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/chats/[id]/messages - Get messages for a chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chatId = id;

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chats/[id]/messages - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chatId = id;
    const { senderId, senderType, content } = await request.json();

    if (!senderId || !senderType || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        senderType,
        content
      }
    });

    // Update chat's updatedAt timestamp and automatically unarchive if archived
    // If applicant sends message, unarchive for applicant (they're active again)
    // If company sends message, unarchive for company (they're active again)
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (senderType === 'applicant') {
      updateData.archivedByApplicant = false;
    } else if (senderType === 'company') {
      updateData.archivedByCompany = false;
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: updateData
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
