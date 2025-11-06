import assert from 'assert';
import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Support running tests with an in-memory MongoDB when MONGO_URI is not provided.
let mongod;
const MONGO = process.env.MONGO_URI || null;
if (MONGO) {
	// connect to provided MongoDB
	await mongoose.connect(MONGO);
} else {
	// start an in-memory MongoDB for tests
	const { MongoMemoryServer } = await import('mongodb-memory-server');
	mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();
	await mongoose.connect(uri);
}
// Clean users
await User.deleteMany({ email: /test-user/ });

// Register a user
const email = 'test-user@example.com';
const pw = 'testpass123';

let res = await request(app).post('/api/auth/register').send({ firstName:'T', lastName:'U', email, password: pw, role:'customer' });
assert.equal(res.status, 200);
assert.ok(res.body.token);

// Login
res = await request(app).post('/api/auth/login').send({ email, password: pw });
assert.equal(res.status, 200);
assert.ok(res.body.token);

console.log('Auth endpoints working');
await mongoose.connection.close();
if (mongod && mongod.stop) await mongod.stop();
