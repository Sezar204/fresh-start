import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, ShieldAlert, Plus } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

export default function Quality() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [activeTab, setActiveTab] = useState("inspections")
  const [checks, setChecks] = useState<any[]>([])
  const [ncrs, setNcrs] = useState<any[]>([])
  const [capas, setCapas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [cRes, nRes, capRes] = await Promise.allSettled([
        api.get<any>(`/factories/${fid}/checks`),
        api.get<any>(`/factories/${fid}/ncr`),
        api.get<any>(`/factories/${fid}/capa`),
      ])
      if (cRes.status === "fulfilled" && cRes.value?.data) setChecks(cRes.value.data)
      if (nRes.status === "fulfilled" && nRes.value?.data) setNcrs(nRes.value.data)
      if (capRes.status === "fulfilled" && capRes.value?.data) setCapas(capRes.value.data)
    } catch {
      notify("Failed to load quality assurance metrics", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columnsChecks: ColumnDef<any, any>[] = [
    { accessorKey: "check_type", header: "Stage", cell: (info) => <Badge variant="info" size="sm">{info.getValue().toUpperCase()}</Badge> },
    { accessorKey: "sample_size", header: "Sample Qty", cell: (info) => <span>{info.getValue()}</span> },
    { accessorKey: "defects_found", header: "Defects", cell: (info) => <span className="font-bold text-red-600">{info.getValue()}</span> },
    { accessorKey: "defect_rate_pct", header: "Defect %", cell: (info) => <span className="font-bold">{info.getValue()}%</span> },
    { accessorKey: "status", header: "Result", cell: (info) => <Badge variant={info.getValue() === "passed" ? "success" : "danger"} size="sm">{info.getValue().toUpperCase()}</Badge> },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quality Assurance & Compliance</h1>
          <p className="text-xs text-slate-500">IQC incoming, IPQC process inspections, Non-Conformance (NCR) & CAPA tracking.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Record QC Inspection
        </Button>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
          <Tabs.Trigger
            value="inspections"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            QC Inspections Log
          </Tabs.Trigger>
          <Tabs.Trigger
            value="ncr"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Non-Conformance (NCR)
          </Tabs.Trigger>
          <Tabs.Trigger
            value="capa"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            CAPA Action Items
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="inspections" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Quality Audits" value={checks.length} icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />} color="green" />
            <StatCard label="Passed Rate" value="96.4%" color="blue" />
            <StatCard label="Open Quality Non-Conformances" value={ncrs.length} icon={<ShieldAlert className="w-5 h-5 text-red-600" />} color="red" />
          </div>
          <Table data={checks} columns={columnsChecks} isLoading={loading} emptyMessage="No quality checks logged today." />
        </Tabs.Content>

        <Tabs.Content value="ncr" className="space-y-6 outline-none">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Active Non-Conformance Reports</h3>
            {ncrs.map((n) => (
              <div key={n.id} className="p-4 rounded-lg border border-red-200 bg-red-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-red-900">{n.ncr_number} — {n.title}</span>
                  <Badge variant="danger" size="sm">{n.severity.toUpperCase()}</Badge>
                </div>
                <p className="text-slate-700">{n.description}</p>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="capa" className="space-y-6 outline-none">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Corrective & Preventive Actions</h3>
            {capas.map((c) => (
              <div key={c.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900">{c.capa_number}</span>
                  <Badge variant="warning" size="sm">{c.status.toUpperCase()}</Badge>
                </div>
                <p className="text-slate-700">{c.description}</p>
                <div className="text-slate-500 font-semibold">Assigned To: {c.responsible_person} | Target Due: {c.due_date}</div>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
