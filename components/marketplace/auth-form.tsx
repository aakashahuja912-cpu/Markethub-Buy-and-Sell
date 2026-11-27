'use client'

import { createClient } from '@/lib/supabase/client'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useState } from 'react'

type AuthMode = 'login' | 'sign-up' | 'forgot-password' | 'reset-password'
const copy: Record<AuthMode, { title: string; description: string; button: string }> = {
  login: { title: 'Welcome back', description: 'Sign in to pick up where you left off.', button: 'Sign in' },
  'sign-up': { title: 'Join the neighborhood', description: 'Create an account to save finds and list your own.', button: 'Create account' },
  'forgot-password': { title: 'Reset your password', description: 'We’ll send a secure reset link to your email.', button: 'Send reset link' },
  'reset-password': { title: 'Choose a new password', description: 'Use at least 8 characters for your new password.', button: 'Update password' },
}

function AuthFormInner({ mode }: { mode: AuthMode }) {
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next')
  const nextPath = nextParam?.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard'
  const text = copy[mode]

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim().toLowerCase()
    const password = String(form.get('password') ?? '')
    const supabase = createClient()

    try {
      if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
        router.replace(nextPath)
        router.refresh()
        return
      }
      if (mode === 'sign-up') {
        const fullName = String(form.get('fullName') ?? '').trim()
        const { error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/sign-up-success` } })
        if (authError) throw authError
        setNotice('Check your inbox for a confirmation link to finish creating your account.')
      } else if (mode === 'forgot-password') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password` })
        if (authError) throw authError
        setNotice('If an account exists for this address, a reset link is on its way.')
      } else {
        const { error: authError } = await supabase.auth.updateUser({ password })
        if (authError) throw authError
        setNotice('Your password is updated. You can continue to your account.')
        window.setTimeout(() => router.replace('/dashboard'), 800)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page page-container">
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="auth-kicker">MARKETHUB · YOUR LOCAL MARKET</p>
        <h1 id="auth-title">{text.title}</h1>
        <p className="auth-description">{text.description}</p>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'sign-up' && <label className="form-field">Your name<input autoComplete="name" name="fullName" required minLength={2} maxLength={80} placeholder="Aarav Sharma" /></label>}
          <label className="form-field">Email address<input autoComplete="email" name="email" type="email" required maxLength={254} placeholder="you@example.com" /></label>
          {mode !== 'forgot-password' && <label className="form-field">{mode === 'reset-password' ? 'New password' : 'Password'}<input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} name="password" type="password" required minLength={8} maxLength={72} placeholder="At least 8 characters" /></label>}
          {mode === 'login' && <div className="auth-options"><span>Secure email sign-in</span><Link className="auth-inline-link" href="/auth/forgot-password">Forgot password?</Link></div>}
          {error && <p role="alert" className="form-error">{error}</p>}
          {notice && <p role="status" className="form-success">{notice}</p>}
          <button className="primary-button" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={16} className="spin" /> Please wait…</> : <>{text.button}<ArrowRight size={15} /></>}</button>
        </form>
        <p className="auth-bottom">{mode === 'login' ? <>New to MarketHub? <Link href="/auth/sign-up">Create an account</Link></> : mode === 'sign-up' ? <>Already have an account? <Link href="/auth/login">Sign in</Link></> : <Link href="/auth/login">Back to sign in</Link>}</p>
      </section>
    </main>
  )
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  return <Suspense fallback={<main className="auth-page page-container"><div className="auth-card">Loading secure sign-in…</div></main>}><AuthFormInner mode={mode} /></Suspense>
}
