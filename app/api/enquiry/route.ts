import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, service, address } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !service) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: firstName, lastName, email, and service are required.' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Europe/London',
    });

    const { error } = await resend.emails.send({
      from: 'Eco Expert Services <notifications@ecoexpertservices.co.uk>',
      to: 'ecoexpertservices@gmail.com',
      reply_to: email,
      subject: `New enquiry - ${service}`,
      text: [
        `New Enquiry Received`,
        ``,
        `Timestamp: ${timestamp}`,
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Service: ${service}`,
        `Address: ${address || 'Not provided'}`,
      ].join('\n'),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Enquiry API error:', err);
    return NextResponse.json(
      { ok: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
