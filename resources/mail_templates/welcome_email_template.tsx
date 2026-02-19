import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  firstName: string
}

export function WelcomeEmailTemplate({ firstName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Hi {firstName}, start automate your life with Summy!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-20">
          <Container className="w-[680px] max-w-full mx-auto bg-white p-8">
            <Img
              src="https://web-summy.vercel.app/summy-logo.png"
              alt="Summy"
              width={112}
              className="mb-6"
            />
            <Heading className="text-2xl font-bold text-gray-800">Welcome, {firstName}! 👋</Heading>
            <Text className="text-gray-600">
              Thanks for signing up. Now you can start your journey with Summy. Your life automated
              by the power of AI.
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              Please ignore this email if you did not create an account.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
