"use client"
import AdminNavbar from "@/components/admin-navbar" // Declaring AdminNavbar here
import { useDropzone } from "react-dropzone"

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { useMemo } from "react"

import { useEffect } from "react"

import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageCropperDialog from "@/components/image-cropper-dialog"
import Image from "next/image"
import Link from "next/link"

type Member = {
  id: string
  name: string
  role: string
  department?: string
  // old data may only have avatarUrl; new adds avatarDataUrl from file uploads
  avatarUrl?: string
  avatarDataUrl?: string
  isLead?: boolean
}

const STORAGE_KEY = "cc_members"

// Default departments per user request
const DEFAULT_DEPARTMENTS = [
  "Core Leadership",
  "Tech",
  "Marketing",
  "Documentation",
  "Logistics",
  "Design Department",
] as const

export default function MembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([])

  // Add form state
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [deptOptions, setDeptOptions] = useState<string[]>([...DEFAULT_DEPARTMENTS])
  const [department, setDepartment] = useState<string>(DEFAULT_DEPARTMENTS[0])
  const [addingCustomDept, setAddingCustomDept] = useState(false)
  const [customDept, setCustomDept] = useState("")
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(undefined)
  const [isLead, setIsLead] = useState(false)

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [eName, setEName] = useState("")
  const [eRole, setERole] = useState("")
  const [eDepartment, setEDepartment] = useState<string>(DEFAULT_DEPARTMENTS[0])
  const [eAddingCustomDept, setEAddingCustomDept] = useState(false)
  const [eCustomDept, setECustomDept] = useState("")
  const [eAvatarDataUrl, setEAvatarDataUrl] = useState<string | undefined>(undefined)
  const [eIsLead, setEIsLead] = useState(false)

  // Crop dialog state
  const [cropOpen, setCropOpen] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  const [editCropOpen, setEditCropOpen] = useState(false)
  const [editCropSrc, setEditCropSrc] = useState<string | null>(null)
  const [editZoom, setEditZoom] = useState(1)

  const {
    getRootProps: getAddRootProps,
    getInputProps: getAddInputProps,
    isDragActive: addDragActive,
  } = useDropzone({
    onDrop: (files) => onAddFileChange(files?.[0]),
    multiple: false,
    accept: { "image/*": [] },
  })
  const {
    getRootProps: getEditRootProps,
    getInputProps: getEditInputProps,
    isDragActive: editDragActive,
  } = useDropzone({
    onDrop: (files) => onEditFileChange(files?.[0]),
    multiple: false,
    accept: { "image/*": [] },
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: Member[] = JSON.parse(raw)
        setMembers(parsed)
        // collect any existing departments into options
        const existingDepts = Array.from(new Set(parsed.map((m) => m.department).filter(Boolean) as string[]))
        if (existingDepts.length) {
          setDeptOptions((prev) => Array.from(new Set([...prev, ...existingDepts])))
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
    } catch {}
  }, [members])

  const canAdd = useMemo(
    () =>
      name.trim().length > 1 && role.trim().length > 1 && (addingCustomDept ? customDept.trim() : department.trim()),
    [name, role, department, addingCustomDept, customDept],
  )

  function resetAddForm() {
    setName("")
    setRole("")
    setDepartment(DEFAULT_DEPARTMENTS[0])
    setAddingCustomDept(false)
    setCustomDept("")
    setAvatarDataUrl(undefined)
    setIsLead(false)
  }

  async function addMember() {
    if (!canAdd) return
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now())

    const finalDept = addingCustomDept ? customDept.trim() : department
    if (addingCustomDept && finalDept && !deptOptions.includes(finalDept)) {
      setDeptOptions((prev) => [...prev, finalDept])
    }

    let finalAvatar = avatarDataUrl
    if (finalAvatar) {
      try {
        finalAvatar = await ensureSquareCover(finalAvatar)
      } catch {}
    }

    setMembers((prev) => [
      ...prev,
      {
        id,
        name: name.trim(),
        role: role.trim(),
        department: finalDept,
        avatarDataUrl: finalAvatar,
        isLead,
      },
    ])

    resetAddForm()
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function openEdit(m: Member) {
    setEditId(m.id)
    setEName(m.name)
    setERole(m.role)
    const dept = m.department || DEFAULT_DEPARTMENTS[0]
    setEDepartment(deptOptions.includes(dept) ? dept : DEFAULT_DEPARTMENTS[0])
    setEAddingCustomDept(!deptOptions.includes(dept) && !!m.department)
    setECustomDept(!deptOptions.includes(dept) ? dept : "")
    setEAvatarDataUrl(m.avatarDataUrl || m.avatarUrl)
    setEIsLead(!!m.isLead)
    setEditOpen(true)
  }

  async function saveEdit() {
    if (!editId) return
    const newDept = eAddingCustomDept ? eCustomDept.trim() : eDepartment
    if (eAddingCustomDept && newDept && !deptOptions.includes(newDept)) {
      setDeptOptions((prev) => [...prev, newDept])
    }

    let finalAvatar = eAvatarDataUrl
    if (finalAvatar) {
      try {
        finalAvatar = await ensureSquareCover(finalAvatar)
      } catch {}
    }

    setMembers((prev) =>
      prev.map((m) =>
        m.id === editId
          ? {
              ...m,
              name: eName.trim(),
              role: eRole.trim(),
              department: newDept,
              avatarDataUrl: finalAvatar,
              isLead: eIsLead,
            }
          : m,
      ),
    )
    setEditOpen(false)
    setEditId(null)
  }

  async function ensureSquareCover(imageSrc: string, size = 512): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(imageSrc)
          return
        }
        const iw = img.naturalWidth
        const ih = img.naturalHeight
        const scale = Math.max(size / iw, size / ih)
        const dw = iw * scale
        const dh = ih * scale
        const dx = (size - dw) / 2
        const dy = (size - dh) / 2
        ctx.drawImage(img, dx, dy, dw, dh)
        resolve(canvas.toDataURL("image/png"))
      }
      img.src = imageSrc
    })
  }

  function onAddFileChange(file?: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCropSrc(reader.result)
        setCropOpen(true)
      }
    }
    reader.readAsDataURL(file)
  }

  function onEditFileChange(file?: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditCropSrc(reader.result)
        setEditCropOpen(true)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pt-24 pb-8">
      <AdminNavbar />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Members</h1>
        <Button asChild variant="outline">
          <Link href="/admin">← Back to Admin</Link>
        </Button>
      </div>

      {/* Section 1: Manage Members (cards) */}
      <Card className="glass-card rounded-xl p-6 mb-8">
        <h2 className="mb-4 text-lg font-semibold">Members</h2>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No members yet. Use the form below to add new members.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => {
              const avatarSrc = m.avatarDataUrl || m.avatarUrl || "/member-avatar.jpg"
              return (
                <Card key={m.id} className="glass-card p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <Image
                        src={avatarSrc || "/placeholder.svg"}
                        alt={`${m.name} avatar`}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{m.name}</div>
                        <div className="truncate text-sm text-muted-foreground">{m.role}</div>
                        <div className="truncate text-xs text-muted-foreground/80">
                          {m.department || "—"} {m.isLead ? "• Lead" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Dialog
                        open={editOpen && editId === m.id}
                        onOpenChange={(o) => (!o ? setEditOpen(false) : openEdit(m))}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="secondary" onClick={() => openEdit(m)}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card rounded-xl">
                          <DialogHeader>
                            <DialogTitle>Edit Member</DialogTitle>
                          </DialogHeader>

                          <div className="grid gap-6">
                            {/* Big upload area with drag & drop and square preview */}
                            <div
                              {...getEditRootProps()}
                              className={`mx-auto w-full max-w-sm rounded-lg border-2 border-dashed p-4 text-center ${
                                editDragActive ? "border-accent bg-accent/10" : "border-border/60 glass"
                              }`}
                            >
                              <input {...getEditInputProps()} />
                              {eAvatarDataUrl ? (
                                <div className="flex flex-col items-center gap-3">
                                  <div
                                    className="relative w-56 overflow-hidden rounded-md"
                                    style={{ paddingTop: "100%" }}
                                  >
                                    <Image
                                      src={eAvatarDataUrl || "/placeholder.svg"}
                                      alt="Uploaded preview"
                                      fill
                                      className="absolute inset-0 h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <label className="sr-only" htmlFor="edit-avatar">
                                      Change photo
                                    </label>
                                    <Input
                                      id="edit-avatar"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(ev) => onEditFileChange(ev.target.files?.[0])}
                                    />
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => {
                                        if (eAvatarDataUrl) {
                                          setEditCropSrc(eAvatarDataUrl)
                                          setEditCropOpen(true)
                                        }
                                      }}
                                    >
                                      Edit Crop
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const input = document.getElementById("edit-avatar") as HTMLInputElement | null
                                        input?.click()
                                      }}
                                    >
                                      Replace
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEAvatarDataUrl(undefined)}>
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  <p className="mb-1 font-medium text-foreground">Upload member photo</p>
                                  <p>Drag & drop here, or click to select</p>
                                </div>
                              )}
                            </div>

                            {/* Name & Role */}
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="grid gap-2">
                                <Label htmlFor="e-name">Name</Label>
                                <Input
                                  id="e-name"
                                  value={eName}
                                  onChange={(e) => setEName(e.target.value)}
                                  placeholder="Jane Doe"
                                  className="glass"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="e-role">Role</Label>
                                <Input
                                  id="e-role"
                                  value={eRole}
                                  onChange={(e) => setERole(e.target.value)}
                                  placeholder="Team Member"
                                  className="glass"
                                />
                              </div>
                            </div>

                            {/* Department */}
                            <div className="grid gap-2">
                              <Label>Department</Label>
                              <Select
                                value={eAddingCustomDept ? "__custom__" : eDepartment}
                                onValueChange={(v) => {
                                  if (v === "__custom__") {
                                    setEAddingCustomDept(true)
                                  } else {
                                    setEAddingCustomDept(false)
                                    setEDepartment(v)
                                  }
                                }}
                              >
                                <SelectTrigger className="glass">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {deptOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="__custom__">+ Add new department</SelectItem>
                                </SelectContent>
                              </Select>
                              {eAddingCustomDept && (
                                <Input
                                  value={eCustomDept}
                                  onChange={(e) => setECustomDept(e.target.value)}
                                  placeholder="Type new department"
                                  className="glass"
                                />
                              )}
                            </div>

                            {/* Department head/lead Yes/No */}
                            <div className="grid gap-2">
                              <Label>Department Head/Lead</Label>
                              <Select value={eIsLead ? "yes" : "no"} onValueChange={(v) => setEIsLead(v === "yes")}>
                                <SelectTrigger className="glass">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <DialogFooter className="mt-2">
                            <Button variant="outline" onClick={() => setEditOpen(false)}>
                              Cancel
                            </Button>
                            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={saveEdit}>
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" variant="destructive" onClick={() => removeMember(m.id)}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </Card>

      {/* Section 2: Add Member (big upload area + form) */}
      <Card className="glass-card rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Add Member</h2>
        <AddForm
          deptOptions={deptOptions}
          setDeptOptions={setDeptOptions}
          name={name}
          setName={setName}
          role={role}
          setRole={setRole}
          department={department}
          setDepartment={setDepartment}
          addingCustomDept={addingCustomDept}
          setAddingCustomDept={setAddingCustomDept}
          customDept={customDept}
          setCustomDept={setCustomDept}
          avatarDataUrl={avatarDataUrl}
          onAddFileChange={onAddFileChange}
          isLead={isLead}
          setIsLead={setIsLead}
          onOpenCrop={() => {
            if (avatarDataUrl) {
              setCropSrc(avatarDataUrl)
              setCropOpen(true)
            }
          }}
          addDropzoneProps={{
            getAddRootProps,
            getAddInputProps,
            addDragActive,
          }}
        />
        <div className="mt-4">
          <Button onClick={addMember} disabled={!canAdd} className="bg-cyan-600 hover:bg-cyan-700">
            Add Member
          </Button>
        </div>
      </Card>

      {/* Crop dialogs for Add and Edit flows */}
      <ImageCropperDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        src={cropSrc || "/placeholder.svg"}
        onCropped={(dataUrl) => {
          setAvatarDataUrl(dataUrl)
        }}
        zoom={zoom}
        setZoom={setZoom}
        aspect={1}
        outputWidth={512}
        outputHeight={512}
      />
      <ImageCropperDialog
        open={editCropOpen}
        onOpenChange={setEditCropOpen}
        src={editCropSrc || "/placeholder.svg"}
        onCropped={(dataUrl) => {
          setEAvatarDataUrl(dataUrl)
        }}
        zoom={editZoom}
        setZoom={setEditZoom}
        aspect={1}
        outputWidth={512}
        outputHeight={512}
      />
    </main>
  )
}

