import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Database, AlertTriangle } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { RawMaterial } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { SearchBar } from "@/components/ui/SearchBar"
import { Table } from "@/components/ui/Table"

export default function RawMaterials() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [items, setItems] = useState<RawMaterial[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/raw-materials`)
      if (res.success && res.data) setItems(res.data)
    } catch {
      notify("Failed to load raw material master data", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columns: ColumnDef<RawMaterial, any>[] = [
    { accessorKey: "code", header: "Material Code", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "name", header: "Material Name", cell: (info) => <span className="font-semibold">{info.getValue()}</span> },
    { accessorKey: "category", header: "Category", cell: (info) => <span className="text-slate-500">{info.getValue() || "General"}</span> },
    { accessorKey: "safety_stock_qty", header: "Safety Stock", cell: (info) => <span>{info.getValue()} {info.row.original.unit_of_measure}</span> },
    { accessorKey: "lead_time_days", header: "Lead Time", cell: (info) => <span>{info.getValue()} Days</span> },
  ]

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Raw Materials & Inputs</h1>
          <p className="text-xs text-slate-500">Chemicals, packaging supplies, and raw ingredient specifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total Ingredients / Materials" value={items.length} icon={<Database className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Critical Threshold Monitored" value={items.length} icon={<AlertTriangle className="w-5 h-5 text-amber-700" />} color="amber" />
      </div>

      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by material code or name..." />
        <Table data={filtered} columns={columns} isLoading={loading} emptyMessage="No raw materials defined." />
      </div>
    </div>
  )
}
