'use client';



import { createContext, useContext } from 'react';

import {

  type UserProfile,

  emptyProfile,

  normalizeProfile,

  profileToFinancialSituation,

  profileToMlPayload,

  isProfileComplete,

  sumAssets,

  sumDebt,

  ASSET_FIELDS,

  DEBT_FIELDS,

} from '@/lib/user-profile';



export type { UserProfile, NullableAmount } from '@/lib/user-profile';

export {

  profileToFinancialSituation,

  profileToMlPayload,

  isProfileComplete,

  sumAssets,

  sumDebt,

  ASSET_FIELDS,

  DEBT_FIELDS,

};



export interface ProfileContextType {

  profile: UserProfile;

  setProfile: (profile: UserProfile) => void;

  profileReady: boolean;

  profileSaving: boolean;

}



export const defaultProfile: UserProfile = { ...emptyProfile };



export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);



export const useProfile = () => {

  const context = useContext(ProfileContext);

  if (context === undefined) {

    throw new Error('useProfile must be used within a ProfileProvider');

  }

  return context;

};



export { emptyProfile, normalizeProfile };

