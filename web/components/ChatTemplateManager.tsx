"use client";

import React, { useState, useEffect } from "react";
import { AVAILABLE_PLACEHOLDERS } from "@/lib/chatTemplates";

type ChatTemplate = {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

interface ChatTemplateManagerProps {
  companyId: string;
}

export default function ChatTemplateManager({ companyId }: ChatTemplateManagerProps) {
  const [templates, setTemplates] = useState<ChatTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ChatTemplate | null>(null);
  const [formData, setFormData] = useState({ name: "", content: "" });

  useEffect(() => {
    fetchTemplates();
  }, [companyId]);

  async function fetchTemplates() {
    try {
      const response = await fetch(`/api/companies/${companyId}/chat-templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setFormData({ name: "", content: "" });
    setEditingTemplate(null);
    setShowCreateModal(true);
  }

  function handleEdit(template: ChatTemplate) {
    setFormData({ name: template.name, content: template.content });
    setEditingTemplate(template);
    setShowCreateModal(true);
  }

  async function handleSave() {
    if (!formData.name.trim() || !formData.content.trim()) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing template
        const response = await fetch(
          `/api/companies/${companyId}/chat-templates/${editingTemplate.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          await fetchTemplates();
          setShowCreateModal(false);
          setEditingTemplate(null);
        } else {
          const error = await response.json();
          alert(error.error || "Fehler beim Speichern der Vorlage");
        }
      } else {
        // Create new template
        const response = await fetch(`/api/companies/${companyId}/chat-templates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchTemplates();
          setShowCreateModal(false);
        } else {
          const error = await response.json();
          alert(error.error || "Fehler beim Erstellen der Vorlage");
        }
      }
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Fehler beim Speichern der Vorlage");
    }
  }

  async function handleDelete(templateId: string) {
    if (!confirm("Möchten Sie diese Vorlage wirklich löschen?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/companies/${companyId}/chat-templates/${templateId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchTemplates();
      } else {
        const error = await response.json();
        alert(error.error || "Fehler beim Löschen der Vorlage");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Fehler beim Löschen der Vorlage");
    }
  }

  function insertPlaceholder(placeholder: string) {
    const textarea = document.getElementById("template-content") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const newText = text.substring(0, start) + placeholder + text.substring(end);
      setFormData({ ...formData, content: newText });
      // Set cursor position after placeholder
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  }

  if (loading) {
    return (
      <div className="ds-card p-4">
        <div className="text-center text-gray-500">Lade Vorlagen...</div>
      </div>
    );
  }

  return (
    <>
      <div className="ds-card p-4 sm:p-6 mb-6">
        {!isExpanded ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl ds-subheading mb-1">Chat-Vorlagen</h3>
              <p className="text-sm ds-body-light">
                Erstellen und verwalten Sie Vorlagen für häufige Nachrichten
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(true)}
              className="ds-button-secondary text-sm sm:text-base px-4 py-2 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Vorlagen verwalten
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl ds-subheading mb-1">Chat-Vorlagen</h3>
                <p className="text-sm ds-body-light">
                  Erstellen und verwalten Sie Vorlagen für häufige Nachrichten
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="ds-button-secondary text-sm sm:text-base px-4 py-2"
                >
                  Ausblenden
                </button>
                <button
                  onClick={handleCreate}
                  className="ds-button-primary-blue text-sm sm:text-base px-4 py-2"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Neue Vorlage
                </button>
              </div>
            </div>

            {templates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Noch keine Vorlagen vorhanden.</p>
                <p className="text-sm mt-2">Erstellen Sie Ihre erste Vorlage!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 sm:p-4 border rounded-lg ${
                      template.isDefault ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          {template.isDefault && (
                            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                              Standard
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {template.content.substring(0, 100)}
                          {template.content.length > 100 ? "..." : ""}
                        </p>
                      </div>
                      {!template.isDefault && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEdit(template)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Bearbeiten"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Löschen"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editingTemplate ? "Vorlage bearbeiten" : "Neue Vorlage erstellen"}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTemplate(null);
                    setFormData({ name: "", content: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="ds-label mb-2 block">Name der Vorlage</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Erstkontakt, Einladung zum Interview"
                  className="ds-input w-full"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label className="ds-label mb-2 block">Vorlagentext</label>
                <div className="mb-2">
                  <p className="text-xs text-gray-600 mb-2">Platzhalter einfügen:</p>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_PLACEHOLDERS.map((placeholder) => (
                      <button
                        key={placeholder.key}
                        onClick={() => insertPlaceholder(placeholder.key)}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                        title={placeholder.description}
                      >
                        {placeholder.label}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  id="template-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Geben Sie hier Ihre Vorlage ein..."
                  rows={8}
                  className="ds-input w-full font-mono text-sm"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTemplate(null);
                    setFormData({ name: "", content: "" });
                  }}
                  className="ds-button-secondary px-4 py-2"
                >
                  Abbrechen
                </button>
                <button onClick={handleSave} className="ds-button-primary-blue px-4 py-2">
                  {editingTemplate ? "Speichern" : "Erstellen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

