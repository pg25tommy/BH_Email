# Menu Control Feature Specification

## Overview
Menu management system for Burger Heaven Email Admin Panel that controls menu items, prices, bestsellers, and sold out status. The main BH_Site will read from this admin panel's API.

## Branch
`feature/menu-control`

## Database Schema (Prisma)
Located in `prisma/schema.prisma`:

```prisma
model Category {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  sortOrder   Int        @default(0)
  active      Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  menuItems   MenuItem[]
}

model MenuItem {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  image       String?
  featured    Boolean  @default(false)
  bestSeller  Boolean  @default(false)
  soldOut     Boolean  @default(false)
  active      Boolean  @default(true)
  sortOrder   Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([categoryId])
}
```

## Database Setup
Tables were created with `npx prisma db push`. Database is PostgreSQL on Neon (Vercel).

**To regenerate Prisma client:**
```bash
npx prisma generate
```

**To push schema changes:**
```bash
npx prisma db push
```

**To seed menu data:**
```bash
npm run db:seed-menu
```

## API Routes Created

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/menu` | GET | Public endpoint for BH_Site (with CORS) |
| `/api/menu/categories` | GET, POST | List/create categories |
| `/api/menu/categories/[id]` | GET, PATCH, DELETE | Single category CRUD |
| `/api/menu/items` | GET, POST | List/create items (with filters) |
| `/api/menu/items/[id]` | GET, PATCH, DELETE | Single item CRUD |

## Dashboard Pages Created

| Page | Purpose |
|------|---------|
| `/dashboard/menu-control` | Overview with stats |
| `/dashboard/menu-control/categories` | Category management |
| `/dashboard/menu-control/items` | Item management with filters |

## Components Created

| File | Purpose |
|------|---------|
| `src/components/CategoryForm.tsx` | Add/edit category form |
| `src/components/CategoryTable.tsx` | Categories list with actions |
| `src/components/MenuItemForm.tsx` | Add/edit menu item form |
| `src/components/MenuItemTable.tsx` | Items table with quick toggles |
| `src/components/MenuFilterBar.tsx` | Filter by category, bestseller, sold out |

## Other Files Created/Modified

| File | Change |
|------|--------|
| `src/types/menu.ts` | TypeScript interfaces |
| `src/components/Sidebar.tsx` | Added "Menu Control" nav item |
| `prisma/seed-menu.ts` | Seed script with 14 categories and 95+ items |
| `package.json` | Added `db:seed-menu` script |

## Current Status
- All code is written and committed
- Database tables exist in Neon PostgreSQL
- Prisma client may need regeneration (`npx prisma generate`)
- Menu data needs to be seeded (`npm run db:seed-menu`)

## To Complete Setup

1. **Regenerate Prisma client:**
   ```bash
   npx prisma generate
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Seed the menu data:**
   ```bash
   npm run db:seed-menu
   ```

4. **Test at:** http://localhost:3003/dashboard/menu-control

## BH_Site Integration
The main site should fetch from `/api/menu`:
```typescript
const res = await fetch('https://your-admin-url/api/menu');
const { categories } = await res.json();
```

CORS is configured to allow requests from BH_Site's Vercel URL.

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- Both `.env` and `.env.local` should have the DATABASE_URL
