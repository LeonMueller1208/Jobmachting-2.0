"use client";

import { useState, useMemo } from "react";
import { ALL_SKILLS, SKILL_CATEGORIES, POPULAR_SKILLS, searchSkills, getSkillsByCategory, type SkillCategory } from "@/lib/skills";

interface SkillsSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  colorScheme?: "blue" | "green";
  label?: string;
}

export default function SkillsSelector({ 
  selectedSkills, 
  onSkillsChange, 
  colorScheme = "blue",
  label = "Skills"
}: SkillsSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const isBlue = colorScheme === "blue";

  // Filter Skills basierend auf Kategorie, Suche und "Nur ausgewählte"
  const filteredSkills = useMemo(() => {
    let filtered = ALL_SKILLS;

    // Kategorie-Filter
    if (activeCategory !== "all") {
      filtered = getSkillsByCategory(activeCategory);
    }

    // Such-Filter
    if (searchQuery.trim()) {
      filtered = searchSkills(searchQuery);
      // Wenn eine Kategorie aktiv ist, zusätzlich filtern
      if (activeCategory !== "all") {
        filtered = filtered.filter(skill => skill.category === activeCategory);
      }
    }

    // "Nur ausgewählte" Filter
    if (showOnlySelected) {
      filtered = filtered.filter(skill => selectedSkills.includes(skill.name));
    }

    return filtered;
  }, [activeCategory, searchQuery, showOnlySelected, selectedSkills]);

  function toggleSkill(skillName: string) {
    if (selectedSkills.includes(skillName)) {
      onSkillsChange(selectedSkills.filter(s => s !== skillName));
    } else {
      onSkillsChange([...selectedSkills, skillName]);
    }
  }

  function addPopularSkill(skillName: string) {
    if (!selectedSkills.includes(skillName)) {
      onSkillsChange([...selectedSkills, skillName]);
    }
  }

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="ds-label">
          {label} * (mindestens 1)
          {filteredSkills.length > 0 && activeCategory !== "all" && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredSkills.length} verfügbar)
            </span>
          )}
        </label>
        {selectedSkills.length > 0 && (
          <button
            onClick={() => setShowOnlySelected(!showOnlySelected)}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              isBlue 
                ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {showOnlySelected ? "Alle anzeigen" : "Nur ausgewählte"}
          </button>
        )}
      </div>

      {/* Selected Skills Preview */}
      {selectedSkills.length > 0 && (
        <div className={`bg-white border-2 rounded-xl p-3 ${
          isBlue ? "border-blue-200" : "border-green-200"
        }`}>
          <p className="text-xs font-medium text-gray-600 mb-2">Ausgewählte Skills ({selectedSkills.length}):</p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {selectedSkills.map(skillName => {
              const skill = ALL_SKILLS.find(s => s.name === skillName);
              return (
                <span 
                  key={skillName} 
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg max-w-full ${
                    isBlue ? "ds-skill-tag-blue" : "ds-skill-tag-green"
                  }`}
                  title={skillName}
                >
                  {skill && <span className="text-xs opacity-70 flex-shrink-0">{SKILL_CATEGORIES[skill.category].icon}</span>}
                  <span className="truncate">{skillName}</span>
                  <button 
                    onClick={() => toggleSkill(skillName)}
                    className={`hover:opacity-70 transition-opacity duration-200 font-bold text-sm leading-none ml-1 flex-shrink-0 ${
                      isBlue ? "hover:text-[var(--accent-blue-dark)]" : "hover:text-[var(--accent-green-dark)]"
                    }`}
                    aria-label={`${skillName} entfernen`}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular Skills Quick-Picks */}
      {selectedSkills.length === 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Beliebte Skills:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.slice(0, 6).map(skillName => {
              const skill = ALL_SKILLS.find(s => s.name === skillName);
              if (!skill) return null;
              return (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => addPopularSkill(skillName)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border-2 transition-all duration-200 font-medium ${
                    isBlue
                      ? "border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50"
                      : "border-gray-300 hover:border-green-400 bg-white hover:bg-green-50"
                  }`}
                >
                  {SKILL_CATEGORIES[skill.category].icon} {skillName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Suche nach Skills..."
          className={`w-full pl-9 pr-8 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 outline-none transition-all text-sm ${
            isBlue 
              ? "focus:border-blue-500 focus:ring-blue-200" 
              : "focus:border-green-500 focus:ring-green-200"
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-2 flex items-center"
          >
            <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="border-b-2 border-gray-200">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 whitespace-nowrap ${
              activeCategory === "all"
                ? isBlue
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Alle
          </button>
          {(Object.keys(SKILL_CATEGORIES) as SkillCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setSearchQuery("");
              }}
              className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 whitespace-nowrap ${
                activeCategory === category
                  ? isBlue
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {SKILL_CATEGORIES[category].icon} <span className="hidden sm:inline">{SKILL_CATEGORIES[category].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500 font-medium">
            {searchQuery ? "Keine Skills gefunden" : "Keine Skills in dieser Kategorie"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`mt-2 text-xs underline ${
                isBlue ? "text-blue-600 hover:text-blue-700" : "text-green-600 hover:text-green-700"
              }`}
            >
              Suche zurücksetzen
            </button>
          )}
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill.name);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.name)}
                  className={`text-xs px-2.5 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-left min-w-0 w-full ${
                    isSelected
                      ? isBlue
                        ? "ds-skill-tag-blue border-blue-500 scale-105 shadow-md"
                        : "ds-skill-tag-green border-green-500 scale-105 shadow-md"
                      : isBlue
                        ? "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        : "bg-white border-gray-300 hover:border-green-400 hover:bg-green-50"
                  }`}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    {isSelected && (
                      <span className={`font-bold flex-shrink-0 ${isBlue ? "text-blue-600" : "text-green-600"}`}>✓</span>
                    )}
                    <span className={`${isSelected ? "font-semibold" : ""} truncate`} title={skill.name}>{skill.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

