# Form Field Options - Complete Reference

## User Input Fields

### 1. zipCode
**Type:** Text input (5 digits)
**Validation:** Must be exactly 5 digits
**Format:** String (numbers only)
**Example:** "60601"

---

### 2. homeOwnership
**Type:** Radio button (single select)
**Options:**
- `"yes"` - Yes (I own my home)
- `"no"` - No (I rent)

**Example:** "yes"

---

### 3. electricBill
**Type:** Radio button (single select)
**Options:**
- `"$0 - $100"`
- `"$100 - $150"`
- `"$150 - $200"`
- `"$200 - $300"`
- `"$300+"`

**Example:** "$150 - $200"

---

### 4. email
**Type:** Email input
**Validation:** Must be valid email format (contains @ and domain)
**Format:** String
**Example:** "john.smith@example.com"

---

### 5. firstName
**Type:** Text input
**Validation:** Required, must not be empty
**Format:** String
**Example:** "John"

---

### 6. lastName
**Type:** Text input
**Validation:** Required, must not be empty
**Format:** String
**Example:** "Smith"

---

### 7. phone
**Type:** Phone number input
**Validation:** Must be at least 10 digits
**Format:** String (digits only, no spaces, dashes, or parentheses)
**Example:** "3125551234"

---

## Tracking Fields (Automatically Captured)

### 8. landing_page
**Type:** Auto-populated
**Options:**
- `"1"` - Landing Page 1 (Multi-step form with hero image)
- `"2"` - Landing Page 2 (Full-screen hero with ZIP entry)
- `"3"` - Landing Page 3 (Single-page all-in-one form)

**Example:** "1"

---

### 9. offer_name
**Type:** Auto-populated based on landing page
**Options:**
- `"Powering What Matters Most"` - (Landing Page 1)
- `"Go Solar With $0 Down"` - (Landing Page 2)
- `"Your Solar Journey Starts Here"` - (Landing Page 3)

**Example:** "Powering What Matters Most"

---

### 10. utm_source
**Type:** URL parameter extraction
**Format:** String
**Source:** Extracted from `?utm_source=` in URL
**Default:** Empty string `""` if not present
**Example:** "google" or "facebook" or "instagram"

---

### 11. utm_campaign
**Type:** URL parameter extraction
**Format:** String
**Source:** Extracted from `?utm_campaign=` in URL
**Default:** Empty string `""` if not present
**Example:** "solar-illinois-2026"

---

### 12. utm_adset
**Type:** URL parameter extraction
**Format:** String
**Source:** Extracted from `?utm_adset=` in URL
**Default:** Empty string `""` if not present
**Example:** "chicago-homeowners"

---

### 13. utm_ad
**Type:** URL parameter extraction
**Format:** String
**Source:** Extracted from `?utm_ad=` in URL
**Default:** Empty string `""` if not present
**Example:** "ad-123"

---

### 14. fbclid
**Type:** URL parameter extraction
**Format:** String
**Source:** Extracted from `?fbclid=` in URL (Facebook Click ID)
**Default:** Empty string `""` if not present
**Example:** "IwAR1234567890abcdefghijklmnop"

---

### 15. submittedAt
**Type:** Auto-generated timestamp
**Format:** ISO 8601 date-time string
**Example:** "2026-03-02T15:30:45.123Z"

---

## Complete Example Payload

```json
{
  "zipCode": "60601",
  "homeOwnership": "yes",
  "electricBill": "$150 - $200",
  "email": "john.smith@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "3125551234",
  "landing_page": "1",
  "offer_name": "Powering What Matters Most",
  "utm_source": "google",
  "utm_campaign": "solar-illinois-2026",
  "utm_adset": "chicago-homeowners",
  "utm_ad": "ad-123",
  "fbclid": "",
  "submittedAt": "2026-03-02T15:30:45.123Z"
}
```

## Example URLs with Tracking Parameters

### Google Ads
```
https://yourdomain.com/1?utm_source=google&utm_campaign=solar-illinois&utm_adset=chicago&utm_ad=ad-001
```

### Facebook Ads
```
https://yourdomain.com/2?utm_source=facebook&utm_campaign=solar-promo&utm_adset=homeowners-35-55&utm_ad=video-ad-1&fbclid=IwAR123456
```

### Instagram Ads
```
https://yourdomain.com/3?utm_source=instagram&utm_campaign=solar-awareness&utm_adset=illinois-residents&utm_ad=carousel-1
```

## Field Summary Table

| Field Name      | Type           | Required | Format               | Source         |
|-----------------|----------------|----------|----------------------|----------------|
| zipCode         | Text Input     | Yes      | 5 digits             | User Entry     |
| homeOwnership   | Radio (2)      | Yes      | "yes" or "no"        | User Selection |
| electricBill    | Radio (5)      | Yes      | String ranges        | User Selection |
| email           | Email Input    | Yes      | Email format         | User Entry     |
| firstName       | Text Input     | Yes      | String               | User Entry     |
| lastName        | Text Input     | Yes      | String               | User Entry     |
| phone           | Phone Input    | Yes      | Digits only (10+)    | User Entry     |
| landing_page    | Auto           | Yes      | "1", "2", or "3"     | Auto-detected  |
| offer_name      | Auto           | Yes      | String               | Auto-detected  |
| utm_source      | URL Param      | No       | String (or "")       | URL Parameter  |
| utm_campaign    | URL Param      | No       | String (or "")       | URL Parameter  |
| utm_adset       | URL Param      | No       | String (or "")       | URL Parameter  |
| utm_ad          | URL Param      | No       | String (or "")       | URL Parameter  |
| fbclid          | URL Param      | No       | String (or "")       | URL Parameter  |
| submittedAt     | Auto           | Yes      | ISO 8601 timestamp   | Auto-generated |

---

**Notes:**
- All fields are included in every submission
- Tracking fields will be empty strings ("") if not present in URL
- Phone field automatically strips non-numeric characters
- All forms validate data before submission
- Timestamp is generated at the moment of form submission
