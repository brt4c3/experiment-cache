db = db.getSiblingDB("testdb");
db.createUser({
  user: "testuser",
  pwd: "testpassword",
  roles: [{ role: "readWrite", db: "testdb" }],
});

db.index.insertMany([
  { _id: "A", value: "MongoDBから取得したA" },
  { _id: "B", value: "MongoDBから取得したB" },
  { _id: "C", value: "MongoDBから取得したC" },
]);
