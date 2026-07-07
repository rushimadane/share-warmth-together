import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  GeoPoint,
} from "firebase/firestore";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
import { db } from "@/lib/firebase";
import {
  COLLECTIONS,
  type GeoLocation,
  type Post,
  type PostType,
  type UserType,
} from "@/types/models";

const DEFAULT_RADIUS_KM = 15;

/** Which post type a given user should SEE in their feed. */
export function feedPostTypeFor(userType: UserType): PostType {
  return userType === "donor" ? "request" : "offering";
}

/** The collection a post's creator lives in, derived from the post type. */
function creatorCollectionFor(postType: PostType): string {
  return postType === "offering" ? COLLECTIONS.donors : COLLECTIONS.recipients;
}

/**
 * Fetches available posts of `postType` within `radiusKm` of `center`,
 * enriched with each creator's name/phone/location.
 *
 * NOTE: the geohash-bounds query combines a range filter on `geohash` with
 * equality filters on `postType` + `status`, which requires a Firestore
 * composite index. If posts never load, check the console for an index link.
 */
export async function getNearbyPosts(
  center: GeoPoint,
  postType: PostType,
  radiusKm: number = DEFAULT_RADIUS_KM
): Promise<Post[]> {
  const centerTuple: [number, number] = [center.latitude, center.longitude];
  const bounds = geohashQueryBounds(centerTuple, radiusKm * 1000);
  const postsCol = collection(db, COLLECTIONS.posts);

  const queries = bounds.map((b) =>
    query(
      postsCol,
      orderBy("geohash"),
      where("geohash", ">=", b[0]),
      where("geohash", "<=", b[1]),
      where("postType", "==", postType),
      where("status", "==", "available")
    )
  );

  const snapshots = await Promise.all(queries.map(getDocs));

  // Collect, de-dupe, and apply a precise distance filter (geohash bounds are
  // an over-approximation of the circle).
  const byId = new Map<string, Post>();
  for (const snap of snapshots) {
    for (const d of snap.docs) {
      const data = d.data();
      const geoPoint = data.geoPoint as GeoPoint | undefined;
      if (!geoPoint) continue;

      const distanceKm = distanceBetween(
        [geoPoint.latitude, geoPoint.longitude],
        centerTuple
      );
      if (distanceKm <= radiusKm) {
        byId.set(d.id, { id: d.id, ...(data as Omit<Post, "id">) });
      }
    }
  }

  const posts = Array.from(byId.values());

  // Enrich each post with its creator's contact info.
  const creatorCollection = creatorCollectionFor(postType);
  await Promise.all(
    posts.map(async (post) => {
      if (!post.creatorId) return;
      const creatorSnap = await getDoc(
        doc(db, creatorCollection, post.creatorId)
      );
      if (creatorSnap.exists()) {
        const c = creatorSnap.data();
        post.userInfo = {
          name: c.restaurantName || c.fullName || "Unknown",
          phone: c.phone || "",
          geoPoint: c.geoPoint,
        };
      }
    })
  );

  posts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  return posts;
}

export interface CreatePostInput {
  creatorId: string;
  userType: UserType;
  foodName: string;
  description: string;
  quantity: string;
  location: GeoLocation;
  /** Only meaningful for donor offerings. */
  expirationDate?: Date | null;
}

/**
 * Creates a post. Donors produce "offering" posts, recipients produce
 * "request" posts — derived from userType so callers can't mismatch them.
 */
export async function createPost(input: CreatePostInput): Promise<void> {
  const postType: PostType = input.userType === "donor" ? "offering" : "request";

  await addDoc(collection(db, COLLECTIONS.posts), {
    creatorId: input.creatorId,
    userType: input.userType,
    postType,
    status: "available",
    foodName: input.foodName,
    description: input.description,
    quantity: input.quantity,
    ...(input.expirationDate ? { expirationDate: input.expirationDate } : {}),
    imageUrl: null,
    createdAt: serverTimestamp(),
    geohash: input.location.geohash,
    geoPoint: input.location.geoPoint,
  });
}
