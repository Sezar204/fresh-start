import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Users, Star } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Supplier } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { SearchBar } from "@/components/ui/SearchBar"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"

export default function Suppliers() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [items, setItems] = useState<Supplier[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/suppliers`)
      if (res.success && res.data) setItems(res.data)
    } catch {
      notify("Failed to load supplier registry", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columns: ColumnDef<Supplier, any>[] = [
    { accessorKey: "code", header: "Supplier Code", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "name", header: "Company Name", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "contact_name", header: "Contact Person", cell: (info) => <span>{info.getValue() || "N/A"}</span> },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: (info) => (
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{info.getValue()} / 5</span>
        </div>
      ),
    },
    { accessorKey: "status", header: "Status", cell: (info) => <Badge variant={info.getValue() === "active" ? "success" : "danger"} size="sm">{info.getValue().toUpperCase()}</Badge> },
  ]

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Approved Suppliers</h1>
          <p className="text-xs text-slate-500">Vendor contacts, quality ratings, and procurement terms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Active Suppliers" value={items.filter((i) => i.status === "active").length} icon={<Users className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Average Performance Rating" value="4.6 / 5.0" icon={<Star className="w-5 h-5 text-amber-600" />} color="amber" />
      </div>

      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search suppliers..." />
        <Table data={filtered} columns={columns} isLoading={loading} emptyMessage="No active suppliers found." />
      </div>
    </div>
  )
}
