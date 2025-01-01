import * as admin from "firebase-admin";

export async function isEventProcessed(eventId: string): Promise<boolean> {
  const db = admin.firestore();
  const doc = await db.collection("processedEvents").doc(eventId).get();
  return doc.exists;
}

// Hàm đánh dấu eventId là đã xử lý
export async function markEventProcessed(eventId: string): Promise<void> {
  const db = admin.firestore();
  await db.collection("processedEvents").doc(eventId).set({
    processed: true,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}
