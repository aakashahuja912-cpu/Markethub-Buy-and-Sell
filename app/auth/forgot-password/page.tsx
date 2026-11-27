import { AuthForm } from '@/components/marketplace/auth-form'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Reset your password' }
export default function ForgotPasswordPage() { return <AuthForm mode="forgot-password" /> }
