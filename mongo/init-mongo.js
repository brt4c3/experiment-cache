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
  { _id: "D", value: "MongoDBから取得したD" },
  { _id: "E", value: "MongoDBから取得したE" },
  { _id: "F", value: "MongoDBから取得したF" },
  { _id: "G", value: "MongoDBから取得したG" },
  { _id: "H", value: "MongoDBから取得したH" },
  { _id: "I", value: "MongoDBから取得したI" },
  { _id: "J", value: "MongoDBから取得したJ" },
  { _id: "K", value: "MongoDBから取得したK" },
  { _id: "L", value: "MongoDBから取得したL" },
  { _id: "M", value: "MongoDBから取得したM" },
  { _id: "N", value: "MongoDBから取得したN" },
  { _id: "O", value: "MongoDBから取得したO" },
  { _id: "P", value: "MongoDBから取得したP" },
  { _id: "Q", value: "MongoDBから取得したQ" },
  { _id: "R", value: "MongoDBから取得したR" },
  { _id: "S", value: "MongoDBから取得したS" },
  { _id: "T", value: "MongoDBから取得したT" },
  { _id: "U", value: "MongoDBから取得したU" },
  { _id: "V", value: "MongoDBから取得したV" }
  ]);
