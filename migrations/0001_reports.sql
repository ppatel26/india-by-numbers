-- Reports from the "Report a problem" form on /corrections/.
CREATE TABLE reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,
  problem TEXT NOT NULL,
  source TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL
);
