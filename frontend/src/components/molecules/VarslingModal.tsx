"use client";

import { Modal } from "../atoms/Modal";
import { Button } from "../atoms/Button";
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  NotificationDto,
} from "@/lib/notifications";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

interface VarslingModalProps {
  patientId?: number;
  patientName?: string;
  onClose: () => void;
  onAllRead?: () => void;
}

export function VarslingModal({
  patientId,
  patientName,
  onClose,
  onAllRead,
}: VarslingModalProps) {
  const title = patientName ? `Varslinger – ${patientName}` : "Varslinger";
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [items, setItems] = useState<NotificationDto[]>([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchNotifications();
        if (mounted) setItems(res);
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Only show notifications that belong to the supplied patientId (if any)
  const visible = (
    patientId ? items.filter((n) => n.patientId === patientId) : items
  ).filter((n) => {
    // If notification has been read and readAt exists, remove it after the end of that day
    if (n.read && n.readAt) {
      const readAt = new Date(n.readAt);
      const endOfDay = new Date(readAt);
      endOfDay.setHours(23, 59, 59, 999);
      return new Date() <= endOfDay;
    }
    return true;
  });

  const hasUnread = visible.some((n) => !n.read);

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsAsRead();
      const now = new Date().toISOString();
      setItems((prev) => prev.map((it) => ({ ...it, read: true, readAt: now })));
      onAllRead?.();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    } finally {
      setMarkingAll(false);
    }
  };

  // When clicking a notification: mark as read for current personnel and navigate to the answered query
  const handleOpenNotification = async (n: NotificationDto) => {
    const updated = items.map((it) =>
      it.id === n.id ? { ...it, read: true } : it,
    );
    setItems(updated);

    const stillUnread = (
      patientId ? updated.filter((it) => it.patientId === patientId) : updated
    ).some((it) => !it.read);
    if (!stillUnread) onAllRead?.();

    apiClient
      .post<void>(`/api/notifications/${n.id}/mark-read`)
      .catch((err) =>
        console.error("Failed to mark notification as read", err),
      );

    // navigate to the answered query if available and we have a selected patient
    if (n.answeredQueryId && patientId) {
      router.push(
        `/dashboard/behandlerSkjema?patientId=${patientId}&open=${n.answeredQueryId}`,
      );
    }

    // Close modal
    onClose();
  };

  return (
    <Modal onClose={onClose} title={title}>
      {loading ? (
        <p className="text-slate-500 text-sm">Laster...</p>
      ) : visible.length === 0 ? (
        <p className="text-slate-500 text-sm">
          Ingen nye varslinger for denne pasienten.
        </p>
      ) : (
        <>
          {hasUnread && (
            <div className="flex justify-end mb-3">
              <Button
                variant="confirm"
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-sm px-4! py-1.5!"
              >
                {markingAll ? "Markerer..." : "Les alle"}
              </Button>
            </div>
          )}
          <ul className="space-y-3">
            {visible.map((n) => (
              <li
                key={n.id}
                className={`flex justify-between items-start p-3 rounded border hover:bg-slate-50 transition cursor-pointer`}
                onClick={() => handleOpenNotification(n)}
              >
                <div>
                  <p
                    className={`${!n.read ? "font-semibold text-slate-900" : "text-slate-400 line-through"}`}
                  >
                    {n.message}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {n.read ? (
                    <span className="text-xs text-slate-400">Lest</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Modal>
  );
}
