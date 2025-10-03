import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/chats/[id]/read - Mark messages as read
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chatId = id;
    const { userType } = await request.json();

    if (!userType) {
      return NextResponse.json({ error: 'Missing userType' }, { status: 400 });
    }

    // Mark all messages from the other party as read
    const senderType = userType === 'applicant' ? 'company' : 'applicant';
    
    await prisma.message.updateMany({
      where: {
        chatId,
        senderType,
        read: false
      },
      data: {
        read: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

