# ✅ OneSave Post-Deployment Validation Guide

## 📋 What is This?

After deploying OneSave to production (Railway + Vercel), use this guide to validate everything works correctly.

---

## 🧪 Phase 1: Local Validation (Before Deploying)

### Step 1: Verify Builds Complete Successfully

```powershell
# Terminal 1: Backend build
cd server
npm run build
# Expected: "Successfully compiled N sources"
```

```powershell
# Terminal 2: Frontend build
cd client
npm run build
# Expected: "Compiled successfully" with 0 errors, 0 warnings
```

✅ **Checklist:**
- [ ] Backend compiles without errors
- [ ] Frontend compiles without warnings
- [ ] Build size is reasonable (~150KB gzipped)

---

### Step 2: Verify Local API Works

```powershell
# Terminal 1: Start backend
cd server
npm run dev
# Expected: "✓ Server running on http://localhost:5000"
```

```powershell
# Terminal 2: Test API endpoints
# Health check
Invoke-RestMethod http://localhost:5000/api/health | ConvertTo-Json

# Expected response:
# {
#   "status": "healthy",
#   "message": "Server is running",
#   "environment": "development",
#   "timestamp": "2025-11-12T10:30:45.123Z"
# }
```

✅ **Checklist:**
- [ ] Backend starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Response includes timestamp and environment
- [ ] API responds within <100ms

---

### Step 3: Verify Local Frontend Works

```powershell
# Terminal 3: Start frontend
cd client
npm start
# Expected: "Compiled successfully" + browser opens to localhost:3000
```

✅ **Checklist:**
- [ ] Frontend compiles successfully
- [ ] Login page appears at http://localhost:3000
- [ ] Can see login form (email + password inputs)

---

### Step 4: Run E2E Tests

```powershell
# Terminal: Run E2E tests
cd server
npm run test:e2e

# Expected output:
# PASS  src/__tests__/e2e/auth.e2e-spec.ts (5.234s)
#   Authentication E2E Tests
#     Register endpoint
#       ✓ should successfully register a new user (45ms)
#       ✓ should reject registration with missing fields (12ms)
#       ✓ should reject duplicate email (18ms)
#     Login endpoint
#       ✓ should successfully login (38ms)
#       ✓ should reject wrong password (15ms)
#       ✓ should reject non-existent user (12ms)
#     GET /me endpoint
#       ✓ should return current user with valid token (22ms)
#       ✓ should reject request without token (8ms)
#     GET /health endpoint
#       ✓ should return health status (5ms)
#
# Tests:       9 passed, 9 total
# Snapshots:   0 total
# Time:        5.234s
```

✅ **Checklist:**
- [ ] All tests pass (9 passed)
- [ ] No test failures or errors
- [ ] Execution time <10 seconds
- [ ] Database operations work correctly

---

## 🌐 Phase 2: Production Deployment Validation

### After Deploying to Railway + Vercel

---

### Step 1: Verify Backend on Railway

#### 1a. Health Check
```powershell
$railwayUrl = "https://YOUR_RAILWAY_DOMAIN.up.railway.app"
Invoke-RestMethod "$railwayUrl/api/health" | ConvertTo-Json

# Expected:
# {
#   "status": "healthy",
#   "message": "Server is running",
#   "environment": "production",  # Note: should be "production"
#   "timestamp": "2025-11-12T10:30:45.123Z"
# }
```

✅ **Checks:**
- [ ] Returns 200 OK (not 404 or 500)
- [ ] Environment shows "production"
- [ ] Timestamp is current (within last minute)

#### 1b. Database Connection
```powershell
# Test if database is connected by registering a test user
$headers = @{ "Content-Type" = "application/json" }
$body = @{
    email = "test-$(Get-Random)@example.com"
    password = "TestPassword123!"
    nomComplet = "Test User"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "$railwayUrl/api/auth/register" `
    -Method Post `
    -Headers $headers `
    -Body $body

