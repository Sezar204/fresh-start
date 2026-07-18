import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { FileText, Download, FileSpreadsheet } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export default function Reports() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [reports, setReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadLibrary = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/reports/library`)
      if (res.success && res.data) {
        setReports(res.data)
        if (res.data.length > 0) setSelectedReport(res.data[0])
      }
    } catch {
      notify("Failed to load reports library", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadLibrary() }, [loadLibrary])

  const handleGenerate = async () => {
    if (!selectedReport) return
    try {
      const res = await api.post<any>(`/factories/${fid}/reports/generate`, { report_id: selectedReport.id })
      if (res.success && res.data) {
        setReportData(res.data)
        notify("Report compiled successfully", "success")
      }
    } catch {
      notify("Failed to compile report", "error")
    }
  }

  return (
    <div className="page-container flex flex-col md:flex-row gap-6 bg-slate-50 select-none pb-12">
      {/* Left List */}
      <div className="w-full md:w-64 space-y-2 shrink-0">
        <h2 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Available Reports</h2>
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => { setSelectedReport(r); setReportData(null); }}
            className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-semibold ${
              selectedReport?.id === r.id
                ? "bg-blue-800 text-white border-blue-800 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="font-bold">{r.title}</div>
            <div className={`text-[10px] ${selectedReport?.id === r.id ? "text-blue-200" : "text-slate-400"}`}>
              {r.category}
            </div>
          </button>
        ))}
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 space-y-6">
        {selectedReport && (
          <Card
            title={selectedReport.title}
            subtitle={selectedReport.description}
            headerAction={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}>Excel</Button>
                <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>PDF</Button>
                <Button variant="default" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />} onClick={handleGenerate}>
                  Generate
                </Button>
              </div>
            }
          >
            {reportData ? (
              <div className="overflow-x-auto text-xs space-y-4">
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md font-semibold">
                  Report generated at: {reportData.generated_at}
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-slate-500 font-semibold bg-slate-50">
                      <th className="p-3">Production Item / Line</th>
                      <th className="p-3">Planned Qty</th>
                      <th className="p-3">Actual Qty</th>
                      <th className="p-3">Adherence %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.preview.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold">{row.item}</td>
                        <td className="p-3">{row.planned}</td>
                        <td className="p-3">{row.actual}</td>
                        <td className="p-3 font-bold text-emerald-600">{row.adherence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center italic">Click "Generate" to compile real-time data table preview.</p>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
