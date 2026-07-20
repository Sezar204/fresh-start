import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Warehouse as WarehouseIcon } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Warehouse } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/badge"

export default function Warehouses() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [items, setItems] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/warehouses`)
      if (res.success && res.data) setItems(res.data)
    } catch {
      notify("Failed to load warehouse facilities", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columns: ColumnDef<Warehouse, any>[] = [
    { accessorKey: "code", header: "Facility Code", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "name", header: "Warehouse Name", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "type", header: "Type", cell: (info) => <Badge variant="info" size="sm">{info.getValue().toUpperCase()}</Badge> },
    { accessorKey: "total_capacity", header: "Storage Capacity", cell: (info) => <span>{info.getValue()} {info.row.original.capacity_unit}</span> },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Warehouses & Depots</h1>
          <p className="text-xs text-slate-500">Storage spaces, total square footage, and climate control conditions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total Storage Facilities" value={items.length} icon={<WarehouseIcon className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Total Physical Space" value="5,000 sqm" color="purple" />
      </div>

      <Table data={items} columns={columns} isLoading={loading} emptyMessage="No warehouse facilities defined." />
    </div>
  )
}