Write-Host "Registration successful: $($response.message)"
```

✅ **Checks:**
- [ ] Registration endpoint returns 201 Created
- [ ] Can create new users
- [ ] Database writes persist
- [ ] No "Cannot find module" errors

#### 1c. Login Test
```powershell
$loginBody = @{
    email = "admin@example.com"
    password = "AdminPassword123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod `
    -Uri "$railwayUrl/api/auth/login" `
    -Method Post `
    -Headers $headers `
    -Body $loginBody

$token = $loginResponse.token
Write-Host "Login successful! Token: $($token.Substring(0, 20))..."

# Test protected endpoint
$authHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$meResponse = Invoke-RestMethod `
    -Uri "$railwayUrl/api/auth/me" `
    -Headers $authHeaders

Write-Host "User info: $($meResponse.nomComplet)"
```

✅ **Checks:**
- [ ] Login returns valid JWT token
- [ ] Token is valid JSON Web Token format
- [ ] GET /me returns user profile
- [ ] Protected endpoints require token
- [ ] Invalid token returns 401 Unauthorized

---

### Step 2: Verify Frontend on Vercel

#### 2a. Page Load
Navigate to: `https://YOUR_VERCEL_DOMAIN.vercel.app`

✅ **Checks:**
- [ ] Page loads within 3 seconds
- [ ] No 404 errors in console
- [ ] Login page displays correctly
- [ ] All images load without errors

#### 2b. Frontend-Backend Communication
Open browser Developer Tools (F12) → Console

1. Try to login with admin credentials:
   - Email: `admin@example.com`
   - Password: `AdminPassword123!`

✅ **Checks:**
- [ ] API calls appear in Network tab
- [ ] No CORS errors
- [ ] Redirect to dashboard after login
- [ ] No API errors in console

#### 2c. Verify Environment Variable
```javascript
// In browser console:
console.log('API URL:', process.env.REACT_APP_API_URL)
```

✅ **Checks:**
- [ ] Shows correct Railway backend URL
- [ ] Not showing localhost:5000
- [ ] Matches `API_URL` GitHub secret

---

### Step 3: Complete User Flow Test

#### 3a. Registration Flow
1. Navigate to app
2. Click "S'inscrire" (Register)
3. Fill in form:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "TestPassword123!"
4. Submit

✅ **Checks:**
- [ ] Form validates input
- [ ] No console errors
- [ ] Redirects to login after registration
- [ ] User can login with new credentials

#### 3b. Dashboard Flow
1. Login as admin
2. Navigate through pages:
   - Dashboard (home)
   - Projets (projects)
   - Événements (events)
   - Rapports (reports)
   - Profil (profile)

✅ **Checks:**
- [ ] All pages load
- [ ] Data displays correctly
- [ ] No blank screens or errors
- [ ] Can navigate between pages
- [ ] Logout button works

#### 3c. Create a Project
1. Click "Ajouter un projet" (Add project)
2. Fill form:
   - Nom: "Test Project"
   - Description: "Test description"
   - Objectif: "Test objective"
3. Submit

✅ **Checks:**
- [ ] Project created successfully
- [ ] Appears in projects list
- [ ] Data persists (refresh page)
- [ ] Can view project details

#### 3d. Create an Event
1. Navigate to "Événements" (Events)
2. Click "Ajouter un événement" (Add event)
3. Fill form with valid data
4. Submit

✅ **Checks:**
- [ ] Event created successfully
- [ ] Appears in events list
- [ ] Can view event details
- [ ] Date/time displayed correctly

---

## 📊 Phase 3: Performance Validation

### Step 1: API Performance

```powershell
# Test response times
function Test-APIPerformance {
    $railwayUrl = "https://YOUR_RAILWAY_DOMAIN.up.railway.app"
    $iterations = 10
    $times = @()
    
    1..$iterations | ForEach-Object {
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $null = Invoke-RestMethod "$railwayUrl/api/health"
        $sw.Stop()
        $times += $sw.ElapsedMilliseconds
        Write-Host "Request $($_): $($sw.ElapsedMilliseconds)ms"
    }
    
    $avg = ($times | Measure-Object -Average).Average
    Write-Host "`nAverage response time: $($avg)ms"
    Write-Host "Max response time: $($times | Measure-Object -Maximum).Maximum)ms"
}

