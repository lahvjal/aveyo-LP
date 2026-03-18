# Backend Handling - Different Form Structures

## Overview

Landing Page 3 collects **additional fields** (address and city) that are not collected on Landing Pages 1 and 2. Your backend/webhook needs to handle this variation.

---

## Field Comparison by Landing Page

### Landing Page 1 & 2 - Standard Fields (13 fields + timestamp)
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "+13125551234",
  "zipCode": "60601",
  "homeOwnership": "yes",
  "electricBill": "$150 - $200",
  "pageSlug": "1",
  "offerName": "Powering What Matters Most",
  "utmSource": "google",
  "utmCampaign": "solar-illinois-2026",
  "utmAdset": "chicago-homeowners",
  "utmAd": "ad-123",
  "fbclid": "",
  "submittedAt": "2026-03-02T15:30:45.123Z"
}
```

### Landing Page 3 - Extended Fields (15 fields + timestamp)
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

---

## Backend Requirements

### 1. **Field Validation**

Your webhook should handle **optional fields** gracefully:

```javascript
// Example webhook handler (Node.js/Express)
app.post('/webhook', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    zipCode,
    address,        // OPTIONAL - only from page 3
    city,           // OPTIONAL - only from page 3
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

  // Optional fields - check if present
  const hasAddress = address && city;
  
  // Process accordingly
  if (hasAddress) {
    // This is from Landing Page 3 - has full address
    console.log('Full address provided:', address, city);
  } else {
    // This is from Landing Page 1 or 2 - no address
    console.log('No address provided');
  }

  // Continue processing...
  res.status(200).json({ success: true });
});
```

### 2. **Database Schema**

Make `address` and `city` **nullable/optional** in your database:

```sql
-- Example SQL Schema
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  zip_code VARCHAR(5) NOT NULL,
  address VARCHAR(255) NULL,        -- NULLABLE
  city VARCHAR(100) NULL,           -- NULLABLE
  home_ownership VARCHAR(10) NOT NULL,
  electric_bill VARCHAR(50) NOT NULL,
  page_slug VARCHAR(10) NOT NULL,
  offer_name VARCHAR(255) NOT NULL,
  utm_source VARCHAR(255) NULL,
  utm_campaign VARCHAR(255) NULL,
  utm_adset VARCHAR(255) NULL,
  utm_ad VARCHAR(255) NULL,
  fbclid VARCHAR(255) NULL,
  submitted_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **Identifying the Source**

Use the `pageSlug` field to identify which form the submission came from:

```javascript
if (pageSlug === '3') {
  // This submission has address and city fields
  // Send to CRM with full address
} else if (pageSlug === '1' || pageSlug === '2') {
  // This submission does NOT have address/city
  // Send to CRM without address
}
```

### 4. **CRM Integration**

If you're pushing to a CRM (like HubSpot, Salesforce, etc.), handle the fields conditionally:

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
    // ... other fields
  };

  // Only add address fields if they exist
  if (formData.address) {
    payload.address = formData.address;
  }
  
  if (formData.city) {
    payload.city = formData.city;
  }

  return payload;
};
```

---

## Recommended Approach

### Option 1: **Flexible Schema (Recommended)**
- Make `address` and `city` optional/nullable fields
- All three forms send to the same webhook endpoint
- Backend handles missing fields gracefully
- Easiest to maintain

### Option 2: **Separate Endpoints**
- Landing Page 1 & 2 → `/webhook/standard`
- Landing Page 3 → `/webhook/with-address`
- Requires updating the form submission URL for page 3
- More complex but gives you stricter validation per form type

### Option 3: **Always Send Empty Strings**
- Make pages 1 & 2 send `address: ""` and `city: ""`
- All payloads have the same structure
- Backend can still check for empty strings
- Slightly less clean but ensures consistency

---

## Testing Checklist

- [ ] Submit form from Landing Page 1 - verify address/city are NOT sent or are null
- [ ] Submit form from Landing Page 2 - verify address/city are NOT sent or are null  
- [ ] Submit form from Landing Page 3 - verify address/city ARE sent and populated
- [ ] Check database inserts handle NULL values for address/city
- [ ] Verify CRM integration works with and without address fields
- [ ] Test webhook with missing optional fields (utm params, fbclid, address, city)

---

## Current Implementation

✅ Landing Page 3 now collects: `address` and `city`
✅ Landing Page 1 and 2 do NOT send these fields
✅ All forms send to the same webhook endpoint
✅ Backend must handle `address` and `city` as **optional fields**

---

## Questions to Answer

1. **Does your webhook/backend accept extra fields gracefully?**
   - If yes, no changes needed
   - If no, you may need to update the webhook handler

2. **Does your database schema need updating?**
   - Add `address` and `city` columns as nullable

3. **Does your CRM need these fields?**
   - Map them conditionally based on whether they're present

4. **Do you want all forms to collect address?**
   - If yes, we can add address fields to pages 1 and 2 as well
   - If no, keep current setup with only page 3 collecting address
