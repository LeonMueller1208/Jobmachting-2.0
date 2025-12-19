import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/chats - Get all chats for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType'); // 'applicant' or 'company'
    const filter = searchParams.get('filter'); // 'active' or 'archived' (default: 'active')

    if (!userId || !userType) {
      return NextResponse.json({ error: 'Missing userId or userType' }, { status: 400 });
    }

    // Build where clause based on user type and archive filter
    const whereClause: any = userType === 'applicant' 
      ? { applicantId: userId }
      : { companyId: userId };

    // Add archive filter
    if (filter === 'archived') {
      if (userType === 'applicant') {
        whereClause.archivedByApplicant = true;
      } else {
        whereClause.archivedByCompany = true;
      }
    } else {
      // Default: show active chats (not archived)
      if (userType === 'applicant') {
        whereClause.archivedByApplicant = false;
      } else {
        whereClause.archivedByCompany = false;
      }
    }

    const chats = await prisma.chat.findMany({
      where: whereClause,
      include: {
        applicant: {
          select: { id: true, name: true, email: true }
        },
        company: {
          select: { id: true, name: true, email: true }
        },
        job: {
          select: { id: true, title: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: {
            messages: {
              where: {
                read: false,
                senderType: userType === 'applicant' ? 'company' : 'applicant'
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chats - Create a new chat
export async function POST(request: NextRequest) {
  try {
    const { applicantId, companyId, jobId } = await request.json();

    if (!applicantId || !companyId || !jobId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if chat already exists
    const existingChat = await prisma.chat.findUnique({
      where: {
        applicantId_companyId_jobId: {
          applicantId,
          companyId,
          jobId
        }
      }
    });

    if (existingChat) {
      return NextResponse.json(existingChat);
    }

    // Create new chat
    const chat = await prisma.chat.create({
      data: {
        applicantId,
        companyId,
        jobId
      },
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
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
