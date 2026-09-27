import { http } from '../../api/http';
import type { MembershipCard } from '../../api/types';

export const membershipCardApi = {
  myCard: () => http.get<MembershipCard>('/membership-card/me').then((r) => r.data),
};
