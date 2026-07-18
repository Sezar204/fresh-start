import React, { useEffect, useState } from "react"
import { Search, X } from "lucide-react"

export interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  const [internalVal, setInternalVal] = useState(value)

  useEffect(() => {
    setInternalVal(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(internalVal)
    }, 300)
    return () => clearTimeout(timer)
  }, [internalVal, onChange])

  return (
    <div className="relative flex items-center w-full max-w-sm">
      <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={internalVal}
        onChange={(e) => setInternalVal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      {internalVal && (
        <button
          onClick={() => {
            setInternalVal("")
            onChange("")
          }}
          className="absolute right-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
