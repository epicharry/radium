import { useState, useEffect, useMemo } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import DashboardCard from './DashboardCard'
import DashboardButton from './DashboardButton'

const SECTION_IDS = ['hero', 'about', 'projects', 'skillset']

const defaultLayout = {
  hero: { order: 0 },
  about: { order: 1 },
  projects: { order: 2 },
  skillset: { order: 3 }
}

function SortableSection({ id, sectionName }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1
  }

  const sectionColors = {
    hero: 'from-orange-500/20 to-orange-500/10',
    about: 'from-blue-500/20 to-blue-500/10',
    projects: 'from-purple-500/20 to-purple-500/10',
    skillset: 'from-green-500/20 to-green-500/10'
  }

  const sectionBorders = {
    hero: 'border-orange-500/40',
    about: 'border-blue-500/40',
    projects: 'border-purple-500/40',
    skillset: 'border-green-500/40'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-6 rounded-xl border-2 ${sectionBorders[id]} bg-gradient-to-br ${sectionColors[id]} backdrop-blur-sm transition-all`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-4 left-4 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing bg-black/40 border border-white/10"
        title="Drag to reorder"
      >
        <GripVertical className="w-5 h-5 text-gray-300" />
      </div>
      <div className="pl-10">
        <h3 className="font-bold text-white text-lg capitalize mb-2">{sectionName}</h3>
        <p className="text-sm text-gray-400">Drag the handle to reorder this section</p>
      </div>
    </div>
  )
}

export default function LayoutEditor({ config, onLayoutChange, onSave, saving }) {
  const [layout, setLayout] = useState(() => {
    return config?.layout || defaultLayout
  })
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    if (config?.layout) {
      setLayout(prevLayout => {
        const configLayoutStr = JSON.stringify(config.layout)
        const prevLayoutStr = JSON.stringify(prevLayout)
        if (configLayoutStr !== prevLayoutStr) {
          return config.layout
        }
        return prevLayout
      })
    }
  }, [config?.layout])

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const sortedIds = [...SECTION_IDS].sort((a, b) => {
        const orderA = layout[a]?.order ?? SECTION_IDS.indexOf(a)
        const orderB = layout[b]?.order ?? SECTION_IDS.indexOf(b)
        return orderA - orderB
      })

      const oldIndex = sortedIds.indexOf(active.id)
      const newIndex = sortedIds.indexOf(over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(sortedIds, oldIndex, newIndex)
        const newLayout = { ...layout }

        newOrder.forEach((id, index) => {
          newLayout[id] = {
            ...newLayout[id],
            order: index
          }
        })

        setLayout(newLayout)
        onLayoutChange(newLayout)
      }
    }
  }

  const sortedSections = useMemo(() => {
    return [...SECTION_IDS].sort((a, b) => {
      const orderA = layout[a]?.order ?? SECTION_IDS.indexOf(a)
      const orderB = layout[b]?.order ?? SECTION_IDS.indexOf(b)
      return orderA - orderB
    })
  }, [layout])

  const sectionNames = {
    hero: 'Hero Section',
    about: 'About Section',
    projects: 'Projects Section',
    skillset: 'Skillset Section'
  }

  return (
    <div className="space-y-6">
      <DashboardCard title="Section Order" description="Drag sections to reorder them on your page">
        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSections}
              strategy={verticalListSortingStrategy}
            >
              {sortedSections.map((id) => (
                <SortableSection
                  key={id}
                  id={id}
                  sectionName={sectionNames[id]}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="p-6 rounded-xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/20 to-orange-500/10 backdrop-blur-sm opacity-90">
                  <h3 className="font-bold text-white text-lg capitalize">{sectionNames[activeId]}</h3>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
        <div className="mt-6 flex justify-end">
          <DashboardButton
            onClick={onSave}
            loading={saving}
            variant="primary"
          >
            {saving ? 'Saving...' : 'Save Order'}
          </DashboardButton>
        </div>
      </DashboardCard>
    </div>
  )
}
