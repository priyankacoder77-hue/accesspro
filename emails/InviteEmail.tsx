import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface InviteEmailProps {
  inviteUrl: string
  orgName: string
  inviterEmail: string
}

export function InviteEmail({ inviteUrl, orgName, inviterEmail }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {orgName} on AccessPro</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Heading style={brandStyle}>AccessPro</Heading>
          </Section>

          {/* Main content */}
          <Section style={contentStyle}>
            <Heading style={headingStyle}>You've been invited</Heading>
            <Text style={textStyle}>
              <strong style={highlightStyle}>{inviterEmail}</strong> has invited you to join{' '}
              <strong style={highlightStyle}>{orgName}</strong> as a Manager on AccessPro.
            </Text>
            <Text style={textStyle}>
              Click the button below to accept your invitation and set up your account. This invite
              expires in 24 hours.
            </Text>

            {/* CTA Button */}
            <Section style={buttonSectionStyle}>
              <Button href={inviteUrl} style={buttonStyle}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={smallTextStyle}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={linkTextStyle}>{inviteUrl}</Text>
          </Section>

          <Hr style={dividerStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              If you didn't expect this invitation, you can safely ignore this email.
            </Text>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} AccessPro. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#0a0a0f',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  margin: '0',
  padding: '0',
}

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px 20px',
}

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
}

const brandStyle: React.CSSProperties = {
  color: '#6366f1',
  fontSize: '24px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  margin: '0',
}

const contentStyle: React.CSSProperties = {
  backgroundColor: '#111118',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '40px 36px',
}

const headingStyle: React.CSSProperties = {
  color: '#f0f0ff',
  fontSize: '22px',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  margin: '0 0 16px',
}

const textStyle: React.CSSProperties = {
  color: '#8888aa',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const highlightStyle: React.CSSProperties = {
  color: '#f0f0ff',
}

const buttonSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0',
}

const buttonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '14px 32px',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-block',
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
}

const smallTextStyle: React.CSSProperties = {
  color: '#555570',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0 0 8px',
}

const linkTextStyle: React.CSSProperties = {
  color: '#6366f1',
  fontSize: '13px',
  wordBreak: 'break-all',
  margin: '0',
}

const dividerStyle: React.CSSProperties = {
  borderColor: 'rgba(255, 255, 255, 0.08)',
  margin: '32px 0',
}

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
}

const footerTextStyle: React.CSSProperties = {
  color: '#555570',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 4px',
}
