/**
 * Timestamp formatting utilities.
 *
 * All backend timestamps are stored/provided in ISO-8601 UTC format (suffixed
 * with "Z").  These helpers convert them to the browser's local timezone for
 * display using the user's own locale settings.
 *
 * If the input cannot be parsed as a valid date, the raw string is returned
 * as a fallback so that existing display code never crashes.
 */

/* ------------------------------------------------------------------ */
/*  Full date + time                                                  */
/* ------------------------------------------------------------------ */

export function formatTimestamp(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/*  Time only (HH:MM:SS)                                              */
/* ------------------------------------------------------------------ */

export function formatTimeOnly(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) {
      // The value may already be a localised time fragment (e.g. "18:02:44")
      // that came from mock data.  Return it verbatim.
      return iso;
    }
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/*  Short date (e.g. "Jul 15")                                        */
/* ------------------------------------------------------------------ */

export function formatDateShort(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/*  Relative time (e.g. "Updated just now", "2m ago", "1h ago")      */
/* ------------------------------------------------------------------ */

export function formatRelativeTime(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 10) return 'Updated just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return formatDateShort(iso);
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/*  Full date + time with relative fallback (for last-updated labels) */
/* ------------------------------------------------------------------ */

export function formatLastUpdated(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return `Updated ${formatRelativeTime(iso)}`;
  } catch {
    return iso;
  }
}
