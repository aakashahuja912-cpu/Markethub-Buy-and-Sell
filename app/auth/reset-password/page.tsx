import { AuthForm } from '@/components/marketplace/auth-form'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Choose a new password' }
export default function ResetPasswordPage() { return <AuthForm mode="reset-password" /> }
