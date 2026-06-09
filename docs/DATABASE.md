# Database Documentation - DigitalKhataBook

## Configuration
- **Engine**: SQLite 3
- **Driver**: `better-sqlite3`
- **Path**: `database/khatabook.db`

## Tables

### 1. `users`
Stores admin credentials.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Primary Key |
| `username` | TEXT (Unique) | Login ID |
| `password` | TEXT | Bcrypt hashed password |
| `full_name` | TEXT | Display name |
| `created_at` | DATETIME | Timestamp |

### 2. `businesses`
Entities providing services/goods.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Primary Key |
| `name` | TEXT | Business Name |
| `type` | TEXT | Category (Dairy, Grocery, etc.) |
| `description` | TEXT | Summary |
| `status` | TEXT | 'Active' or 'Inactive' |
| `created_at` | DATETIME | Timestamp |

### 3. `customers`
Clients shared across businesses.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Primary Key |
| `customer_code` | TEXT (Unique) | Auto-generated ID (e.g., CUS0001) |
| `full_name` | TEXT | Searchable name |
| `mobile` | TEXT (Unique) | 10-digit number |
| `address` | TEXT | Residence info |
| `village_city` | TEXT | Searchable location |
| `notes` | TEXT | Internal remarks |
| `balance` | REAL | Total net balance |
| `created_at` | DATETIME | Timestamp |

### 4. `transactions`
Every credit/debit activity.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Primary Key |
| `date` | DATETIME | Full timestamp (ISO) |
| `customer_id` | INTEGER (FK) | Reference to customers |
| `business_id` | INTEGER (FK) | Reference to businesses (nullable) |
| `type` | TEXT | milk_collection, owner_payment, etc. |
| `amount` | REAL | Monetary value |
| `remarks` | TEXT | Notes |

## Relationships
- One **Customer** has Many **Transactions**.
- One **Business** has Many **Transactions**.
- **Transactions** table contains Foreign Keys to both `customers.id` and `businesses.id`.

## Migration Process
1. Do not modify `database/setup.js`.
2. Create `database/migrate_vN.js`.
3. Script logic should check if column/table exists before modifying.
4. Run via `node database/migrate_vN.js`.
