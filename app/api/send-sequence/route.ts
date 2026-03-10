import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { emails, toEmail, toName } = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0 || !toEmail) {
      return NextResponse.json(
        { error: 'emails array and toEmail are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Send the Day 1 email immediately
    const day1Email = emails[0];
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: toEmail,
      subject: day1Email.subject,
      text: day1Email.body,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      sentTo: toEmail,
      subject: day1Email.subject,
    });
  } catch (error) {
    console.error('Send sequence error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