Test-APIPerformance
```

✅ **Benchmarks:**
- [ ] Average response time: <200ms
- [ ] Max response time: <500ms
- [ ] No timeouts (30s limit)
- [ ] Consistent performance

### Step 2: Frontend Performance

Open browser DevTools → Lighthouse:

1. Run Lighthouse audit (Performance tab)
2. Check scores:

✅ **Targets:**
- [ ] Performance score: >80
- [ ] Accessibility score: >80
- [ ] Best Practices score: >90
- [ ] SEO score: >80
- [ ] Largest Contentful Paint (LCP): <2.5s
- [ ] First Input Delay (FID): <100ms
- [ ] Cumulative Layout Shift (CLS): <0.1

---

## 🔐 Phase 4: Security Validation

### Step 1: Authentication Security

✅ **Checks:**
- [ ] Password requires minimum 8 characters
- [ ] Passwords are hashed (bcryptjs 10 rounds)
- [ ] JWT tokens expire after 7 days
- [ ] Tokens cannot be reused after logout
- [ ] Protected endpoints require valid token

### Step 2: API Security

```powershell
# Test CORS headers
$railwayUrl = "https://YOUR_RAILWAY_DOMAIN.up.railway.app"
$response = Invoke-WebRequest "$railwayUrl/api/health" `
    -Method Options `
    -Headers @{ "Origin" = "https://YOUR_VERCEL_DOMAIN.vercel.app" }

Write-Host "CORS Headers:"
Write-Host "Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])"
Write-Host "Access-Control-Allow-Methods: $($response.Headers['Access-Control-Allow-Methods'])"
```

✅ **Checks:**
- [ ] CORS allows Vercel domain
- [ ] CORS does NOT allow wildcard (*)
- [ ] OPTIONS requests return 200 OK
- [ ] Invalid origins are rejected

### Step 3: Data Validation

✅ **Checks:**
- [ ] Cannot register with invalid email
- [ ] Cannot create project with empty name
- [ ] Cannot create event with past date
- [ ] File uploads are validated
- [ ] Input sanitization works

---

## 🚨 Phase 5: Error Handling Validation

### Step 1: 404 Errors

```powershell
# Test 404
$railwayUrl = "https://YOUR_RAILWAY_DOMAIN.up.railway.app"
try {
    Invoke-RestMethod "$railwayUrl/api/projects/nonexistent-id"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    # Expected: 404 Not Found
}
```

✅ **Checks:**
- [ ] Returns 404 status code
- [ ] Error message is clear
- [ ] No stack trace exposed

### Step 2: 500 Errors

✅ **Checks:**
- [ ] Database errors handled gracefully
- [ ] No stack traces exposed to users
- [ ] Returns meaningful error message
- [ ] Errors logged to Railway logs

### Step 3: Network Errors

✅ **Checks:**
- [ ] App handles offline gracefully
- [ ] Retry mechanism works
- [ ] Shows error message to user
- [ ] Can recover when network restored

---

## 📈 Phase 6: Database Validation

### Step 1: PostgreSQL Connection

```powershell
# Check Railway PostgreSQL logs
# (In Railway dashboard → Database → Logs)

