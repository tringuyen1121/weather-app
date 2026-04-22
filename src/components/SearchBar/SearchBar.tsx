import { useState, useRef, useEffect, useCallback } from "react";
import { useGeocoding } from "../../hooks/useGeocoding";
import type { Location } from "../../types/weather";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  onSelectLocation: (location: Location) => void;
  onGeolocate: () => void;
  geolocating: boolean;
}

const SearchBar = ({
  onSelectLocation,
  onGeolocate,
  geolocating,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, loading } = useGeocoding(query);

  const showDropdown =
    open && query.trim().length > 0 && (results.length > 0 || loading);

  const onQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setOpen(true);
      setHighlightedIndex(-1);
    },
    [],
  );

  const handleSelect = useCallback(
    (loc: Location) => {
      onSelectLocation(loc);
      setQuery("");
      setOpen(false);
    },
    [onSelectLocation],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown) {
        if (e.key === "Escape") {
          setOpen(false);
          inputRef.current?.blur();
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          setOpen(false);
          inputRef.current?.blur();
          break;
        case "ArrowDown":
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < results.length) {
            handleSelect(results[highlightedIndex]);
          }
          break;
        default:
          break;
      }
    },
    [showDropdown, results, highlightedIndex, handleSelect],
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.inputRow}>
        <span className={styles.searchIcon} aria-hidden="true">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search for a city…"
          value={query}
          onChange={onQueryChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search city"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          autoComplete="off"
          spellCheck={false}
        />
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        <button
          className={styles.geoBtn}
          onClick={onGeolocate}
          disabled={geolocating}
          aria-label="Use my location"
          title="Use my location"
        >
          {geolocating ? <span className={styles.spinner} /> : "📍"}
        </button>
      </div>

      {showDropdown && (
        <ul
          className={styles.dropdown}
          role="listbox"
          aria-label="Location suggestions"
        >
          {results.map((loc, index) => (
            <li
              key={loc.id}
              className={`${styles.option} ${
                index === highlightedIndex ? styles.highlighted : ""
              }`}
              role="option"
              aria-selected={index === highlightedIndex}
              onMouseDown={() => handleSelect(loc)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <span className={styles.optionName}>{loc.name}</span>
              <span className={styles.optionSub}>
                {[loc.admin1, loc.country].filter(Boolean).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
