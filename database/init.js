// Create application database and collections
db = db.getSiblingDB('mytype')

// Create collections
db.createCollection('users')
db.createCollection('documents')
db.createCollection('sessions')

// Create application user with limited privileges
db.createUser({
  user: 'mytype',
  pwd: 'mytype',
  roles: [
    {
      role: 'readWrite',
      db: 'mytype',
    },
  ],
})

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.documents.createIndex({ ownerId: 1 })
db.sessions.createIndex({ userId: 1 })
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
