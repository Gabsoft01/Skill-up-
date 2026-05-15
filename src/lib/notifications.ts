import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: 'proposal' | 'offer' | 'message' | 'payment' | 'system';
  relatedId?: string;
  link?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notifRef = doc(collection(db, 'notifications'));
    await setDoc(notifRef, {
      ...params,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'notifications');
  }
}
