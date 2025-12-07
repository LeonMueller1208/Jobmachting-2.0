"use client";

import { useState, useMemo } from "react";
import { ALL_SKILLS, SKILL_CATEGORIES, POPULAR_SKILLS, searchSkills, getSkillsByCategory, type SkillCategory } from "@/lib/skills";

interface Step5SkillsProps {
  skills: string[];
  setSkills: (value: string[]) => void;
}

export default function Step5Skills({ skills, setSkills }: Step5SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlySelected, setShowOnlySelected] = useState(false);

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
      filtered = filtered.filter(skill => skills.includes(skill.name));
    }

    return filtered;
  }, [activeCategory, searchQuery, showOnlySelected, skills]);

  function toggleSkill(skillName: string) {
    if (skills.includes(skillName)) {
      setSkills(skills.filter(s => s !== skillName));
    } else {
      setSkills([...skills, skillName]);
    }
  }

  function addPopularSkill(skillName: string) {
    if (!skills.includes(skillName)) {
      setSkills([...skills, skillName]);
    }
  }

  const selectedSkillsData = skills.map(name => ALL_SKILLS.find(s => s.name === name)).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 ds-icon-container-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 ds-icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl ds-heading mb-2">Deine Skills 🎯</h2>
        <p className="ds-body-light text-base sm:text-lg">Wähle mindestens 1 Skill aus</p>
      </div>

      {/* Skills Counter */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl text-center border-2 border-blue-100">
        <p className="text-lg font-semibold text-gray-800">
          {skills.length === 0 && "Noch keine Skills ausgewählt"}
          {skills.length === 1 && "1 Skill ausgewählt ✓"}
          {skills.length > 1 && `${skills.length} Skills ausgewählt ✓`}
        </p>
        {skills.length >= 3 && skills.length <= 8 && (
          <p className="text-sm text-green-600 mt-1 font-medium">Perfekt! Je mehr Skills, desto bessere Matches! 🚀</p>
        )}
        {skills.length > 8 && (
          <p className="text-sm text-blue-600 mt-1 font-medium">Viele Skills ausgewählt - super! 💪</p>
        )}
      </div>

      {/* Selected Skills Preview */}
      {skills.length > 0 && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">Deine ausgewählten Skills:</p>
            <button
              onClick={() => setShowOnlySelected(!showOnlySelected)}
              className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {showOnlySelected ? "Alle anzeigen" : "Nur ausgewählte"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {skills.map(skillName => {
              const skill = ALL_SKILLS.find(s => s.name === skillName);
              return (
                <span 
                  key={skillName} 
                  className="inline-flex items-center gap-1.5 ds-skill-tag-blue text-sm px-3 py-1.5 max-w-full"
                  title={skillName}
                >
                  {skill && <span className="text-xs opacity-70 flex-shrink-0">{SKILL_CATEGORIES[skill.category].icon}</span>}
                  <span className="truncate">{skillName}</span>
                  <button 
                    onClick={() => toggleSkill(skillName)}
                    className="hover:text-[var(--accent-blue-dark)] transition-colors duration-200 font-bold text-base leading-none ml-1 flex-shrink-0"
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
      {skills.length === 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Beliebte Skills:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.slice(0, 6).map(skillName => {
              const skill = ALL_SKILLS.find(s => s.name === skillName);
              if (!skill) return null;
              return (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => addPopularSkill(skillName)}
                  className="text-sm px-3 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50 transition-all duration-200 font-medium"
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
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Suche nach Skills..."
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="border-b-2 border-gray-200">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-blue-500 text-white shadow-md"
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
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                activeCategory === category
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {SKILL_CATEGORIES[category].icon} {SKILL_CATEGORIES[category].label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="ds-label">
            {activeCategory === "all" ? "Alle Skills" : SKILL_CATEGORIES[activeCategory].label} *
            {filteredSkills.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredSkills.length} verfügbar)
              </span>
            )}
          </label>
        </div>
        
        {filteredSkills.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">
              {searchQuery ? "Keine Skills gefunden" : "Keine Skills in dieser Kategorie"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Suche zurücksetzen
              </button>
            )}
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredSkills.map((skill) => {
                const isSelected = skills.includes(skill.name);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.name)}
                    className={`text-sm px-3 py-2.5 rounded-lg border-2 transition-all duration-200 font-medium text-left min-w-0 w-full min-h-[3rem] flex items-start ${
                      isSelected
                        ? "ds-skill-tag-blue border-blue-500 scale-105 shadow-md"
                        : "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-1.5 min-w-0 w-full">
                      {isSelected && <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">✓</span>}
                      <span className={`${isSelected ? "font-semibold" : ""} line-clamp-2 break-words hyphens-auto`} lang="de" title={skill.name}>{skill.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              <strong>Pro-Tipp:</strong> Wähle alle Skills aus, die du beherrschst!
            </p>
            <p className="text-xs text-blue-700">
              Nutze die Kategorien und Suche, um schnell die passenden Skills zu finden. Auch Soft Skills wie Kommunikation und Teamarbeit sind wichtig!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
