import { useEffect, useRef, useState, useCallback } from 'react';

// Reads VITE_GOOGLE_CLIENT_ID from frontend/.env — when it is not set,
// this component renders nothing, so the app never breaks in demos.
export const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let gsiPromise = null;

// Loads the official Google Identity Services script once per page
const loadGoogleScript = () => {
  if (gsiPromise) return gsiPromise;

  gsiPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });

  return gsiPromise;
};

const GoogleButton = ({ onSuccess, text = 'continue_with' }) => {
  const divRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Keep the callback stable so initialize() is not re-run on every render
  const handleCredentialResponse = useCallback(
    (response) => {
      if (response?.credential) onSuccess(response.credential);
    },
    [onSuccess]
  );

  useEffect(() => {
    if (!GOOGLE_ENABLED) return undefined;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setReady(true);
      })
      .catch(() => {
        // Network blocked — button simply never appears
      });

    return () => {
      cancelled = true;
    };
  }, [handleCredentialResponse]);

  useEffect(() => {
    if (ready && divRef.current && window.google?.accounts?.id) {
      divRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(divRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text,
        width: 380,
        logo_alignment: 'left',
      });
    }
  }, [ready, text]);

  if (!GOOGLE_ENABLED) return null;

  return <div className="google-btn-wrap" ref={divRef} />;
};

export default GoogleButton;
