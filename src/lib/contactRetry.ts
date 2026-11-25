// Only a non-sensitive completion revision is stored, scoped to this application
// and browser tab. Form fields remain exclusively in existing history state.
const key = `elmekawy:contact-retry:${import.meta.env.BASE_URL}`;
const initialRevision = '00000000-0000-0000-0000-000000000000';
export const CONTACT_RETRY_COMPLETED = 'elmekawy:contact-retry-completed';
let volatileRevision: string | undefined;

export function contactRetryRevision(): string {
  if (typeof window === 'undefined') return '';
  if (volatileRevision !== undefined) return volatileRevision;
  try {
    const storage = window.sessionStorage;
    const revision = storage.getItem(key) ?? initialRevision;
    // Verify writes too: readable storage may be full or read-only. Reserve the
    // same fixed-size marker used on completion before accepting any draft.
    storage.setItem(key, revision);
    return revision;
  } catch {
    // With storage denied, only drafts created in this document can be retried.
    // A fresh document must fail closed rather than resurrect a completed draft.
    return volatileRevision = window.crypto.randomUUID();
  }
}

export function completeContactRetry() {
  const revision = window.crypto.randomUUID();
  try {
    window.sessionStorage.setItem(key, revision);
    volatileRevision = undefined;
  } catch {
    volatileRevision = revision;
  }
  window.dispatchEvent(new Event(CONTACT_RETRY_COMPLETED));
}

export function isCurrentContactRetry(state: { retryRevision?: string }): boolean {
  // Existing pre-checkpoint drafts belong to the initial, uncompleted session.
  return (state.retryRevision ?? initialRevision) === contactRetryRevision();
}
