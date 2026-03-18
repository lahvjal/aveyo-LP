# Backend Handling - Consistent Form Structure

## Overview

All three landing pages now send **the same payload structure**. Landing Pages 1 and 2 send empty strings for `address` and `city`, while Landing Page 3 sends populated values.

---

## Consistent Payload Structure (All Pages)

All landing pages now send the same 15 fields + timestamp:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "+13125551234",
  "zipCode": "60601",
  "address": "123 Main Street",
  "city": "Chicago",
  "homeOwnership": "yes",
  "electricBill": "$150 - $200",
  "pageSlug": "3",
  "offerName": "Your Solar Journey Starts Here",
  "utmSource": "google",
  "utmCampaign": "solar-illinois-2026",
  "utmAdset": "chicago-homeowners",
  "utmAd": "ad-123",
  "fbclid": "",
  "submittedAt": "2026-03-02T15:30:45.123Z"
}
```

### Differences by Landing Page

**Landing Page 1 & 2:**
```json
{
  ...
  "address": "",
  "city": "",
  ...
}
```

**Landing Page 3:**
```json
{
  ...
  "address": "123 Main Street",
  "city": "Chicago",
  ...
}
```

---

## Backend Requirements

### 1. **All Fields Always Present**

✅ Your webhook will **always receive** all fields
✅ `address` and `city` will be **empty strings** from pages 1 & 2
✅ `address` and `city` will be **populated** from page 3

```javascript
// Example webhook handler (Node.js/Express)
app.post('/webhook', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    zipCode,
    address,        // Always present (empty string or value)
    city,           // Always present (empty string or value)
    homeOwnership,
    electricBill,
    pageSlug,
    offerName,
    utmSource,
    utmCampaign,
    utmAdset,
    utmAd,
    fbclid,
    submittedAt
  } = req.body;

  // Required fields validation
  if (!firstName || !lastName || !email || !phone || !zipCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if address was provided
  const hasAddress = address !== '' && city !== '';
  
  if (hasAddress) {
    console.log('Full address provided:', address, city);
  } else {
    console.log('No address provided (empty strings)');
  }

  // Continue processing...
  res.status(200).json({ success: true });
});
```

### 2. **Database Schema**

All fields can be stored as strings. Store empty strings or convert to NULL:

```sql
-- Example SQL Schema
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  zip_code VARCHAR(5) NOT NULL,
  address VARCHAR(255) NOT NULL DEFAULT '',    -- Empty string default
  city VARCHAR(100) NOT NULL DEFAULT '',       -- Empty string default
  home_ownership VARCHAR(10) NOT NULL,
  electric_bill VARCHAR(50) NOT NULL,
  page_slug VARCHAR(10) NOT NULL,
  offer_name VARCHAR(255) NOT NULL,
  utm_source VARCHAR(255) NOT NULL DEFAULT '',
  utm_campaign VARCHAR(255) NOT NULL DEFAULT '',
  utm_adset VARCHAR(255) NOT NULL DEFAULT '',
  utm_ad VARCHAR(255) NOT NULL DEFAULT '',
  fbclid VARCHAR(255) NOT NULL DEFAULT '',
  submitted_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**OR convert empty strings to NULL:**

```javascript
// Convert empty strings to null before inserting
const lead = {
  first_name: firstName,
  last_name: lastName,
  email: email,
  phone: phone,
  zip_code: zipCode,
  address: address || null,        // Convert "" to null
  city: city || null,              // Convert "" to null
  home_ownership: homeOwnership,
  // ... other fields
};
```

### 3. **Identifying the Source**

Use the `pageSlug` field to identify which form the submission came from:

```javascript
if (pageSlug === '3') {
  // This submission likely has address and city filled
  if (address && city) {
    console.log('Page 3 with address:', address, city);
  }
} else if (pageSlug === '1' || pageSlug === '2') {
  // This submission has empty strings for address/city
  console.log('Page 1 or 2 - address fields are empty');
}
```

### 4. **CRM Integration**

When pushing to a CRM, you can choose to omit empty fields:

```javascript
// Example CRM payload builder
const buildCRMPayload = (formData) => {
  const payload = {
    email: formData.email,
    firstname: formData.firstName,
    lastname: formData.lastName,
    phone: formData.phone,
    zip: formData.zipCode,
    home_ownership: formData.homeOwnership,
    electric_bill: formData.electricBill,
    page_source: formData.pageSlug,
    offer: formData.offerName,
  };

  // Only add address fields if they're not empty
  if (formData.address && formData.address !== '') {
    payload.address = formData.address;
  }
  
  if (formData.city && formData.city !== '') {
    payload.city = formData.city;
  }

  // Add UTM fields if present
  if (formData.utmSource) payload.utm_source = formData.utmSource;
  if (formData.utmCampaign) payload.utm_campaign = formData.utmCampaign;
  if (formData.utmAdset) payload.utm_adset = formData.utmAdset;
  if (formData.utmAd) payload.utm_ad = formData.utmAd;
  if (formData.fbclid) payload.fbclid = formData.fbclid;

  return payload;
};
```

---

## Benefits of This Approach

✅ **Consistent structure** - All payloads have the same fields
✅ **No null handling** - Backend always receives all keys
✅ **Simple validation** - Check for empty strings
✅ **Easy to maintain** - No conditional field checking needed

---

## Testing Checklist

- [ ] Submit form from Landing Page 1 - verify `address: ""` and `city: ""`
- [ ] Submit form from Landing Page 2 - verify `address: ""` and `city: ""`
- [ ] Submit form from Landing Page 3 - verify `address` and `city` have values
- [ ] Check database inserts handle empty strings correctly
- [ ] Verify CRM integration filters out empty address fields
- [ ] Test webhook accepts consistent payload structure

---

## Current Implementation

✅ Landing Page 3 collects and sends: `address` and `city` with values
✅ Landing Page 1 and 2 send: `address: ""` and `city: ""`
✅ All forms send identical payload structure (17 fields total)
✅ Backend receives consistent structure on every submission
