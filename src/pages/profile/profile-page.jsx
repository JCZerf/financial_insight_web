import { useEffect, useState } from 'react'
import { User, Mail, Calendar } from 'lucide-react'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sidebar } from '@/components/layout/sidebar'
import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
import { HelpButton } from '@/components/dashboard/help-button'
import { cn } from '@/lib/utils'
import { fetchUserProfile, updateUserProfile } from '@/lib/api-client'
import { formatBirthDate, birthDateToApiDate } from '@/features/auth/lib/auth-validators'

function apiDateToBirthDate(apiDate) {
  if (!apiDate) return ''
  const [year, month, day] = apiDate.split('-')
  return `${day}${month}${year}`
}

function profileToFormData(data) {
  return {
    name: data?.name || '',
    birth_date: data?.birth_date ? formatBirthDate(apiDateToBirthDate(data.birth_date)) : '',
  }
}

export function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
  })
  const [initialFormData, setInitialFormData] = useState({
    name: '',
    birth_date: '',
  })
  const [userData, setUserData] = useState(null)
  const hasChanges = (
    formData.name.trim() !== initialFormData.name.trim()
    || formData.birth_date !== initialFormData.birth_date
  )

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchUserProfile()
        const nextFormData = profileToFormData(data)
        setUserData(data)
        setFormData(nextFormData)
        setInitialFormData(nextFormData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!hasChanges) return

    try {
      setUpdating(true)
      setError(null)
      setSuccess(null)
      
      await updateUserProfile({
        name: formData.name,
        birth_date: birthDateToApiDate(formData.birth_date),
      })
      
      setSuccess('Perfil atualizado com sucesso!')
      
      // Recarrega os dados
      const data = await fetchUserProfile()
      const nextFormData = profileToFormData(data)
      setUserData(data)
      setFormData(nextFormData)
      setInitialFormData(nextFormData)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'birth_date' ? formatBirthDate(value) : value 
    }))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/perfil"
      />
      
      <main className={cn(
        'flex-1 px-3 py-4 text-foreground transition-all duration-300 sm:px-4',
        sidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'
      )}>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
          <AuthenticatedHeader
            title="Perfil"
            description="Gerencie suas informações pessoais"
            user={userData}
          />

          {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Carregando perfil...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <p>{error}</p>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
              <p>{success}</p>
            </Alert>
          )}

          {!loading && userData && (
            <div className="grid gap-5 md:grid-cols-3">
              {/* Informações da conta */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Informações da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <User className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {userData.name || 'Usuário'}
                      </p>
                      <p className="text-xs text-muted-foreground">Nome completo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-500/10 p-3">
                      <Mail className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{userData.email}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>

                  {userData.birth_date && (
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-500/10 p-3">
                        <Calendar className="size-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(userData.birth_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-muted-foreground">Data de nascimento</p>
                      </div>
                    </div>
                  )}

                  {userData.cpf && (
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-emerald-500/10 p-3">
                        <User className="size-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {userData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                        </p>
                        <p className="text-xs text-muted-foreground">CPF</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Formulário de edição */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Editar Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birth_date">Data de Nascimento</Label>
                      <Input
                        id="birth_date"
                        name="birth_date"
                        type="text"
                        value={formData.birth_date}
                        onChange={handleChange}
                        placeholder="02/08/1997"
                        inputMode="numeric"
                        maxLength={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        disabled
                        className="bg-muted cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        O email não pode ser alterado
                      </p>
                    </div>

                    {userData.cpf && (
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          name="cpf"
                          type="text"
                          value={userData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                          disabled
                          className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">
                          O CPF não pode ser alterado
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...initialFormData,
                          })
                          setError(null)
                          setSuccess(null)
                        }}
                        disabled={updating || !hasChanges}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={updating || !hasChanges}
                      >
                        {updating ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <HelpButton />
    </div>
  )
}
