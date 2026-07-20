import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { FileCode2, Layers } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { BOMHeader } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/badge"

export default function BOM() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [boms, setBoms] = useState<BOMHeader[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/bom`)
      if (res.success && res.data) setBoms(res.data)
    } catch {
      notify("Failed to load BOM structures", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columns: ColumnDef<BOMHeader, any>[] = [
    { accessorKey: "name", header: "BOM Recipe Name", cell: (info) => <span className="font-bold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "version", header: "Version", cell: (info) => <span className="font-mono">{info.getValue()}</span> },
    { accessorKey: "yield_pct", header: "Yield Factor", cell: (info) => <span className="font-semibold text-emerald-600">{info.getValue()}%</span> },
    { accessorKey: "status", header: "Status", cell: (info) => <Badge variant={info.getValue() === "active" ? "success" : "muted"} size="sm">{info.getValue().toUpperCase()}</Badge> },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Bill of Materials (BOM) & Recipes</h1>
          <p className="text-xs text-slate-500">Formulas, raw material requirements and yield efficiency factors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total BOM Structures" value={boms.length} icon={<Layers className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Active Recipes" value={boms.filter((b) => b.status === "active").length} icon={<FileCode2 className="w-5 h-5 text-emerald-700" />} color="green" />
      </div>

      <Table data={boms} columns={columns} isLoading={loading} emptyMessage="No BOM formulas configured." />
    </div>
  )
}
