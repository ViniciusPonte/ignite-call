'use client'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ConnectCalendar() {
  const session = useSession()
  const searchParams = useSearchParams()

  const hasAuthError = Boolean(searchParams.get('error'))
  const isSignedIn = session.status === 'authenticated'

  async function handleConnectGoogle() {
    await signIn('google')
  }

  const router = useRouter()

  async function handleNavigateToNextStep() {
    router.push('/register/time-intervals')
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2}></MultiStep>
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {isSignedIn ? (
            <Button type="submit" variant="secondary" size="sm" disabled>
              Conectado <Check />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              onClick={handleConnectGoogle}
            >
              Conectar <ArrowRight />
            </Button>
          )}
        </ConnectItem>
        {hasAuthError && (
          <AuthError size="sm">
            Falha ao se conectar ao google, verifique se você habilitou as
            permissões de acesso ao Google Calendar
          </AuthError>
        )}
        <Button
          type="submit"
          disabled={!isSignedIn}
          onClick={handleNavigateToNextStep}
        >
          Próximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
