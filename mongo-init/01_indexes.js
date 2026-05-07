/**
 * MongoDB schema (collections):
 *
 * users
 *   username: string (unique)
 *   password_hash: string (set by Flask at signup; never store plain passwords)
 *
 * lists
 *   user_id: ObjectId → users._id
 *   name: string (list title)
 *
 * catalog_items (seeded master list — coordinates for maps live here)
 *   name, category, due_date, location: { latitude, longitude }
 *
 * list_items (many-to-many lists ↔ catalog_items; completion is per user list)
 *   list_id: ObjectId → lists._id
 *   catalog_item_id: ObjectId → catalog_items._id
 *   completed: boolean
 */

const dbName = process.env.MONGO_INITDB_DATABASE || "summer_bucket_list";
const appDb = db.getSiblingDB(dbName);

appDb.users.createIndex({ username: 1 }, { unique: true });

appDb.lists.createIndex({ user_id: 1 });
appDb.lists.createIndex({ user_id: 1, name: 1 });

appDb.catalog_items.createIndex({ category: 1 });

appDb.list_items.createIndex({ list_id: 1 });
appDb.list_items.createIndex({ catalog_item_id: 1 });
appDb.list_items.createIndex(
  { list_id: 1, catalog_item_id: 1 },
  { unique: true }
);
