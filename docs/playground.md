---
title: Puppy School
layout: default
nav_order: 7
parent: Documentation
---

# DBMN Puppy School
{: #playground }

A live REST API sandbox for puppy training. Use it to learn Dobermann's features — batch uploads, pagination, nested data — without needing access to a production API.

All seed data is dog-themed because we're Dobermann and we think that's hilarious.

---

## What's Included

The playground provides three GS1/EDI-aligned supply chain domains plus reference lookup tables:

| Domain | Tables | Nesting | Demo Scenario |
|--------|--------|---------|---------------|
| **Shipments** (ASN / EDI 856) | Shipments → Packages → Items | 3-level | Nested JSON generation from flat CSV |
| **Purchase Orders** (EDI 850) | POs → Line Items | 2-level | Parent/child data loading |
| **Inventory** (EDI 846) | Single table | Flat | High-volume bulk uploads |
| **Reference Data** | Carriers, Locations, Products, Trading Partners | Lookup | FK-validated master data |

All three transactional domains come pre-loaded with dog-themed seed data — carrier names like "BarkPost Express" (SCAC: BARK), products like "Tennis Ball Launcher 3000", locations like "Golden Retriever Distribution Center". GET responses include nested reference objects automatically.

---

## Reference Data
{: #reference-data }

The playground uses reference/lookup tables with foreign key constraints to validate your data. When you POST a shipment with `carrierScac: "BARK"`, the API validates it exists in the carriers table and returns the full carrier object in GET responses.

### Available Reference Endpoints

| Endpoint | Records | Key |
|----------|---------|-----|
| `GET /reference/carriers` | 6 carriers | SCAC code |
| `GET /reference/locations` | 12 locations | GLN |
| `GET /reference/products` | 20 products | GTIN |
| `GET /reference/trading-partners` | 10 partners | GLN |

### Nested Reference Objects

GET responses automatically include nested reference data. For example, a shipment includes:

```json
{
  "shipmentId": "SHP-BARK-00001",
  "carrierScac": "BARK",
  "carrierName": "BarkPost Express",
  "carrier": {
    "scac": "BARK",
    "name": "BarkPost Express",
    "breed": "Golden Retriever",
    "motto": "Every package gets a tail wag"
  },
  "origin": {
    "gln": "0614141000012",
    "name": "Golden Retriever Distribution Center",
    "city": "Atlanta",
    "state": "GA"
  },
  "destination": {
    "gln": "0614141000050",
    "name": "Bulldog Bulk Warehouse",
    "city": "New York",
    "state": "NY"
  }
}
```

### FK Validation

If you POST data with an invalid SCAC, GLN, or GTIN, you'll get a helpful error:

```json
{
  "error": "Invalid reference value. Ensure carrier SCAC, location GLN, product GTIN, or trading partner GLN exists in the reference tables. Use GET /reference/<type> to see valid values.",
  "code": "FK_VIOLATION"
}
```

---

## Getting Started
{: #getting-started }

### 1. Sign In to DBMN

Click the DBMN icon in the VS Code status bar and sign in (or register for a free account).

### 2. Create an Environment

1. Open Dobermann, go to **Environments**
2. Create a new environment
3. Set the **Name** to: `DBMN Puppy School`
4. Set the **Base URL** to: `https://api.dbmn.io/functions/v1/playground`

### 3. Set Authentication to DBMN

1. In the environment's **Authentication** section, select **DBMN** from the dropdown
2. That's it — Dobermann injects your DBMN token automatically at execution time

No manual headers or token copy/paste required. If your session expires, Dobermann prompts you to re-authenticate before execution.

### 4. Create Endpoints

Use the ready-to-paste templates below. For each one:

1. Create a new endpoint
2. Click **Paste**
3. Paste the template — Dobermann populates everything automatically

---

## Endpoint Templates
{: #endpoint-templates }

Copy any template below and paste it into a new Dobermann endpoint.

### Inventory — Bulk Upload (POST)
{: #inventory-bulk-upload }

Upload inventory records in bulk. Accepts an array of items — ideal for demonstrating high-volume batch execution with 16+ threads.

```javascript
// Name: Puppy School — Bulk Inventory Upload
// Method: POST
// Path: /inventory
// Header: Content-Type: application/json [enabled]

[
  {
    "gtin": "{{gtin}}",
    "sku": "{{sku}}",
    "description": "{{description}}",
    "locationGln": "{{locationGln}}",
    "locationName": "{{locationName}}",
    "quantityOnHand": "{{quantityOnHand:number}}",
    "uom": "{{uom}}",
    "status": "{{status}}"
  }
]
```

{: .note }
> **Bulk array format** — The body is a JSON array, so each row in your CSV becomes one element. When running with multiple threads, each transaction sends its own array of records. This is the fastest way to load large volumes.

### Inventory — List with Pagination (GET)
{: #inventory-list }

Paginated inventory listing. Configure this endpoint to demonstrate Dobermann's pagination feature. Responses include nested `location` and `product` reference objects.

```javascript
// Name: Puppy School — List Inventory
// Method: GET
// Path: /inventory
// QueryParam: page: {{A8:PAGE:0:totalCount}} [enabled]
// QueryParam: size: {{A8:SIZE:100:pageSize}} [enabled]
// QueryParam: order: desc [enabled]
```

### Inventory — Get by ID (GET)
{: #inventory-get }

```javascript
// Name: Puppy School — Get Inventory
// Method: GET
// Path: /inventory/{{id}}
```

### Inventory — Update (PUT)
{: #inventory-update }

```javascript
// Name: Puppy School — Update Inventory
// Method: PUT
// Path: /inventory/{{id}}
// Header: Content-Type: application/json [enabled]

{
  "quantityOnHand": "{{quantityOnHand:number}}",
  "status": "{{status}}"
}
```

### Inventory — Delete (DELETE)
{: #inventory-delete }

```javascript
// Name: Puppy School — Delete Inventory
// Method: DELETE
// Path: /inventory/{{id}}
```

---

### Purchase Orders — Nested Upload (POST)
{: #po-upload }

2-level nested upload. Each CSV row contains both PO header and line item fields — Dobermann's JSON generator groups them automatically.

```javascript
// Name: Puppy School — Create Purchase Orders
// Method: POST
// Path: /purchase-orders
// Header: Content-Type: application/json [enabled]

{
  "poNumber": "{{poNumber}}",
  "buyerName": "{{buyerName}}",
  "supplierName": "{{supplierName}}",
  "status": "{{status}}",
  "currency": "USD",
  "lines": [
    {
      "lineNumber": "{{lineNumber:number}}",
      "gtin": "{{gtin}}",
      "sku": "{{sku}}",
      "description": "{{description}}",
      "orderedQty": "{{orderedQty:number}}",
      "unitPrice": "{{unitPrice:number}}",
      "uom": "{{uom}}"
    }
  ]
}
```

### Purchase Orders — List with Pagination (GET)
{: #po-list }

Responses include nested `buyer` and `supplier` reference objects from the trading partners table.

```javascript
// Name: Puppy School — List Purchase Orders
// Method: GET
// Path: /purchase-orders
// QueryParam: page: {{A8:PAGE:0:totalCount}} [enabled]
// QueryParam: size: {{A8:SIZE:100:pageSize}} [enabled]
// QueryParam: order: desc [enabled]
```

### Purchase Orders — Get with Line Items (GET)
{: #po-get }

Returns the PO with nested `buyer`/`supplier` objects and all line items (each with nested `product` reference).

```javascript
// Name: Puppy School — Get Purchase Order
// Method: GET
// Path: /purchase-orders/{{id}}
```

### Purchase Orders — Update (PUT)
{: #po-update }

```javascript
// Name: Puppy School — Update Purchase Order
// Method: PUT
// Path: /purchase-orders/{{id}}
// Header: Content-Type: application/json [enabled]

{
  "status": "{{status}}"
}
```

### Purchase Orders — Delete (DELETE)
{: #po-delete }

```javascript
// Name: Puppy School — Delete Purchase Order
// Method: DELETE
// Path: /purchase-orders/{{id}}
```

---

### Shipments — 3-Level Nested Upload (POST)
{: #shipments-upload }

The most complex template: shipments contain packages, which contain items. All three levels are generated from a single flat CSV file.

```javascript
// Name: Puppy School — Create Shipments (3-level)
// Method: POST
// Path: /shipments
// Header: Content-Type: application/json [enabled]

{
  "shipmentId": "{{shipmentId}}",
  "carrierScac": "{{carrierScac}}",
  "carrierName": "{{carrierName}}",
  "originGln": "{{originGln}}",
  "originName": "{{originName}}",
  "destinationGln": "{{destinationGln}}",
  "destinationName": "{{destinationName}}",
  "packages": [
    {
      "sscc": "{{sscc}}",
      "packageType": "{{packageType}}",
      "weight": "{{weight:number}}",
      "weightUom": "{{weightUom}}",
      "items": [
        {
          "gtin": "{{gtin}}",
          "sku": "{{sku}}",
          "description": "{{description}}",
          "quantity": "{{quantity:number}}",
          "lotNumber": "{{lotNumber}}"
        }
      ]
    }
  ]
}
```

### Shipments — List with Pagination (GET)
{: #shipments-list }

Responses include nested `carrier`, `origin`, and `destination` reference objects.

```javascript
// Name: Puppy School — List Shipments
// Method: GET
// Path: /shipments
// QueryParam: page: {{A8:PAGE:0:totalCount}} [enabled]
// QueryParam: size: {{A8:SIZE:100:pageSize}} [enabled]
// QueryParam: order: desc [enabled]
```

### Shipments — Get with Packages and Items (GET)
{: #shipments-get }

Returns the full 3-level hierarchy: shipment with nested `carrier`/`origin`/`destination` objects, packages, and their items (each with nested `product` reference).

```javascript
// Name: Puppy School — Get Shipment
// Method: GET
// Path: /shipments/{{id}}
```

### Shipments — Update (PUT)
{: #shipments-update }

```javascript
// Name: Puppy School — Update Shipment
// Method: PUT
// Path: /shipments/{{id}}
// Header: Content-Type: application/json [enabled]

{
  "status": "{{status}}"
}
```

### Shipments — Delete (DELETE)
{: #shipments-delete }

```javascript
// Name: Puppy School — Delete Shipment
// Method: DELETE
// Path: /shipments/{{id}}
```

---

### Reference Data — Lookup Tables (GET)
{: #reference-endpoints }

Read-only endpoints returning the master data used for FK validation.

```javascript
// Name: Puppy School — List Carriers
// Method: GET
// Path: /reference/carriers
```

```javascript
// Name: Puppy School — List Locations
// Method: GET
// Path: /reference/locations
```

```javascript
// Name: Puppy School — List Products
// Method: GET
// Path: /reference/products
```

```javascript
// Name: Puppy School — List Trading Partners
// Method: GET
// Path: /reference/trading-partners
```

---

### Stats — Check Usage (GET)
{: #stats }

Check your current row count, limit, and remaining capacity.

```javascript
// Name: Puppy School — My Stats
// Method: GET
// Path: /stats
```

**Response:**

```json
{
  "userId": "abc-123",
  "rowCount": 1250,
  "rowLimit": 250000,
  "rowsRemaining": 248750,
  "ttlHours": 48
}
```

### Reset — Delete All My Data (DELETE)
{: #reset }

Remove all your playground data (seed data is preserved).

```javascript
// Name: Puppy School — Reset My Data
// Method: DELETE
// Path: /my-data
```

---

## Sample CSV Files
{: #sample-csv }

Download these CSV files to use with the endpoint templates above.

### Flat Bulk — Inventory

For use with the [Bulk Inventory Upload](#inventory-bulk-upload) endpoint.

```csv
gtin,sku,description,locationGln,locationName,quantityOnHand,uom,status
00012345600012,SKU-WOOF-001,Premium Belly Rub Machine,0614141000012,Golden Retriever Distribution Center,500,EA,active
00012345600029,SKU-WOOF-002,Tennis Ball Launcher 3000,0614141000029,Labrador Logistics Hub,120,CS,low_stock
00012345600036,SKU-WOOF-003,Squirrel Detection Radar,0614141000036,German Shepherd Sorting Facility,850,EA,active
00012345600043,SKU-WOOF-004,Anti-Mailman Defense System,0614141000043,Poodle Processing Center,30,EA,low_stock
00012345600050,SKU-WOOF-005,Automatic Treat Dispenser Pro,0614141000050,Bulldog Bulk Warehouse,200,EA,active
00012345600067,SKU-WOOF-006,Indestructible Chew Toy (Ha Right),0614141000067,Husky High-Speed Hub,75,EA,reserved
00012345600074,SKU-WOOF-007,Self-Cleaning Dog Bath Station,0614141000012,Golden Retriever Distribution Center,400,EA,active
00012345600081,SKU-WOOF-008,AI-Powered Smart Dog Door,0614141000029,Labrador Logistics Hub,160,EA,active
00012345600098,SKU-WOOF-009,GPS Walkies Tracker Collar,0614141000036,German Shepherd Sorting Facility,25,EA,in_transit
00012345600104,SKU-WOOF-010,Artisanal Organic Bone Box,0614141000043,Poodle Processing Center,600,EA,active
```

### 2-Level Nested — Purchase Orders

For use with the [Purchase Orders Upload](#po-upload) endpoint.

```csv
poNumber,buyerName,supplierName,status,lineNumber,gtin,sku,description,orderedQty,unitPrice,uom
PO-WOOF-00001,Goodest Boy Enterprises,Chew Toy Manufacturing Inc,submitted,1,00012345600012,SKU-WOOF-001,Premium Belly Rub Machine,100,149.99,EA
PO-WOOF-00001,Goodest Boy Enterprises,Chew Toy Manufacturing Inc,submitted,2,00012345600029,SKU-WOOF-002,Tennis Ball Launcher 3000,50,89.99,EA
PO-WOOF-00001,Goodest Boy Enterprises,Chew Toy Manufacturing Inc,submitted,3,00012345600036,SKU-WOOF-003,Squirrel Detection Radar,200,249.99,EA
PO-WOOF-00002,Tail Waggers International,Wagmore Components Ltd,acknowledged,1,00012345600043,SKU-WOOF-004,Anti-Mailman Defense System,75,349.99,EA
PO-WOOF-00002,Tail Waggers International,Wagmore Components Ltd,acknowledged,2,00012345600050,SKU-WOOF-005,Automatic Treat Dispenser Pro,30,129.99,EA
PO-WOOF-00003,The Paw Print Trading Company,Boop & Snoot Supply Co,draft,1,00012345600067,SKU-WOOF-006,Indestructible Chew Toy (Ha Right),500,24.99,EA
PO-WOOF-00003,The Paw Print Trading Company,Boop & Snoot Supply Co,draft,2,00012345600074,SKU-WOOF-007,Self-Cleaning Dog Bath Station,120,499.99,EA
PO-WOOF-00003,The Paw Print Trading Company,Boop & Snoot Supply Co,draft,3,00012345600081,SKU-WOOF-008,AI-Powered Smart Dog Door,80,299.99,EA
```

### 3-Level Nested — Shipments

For use with the [Shipments Upload](#shipments-upload) endpoint.

```csv
shipmentId,carrierScac,carrierName,originGln,originName,destinationGln,destinationName,sscc,packageType,weight,weightUom,gtin,sku,description,quantity,lotNumber
SHP-BARK-00001,BARK,BarkPost Express,0614141000012,Golden Retriever Distribution Center,0614141000050,Bulldog Bulk Warehouse,00340123450000000018,pallet,250.5,KG,00012345600012,SKU-WOOF-001,Premium Belly Rub Machine,100,LOT-WOOF-2026-A
SHP-BARK-00001,BARK,BarkPost Express,0614141000012,Golden Retriever Distribution Center,0614141000050,Bulldog Bulk Warehouse,00340123450000000018,pallet,250.5,KG,00012345600029,SKU-WOOF-002,Tennis Ball Launcher 3000,50,LOT-WOOF-2026-B
SHP-BARK-00001,BARK,BarkPost Express,0614141000012,Golden Retriever Distribution Center,0614141000050,Bulldog Bulk Warehouse,00340123450000000025,carton,12.3,KG,00012345600036,SKU-WOOF-003,Squirrel Detection Radar,200,LOT-WOOF-2026-C
SHP-PAWZ-00002,PAWZ,PawPrint Logistics,0614141000029,Labrador Logistics Hub,0614141000067,Husky High-Speed Hub,00340123450000000049,pallet,180.0,KG,00012345600050,SKU-WOOF-005,Automatic Treat Dispenser Pro,30,LOT-WOOF-2026-E
SHP-PAWZ-00002,PAWZ,PawPrint Logistics,0614141000029,Labrador Logistics Hub,0614141000067,Husky High-Speed Hub,00340123450000000049,pallet,180.0,KG,00012345600067,SKU-WOOF-006,Indestructible Chew Toy (Ha Right),150,LOT-WOOF-2026-F
SHP-PAWZ-00002,PAWZ,PawPrint Logistics,0614141000029,Labrador Logistics Hub,0614141000067,Husky High-Speed Hub,00340123450000000056,crate,45.2,KG,00012345600074,SKU-WOOF-007,Self-Cleaning Dog Bath Station,40,LOT-WOOF-2026-G
```

---

## Pagination Response
{: #pagination }

All GET list endpoints return a paginated envelope:

```json
{
  "totalCount": 5000,
  "pageSize": 100,
  "page": 0,
  "totalPages": 50,
  "data": [ ... ]
}
```

This works with Dobermann's pagination variables:

| Variable | Maps to |
|----------|---------|
| `{{A8:PAGE:0:totalCount}}` | `page` param, reads `totalCount` from response |
| `{{A8:SIZE:100:pageSize}}` | `size` param, reads `pageSize` from response |

### Filtering and Sorting

Add query parameters to filter and sort:

| Parameter | Example | Description |
|-----------|---------|-------------|
| `status` | `?status=active` | Filter by status |
| `sort` | `?sort=created_at` | Sort field |
| `order` | `?order=asc` | Sort direction (`asc` or `desc`) |

---

## Multi-Threaded Batch Execution
{: #multi-threaded }

The playground handles concurrent requests well. When running batch uploads:

- **Flat uploads (Inventory)** — Run with up to 16 threads. Each thread sends its own batch of records. The API handles concurrent inserts.
- **Nested uploads (POs, Shipments)** — Run with up to 16 threads. Each thread processes its own parent + child records independently.

{: .note }
> **Tip** — For the best demo experience, start with 4 threads and increase to 16 to show the speed difference. The inventory bulk upload is the ideal endpoint for thread scaling demos.

---

## Limits
{: #limits }

| Limit | Value |
|-------|-------|
| **Rows per user** | 250,000 across all tables |
| **Max items per POST** | 1,000 |
| **Max page size** | 500 |
| **Data TTL** | 48 hours (your data auto-purges; seed data is permanent) |

Use the [Stats](#stats) endpoint to check your current usage. Use [Reset](#reset) to clear all your data immediately.

---

## Error Responses
{: #errors }

The playground returns structured errors:

```json
{
  "error": "Row limit exceeded",
  "code": "ROW_LIMIT_EXCEEDED",
  "details": { "current": 248500, "requested": 2000, "limit": 250000 }
}
```

| Code | Status | Meaning |
|------|--------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid JSON body |
| `FK_VIOLATION` | 400 | Invalid SCAC, GLN, or GTIN — not in reference tables |
| `BULK_LIMIT_EXCEEDED` | 400 | More than 1,000 items in one POST |
| `ROW_LIMIT_EXCEEDED` | 429 | Would exceed 250,000 row limit |

---

## Data Isolation
{: #data-isolation }

- **Seed data** — Visible to all authenticated users. Cannot be modified or deleted.
- **Your data** — Only you can see, update, and delete your own records.
- **Other users** — Cannot see your data. You cannot see theirs.
- **Reference data** — Read-only for all users. Used for FK validation.

---

## Related Topics

- [Endpoints](/docs/endpoints/) — Full endpoint configuration reference
- [Template Variables](/docs/template-variables/) — Variable syntax, types, and modifiers
- [Batch Preparation](/docs/batch-preparation/) — Load CSV data and map columns
- [Pagination](/docs/pagination/) — Configure paginated API requests
- [Sharing Endpoints](/docs/sharing-endpoints/) — Share endpoint templates with your team
