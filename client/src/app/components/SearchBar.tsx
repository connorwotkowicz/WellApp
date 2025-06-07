'use client';

interface SearchBarProps {
  onSearch: (query: string) => void;
  allItems: any[];
  onCloseSearch: () => void;
}

export default function SearchBar({ onSearch, allItems, onCloseSearch }: SearchBarProps) {
  return (
    <div>
      <input type="text" placeholder="Search..." onChange={(e) => onSearch(e.target.value)} />
      <button onClick={onCloseSearch}>Close</button>
    </div>
  );
}
