import React, { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { RefreshCw, Factory as FactoryIcon, AlertTriangle, CheckCircle2 } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { StatCard } from "@/components/ui/StatCard"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { HealthGauge } from "@/components/ui/HealthGauge"

export default function CorporateCenter() {
  const navigate = useNavigate()
  const { setCurrentFactory, notify } = useAppStore()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadOverview = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>("/corporate/overview")
      if (res.success && res.data) {
        setData(res.data)
      }
    } catch {
      notify("Failed to load corporate overview", "error")
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => { loadOverview() }, [loadOverview])

  const handleSelectFactory = (f: any) => {
    setCurrentFactory(f)
    navigate(`/factory/${f.id}/dashboard`)
  }

  if (loading || !data) {
    return <div className="page-container p-8 font-semibold text-slate-500">Loading Corporate Multi-Plant View...</div>
  }

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Corporate Multi-Plant Control</h1>
          <p className="text-xs text-slate-500">Executive group-level synthesis across all regional manufacturing facilities.</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={loadOverview}>
          Refresh Network Data
        </Button>
      </div>

      {/* Group KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Output Network" value={data.group_kpis?.total_output || "18,450 units"} color="blue" />
        <StatCard label="Group Avg OEE" value={`${data.group_kpis?.avg_oee_pct || 84.2}%`} color="green" />
        <StatCard label="Group Avg OTIF" value={`${data.group_kpis?.avg_otif_pct || 94.8}%`} color="purple" />
        <StatCard label="Group First Pass Quality" value={`${data.group_kpis?.avg_quality_pct || 97.1}%`} color="amber" />
      </div>

      {/* Facilities Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Regional Facilities Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.factories?.map((f: any) => (
            <div
              key={f.id}
              onClick={() => handleSelectFactory(f)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{f.code}</span>
                    <Badge variant="success" size="sm" dot>{f.status.toUpperCase()}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{f.name}</h3>
                </div>
                <HealthGauge score={88} size="sm" showLabel={false} />
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Location: {f.location || "Central Regional Zone"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Alerts & Pending Decisions across all plants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Corporate System Critical Alerts">
          <div className="space-y-3 text-xs">
            {data.critical_alerts?.map((a: any) => (
              <div key={a.id} className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-900 font-medium">
                <div className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  {a.title}
                </div>
                <p className="mt-1">{a.message}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Corporate Decision Approval Pipeline">
          <div className="space-y-3 text-xs">
            {data.pending_decisions?.map((d: any) => (
              <div key={d.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900">{d.title}</div>
                <p className="text-slate-600">{d.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
