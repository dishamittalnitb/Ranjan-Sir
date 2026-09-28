import { registry, type ActionHandler } from './registry'
import type { UIComponentSchema } from '../services/api'

interface DynamicRendererProps {
  components: UIComponentSchema[]
  onAction: ActionHandler
}

export function DynamicRenderer({ components, onAction }: DynamicRendererProps) {
  return (
    <div className="flex flex-col gap-6">
      {components.map((component, i) => {
        const Render = registry[component.type]
        if (!Render) {
          return (
            <div key={i} className="text-xs text-secondary font-mono">
              Unknown component: {component.type}
            </div>
          )
        }
        return <Render key={i} component={component} onAction={onAction} />
      })}
    </div>
  )
}
