import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"
import { ColumnDef } from "@tanstack/react-table"
import { Wrench, Clock, Plus } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

export default function Maintenance() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [activeTab, setActiveTab] = useState("wos")
  const [wos, setWos] = useState<any[]>([])
  const [breakdowns, setBreakdowns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [woRes, bRes] = await Promise.allSettled([
        api.get<any>(`/factories/${fid}/work-orders`),
        api.get<any>(`/factories/${fid}/breakdowns`),
      ])
      if (woRes.status === "fulfilled" && woRes.value?.data) setWos(woRes.value.data)
      if (bRes.status === "fulfilled" && bRes.value?.data) setBreakdowns(bRes.value.data)
    } catch {
      notify("Failed to load plant maintenance data", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columnsWO: ColumnDef<any, any>[] = [
    { accessorKey: "wo_number", header: "WO Number", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "type", header: "Type", cell: (info) => <span className="uppercase font-semibold">{info.getValue()}</span> },
    { accessorKey: "priority", header: "Priority", cell: (info) => <Badge variant={info.getValue() === "high" ? "danger" : "warning"} size="sm">{info.getValue().toUpperCase()}</Badge> },
    { accessorKey: "assigned_to", header: "Assigned Technician", cell: (info) => <span>{info.getValue() || "Unassigned"}</span> },
    { accessorKey: "status", header: "Status", cell: (info) => <Badge variant="info" size="sm">{info.getValue().toUpperCase()}</Badge> },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Plant Asset Maintenance (PM & Calibration)</h1>
          <p className="text-xs text-slate-500">Preventive schedules, breakdown tickets, MTBF and MTTR metrics.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Create Work Order
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Machine Availability" value="94.2%" icon={<Clock className="w-5 h-5 text-emerald-700" />} color="green" />
        <StatCard label="Mean Time Between Failures (MTBF)" value="120 hrs" color="blue" />
        <StatCard label="Mean Time To Repair (MTTR)" value="2.5 hrs" color="purple" />
        <StatCard label="Open Work Orders" value={wos.length} icon={<Wrench className="w-5 h-5 text-amber-700" />} color="amber" />
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
          <Tabs.Trigger
            value="wos"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Work Orders Log
          </Tabs.Trigger>
          <Tabs.Trigger
            value="breakdowns"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Breakdown & Downtime Incidents
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="wos" className="outline-none">
          <Table data={wos} columns={columnsWO} isLoading={loading} emptyMessage="No active work orders." />
        </Tabs.Content>

        <Tabs.Content value="breakdowns" className="outline-none">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="text-base font-bold text-slate-900">Unscheduled Breakdown Log</h3>
            {breakdowns.length > 0 ? (
              breakdowns.map((b) => (
                <div key={b.id} className="p-3 border rounded border-amber-200 bg-amber-50">
                  <span className="font-bold">{b.description}</span> — Duration: {b.duration_hours} hrs
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">Zero unplanned breakdowns logged today.</p>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
