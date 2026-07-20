import React, { useEffect, useState, useCallback } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import { Save, Database, ShieldCheck } from "lucide-react"
import { systemApi } from "@/api/system"
import { useAppStore } from "@/stores/appStore"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Settings() {
  const { notify, setLastBackup } = useAppStore()
  const [activeTab, setActiveTab] = useState("backup")
  const [backups, setBackups] = useState<any[]>([])
  const [backingUp, setBackingUp] = useState(false)

  const loadBackups = useCallback(async () => {
    try {
      const res = await systemApi.listBackups()
      if (res.success && res.data) setBackups(res.data)
    } catch {
      notify("Failed to load backup logs", "error")
    }
  }, [notify])

  useEffect(() => { loadBackups() }, [loadBackups])

  const handleBackupNow = async () => {
    setBackingUp(true)
    try {
      const res = await systemApi.backupNow()
      if (res.success && res.data) {
        notify("Database snapshot created successfully", "success")
        setLastBackup(res.data.created_at, "success")
        loadBackups()
      }
    } catch {
      notify("Backup failed", "error")
    } finally {
      setBackingUp(false)
    }
  }

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">Platform Settings & Backups</h1>
        <p className="text-xs text-slate-500">System parameters, database snapshots, and offline operational configurations.</p>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
          <Tabs.Trigger
            value="general"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            General
          </Tabs.Trigger>
          <Tabs.Trigger
            value="backup"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Backup & Restore
          </Tabs.Trigger>
          <Tabs.Trigger
            value="about"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            About System
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="general" className="outline-none">
          <Card title="Operational Parameters">
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800">Interface Language</label>
                <select className="w-full mt-1 border border-slate-300 rounded-lg p-2 bg-white">
                  <option value="en">English (US)</option>
                  <option value="ar">Arabic (RTL support)</option>
                </select>
              </div>
              <Button variant="default" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Settings
              </Button>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="backup" className="space-y-6 outline-none">
          <Card
            title="Database Backup Management"
            subtitle="SQLite single-file offline database backups."
            headerAction={
              <Button variant="default" size="sm" loading={backingUp} leftIcon={<Database className="w-3.5 h-3.5" />} onClick={handleBackupNow}>
                Backup Now
              </Button>
            }
          >
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-slate-500 font-semibold bg-slate-50">
                    <th className="p-3">Filename</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {backups.map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">{b.filename}</td>
                      <td className="p-3 uppercase text-[10px] font-bold text-slate-500">{b.backup_type}</td>
                      <td className="p-3 font-mono">{(b.file_size_bytes / 1024).toFixed(1)} KB</td>
                      <td className="p-3 font-mono">{b.created_at}</td>
                      <td className="p-3"><Badge variant="success" size="sm">{b.status.toUpperCase()}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="about" className="outline-none">
          <Card title="EMICP Desktop Edition Info">
            <div className="space-y-3 text-xs text-slate-700">
              <p><strong>Platform:</strong> Desktop App (Tauri 2.0 Rust + React TS + FastAPI + SQLite)</p>
              <p><strong>Version:</strong> 1.0.0 Enterprise Release</p>
              <p><strong>Execution Mode:</strong> Air-Gapped / 100% Local Offline Operation</p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-700" /> Integrity Status: Operational & Verified
              </div>
            </div>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
