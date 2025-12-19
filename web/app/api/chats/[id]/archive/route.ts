import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/chats/[id]/archive
 * Archive or unarchive a chat for a specific user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userType, archived } = body; // 'applicant' or 'company', boolean

    if (!userType || typeof archived !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing userType or archived flag' },
        { status: 400 }
      );
    }

    // Update the appropriate archive field
    const updateData: any = {};
    if (userType === 'applicant') {
      updateData.archivedByApplicant = archived;
    } else if (userType === 'company') {
      updateData.archivedByCompany = archived;
    } else {
      return NextResponse.json(
        { error: 'Invalid userType' },
        { status: 400 }
      );
    }

    const chat = await prisma.chat.update({
      where: { id },
      data: updateData,
      include: {
        applicant: {
          select: { id: true, name: true, email: true }
        },
        company: {
          select: { id: true, name: true, email: true }
        },
        job: {
          select: { id: true, title: true }
        }
      }
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error archiving chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