function AddForm(props: {
  deptOptions: string[]
  setDeptOptions: (updater: (prev: string[]) => string[]) => void
  name: string
  setName: (v: string) => void
  role: string
  setRole: (v: string) => void
  department: string
  setDepartment: (v: string) => void
  addingCustomDept: boolean
  setAddingCustomDept: (v: boolean) => void
  customDept: string
  setCustomDept: (v: string) => void
  avatarDataUrl?: string
  onAddFileChange: (file?: File) => void
  isLead: boolean
  setIsLead: (v: boolean) => void
  onOpenCrop: () => void
  addDropzoneProps: {
    getAddRootProps: ReturnType<typeof useDropzone>["getRootProps"]
    getAddInputProps: ReturnType<typeof useDropzone>["getInputProps"]
    addDragActive: boolean
  }
}) {
  const {
    deptOptions,
    name,
    setName,
    role,
    setRole,
    department,
    setDepartment,
    addingCustomDept,
    setAddingCustomDept,
    customDept,
    setCustomDept,
    avatarDataUrl,
    onAddFileChange,
    isLead,
    setIsLead,
    onOpenCrop,
    addDropzoneProps: { getAddRootProps, getAddInputProps, addDragActive },
  } = props

  return (
    <div className="grid gap-6">
      {/* Big upload area with drag & drop and square preview */}
      <div
        {...getAddRootProps()}
        className={`mx-auto w-full max-w-sm rounded-lg border-2 border-dashed p-4 text-center ${
          addDragActive ? "border-accent bg-accent/10" : "border-border/60 glass"
        }`}
      >
        <input {...getAddInputProps()} />
        {avatarDataUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-56 overflow-hidden rounded-md" style={{ paddingTop: "100%" }}>
              <Image
                src={avatarDataUrl || "/placeholder.svg"}
                alt="Uploaded preview"
                fill
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="avatar">
                Change photo
              </label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(ev) => onAddFileChange(ev.target.files?.[0])}
              />
              <Button size="sm" variant="secondary" onClick={onOpenCrop}>
                Edit Crop
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const input = document.getElementById("avatar") as HTMLInputElement | null
                  input?.click()
                }}
              >
                Replace
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onAddFileChange(undefined)}>
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Upload member photo</p>
            <p>Drag & drop here, or click to select</p>
          </div>
        )}
      </div>

      {/* Name & Role */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="glass"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Team Member"
            className="glass"
          />
        </div>
      </div>

      {/* Department */}
      <div className="grid gap-2">
        <Label>Department</Label>
        <Select
          value={addingCustomDept ? "__custom__" : department}
          onValueChange={(v) => {
            if (v === "__custom__") {
              setAddingCustomDept(true)
            } else {
              setAddingCustomDept(false)
              setDepartment(v)
            }
          }}
        >
          <SelectTrigger className="glass">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {deptOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
            <SelectItem value="__custom__">+ Add new department</SelectItem>
          </SelectContent>
        </Select>
        {addingCustomDept && (
          <Input
            value={customDept}
            onChange={(e) => setCustomDept(e.target.value)}
            placeholder="Type new department"
            className="glass"
          />
        )}
      </div>

      {/* Department head/lead Yes/No */}
      <div className="grid gap-2">
        <Label>Department Head/Lead</Label>
        <Select value={isLead ? "yes" : "no"} onValueChange={(v) => setIsLead(v === "yes")}>
          <SelectTrigger className="glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
