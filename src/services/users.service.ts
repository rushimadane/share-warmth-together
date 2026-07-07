import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  COLLECTIONS,
  profileCollectionFor,
  type GeoLocation,
  type UserProfile,
  type UserType,
} from "@/types/models";

export interface ResolvedProfile {
  userType: UserType;
  profile: UserProfile;
}

/**
 * Looks up a user's profile by uid, checking the donors collection first and
 * then recipients. Returns null if the user has no profile document yet.
 *
 * This is the single source of truth for "is this account a donor or a
 * recipient?" — previously duplicated across Login, Feed and MainHeader.
 */
export async function getUserProfile(
  uid: string
): Promise<ResolvedProfile | null> {
  const donorSnap = await getDoc(doc(db, COLLECTIONS.donors, uid));
  if (donorSnap.exists()) {
    return { userType: "donor", profile: donorSnap.data() as UserProfile };
  }

  const recipientSnap = await getDoc(doc(db, COLLECTIONS.recipients, uid));
  if (recipientSnap.exists()) {
    return {
      userType: "recipient",
      profile: recipientSnap.data() as UserProfile,
    };
  }

  return null;
}

/** Merges a captured location into the user's profile document. */
export async function saveUserLocation(
  uid: string,
  userType: UserType,
  location: GeoLocation
): Promise<void> {
  await setDoc(
    doc(db, profileCollectionFor(userType), uid),
    { geoPoint: location.geoPoint, geohash: location.geohash },
    { merge: true }
  );
}
