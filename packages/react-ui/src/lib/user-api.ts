import { LocalesEnum, UserWithMetaInformationAndProject } from '@activepieces/shared';

import { api } from './api';

export const userApi = {
  getCurrentUser() {
    return api.get<UserWithMetaInformationAndProject>('/v1/users/me');
  },
  updateLocale(locale: LocalesEnum | undefined) {
    return api.post<{ locale: LocalesEnum | undefined }>('/v1/users/me/locale', {
      locale,
    });
  },
};
