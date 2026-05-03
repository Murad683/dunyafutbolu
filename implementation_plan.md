# Unified Category System Implementation Plan

This plan outlines the changes required to move from static/string-based category management to a professional, unified, and dynamic category system across News (Articles), Transfers, and Videos.

## User Review Required

> [!IMPORTANT]
> **Database Schema Changes**: This update involves changing the `Transfer` and `Video` entities to use a `ManyToOne` relation with the `Category` entity instead of simple strings. This will break existing test data, but per your instructions, this is acceptable.

> [!NOTE]
> **Category Types**: We will introduce a `type` column in the `Category` entity to distinguish between categories for Articles, Leagues (for Transfers), and Video types.

## Proposed Changes

### Backend (NestJS)

---

#### [MODIFY] [category.entity.ts](file:///c:/Users/User/Downloads/dunyafutbolu-az/backend/src/categories/entities/category.entity.ts)
- Add `type` column: `@Column({ type: 'enum', enum: ['article', 'league', 'video'], default: 'article' })`.

#### [MODIFY] [categories.service.ts](file:///c:/Users/User/Downloads/dunyafutbolu-az/backend/src/categories/categories.service.ts)
- Update `findAll()` to accept an optional `type` filter.
- Update `onModuleInit()` to seed default categories for all types:
  - **Articles**: "Ölkə futbolu", "Dünya futbolu"
  - **Leagues**: "Premyer Liqa", "La Liga", "Seria A", etc.
  - **Videos**: "Trend", "Qol", "Fails", etc.

#### [MODIFY] [transfer.entity.ts](file:///c:/Users/User/Downloads/dunyafutbolu-az/backend/src/transfers/entities/transfer.entity.ts)
- Change `league: string` to `league: Category` with a `@ManyToOne` relation.

#### [MODIFY] [video.entity.ts](file:///c:/Users/User/Downloads/dunyafutbolu-az/backend/src/videos/entities/video.entity.ts)
- Change `category: string` to `category: Category` with a `@ManyToOne` relation.

#### [MODIFY] DTOs
- `CreateCategoryDto`: Add `type` field.
- `CreateTransferDto` / `CreateVideoDto`: Change `league`/`category` field to `leagueId`/`categoryId` (number).

### Admin Panel (React)

---

#### [MODIFY] [CategoriesPage.tsx](file:///c:/Users/User/Downloads/dunyafutbolu-az/admin/src/pages/CategoriesPage.tsx)
- Add a "Type" dropdown to the category creation form.
- Filter the categories table by type or display the type in the list.

#### [MODIFY] [TransfersPage.tsx](file:///c:/Users/User/Downloads/dunyafutbolu-az/admin/src/pages/TransfersPage.tsx)
- Fetch categories of type `league`.
- Replace the `league` text input with a `select` dropdown.

#### [MODIFY] [VideosPage.tsx](file:///c:/Users/User/Downloads/dunyafutbolu-az/admin/src/pages/VideosPage.tsx)
- Fetch categories of type `video`.
- Replace the `category` text input with a `select` dropdown.

### Frontend (React / TanStack Router)

---

#### [MODIFY] [transferler.tsx](file:///c:/Users/User/Downloads/dunyafutbolu-az/frontend/src/routes/transferler.tsx)
- Fetch leagues from `/categories?type=league`.
- Replace hardcoded `LEAGUE_FILTERS` with dynamic data from the API.

#### [MODIFY] [video.tsx](file:///c:/Users/User/Downloads/dunyafutbolu-az/frontend/src/routes/video.tsx)
- Fetch video categories from `/categories?type=video`.
- Replace hardcoded `CATS` with dynamic data from the API.

## Verification Plan

### Automated Tests
- Manual API testing via Swagger or Postman to ensure `/categories?type=...` returns the correct data.
- Verify that creating a transfer/video with a valid category ID works.

### Manual Verification
1. **Admin Panel**:
   - Create a new category of type "league" (e.g., "Bundesliga").
   - Open "Transfers" and verify "Bundesliga" appears in the dropdown.
   - Create a transfer and check if it's saved correctly.
2. **User Frontend**:
   - Open the "Transfers" page and verify the league filter reflects the categories in the DB.
   - Open the "Videos" page and verify the category filters are dynamic.
