import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { Factory as FactoryIcon, Play } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function ProductionPlanning() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/production/orders`)
      if (res.success && res.data) setOrders(res.data)
    } catch {
      notify("Failed to load production orders", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: "order_number", header: "MO Number", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "planned_qty", header: "Planned Qty", cell: (info) => <span className="font-semibold">{info.getValue()} units</span> },
    { accessorKey: "actual_qty", header: "Actual Output", cell: (info) => <span className="font-bold text-emerald-600">{info.getValue()} units</span> },
    { accessorKey: "adherence_pct", header: "Adherence %", cell: (info) => <span className="font-bold">{info.getValue()}%</span> },
    { accessorKey: "status", header: "Status", cell: (info) => <Badge variant={info.getValue() === "in_progress" ? "success" : "info"} size="sm">{info.getValue().toUpperCase()}</Badge> },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Production Control & Master Schedule</h1>
          <p className="text-xs text-slate-500">Shop floor execution, line Gantt schedules, and plan adherence tracking.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
          Generate Daily Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Active Manufacturing Orders" value={orders.length} icon={<FactoryIcon className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Overall Schedule Adherence" value="92.5%" color="green" />
        <StatCard label="Line Changeover Loss" value="45 mins" color="amber" />
      </div>

      {/* Simplified Gantt Overview */}
      <Card title="Shop Floor Line Execution Board">
        <div className="space-y-4 text-xs">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="font-bold text-slate-800 mb-2">Line 1 — High-Speed Packaging (Status: RUNNING)</div>
            <div className="flex gap-2">
              <div className="bg-blue-800 text-white p-2.5 rounded-md flex-1 text-center font-semibold">
                ORD-20260718-001 (Liquid Detergent 1L) — 2,500 units [80% Complete]
              </div>
              <div className="bg-slate-200 text-slate-600 p-2.5 rounded-md w-1/3 text-center">
                Next: ORD-20260718-005 (Disinfectant 5L)
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="font-bold text-slate-800 mb-2">Line 2 — Automated Assembly (Status: RUNNING)</div>
            <div className="flex gap-2">
              <div className="bg-emerald-700 text-white p-2.5 rounded-md flex-1 text-center font-semibold">
                ORD-20260718-002 (Hand Sanitizer Gel) — 1,500 units [95% Complete]
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Table data={orders} columns={columns} isLoading={loading} emptyMessage="No manufacturing orders scheduled." />
    </div>
  )
}
