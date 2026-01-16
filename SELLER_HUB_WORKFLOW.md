# Seller Hub Product Posting Workflow

## Overview
This document explains the complete workflow of how sellers post products and make them available across the platform's different marketplaces.

## 1. Product Creation Process

### 1.1 Seller Product Creation
- **Route**: `/seller/products/new`
- **Component**: `SellerProductCreate.jsx`
- **Backend Endpoint**: `POST /api/products`
- **Roles Allowed**: `Seller`, `ProspectiveSeller`, `Admin`

### 1.2 Automatic Approval for Sellers
When a seller creates a product:
```javascript
// In productController.js lines 115-119
if (req.user.role === 'Seller') {
  status = 'approved';  // Automatically set to approved
}
const approved = status === 'approved';
const verified = status === 'approved';
```

This means **seller-created products are automatically approved and verified**, making them immediately visible across all platforms.

### 1.3 Product Storage
Products are stored with:
- `status: 'approved'`
- `approved: true`
- `verified: true`
- `seller: [seller_user_id]`
- All product metadata (name, description, price, images, etc.)

## 2. Product Visibility Across Platforms

### 2.1 Eshop (/eshop)
**Location**: `client/src/pages/Eshop.jsx`
**API Call**: `GET /products?approved=true&verified=true`
**Visibility Criteria**: Products must be BOTH approved AND verified
**Access Level**: Public (any visitor)

### 2.2 Marketplace
**Location**: `client/src/pages/Marketplace.jsx`
**API Call**: `GET /products?approved=true&verified=true` (after fix)
**Visibility Criteria**: Products must be BOTH approved AND verified
**Access Level**: Public (any visitor)

### 2.3 Individual Seller Shop (/shop/:slug)
**Location**: `client/src/pages/SellerStorefront.jsx`
**API Call**: `GET /shops/:slug`
**Visibility Logic**:
- **Public View**: Shows only `status='approved'`, `approved=true`, `verified=true` products
- **Preview Mode**: Shows ALL seller products regardless of approval status
- **Access Control**: 
  - Shop owners can preview all their products
  - Public visitors see only approved products

## 3. Admin Product Management

### 3.1 Product Approval System
**Location**: `client/src/pages/admin/ProductApproval.jsx`
**Endpoints**:
- `PUT /admin/products/:id/approve` - Sets `approved=true`, `verified=true`, `status='approved'`
- `PUT /admin/products/:id/status` - Manual status management

### 3.2 Verification Process
Admins can:
- Verify individual products
- Fix all products for a seller
- Unapprove/reject products
- View pending approvals

## 4. Data Models

### 4.1 Product Model (`server/models/Product.js`)
Key fields for visibility:
```javascript
{
  status: { type: String, enum: ['pending', 'approved', 'disabled', 'hold'] },
  approved: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}
```

### 4.2 Seller Profile Model (`server/models/SellerProfile.js`)
Controls shop availability:
```javascript
{
  status: { type: String, enum: ['pending', 'active', 'suspended'] },
  slug: { type: String, unique: true }
}
```

## 5. Key Workflows

### 5.1 Seller Posts Product
1. Seller navigates to `/seller/products/new`
2. Fills product details and uploads images
3. Submits form
4. Backend automatically sets:
   - `status = 'approved'`
   - `approved = true`
   - `verified = true`
5. Product becomes immediately visible in Eshop, Marketplace, and Seller Shop

### 5.2 Visitor Views Products
1. **Eshop**: Shows all approved & verified products
2. **Marketplace**: Shows all approved & verified products
3. **Seller Shop**: Shows only approved products for that specific seller

### 5.3 Admin Moderation
1. Admin reviews pending products in admin panel
2. Can approve/unapprove products as needed
3. Can fix seller's entire product catalog at once

## 6. Troubleshooting

### 6.1 Product Not Appearing
Common causes:
- Product not approved/verified
- Seller profile not active
- Database inconsistency

### 6.2 Diagnostic Tools
Available scripts:
- `debug_eshop.js` - Check Eshop visibility issues
- `diagnose_products.js` - Comprehensive product status check
- `check_seller_status.js` - Seller-specific diagnostics

## 7. Recent Improvements

### 7.1 Consistency Fixes
- **Marketplace now filters by `approved=true&verified=true`** (previously showed all products)
- Unified approval criteria across all platforms
- Better logging for debugging visibility issues

### 7.2 Enhanced Visibility
- Products are immediately available upon creation
- Preview mode for sellers to see unapproved products
- Clear distinction between public and private views

## 8. Best Practices

### 8.1 For Sellers
- Products appear immediately after creation
- Use preview mode to check product presentation before going live
- Ensure all product information is complete and accurate

### 8.2 For Admins
- Monitor newly created products
- Use bulk actions for seller management
- Regularly check platform consistency with diagnostic tools

### 8.3 For Developers
- Maintain consistent approval criteria across all endpoints
- Add proper logging for visibility debugging
- Test cross-platform consistency regularly