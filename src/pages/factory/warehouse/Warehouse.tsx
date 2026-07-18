import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Warehouse as WarehouseIcon, Layers } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"

export default function WarehousePage() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/warehouses`)
      if (res.success && res.data) setWarehouses(res.data)
    } catch {
      notify("Failed to load warehouse spatial data", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: "code", header: "Code", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "name", header: "Storage Depot Name", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "type", header: "Material Zone", cell: (info) => <Badge variant="info" size="sm">{info.getValue().toUpperCase()}</Badge> },
    { accessorKey: "total_capacity", header: "Footprint / Area", cell: (info) => <span>{info.getValue()} {info.row.original.capacity_unit}</span> },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Warehouse Layout & Zone Staging</h1>
          <p className="text-xs text-slate-500">Facility space management, bin assignments, and staging zones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Depots & Warehouses" value={warehouses.length} icon={<WarehouseIcon className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Total Volumetric Utilization" value="68.4%" icon={<Layers className="w-5 h-5 text-purple-700" />} color="purple" />
      </div>

      <Table data={warehouses} columns={columns} isLoading={loading} emptyMessage="No warehouse layouts registered." />
    </div>
  )
}
