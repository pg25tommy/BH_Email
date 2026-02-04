import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}


function wrapInTemplate(bodyHtml: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #c19a6b, #a67c52); padding: 24px; text-align: center;">
        <h1 style="color: #f97316; margin: 0; font-family: 'Arial Black', Arial, sans-serif; font-size: 28px; letter-spacing: 2px;">
          BURGER HEAVEN
        </h1>
      </div>
      <div style="padding: 32px 24px;">
        ${bodyHtml}
      </div>
      <div style="background: #3d2d1c; padding: 20px; text-align: center; color: #d4b896; font-size: 12px;">
        <p style="margin: 0 0 8px 0;">Burger Heaven | 77 10th St, New Westminster, BC V3M 3X4</p>
        <p style="margin: 0;">604.522.8339 | To unsubscribe, reply to this email or contact us directly.</p>
      </div>
    </div>
  `;
}

function personalizeBody(body: string, firstName: string, lastName: string | null): string {
  return body
    .replace(/\{\{firstName\}\}/g, firstName)
    .replace(/\{\{lastName\}\}/g, lastName || '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, body: emailBody, subscriberIds } = body;

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      );
    }

    const where: { active: boolean; id?: { in: string[] } } = { active: true };
    if (subscriberIds && subscriberIds.length > 0) {
      where.id = { in: subscriberIds };
    }

    const subscribers = await prisma.subscriber.findMany({ where });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers to send to' },
        { status: 400 }
      );
    }

    const emailLog = await prisma.emailLog.create({
      data: {
        subject,
        body: emailBody,
        recipientCount: subscribers.length,
      },
    });

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const personalizedBody = personalizeBody(emailBody, subscriber.firstName, subscriber.lastName);
      const html = wrapInTemplate(personalizedBody);

      try {
        const { error } = await getResend().emails.send({
          from: process.env.EMAIL_FROM || 'Burger Heaven <onboarding@resend.dev>',
          to: [subscriber.email],
          subject,
          html,
        });

        const status = error ? 'failed' : 'sent';
        if (error) {
          failed++;
          console.error(`Failed to send to ${subscriber.email}:`, error);
        } else {
          sent++;
        }

        await prisma.emailRecipient.create({
          data: {
            emailLogId: emailLog.id,
            subscriberId: subscriber.id,
            status,
          },
        });
      } catch (err) {
        failed++;
        console.error(`Error sending to ${subscriber.email}:`, err);

        await prisma.emailRecipient.create({
          data: {
            emailLogId: emailLog.id,
            subscriberId: subscriber.id,
            status: 'failed',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      emailLogId: emailLog.id,
      sent,
      failed,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
