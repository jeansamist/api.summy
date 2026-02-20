import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Tailwind, Text } from '@react-email/components'

interface PasswordResetAlertEmailProps {
  firstName: string
  resetAt: string
}

export function PasswordResetAlertEmailTemplate({
  firstName,
  resetAt,
}: PasswordResetAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Security alert: Your Summy password was changed</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-20">
          <Container className="w-[680px] max-w-full mx-auto bg-white p-8">
            <Img
              src="https://web-summy.vercel.app/summy-logo.png"
              alt="Summy"
              width={112}
              className="mb-6"
            />
            <Heading className="text-2xl font-bold text-gray-800">Hello, {firstName}! 👋</Heading>
            <Text className="text-gray-600">
              Your password was changed on <strong>{resetAt}</strong>.
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              If you did not make this change, secure your account immediately.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
