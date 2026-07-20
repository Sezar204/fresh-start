import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Users, UserCheck, Plus } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Worker } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Workforce() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/workers`)
      if (res.success && res.data) setWorkers(res.data)
    } catch {
      notify("Failed to load workforce roster", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columns: ColumnDef<Worker, any>[] = [
    { accessorKey: "employee_id", header: "Emp ID", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "name", header: "Employee Name", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "department", header: "Department", cell: (info) => <span>{info.getValue() || "Operations"}</span> },
    { accessorKey: "role", header: "Role", cell: (info) => <span className="font-medium text-slate-700">{info.getValue() || "Operator"}</span> },
    { accessorKey: "status", header: "Status", cell: (info) => <Badge variant={info.getValue() === "active" ? "success" : "muted"} size="sm">{info.getValue().toUpperCase()}</Badge> },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Workforce & Shift Roster</h1>
          <p className="text-xs text-slate-500">Employee skills matrix, shift roster assignments, and daily attendance tracking.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Register Worker
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Plant Workforce" value={workers.length} icon={<Users className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Attendance Rate" value="98.0%" icon={<UserCheck className="w-5 h-5 text-emerald-700" />} color="green" />
        <StatCard label="Active Skilled Operators" value="10 Operators" color="purple" />
      </div>

      <Table data={workers} columns={columns} isLoading={loading} emptyMessage="No workforce personnel registered." />
    </div>
  )
}
