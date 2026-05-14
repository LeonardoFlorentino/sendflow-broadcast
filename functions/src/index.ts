import {setGlobalOptions} from "firebase-functions";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions/v2";
import {initializeApp} from "firebase-admin/app";
import {Timestamp, getFirestore} from "firebase-admin/firestore";

setGlobalOptions({maxInstances: 10, region: "southamerica-east1"});

initializeApp();

const DISPATCH_BATCH_LIMIT = 400;

export const dispatchScheduledMessages = onSchedule(
  {
    schedule: "every 1 minutes",
    timeZone: "America/Sao_Paulo",
  },
  async () => {
    const db = getFirestore();
    const now = Timestamp.now();

    const dueSnapshot = await db
      .collection("messages")
      .where("status", "==", "scheduled")
      .where("scheduledAt", "<=", now)
      .limit(DISPATCH_BATCH_LIMIT)
      .get();

    if (dueSnapshot.empty) {
      return;
    }

    const batch = db.batch();
    dueSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "sent",
        sentAt: now,
      });
    });

    await batch.commit();
    logger.info("Dispatched scheduled messages", {
      count: dueSnapshot.size,
    });
  },
);
