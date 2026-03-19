# SubLedger API Documentation

## Overview

- Base URL: `http://localhost:<PORT>`
- Content-Type: `application/json`
- Auth: JWT Bearer token in `Authorization` header

```http
Authorization: Bearer <token>
```

## Standard Response Format

Most endpoints return:

```json
{
	"status": "success",
	"message": "Optional message",
	"data": {}
}
```

For list responses that return a raw array, `results` is included automatically.

Error format:

```json
{
	"status": "error",
	"message": "Validation failed",
	"code": "VALIDATION_ERROR",
	"errors": ["body.email: Invalid email"],
	"stack": "..."
}
```

## Health

### GET /health

Health check endpoint.

Response:

```json
{
	"status": "success",
	"message": "Server is healthy"
}
```

## Auth Endpoints

### POST /auth/signup

Create a new user.

Body:

```json
{
	"email": "user@example.com",
	"password": "secret123",
	"role": "user",
	"username": "myusername"
}
```

Validation:

- `email`: valid email
- `password`: min 6 chars
- `role`: `user` | `admin`
- `username`: min 6, max 50

Response `201`:

```json
{
	"status": "success",
	"data": {
		"user": {
			"_id": "...",
			"email": "user@example.com",
			"username": "myusername",
			"role": "user",
			"createdAt": "...",
			"updatedAt": "..."
		}
	}
}
```

### POST /auth/login

Authenticate a user and return JWT token.

Body:

```json
{
	"email": "user@example.com",
	"password": "secret123"
}
```

Response `200`:

```json
{
	"status": "success",
	"data": {
		"user": {
			"_id": "...",
			"email": "user@example.com",
			"username": "myusername",
			"role": "user"
		},
		"token": "<jwt-token>"
	}
}
```

## User Endpoints (Role: user)

All `/user/*` endpoints require:

- valid JWT
- role = `user`

---

### Subscriptions

### GET /user/subscriptions

List current user's subscriptions.

Query params:

- `page` (optional, default `1`)
- `limit` (optional, default `10`, max `100`)
- `status` (optional: `active` | `cancelled`)

Response `200`:

```json
{
	"status": "success",
	"message": "Subscriptions retrieved successfully",
	"data": {
		"subscriptions": [],
		"pagination": {
			"page": 1,
			"limit": 10,
			"total": 0,
			"totalPages": 1
		}
	}
}
```

### POST /user/subscriptions

Create a subscription for current user.

Body:

```json
{
	"name": "Netflix",
	"price": 15.99,
	"billing_cycle": "monthly"
}
```

Validation:

- `name`: non-empty string
- `price`: number >= 0
- `billing_cycle`: `monthly` | `yearly`

Response `201`:

```json
{
	"status": "success",
	"message": "Subscription created successfully",
	"data": {
		"subscription": {
			"_id": "...",
			"user": "...",
			"name": "Netflix",
			"price": 15.99,
			"billing_cycle": "monthly",
			"status": "active"
		}
	}
}
```

### GET /user/subscriptions/:subscriptionId

Get one owned subscription + transactions + total spent.

Query params (transactions pagination/filter):

- `page`, `limit`
- `status` (`paid` | `failed`)
- `fromDate` (ISO date)
- `toDate` (ISO date)

Response `200`:

```json
{
	"status": "success",
	"message": "Subscription retrieved successfully",
	"data": {
		"subscription": {},
		"transactions": [],
		"totalSpent": 0,
		"pagination": {
			"page": 1,
			"limit": 10,
			"total": 0,
			"totalPages": 1
		}
	}
}
```

### PATCH /user/subscriptions/:subscriptionId

Update owned subscription.

Body (at least one field):

```json
{
	"name": "Netflix Premium",
	"price": 19.99,
	"billing_cycle": "monthly",
	"status": "active"
}
```

Validation:

- `status`: `active` | `cancelled`
- At least one updatable field is required.

### DELETE /user/subscriptions/:subscriptionId

Delete owned subscription.

Response `200`: deleted subscription in `data.subscription`.

### PATCH /user/subscriptions/:subscriptionId/cancel

Cancel owned subscription.

- Changes status to `cancelled`
- Returns `409` if already cancelled

Response `200`:

```json
{
	"status": "success",
	"message": "Subscription cancelled successfully",
	"data": {
		"subscription": {}
	}
}
```

---

### Transactions

### GET /user/transactions

List transactions belonging to current user (across all owned subscriptions).

Query params:

- `page`, `limit`
- `status` (`paid` | `failed`)
- `subscriptionId` (optional)
- `fromDate`, `toDate` (optional ISO dates)

Response `200`:

```json
{
	"status": "success",
	"message": "User transactions retrieved successfully",
	"data": {
		"transactions": [],
		"pagination": {
			"page": 1,
			"limit": 10,
			"total": 0,
			"totalPages": 1
		}
	}
}
```

### GET /user/subscriptions/:subscriptionId/transactions

List transactions for one owned subscription.

Query params:

- `page`, `limit`
- `status` (`paid` | `failed`)
- `fromDate`, `toDate`

Response `200`: same structure as `/user/transactions`.

### POST /user/subscriptions/:subscriptionId/transactions

Create a transaction for one owned subscription.

Body:

```json
{
	"amount": 15.99,
	"paymentDate": "2026-03-19T08:30:00.000Z",
	"status": "paid"
}
```

Validation:

- `amount`: number >= 0
- `paymentDate`: valid date
- `status`: `paid` | `failed`

Business rule:

- Transaction creation is blocked for cancelled subscriptions (`409`).

Response `201`:

```json
{
	"status": "success",
	"message": "Transaction created successfully",
	"data": {
		"transaction": {}
	}
}
```

---

### User Stats

### GET /user/stats

Return stats for current user subscriptions.

Response `200` (note: this endpoint currently returns raw JSON, not wrapped by `sendResponse`):

```json
{
	"totalSubscriptions": 3,
	"activeSubscriptions": 2,
	"cancelledSubscriptions": 1,
	"totalSpent": "120.50"
}
```

## Admin Endpoints (Role: admin)

All `/admin/*` endpoints require:

- valid JWT
- role = `admin`

### GET /admin/users

List all users.

Response `200`:

```json
{
	"status": "success",
	"results": 2,
	"data": [
		{
			"_id": "...",
			"email": "a@example.com",
			"username": "userA",
			"role": "user"
		}
	]
}
```

### GET /admin/me

Get admin profile from token identity.

Response `200`:

```json
{
	"status": "success",
	"data": {
		"_id": "...",
		"email": "admin@subledger.dev",
		"username": "admin",
		"role": "admin"
	}
}
```

## Validation Notes

- IDs are expected in Mongo ObjectId format.
- Unknown body fields are rejected on validated routes (`.strict()`).
- Empty PATCH body is rejected for subscription update routes.

## Authorization Notes

- Subscription scoped endpoints enforce ownership.
- A user cannot read/update/delete another user's subscription.
- Admin-only routes are protected with role middleware.
