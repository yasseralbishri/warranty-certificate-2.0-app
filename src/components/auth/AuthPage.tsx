import { LoginForm } from './LoginForm'
import { SupabaseSetupAlert } from '../SupabaseSetupAlert'

export function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SupabaseSetupAlert />
      <LoginForm />
    </div>
  )
}
