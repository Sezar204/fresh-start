import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Clock } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Shift } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SlideOver } from "@/components/ui/SlideOver"
import { Input } from "@/components/ui/Input"

const schema = z.object({
  name: z.string().min(2, "Name required"),
  start_time: z.string().min(1, "Start time required"),
  end_time: z.string().min(1, "End time required"),
  headcount: z.coerce.number().min(1),
})

type FormValues = z.infer<typeof schema>

export default function Shifts() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [items, setItems] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [isSlideOpen, setIsSlideOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { headcount: 10, start_time: "08:00", end_time: "16:00" },
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/shifts`)
      if (res.success && res.data) setItems(res.data)
    } catch {
      notify("Failed to load shift patterns", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const res = await api.post<any>(`/factories/${fid}/shifts`, values)
      if (res.success) {
        notify("Shift created", "success")
        setIsSlideOpen(false)
        reset()
        loadData()
      }
    } catch {
      notify("Error creating shift", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnDef<Shift, any>[] = [
    { accessorKey: "name", header: "Shift Name", cell: (info) => <span className="font-bold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "start_time", header: "Start", cell: (info) => <span className="font-mono">{info.getValue()}</span> },
    { accessorKey: "end_time", header: "End", cell: (info) => <span className="font-mono">{info.getValue()}</span> },
    { accessorKey: "headcount", header: "Planned Headcount", cell: (info) => <span className="font-bold text-blue-700">{info.getValue()} Workers</span> },
    { accessorKey: "is_active", header: "Active", cell: (info) => <Badge variant={info.getValue() ? "success" : "muted"} size="sm">{info.getValue() ? "ACTIVE" : "INACTIVE"}</Badge> },
  ]

  const totalHeadcount = items.reduce((acc, curr) => acc + curr.headcount, 0)

  return (
    <div className="page-container space-y-6 bg-slate-50 pb-12 select-none">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Work Shifts & Schedules</h1>
          <p className="text-xs text-slate-500">Configure factory shift hours, breaks, and workforce allocations.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsSlideOpen(true)}>Add Shift</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Configured Shifts" value={items.length} icon={<Clock className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Active Shifts" value={items.filter((i) => i.is_active).length} color="green" />
        <StatCard label="Combined Headcount Capacity" value={`${totalHeadcount} Staff`} color="purple" />
      </div>

      <Table data={items} columns={columns} isLoading={loading} emptyMessage="No shift schedules configured." />

      <SlideOver open={isSlideOpen} onClose={() => setIsSlideOpen(false)} title="Add Work Shift" footer={<><Button variant="outline" size="sm" onClick={() => setIsSlideOpen(false)}>Cancel</Button><Button variant="default" size="sm" loading={submitting} onClick={handleSubmit(onSubmit)}>Save</Button></>}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Shift Name" required placeholder="Morning Shift" error={errors.name?.message} {...register("name")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time" required error={errors.start_time?.message} {...register("start_time")} />
            <Input label="End Time" type="time" required error={errors.end_time?.message} {...register("end_time")} />
          </div>
          <Input label="Required Headcount" type="number" required error={errors.headcount?.message} {...register("headcount")} />
        </form>
      </SlideOver>
    </div>
  )
}
