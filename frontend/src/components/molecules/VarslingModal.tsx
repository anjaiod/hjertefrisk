"use client";

import { Modal } from "../atoms/Modal";
import { useEffect, useState } from "react";
import { fetchNotifications, NotificationDto } from "@/lib/notifications";

interface VarslingModalProps {
  patientId?: number;
  patientName?: string;
  onClose: () => void;
}

export function VarslingModal({
  patientId,
  patientName,
  onClose,
}: VarslingModalProps) {
  const title = patientName ? `Varslinger – ${patientName}` : "Varslinger";
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationDto[]>([]);

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
  const visible = patientId
    ? items.filter((n) => n.patientId === patientId)
    : items;

  return (
    <Modal onClose={onClose} title={title}>
      {loading ? (
        <p className="text-slate-500 text-sm">Laster...</p>
      ) : visible.length === 0 ? (
        <p className="text-slate-500 text-sm">
          Ingen varslinger for denne pasienten.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((n) => (
            <li key={n.id} className="flex justify-between items-start">
              <div>
                <p className="font-medium">{n.message}</p>
                <p className="text-sm text-slate-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.read && (
                <span className="text-xs bg-brand-sky text-white px-2 rounded">
                  Ny
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
