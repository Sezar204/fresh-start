import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Wrench } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Machine } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { SearchBar } from "@/components/ui/SearchBar"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { SlideOver } from "@/components/ui/SlideOver"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"

const schema = z.object({
  code: z.string().min(2, "Code required"),
  name: z.string().min(2, "Name required"),
  criticality: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["active", "idle", "maintenance", "down"]),
})

type FormValues = z.infer<typeof schema>

export default function Machines() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [items, setItems] = useState<Machine[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSlideOpen, setIsSlideOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { criticality: "medium", status: "active" },
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/machines`)
      if (res.success && res.data) setItems(res.data)
    } catch {
      notify("Failed to load machine registry", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const res = await api.post<any>(`/factories/${fid}/machines`, values)
      if (res.success) {
        notify("Machine created", "success")
        setIsSlideOpen(false)
        reset()
        loadData()
      }
    } catch {
      notify("Error creating machine", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnDef<Machine, any>[] = [
    { accessorKey: "code", header: "Code", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "name", header: "Machine Name", cell: (info) => <span className="font-semibold">{info.getValue()}</span> },
    { accessorKey: "criticality", header: "Criticality", cell: (info) => <Badge variant={info.getValue() === "critical" ? "danger" : "info"} size="sm">{info.getValue().toUpperCase()}</Badge> },
    { accessorKey: "status", header: "Status", cell: (info) => <Badge variant={info.getValue() === "active" ? "success" : "warning"} size="sm" dot>{info.getValue().toUpperCase()}</Badge> },
  ]

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Machine Registry</h1>
          <p className="text-xs text-slate-500">Track industrial equipment, status and maintenance criticality.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsSlideOpen(true)}>Add Machine</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Equipment" value={items.length} icon={<Wrench className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Active" value={items.filter((i) => i.status === "active").length} color="green" />
        <StatCard label="In Maintenance" value={items.filter((i) => i.status === "maintenance").length} color="amber" />
        <StatCard label="Down / Breakdown" value={items.filter((i) => i.status === "down").length} color="red" />
      </div>

      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search machinery..." />
        <Table data={filtered} columns={columns} isLoading={loading} emptyMessage="No machines registered." />
      </div>

      <SlideOver open={isSlideOpen} onClose={() => setIsSlideOpen(false)} title="Add Industrial Machine" footer={<><Button variant="outline" size="sm" onClick={() => setIsSlideOpen(false)}>Cancel</Button><Button variant="default" size="sm" loading={submitting} onClick={handleSubmit(onSubmit)}>Save</Button></>}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Code" required placeholder="MAC-101" error={errors.code?.message} {...register("code")} />
          <Input label="Name" required placeholder="Rotary Filler Station" error={errors.name?.message} {...register("name")} />
          <Select label="Criticality" options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "critical", label: "Critical" }]} {...register("criticality")} />
          <Select label="Status" options={[{ value: "active", label: "Active" }, { value: "idle", label: "Idle" }, { value: "maintenance", label: "Maintenance" }, { value: "down", label: "Down" }]} {...register("status")} />
        </form>
      </SlideOver>
    </div>
  )
}
