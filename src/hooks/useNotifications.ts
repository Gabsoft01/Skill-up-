import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'proposal' | 'offer' | 'message' | 'payment' | 'system';
  isRead: boolean;
  relatedId?: string;
  link?: string;
  createdAt: any;
}

export function useNotifications() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      let unread = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Notification, 'id'>;
        notifs.push({ id: doc.id, ...data });
        if (!data.isRead) {
          unread++;
        }
      });
      
      setNotifications(notifs);
      setUnreadCount(unread);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'notifications');
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${notificationId}`);
    }
  };

  const markAllAsRead = async () => {
    // Note: In a production app with many notifications, this might be better as a batch commit
    // or a Cloud Function to avoid many concurrent client writes, but this works for our scope.
    const unreadNotifs = notifications.filter(n => !n.isRead);
    
    for (const notif of unreadNotifs) {
      try {
        await updateDoc(doc(db, 'notifications', notif.id), {
          isRead: true
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `notifications/${notif.id}`);
      }
    }
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
