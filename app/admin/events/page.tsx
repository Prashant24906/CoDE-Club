"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AdminNavbar } from "@/components/admin-navbar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDropzone } from "react-dropzone"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import ImageCropperDialog from "@/components/image-cropper-dialog"

type EventItem = {
  id: string
  title: string
  date: string
  location?: string
  description: string
  image?: string
  googleFormLink?: string
}

const STORAGE_KEY = "cc_events"

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([])

  // Add form state (accordion)
  const [aTitle, setATitle] = useState("")
  const [aDate, setADate] = useState("")
  const [aLocation, setALocation] = useState("")
  const [aDescription, setADescription] = useState("")
  const [aGoogleForm, setAGoogleForm] = useState("")
  const [aImage, setAImage] = useState<string | undefined>(undefined)

  // Edit modal state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [eTitle, setETitle] = useState("")
  const [eDate, setEDate] = useState("")
  const [eLocation, setELocation] = useState("")
  const [eDescription, setEDescription] = useState("")
  const [eGoogleForm, setEGoogleForm] = useState("")
  const [eImage, setEImage] = useState<string | undefined>(undefined)

  // Cropper state for add/edit
  const [addCropOpen, setAddCropOpen] = useState(false)
  const [addCropSrc, setAddCropSrc] = useState<string | null>(null)
  const [editCropOpen, setEditCropOpen] = useState(false)
  const [editCropSrc, setEditCropSrc] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as any[]
        setEvents(
          parsed.map((e) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            location: e.location || undefined,
            description: e.description || "",
            image: e.image || undefined,
            googleFormLink: e.googleFormLink || undefined,
          })),
        )
      }
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch {}
  }, [events])

  const addCanSave = useMemo(
    () => aTitle.trim().length > 2 && aDate.trim().length > 0 && aDescription.trim().length > 0,
    [aTitle, aDate, aDescription],
  )
  const editCanSave = useMemo(
    () => eTitle.trim().length > 2 && eDate.trim().length > 0 && eDescription.trim().length > 0,
    [eTitle, eDate, eDescription],
  )
  const addIsFuture = useMemo(() => {
    const d = parseYmd(aDate)
    return d ? d.getTime() > Date.now() : false
  }, [aDate])
  const editIsFuture = useMemo(() => {
    const d = parseYmd(eDate)
    return d ? d.getTime() > Date.now() : false
  }, [eDate])

  function resetAddForm() {
    setATitle("")
    setADate("")
    setALocation("")
    setADescription("")
    setAGoogleForm("")
    setAImage(undefined)
  }
  function resetEditForm() {
    setEditingId(null)
    setETitle("")
    setEDate("")
    setELocation("")
    setEDescription("")
    setEGoogleForm("")
    setEImage(undefined)
  }

  // Open cropper when adding image
  const onAddDrop = (files: File[]) => {
    const file = files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : undefined
      if (result) {
        setAddCropSrc(result)
        setAddCropOpen(true)
      }
    }
    reader.readAsDataURL(file)
  }

  // Open cropper when editing image
  const onEditDrop = (files: File[]) => {
    const file = files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : undefined
      if (result) {
        setEditCropSrc(result)
        setEditCropOpen(true)
      }
    }
    reader.readAsDataURL(file)
  }

  const {
    getRootProps: getAddRootProps,
    getInputProps: getAddInputProps,
    isDragActive: addDragActive,
  } = useDropzone({
    onDrop: onAddDrop,
    multiple: false,
    accept: { "image/*": [] },
  })
  const {
    getRootProps: getEditRootProps,
    getInputProps: getEditInputProps,
    isDragActive: editDragActive,
  } = useDropzone({
    onDrop: onEditDrop,
    multiple: false,
    accept: { "image/*": [] },
  })

  function addEvent() {
    if (!addCanSave) return
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now())
    setEvents((prev) => [
      {
        id,
        title: aTitle.trim(),
        date: aDate,
        location: aLocation.trim() || undefined,
        description: aDescription.trim(),
        image: aImage,
        googleFormLink: addIsFuture && aGoogleForm.trim() ? aGoogleForm.trim() : undefined,
      },
      ...prev,
    ])
    resetAddForm()
  }

  function openEdit(e: EventItem) {
    setEditingId(e.id)
    setETitle(e.title)
    setEDate(e.date)
    setELocation(e.location || "")
    setEDescription(e.description || "")
    setEGoogleForm(e.googleFormLink || "")
    setEImage(e.image || undefined)
    setEditOpen(true)
  }

  function saveEdit() {
    if (!editingId || !editCanSave) return
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === editingId
          ? {
              ...ev,
              title: eTitle.trim(),
              date: eDate,
              location: eLocation.trim() || undefined,
              description: eDescription.trim(),
              image: eImage,
              googleFormLink: editIsFuture && eGoogleForm.trim() ? eGoogleForm.trim() : undefined,
            }
          : ev,
      ),
    )
    setEditOpen(false)
    resetEditForm()
  }

  function deleteEvent(id: string) {
    if (!window.confirm("Delete this event?")) return
    setEvents((prev) => prev.filter((e) => e.id !== id))
    if (editingId === id) {
      setEditOpen(false)
      resetEditForm()
    }
  }

  // Local date helpers
  function formatYmd(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }
  function parseYmd(s: string): Date | null {
    if (!s) return null
    const [y, m, d] = s.split("-").map((v) => Number(v))
    if (!y || !m || !d) return null
    // Local midnight for stable comparisons without timezone shifts
    return new Date(y, m - 1, d)
  }

  // Derived Date objects for calendar selection
  const addSelectedDate = useMemo(() => (aDate ? (parseYmd(aDate) ?? undefined) : undefined), [aDate])
  const editSelectedDate = useMemo(() => (eDate ? (parseYmd(eDate) ?? undefined) : undefined), [eDate])

  return (
    <main className="mx-auto max-w-5xl px-4 pt-24 pb-8">
      <AdminNavbar />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Events</h1>
        <Button asChild variant="outline">
          <Link href="/admin">← Back to Admin</Link>
        </Button>
      </div>

      {/* Events list */}
      <Card className="glass-card mb-8 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Events</h2>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <div key={e.id} className="rounded-lg border border-border overflow-hidden bg-background/50">
                <div className="relative w-full bg-muted/30 overflow-hidden" style={{ paddingTop: "56.25%" }}>
                  {e.image ? (
                    <img
                      src={e.image || "/placeholder.svg"}
                      alt={e.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src="/event-thumbnail-placeholder.jpg"
                      alt="Event thumbnail placeholder"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-semibold truncate" title={e.title}>
                    {e.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground flex flex-col gap-0.5">
                    <span>{new Date(e.date).toLocaleDateString()}</span>
                    <span>{e.location || "TBD"}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(e)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteEvent(e.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Persistent Add Event section */}
      <Card className="glass-card rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Add New Event</h2>

        {/* Drag and drop upload area with crop controls */}
        <div
          {...getAddRootProps()}
          className={`mb-4 rounded-lg border border-dashed p-6 text-center transition ${
            addDragActive ? "bg-accent/10 border-accent" : "bg-background/50"
          }`}
        >
          <input {...getAddInputProps()} />
          {aImage ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-full rounded-md overflow-hidden" style={{ paddingTop: "56.25%" }}>
                <img
                  src={aImage || "/placeholder.svg"}
                  alt="Selected event"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    if (aImage) {
                      setAddCropSrc(aImage)
                      setAddCropOpen(true)
                    }
                  }}
                >
                  Edit Crop
                </Button>
                <label className="sr-only" htmlFor="add-image-input">
                  Replace image
                </label>
                <input
                  id="add-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(ev) => {
                    const file = ev.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const result = typeof reader.result === "string" ? reader.result : undefined
                      if (result) {
                        setAddCropSrc(result)
                        setAddCropOpen(true)
                      }
                    }
                    reader.readAsDataURL(file)
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("add-image-input")?.click()
                  }}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault()
                    setAImage(undefined)
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Upload event image</p>
              <p>Drag & drop here, or click to select</p>
            </div>
          )}
        </div>

        {/* Existing add form fields (Title, Date with Popover+Calendar, Location, Description, optional Google Form, buttons) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="a-title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="a-title"
              value={aTitle}
              onChange={(e) => setATitle(e.target.value)}
              placeholder="Hackathon 2025"
              className="glass rounded-md px-3 py-2"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="a-date" className="text-sm font-medium">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start font-normal bg-transparent"
                  id="a-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {aDate ? (
                    new Date(aDate).toLocaleDateString()
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={addSelectedDate}
                  onSelect={(d) => {
                    if (d) setADate(formatYmd(d))
                  }}
                  initialMonth={addSelectedDate ?? new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label htmlFor="a-location" className="text-sm font-medium">
              Location (optional)
            </label>
            <input
              id="a-location"
              value={aLocation}
              onChange={(e) => setALocation(e.target.value)}
              placeholder="Auditorium A"
              className="glass rounded-md px-3 py-2"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label htmlFor="a-desc" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="a-desc"
              value={aDescription}
              onChange={(e) => setADescription(e.target.value)}
              placeholder="Short details..."
              className="glass min-h-24 rounded-md px-3 py-2"
            />
          </div>

          {/* Show Google Form Link only for future dates */}
          {addIsFuture && (
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="a-gform" className="text-sm font-medium">
                Google Form Link (optional)
              </label>
              <input
                id="a-gform"
                value={aGoogleForm}
                onChange={(e) => setAGoogleForm(e.target.value)}
                placeholder="https://forms.google.com/..."
                className="glass rounded-md px-3 py-2"
              />
            </div>
          )}

          <div className="flex gap-2 sm:col-span-2">
            <Button onClick={addEvent} disabled={!addCanSave} className="bg-emerald-600 hover:bg-emerald-700">
              Submit
            </Button>
            <Button type="button" variant="secondary" onClick={resetAddForm}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Crop dialogs for Add & Edit */}
      <ImageCropperDialog
        open={addCropOpen}
        onOpenChange={setAddCropOpen}
        src={addCropSrc || "/placeholder.svg?height=512&width=512&query=event%20thumbnail"}
        onCropped={(dataUrl) => setAImage(dataUrl)}
        aspect={16 / 9}
        outputWidth={1280}
        outputHeight={720}
      />
      <ImageCropperDialog
        open={editCropOpen}
        onOpenChange={setEditCropOpen}
        src={editCropSrc || "/placeholder.svg?height=512&width=512&query=event%20thumbnail"}
        onCropped={(dataUrl) => setEImage(dataUrl)}
        aspect={16 / 9}
        outputWidth={1280}
        outputHeight={720}
      />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>

          <div
            {...getEditRootProps()}
            className={`mb-4 rounded-lg border border-dashed p-4 text-center transition ${
              editDragActive ? "bg-accent/10 border-accent" : "bg-background/50"
            }`}
          >
            <input {...getEditInputProps()} />
            {eImage ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-full rounded-md overflow-hidden" style={{ paddingTop: "56.25%" }}>
                  <img
                    src={eImage || "/placeholder.svg"}
                    alt="Selected event"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={(ev) => {
                      ev.preventDefault()
                      if (eImage) {
                        setEditCropSrc(eImage)
                        setEditCropOpen(true)
                      }
                    }}
                  >
                    Edit Crop
                  </Button>
                  <label className="sr-only" htmlFor="edit-image-input">
                    Replace image
                  </label>
                  <input
                    id="edit-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(ev) => {
                      const file = ev.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = () => {
                        const result = typeof reader.result === "string" ? reader.result : undefined
                        if (result) {
                          setEditCropSrc(result)
                          setEditCropOpen(true)
                        }
                      }
                      reader.readAsDataURL(file)
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(ev) => {
                      ev.preventDefault()
                      document.getElementById("edit-image-input")?.click()
                    }}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(ev) => {
                      ev.preventDefault()
                      setEImage(undefined)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Upload event image</p>
                <p>Drag & drop here, or click to select</p>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="e-title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="e-title"
                value={eTitle}
                onChange={(ev) => setETitle(ev.target.value)}
                className="glass rounded-md px-3 py-2"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="e-date" className="text-sm font-medium">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start font-normal bg-transparent"
                    id="e-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eDate ? (
                      new Date(eDate).toLocaleDateString()
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={editSelectedDate}
                    onSelect={(d) => {
                      if (d) setEDate(formatYmd(d))
                    }}
                    initialMonth={editSelectedDate ?? new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <label htmlFor="e-location" className="text-sm font-medium">
                Location (optional)
              </label>
              <input
                id="e-location"
                value={eLocation}
                onChange={(ev) => setELocation(ev.target.value)}
                className="glass rounded-md px-3 py-2"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="e-desc" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="e-desc"
                value={eDescription}
                onChange={(ev) => setEDescription(ev.target.value)}
                className="glass min-h-24 rounded-md px-3 py-2"
              />
            </div>

            {editIsFuture && (
              <div className="grid gap-2">
                <label htmlFor="e-gform" className="text-sm font-medium">
                  Google Form Link (optional)
                </label>
                <input
                  id="e-gform"
                  value={eGoogleForm}
                  onChange={(ev) => setEGoogleForm(ev.target.value)}
                  placeholder="https://forms.google.com/..."
                  className="glass rounded-md px-3 py-2"
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={!editCanSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
