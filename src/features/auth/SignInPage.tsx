import { useState, type FormEvent } from 'react'
import { BrandMark } from '../../components/BrandMark'
import { Button } from '../../components/Button'
import { FieldError } from '../../components/Callout'
import { TextField } from '../../components/TextField'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ModeTabs, type SignInMode } from './components/ModeTabs'
import { RevealKeyButton } from './components/RevealKeyButton'
import { useSignIn } from './useSignIn'

const helpText: Record<SignInMode, string> = {
  user: 'Your administrator gave you this key. It is shown only once when it is created.',
  admin: 'Admin keys are created during setup and work only from the LAN or VPN.',
}

export const SignInPage = () => {
  const [mode, setMode] = useState<SignInMode>('user')
  const [key, setKey] = useState('')
  const [isKeyVisible, setIsKeyVisible] = useState(false)
  const { submit, error, clearError, isPending } = useSignIn(mode)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit(key)
  }

  const switchMode = (next: SignInMode) => {
    setMode(next)
    clearError()
  }

  return (
    <div className="grid min-h-screen place-items-center px-5 py-10">
      <div className="fixed top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px]">
        <div className="animate-rise mb-7 grid justify-items-center gap-3 text-center">
          <BrandMark size={52} />
          <h1 className="text-gradient text-[30px] leading-tight font-semibold tracking-tight">
            EmailCheck
          </h1>
          <p className="max-w-[290px] text-[14px] text-ink-soft">
            Confirm an address exists before you send. No email is ever delivered.
          </p>
        </div>

        <div
          className="glass animate-rise rounded-2xl p-6 shadow-high"
          style={{ animationDelay: '90ms' }}
        >
          <ModeTabs mode={mode} onChange={switchMode} />

          <form onSubmit={handleSubmit} noValidate className="mt-5">
            <TextField
              label="API key"
              type={isKeyVisible ? 'text' : 'password'}
              autoComplete="off"
              placeholder="ev_…"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              trailing={
                <RevealKeyButton
                  isVisible={isKeyVisible}
                  onToggle={() => setIsKeyVisible((visible) => !visible)}
                />
              }
            />

            <FieldError>{error}</FieldError>

            <Button type="submit" fullWidth disabled={isPending} className="mt-4">
              {isPending ? 'Checking…' : mode === 'admin' ? 'Sign in as admin' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-soft">
            {helpText[mode]}
          </p>
        </div>
      </div>
    </div>
  )
}
