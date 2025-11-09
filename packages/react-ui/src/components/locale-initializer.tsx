import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { userHooks } from '@/hooks/user-hooks';
import { applyGoogleTranslateLanguage } from '@/lib/google-translate';

/**
 * Component that initializes i18n locale from user's saved preference
 * This ensures the user's language preference is applied on app startup
 * and all pieces are loaded in the correct language
 */
export function LocaleInitializer({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { data: currentUser } = userHooks.useCurrentUser();

  useEffect(() => {
    // Update i18n language when user's saved locale is loaded
    if (currentUser?.locale && currentUser.locale !== i18n.language) {
      i18n.changeLanguage(currentUser.locale);
      // Invalidate all piece queries to refetch with the correct locale
      // This ensures pieces are loaded in the user's preferred language from the start
      queryClient.invalidateQueries({ queryKey: ['piece'] });
      queryClient.invalidateQueries({ queryKey: ['pieces'] });
      queryClient.invalidateQueries({ queryKey: ['pieces-metadata'] });
    }
  }, [currentUser?.locale, i18n, queryClient]);

  useEffect(() => {
    if (currentUser?.locale) {
      applyGoogleTranslateLanguage(currentUser.locale);
    }
  }, [currentUser?.locale]);

  return <>{children}</>;
}

