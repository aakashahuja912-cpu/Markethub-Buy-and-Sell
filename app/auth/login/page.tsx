import { AuthForm } from '@/components/marketplace/auth-form'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Sign in' }
export default function LoginPage() { return <AuthForm mode="login" /> }
