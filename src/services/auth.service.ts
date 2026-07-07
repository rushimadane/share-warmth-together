import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { COLLECTIONS, type GeoLocation } from "@/types/models";

export interface DonorRegistration {
  email: string;
  password: string;
  restaurantName: string;
  phone: string;
  address: string;
  location: GeoLocation;
}

/** Creates a donor auth account and its `donors/{uid}` profile document. */
export async function registerDonor(input: DonorRegistration): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );

  await setDoc(doc(db, COLLECTIONS.donors, user.uid), {
    restaurantName: input.restaurantName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    geohash: input.location.geohash,
    geoPoint: input.location.geoPoint,
    userType: "donor",
    createdAt: new Date().toISOString(),
  });
}

export interface RecipientRegistration {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  organization?: string | null;
  darpanId?: string;
  foodPreferences?: string[];
  location: GeoLocation;
}

/** Creates a recipient auth account and its `recipients/{uid}` profile document. */
export async function registerRecipient(
  input: RecipientRegistration
): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );

  await setDoc(doc(db, COLLECTIONS.recipients, user.uid), {
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    organization: input.organization ?? null,
    ...(input.darpanId ? { darpanId: input.darpanId } : {}),
    ...(input.foodPreferences ? { foodPreferences: input.foodPreferences } : {}),
    geohash: input.location.geohash,
    geoPoint: input.location.geoPoint,
    userType: "recipient",
    createdAt: new Date().toISOString(),
  });
}
