import { db } from './index.ts';
import {
  events,
  seatingSections,
  news,
  announcements,
  bookings,
  tickets,
  payments,
  auditLogs,
  users,
} from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export async function fetchEventsFromDb() {
  try {
    return await db.select().from(events).orderBy(events.eventDate);
  } catch (error) {
    console.error('Failed to query events from Cloud SQL:', error);
    return null;
  }
}

export async function fetchSectionsFromDb() {
  try {
    return await db.select().from(seatingSections).orderBy(seatingSections.priceKes);
  } catch (error) {
    console.error('Failed to query seating sections from Cloud SQL:', error);
    return null;
  }
}

export async function fetchNewsFromDb() {
  try {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  } catch (error) {
    console.error('Failed to query news from Cloud SQL:', error);
    return null;
  }
}

export async function fetchAnnouncementsFromDb() {
  try {
    return await db.select().from(announcements).where(eq(announcements.isActive, true));
  } catch (error) {
    console.error('Failed to query announcements from Cloud SQL:', error);
    return null;
  }
}

export async function recordBookingInDb(bookingData: any, ticketList: any[]) {
  try {
    const [savedBooking] = await db.insert(bookings).values({
      bookingReference: bookingData.bookingReference,
      userId: bookingData.userId || 'usr_fan_01',
      eventId: bookingData.eventId,
      eventTitle: bookingData.eventTitle,
      eventDate: bookingData.eventDate,
      contactName: bookingData.contactName,
      contactEmail: bookingData.contactEmail,
      contactPhone: bookingData.contactPhone,
      nationalId: bookingData.nationalId,
      subtotalKes: bookingData.subtotalKes,
      levyFeeKes: bookingData.levyFeeKes,
      totalAmountKes: bookingData.totalAmountKes,
      status: bookingData.status,
    }).returning();

    for (const t of ticketList) {
      await db.insert(tickets).values({
        ticketNumber: t.ticketNumber,
        bookingReference: t.bookingReference,
        eventId: t.eventId,
        eventTitle: t.eventTitle,
        eventDate: t.eventDate,
        eventTime: t.eventTime,
        gatesOpenTime: t.gatesOpenTime,
        attendeeName: t.attendeeName,
        attendeeNationalId: t.attendeeNationalId,
        sectionCode: t.sectionCode,
        sectionName: t.sectionName,
        standLocation: t.standLocation,
        gateEntrance: t.gateEntrance,
        turnstileNumber: t.turnstileNumber,
        seatInfo: t.seatInfo,
        priceKes: t.priceKes,
        qrCodeHash: t.qrCodeHash,
        status: t.status,
      });
    }

    return savedBooking;
  } catch (error) {
    console.error('Failed to record booking in Cloud SQL:', error);
    return null;
  }
}

export async function recordPaymentInDb(paymentData: any) {
  try {
    const [savedPayment] = await db.insert(payments).values({
      checkoutRequestId: paymentData.checkoutRequestId,
      merchantRequestId: paymentData.merchantRequestId,
      bookingReference: paymentData.bookingReference,
      phoneNumber: paymentData.phoneNumber,
      amountKes: paymentData.amountKes,
      receiptNumber: paymentData.receiptNumber,
      status: paymentData.status,
    }).returning();
    return savedPayment;
  } catch (error) {
    console.error('Failed to record payment in Cloud SQL:', error);
    return null;
  }
}

export async function logAuditEvent(action: string, actorId?: string, targetResource?: string, details?: string) {
  try {
    await db.insert(auditLogs).values({
      action,
      actorId,
      targetResource,
      details,
    });
  } catch (error) {
    console.error('Failed to write audit log to Cloud SQL:', error);
  }
}
