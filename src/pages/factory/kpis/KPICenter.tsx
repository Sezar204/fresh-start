import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { BarChart2, Plus } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Sparkline } from "@/components/ui/Sparkline"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function KPICenter() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [kpis, setKpis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/kpis`)
      if (res.success && res.data) setKpis(res.data)
    } catch {
      notify("Failed to load KPI metrics", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">KPI Control Center</h1>
          <p className="text-xs text-slate-500">Executive performance targets, operational trends, and custom performance metrics.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Add Custom KPI
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((k) => (
          <Card key={k.id} className="border-l-4 border-l-emerald-500 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="info" size="sm">{k.kpi?.category || "General"}</Badge>
              <span className="text-[10px] font-bold text-slate-400 font-mono">{k.kpi?.code}</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{k.kpi?.name}</h4>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-slate-900">{k.value.toFixed(1)}{k.kpi?.unit}</span>
                <span className="text-xs font-semibold text-slate-500">Target: {k.kpi?.target_value}{k.kpi?.unit}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-600">On Target</span>
              <Sparkline data={k.trend || [80, 82, 85, 84, 88]} color="#16A34A" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
