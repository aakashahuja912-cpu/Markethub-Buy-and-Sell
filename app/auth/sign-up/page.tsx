import { AuthForm } from '@/components/marketplace/auth-form'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Create an account' }
export default function SignUpPage() { return <AuthForm mode="sign-up" /> }
