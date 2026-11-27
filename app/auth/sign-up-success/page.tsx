import { Check, Mail } from 'lucide-react'
import Link from 'next/link'
export default function SignUpSuccessPage() { return <main className="auth-page page-container"><section className="auth-card"><span className="empty-mark"><Mail size={22} /></span><p className="auth-kicker" style={{ marginTop: 18 }}>ONE MORE STEP</p><h1>Check your inbox</h1><p className="auth-description">We sent you a confirmation link. Verify your email to start exploring MarketHub.</p><Link className="primary-button" href="/auth/login"><Check size={16} /> Back to sign in</Link></section></main> }
