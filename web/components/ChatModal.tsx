"use client";

import React, { useEffect, useState } from "react";
import { formatChatStartDate } from "@/lib/dateUtils";
import { replacePlaceholders, type PlaceholderData } from "@/lib/chatTemplates";

type Chat = {
  id: string;
  applicant: { id: string; name: string; email: string };
  company: { id: string; name: string; email: string };
  job: { id: string; title: string };
  messages: Array<{
    id: string;
    senderId: string;
    senderType: string;
    content: string;
    createdAt: string;
  }>;
};

type Message = {
  id: string;
  senderId: string;
  senderType: string;
  content: string;
  createdAt: string;
};

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId: string;
  companyId: string;
  jobId: string;
  applicantName: string;
  jobTitle: string;
  chatCreatedAt: string;
  userType: 'applicant' | 'company';
  onMessagesRead?: () => void;
  companyName?: string;
  applicantEmail?: string;
}

export default function ChatModal({
  isOpen,
  onClose,
  applicantId,
  companyId,
  jobId,
  applicantName,
  jobTitle,
  chatCreatedAt,
  userType,
  onMessagesRead,
  companyName = '',
  applicantEmail = ''
}: ChatModalProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      createOrGetChat();
      if (userType === 'company' && companyId) {
        fetchTemplates();
      }
    }
  }, [isOpen, userType, companyId]);

  useEffect(() => {
    if (chat) {
      fetchMessages();
      markAsRead();
    }
  }, [chat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function markAsRead() {
    if (!chat) return;
    
    try {
      await fetch(`/api/chats/${chat.id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType })
      });
      
      // Notify parent to refresh chat list
      if (onMessagesRead) {
        onMessagesRead();
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  async function createOrGetChat() {
    setLoading(true);
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantId, companyId, jobId })
      });
      
      if (response.ok) {
        const chatData = await response.json();
        setChat(chatData);
      }
    } catch (error) {
      console.error('Error creating/getting chat:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages() {
    if (!chat) return;
    
    try {
      const response = await fetch(`/api/chats/${chat.id}/messages`);
      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  async function fetchTemplates() {
    try {
      const response = await fetch(`/api/companies/${companyId}/chat-templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch templates:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }

  function handleTemplateSelect(template: any) {
    if (userType === 'company') {
      const placeholderData: PlaceholderData = {
        applicantName,
        jobTitle,
        companyName: companyName || '',
        applicantEmail: applicantEmail || '',
      };
      const filledTemplate = replacePlaceholders(template.content, placeholderData);
      setNewMessage(filledTemplate);
      setShowTemplateDropdown(false);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !chat || sending) return;

    setSending(true);
    try {
      // Replace placeholders before sending (in case user edited the template)
      let messageContent = newMessage.trim();
      if (userType === 'company') {
        const placeholderData: PlaceholderData = {
          applicantName,
          jobTitle,
          companyName: companyName || '',
          applicantEmail: applicantEmail || '',
        };
        messageContent = replacePlaceholders(messageContent, placeholderData);
      }

      const response = await fetch(`/api/chats/${chat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userType === 'applicant' ? applicantId : companyId,
          senderType: userType,
          content: messageContent
        })
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[85vh] sm:h-[600px] max-h-[700px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chat mit {applicantName}</h3>
            <p className="text-sm text-gray-500">{jobTitle}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatChatStartDate(chatCreatedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Lade Chat...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Noch keine Nachrichten</p>
                <p className="text-sm">Starten Sie die Unterhaltung!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === userType ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderType === userType
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderType === userType ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
          <div className="flex space-x-2">
            {userType === 'company' && (
              <div className="relative">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="px-2 sm:px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[60px] sm:min-h-[44px] flex items-center justify-center shrink-0"
                  title="Vorlage verwenden"
                  disabled={templates.length === 0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                {showTemplateDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowTemplateDropdown(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                      <div className="p-2 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-700">Vorlage auswählen</p>
                      </div>
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-sm text-gray-900 mb-1">
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {template.content.substring(0, 80)}
                            {template.content.length > 80 ? '...' : ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nachricht eingeben..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              style={{ fontSize: '16px', minHeight: '80px' }}
              rows={3}
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-w-[60px] sm:min-w-[44px] min-h-[60px] sm:min-h-[44px] flex items-center justify-center shrink-0"
            >
              {sending ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
