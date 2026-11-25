import { useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHydrationLocationState } from '@/contexts/renderState';
import { CONTACT_RETRY_COMPLETED, isCurrentContactRetry } from '@/lib/contactRetry';
import type { ContactDraft } from '@/types/contact';

interface RetryState { draft?: ContactDraft; retryRevision?: string }

export function useContactRetryState<T>() {
  const state = useHydrationLocationState<T & RetryState>();
  const location = useLocation();
  const navigate = useNavigate();
  const [, recheck] = useReducer(value => value + 1, 0);
  const stale = !!state?.draft && !isCurrentContactRetry(state);
  useEffect(() => {
    // Includes documents restored from the back/forward cache.
    const check = () => recheck();
    for (const event of ['pageshow', 'popstate', CONTACT_RETRY_COMPLETED]) window.addEventListener(event, check);
    return () => {
      for (const event of ['pageshow', 'popstate', CONTACT_RETRY_COMPLETED]) window.removeEventListener(event, check);
    };
  }, []);
  useEffect(() => {
    // A successful send can already have changed browser history while the
    // router is still committing its transition. Never replace that new entry.
    if (!stale || window.history.state?.key !== location.key) return;
    navigate({ pathname: location.pathname, search: location.search, hash: location.hash }, { replace: true, state: null });
  }, [stale, state, location.key, location.pathname, location.search, location.hash, navigate]);
  return stale ? null : state;
}
