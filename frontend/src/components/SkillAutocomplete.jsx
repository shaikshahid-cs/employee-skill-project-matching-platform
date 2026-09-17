import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import skillApi from '../api/skillApi';

export default function SkillAutocomplete({ value = '', onChange, onSelectSkill, placeholder = 'Search existing skills catalog...' }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const results = await skillApi.searchSkills(value);
        if (isMounted) {
          setOptions(Array.isArray(results) ? results : []);
        }
      } catch {
        if (isMounted) setOptions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSkills();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>

      {showDropdown && (value.trim().length > 0 || options.length > 0) && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.35rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 60,
          boxShadow: 'var(--shadow-md)'
        }}>
          {loading && (
            <div style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Searching skills catalog...
            </div>
          )}

          {!loading && options.length === 0 && (
            <div style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              No matching skills found in catalog.
            </div>
          )}

          {!loading && options.map((skill) => (
            <div
              key={skill.id || skill.name}
              onMouseDown={() => {
                onSelectSkill(skill);
                setShowDropdown(false);
              }}
              style={{
                padding: '0.65rem 0.85rem',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-color)',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {skill.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
