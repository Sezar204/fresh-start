import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Building2, CreditCard } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Customer } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { SearchBar } from "@/components/ui/SearchBar"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"

export default function Customers() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [items, setItems] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/customers`)
      if (res.success && res.data) setItems(res.data)
    } catch {
      notify("Failed to load customer accounts", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columns: ColumnDef<Customer, any>[] = [
    { accessorKey: "code", header: "Customer ID", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "name", header: "Client / Distributor", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "type", header: "Segment", cell: (info) => <Badge variant="info" size="sm">{info.getValue().toUpperCase()}</Badge> },
    { accessorKey: "credit_limit", header: "Credit Limit", cell: (info) => <span className="font-bold text-slate-800">${Number(info.getValue() || 0).toLocaleString()}</span> },
  ]

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Accounts</h1>
          <p className="text-xs text-slate-500">B2B client profiles, distribution channels, and credit parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total Commercial Clients" value={items.length} icon={<Building2 className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Active Credit Facilities" value={items.filter((i) => i.credit_limit).length} icon={<CreditCard className="w-5 h-5 text-emerald-700" />} color="green" />
      </div>

      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
        <Table data={filtered} columns={columns} isLoading={loading} emptyMessage="No customers found." />
      </div>
    </div>
  )
}
