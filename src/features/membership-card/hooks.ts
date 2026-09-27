import { useQuery } from '@tanstack/react-query';
import { membershipCardApi } from './api';

export function useMyMembershipCard() {
  return useQuery({ queryKey: ['membership-card', 'me'], queryFn: membershipCardApi.myCard });
}