✅ **Checks:**
- [ ] Connection pool shows 2-5 active connections
- [ ] No connection timeout errors
- [ ] No "too many connections" errors
- [ ] Queries execute within <100ms
```

### Step 2: Data Persistence

1. Create a project
2. Create an event in that project
3. Refresh the page
4. Logout and login again

✅ **Checks:**
- [ ] Project still exists
- [ ] Event still exists
- [ ] Data is unchanged
- [ ] Pagination works correctly

### Step 3: Backup Status

✅ **Checks:**
- [ ] Railway auto-backups are enabled
- [ ] Backups run daily
- [ ] Can restore from backup if needed
- [ ] Backup size is reasonable

---

## 🔔 Phase 7: Monitoring & Logging

### Step 1: Railway Logs

In Railway Dashboard:
1. Click "Logs" tab
2. Filter by level (Info, Warn, Error)

✅ **Checks:**
- [ ] No ERROR logs (except expected ones)
- [ ] No unhandled exceptions
- [ ] Request logs show successful responses
- [ ] Performance metrics are displayed

### Step 2: Vercel Logs

In Vercel Dashboard:
1. Click "Functions" tab
2. Check logs for errors

✅ **Checks:**
- [ ] No function errors
- [ ] Build logs show successful compilation
- [ ] Deployment logs clean and complete
- [ ] No memory/timeout issues

---

## 📋 Final Validation Checklist

### Pre-Deployment
- [ ] All tests pass locally (`npm run test:e2e`)
- [ ] Frontend builds without warnings
- [ ] Backend compiles without errors
- [ ] .env variables are set correctly
- [ ] GitHub Secrets are configured

### Post-Deployment
- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] API responses are correct
- [ ] Database operations work
- [ ] User can register
- [ ] User can login
- [ ] Protected routes require auth
- [ ] Logout works

### Security & Performance
- [ ] API response time <200ms average
- [ ] Frontend Lighthouse score >80
- [ ] CORS headers correct
- [ ] Passwords encrypted
- [ ] No console errors
- [ ] Error handling works

### Data & Monitoring
- [ ] Can create and view projects
- [ ] Can create and view events
- [ ] Data persists after logout/login
- [ ] Logs are being collected
- [ ] No unhandled exceptions
- [ ] Backups are enabled

---

## 🆘 Troubleshooting

### "API not responding"
1. Check Railway backend is running
2. Verify API_URL in Vercel environment
3. Check CORS settings
4. Review Railway logs for errors

### "Cannot connect to database"
1. Verify DATABASE_URL in Railway
2. Check PostgreSQL is running
3. Run migrations: `npx prisma migrate deploy`
4. Check Railway logs

### "Frontend shows blank screen"
1. Check browser console for errors
2. Verify frontend build succeeded
3. Check Vercel deployment logs
4. Clear browser cache (Ctrl+Shift+Delete)

### "Login not working"
1. Verify admin user exists in database
2. Check API health endpoint
3. Review auth error message
4. Check Railway logs

### "Slow performance"
1. Check Railway CPU/Memory usage
2. Check Vercel function execution time
3. Review database query performance
4. Check for N+1 query problems

---

## ✅ Success Criteria

Your deployment is successful when:

✅ **Functionality**
- [ ] All pages load correctly
- [ ] All operations complete successfully
- [ ] No console errors
- [ ] No API errors

✅ **Performance**
- [ ] API responds in <200ms
- [ ] Frontend loads in <3 seconds
- [ ] Lighthouse scores >80
- [ ] No timeouts

✅ **Security**
- [ ] Cannot access protected routes without token
- [ ] CORS properly configured
- [ ] Passwords properly encrypted
- [ ] No sensitive data exposed

✅ **Reliability**
- [ ] Database operations consistent
- [ ] Data persists correctly
- [ ] Errors handled gracefully
- [ ] Monitoring & logs working

---

## 📞 Getting Help

If you encounter issues:

1. **Check Logs First**
   - Railway backend logs
   - Vercel frontend logs
   - Browser console (F12)

2. **Read Documentation**
   - DEPLOYMENT_GUIDE.md
   - README_DEV.md
   - docs/TECHNIQUE.md

3. **Run Local Tests**
   - `npm run test:e2e` (backend)
   - Check if issue reproduces locally

4. **Common Issues**
   - See "Troubleshooting" sections in DEPLOYMENT_GUIDE.md

---

**Document Version:** 1.0  
**Last Updated:** November 12, 2025  
**OneSave Version:** 1.0.0  

🎉 **Congratulations on your deployment!**
