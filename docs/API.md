# API Documentation

## Introduction

SwasthAI Guardian exposes a **RESTful JSON API** through an Express.js backend. All endpoints are prefixed with `/api`. The API supports authentication via JWT tokens, role-based access control, input validation with Zod schemas, and structured error responses.

Base URL (production): `https://swasthai-backend.onrender.com/api`

---

## Authentication

### Headers

Authenticated requests require a Bearer JWT token:

```
Authorization: Bearer <token>
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

### Success Response Format

```json
{
  "success": true,
  "data": { ... }
}
```

---

## API Endpoints

### Auth

#### POST /api/auth/register
Register a new user.

```json
{
  "phone": "9876543210",
  "username": "ramesh",
  "name": "Ramesh Kumar",
  "password": "securepass123",
  "role": "villager",
  "villageId": "village_001",
  "gender": "male",
  "age": 32,
  "economic_status": "bpl",
  "caste": "general",
  "area_type": "rural"
}
```

**Response:** `201` — JWT token + user profile

#### POST /api/auth/request-otp
Request an OTP for phone-based login.

```json
{ "phone": "9876543210" }
```

**Response:** `200` — `{ "message": "OTP sent successfully" }`

#### POST /api/auth/login-otp
Login using OTP verification.

```json
{
  "phone": "9876543210",
  "otp": "1234",
  "role": "villager"
}
```

**Response:** `200` — JWT token + user profile

#### POST /api/auth/login
Login with password.

```json
{
  "identifier": "ramesh",
  "password": "securepass123",
  "role": "villager"
}
```

**Response:** `200` — JWT token + refresh token

#### POST /api/auth/refresh
Refresh an expired JWT token.

```json
{ "refreshToken": "..." }
```

**Response:** `200` — New JWT token

#### POST /api/auth/logout
Invalidate the current session.

#### GET /api/auth/profile
Get authenticated user profile.

#### PUT /api/auth/profile
Update user profile.

```json
{ "name": "New Name", "username": "newusername" }
```

#### POST /api/auth/verify-aadhaar
Verify and link Aadhaar (Verhoeff checksum validation).

```json
{ "aadhaar": "123412341234" }
```

#### GET /api/auth/schemes
Get government schemes the user is eligible for.

---

### Villager

#### POST /api/villager/check-symptoms
Submit symptoms for AI diagnosis.

```json
{
  "symptoms": "fever and headache since 2 days",
  "language": "en",
  "villageId": "village_001"
}
```

**Response:** `200` — Disease prediction, confidence, severity, advice

#### GET /api/villager/symptoms
Get symptom check history (paginated).

#### POST /api/villager/ai-chat
Chat with Sakhi RAG assistant.

```json
{
  "message": "What are the symptoms of dengue?",
  "language": "en",
  "conversationId": "conv_001"
}
```

#### POST /api/villager/ambulance-request
Request an ambulance.

```json
{
  "name": "Ramesh Kumar",
  "location": "Village Road, near PHC",
  "priority": "high",
  "type": "emergency",
  "symptoms": "chest pain"
}
```

#### POST /api/villager/sos
Send an emergency SOS alert.

```json
{
  "alertType": "ambulance_request",
  "message": "Emergency at village entrance"
}
```

#### POST /api/villager/skin-log
Log a skin condition analysis result.

#### POST /api/villager/phq2
Submit PHQ-2 mental health screening.

```json
{
  "interest_score": 1,
  "mood_score": 2
}
```

#### POST /api/villager/sync-health
Report offline sync health metrics.

```json
{
  "recordCount": 15,
  "durationMs": 2300,
  "syncBatchId": "batch_001",
  "clientRequestIds": ["req_001", "req_002"],
  "pendingCount": 0
}
```

#### GET /api/villager/health-tips
Get personalized health tips.

#### GET /api/villager/seasonal-risks
Get seasonal disease risks for the user's village.

---

### NGO / ASHA Worker

#### GET /api/ngo/maternal
Get pregnancy records (paginated, village-scoped).

#### POST /api/ngo/maternal
Create a pregnancy record.

```json
{
  "name": "Sunita Devi",
  "age": 24,
  "trimester": 2,
  "dueDate": "2025-08-15",
  "riskLevel": "medium",
  "villageId": "village_001",
  "systolic_bp": 120,
  "diastolic_bp": 80,
  "bs": 95,
  "body_temp": 98.6,
  "heart_rate": 72
}
```

#### GET /api/ngo/malnutrition
Get malnutrition records (paginated).

#### POST /api/ngo/malnutrition
Create a malnutrition assessment.

```json
{
  "childName": "Arjun",
  "ageMonths": 18,
  "weight": 8.5,
  "height": 75,
  "villageId": "village_001"
}
```

#### GET /api/ngo/requests
Get health requests / triage feed.

#### PUT /api/ngo/requests/:id
Accept, start, or complete a health request.

#### POST /api/ngo/referral
Create a referral.

```json
{
  "patient_name": "Ramesh Kumar",
  "patient_phone": "9876543210",
  "villageId": "village_001",
  "referred_to": "PHC Varanasi",
  "reason": "Suspected tuberculosis",
  "priority": "high"
}
```

#### PUT /api/ngo/referral/:id
Update referral outcome.

```json
{
  "outcome": "completed",
  "outcome_details": "Patient diagnosed and started on DOTS therapy"
}
```

---

### Admin

#### GET /api/admin/dashboard
Get command center KPIs and statistics.

#### POST /api/admin/outbreak-alert
Receive outbreak alert from AI agent (requires AGENT_SECRET).

```json
{
  "villageId": "village_001",
  "districtId": "district_main",
  "disease": "Cholera",
  "confidence": 94.5,
  "reasoning": "3+ cases of watery diarrhea in last 24 hours"
}
```

#### GET /api/admin/outbreaks
Get all outbreak alerts.

#### GET /api/admin/outbreak-events
Get outbreak event stream (SSE).

#### GET /api/admin/ai-traces
Get AI reasoning traces from the Outbreak Agent.

#### GET /api/admin/system
Get system health status.

#### GET /api/admin/users
List all users.

#### POST /api/admin/bulk-upload
Upload village data in bulk (CSV).

#### GET /api/admin/config
Get district configuration.

#### PUT /api/admin/config
Update district configuration.

#### POST /api/admin/issue-alert
Issue a district-wide alert.

#### GET /api/admin/report
Generate district CMO report (CSV download).

#### POST /api/admin/toggle-demo
Toggle demo mode with seeded data.

---

### System

#### GET /api/health
Basic health check.

```json
{ "status": "ok" }
```

#### GET /api/health/detailed
Detailed health status including all service connections.

---

### Webhooks

#### POST /api/webhooks/twilio
Receive Twilio SMS delivery status callbacks (HMAC-SHA1 validated).

---

## Rate Limiting

| Endpoint Group | Limit | Window |
|---------------|-------|--------|
| Auth endpoints | 15 requests | 15 minutes |
| AI endpoints | 10 requests | 1 minute |
| General API | 100 requests | 15 minutes |

Rate limit headers are returned with every response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body failed Zod schema validation |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | Insufficient role permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `AI_SERVICE_ERROR` | 502 | AI service unavailable or errored |
| `CONFLICT` | 409 | Duplicate request (idempotency key collision) |

---

## Best Practices

### Idempotency
All mutation endpoints accept an optional `client_request_id` header or body field. If a request with the same ID is received within 24 hours, it is safely rejected as a duplicate. Use UUIDs for client request IDs.

### Pagination
List endpoints support `?page=1&limit=50` query parameters. Default page size is 50, maximum is 200.

### Language
Endpoints that accept language use ISO 639-1 codes: `en`, `hi`, `mr`, `ta`, `te`, `bn`.

### Error Handling
Always check `success` field in the response. When `success` is `false`, examine `error.code` and `error.message` for details.

### Security
- All API calls must use HTTPS in production
- JWT tokens expire after 24 hours; use `/auth/refresh` to renew
- Never share `AGENT_SECRET` or `JWT_SECRET`

---

## Future Improvements

- [ ] OpenAPI 3.1 specification with Swagger UI at `/api/docs`
- [ ] GraphQL gateway for complex nested queries
- [ ] Webhook signature verification for third-party integrations
- [ ] API versioning (`/api/v2/`) for backward-compatible evolution
- [ ] Request/response compression (Brotli)
- [ ] Bulk/batch endpoints for offline sync optimization
- [ ] Rate limit tiers based on subscription plan
