import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function FeedbackAlert({ variant = 'default', title, description }) {
  const Icon = variant === 'destructive' ? AlertCircle : CheckCircle2

  return (
    <Alert variant={variant} className="rounded-2xl border">
      <Icon className="mt-0.5 size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
