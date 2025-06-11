# Fake Bike Shop E-Commerce API

## Problem Description

You're tasked with building a website that allows Marcus, a bicycle shop owner, to sell his bicycles. Marcus owns a growing business and now wants to sell online. He also tells you that bicycles are his main product, but if the business continues to grow, he will surely start selling other sports-related items such as skis, surfboards, roller skates, etc. It would be a nice bonus if the same website allowed him to sell those things as well.What makes Marcus's business successful is that customers can fully customize their bicycles. They can select many different options for the various parts of the bicycle.
Here is an incomplete list of all the parts and their possible choices, to give an example:

Frame type: Full-suspension, diamond, step-through
Frame finish: Matte, shiny
Wheels: Road wheels, mountain wheels, fat bike wheels
Rim color: Red, black, blue
Chain: Single-speed chain, 8-speed chain
On top of that, Marcus points out that some combinations are prohibited because they are not possible in reality. For example:

If you select "mountain wheels," then the only frame available is the full-suspension.
If you select "fat bike wheels," then the red rim color is unavailable because the manufacturer doesn't provide it.
Additionally, Marcus sometimes doesn't have all possible variations of each part in stock, so he wants to be able to mark them as "temporarily out of stock" to avoid receiving orders he can't fulfill.Finally, Marcus explains how to calculate the price that you should present to the customer after customizing a bicycle. Normally, this price is calculated by adding up the individual prices of each selected part. For example:

Full suspension = 130 EUR
Shiny frame = 30 EUR
Road wheels = 80 EUR
Rim color blue = 20 EUR
Chain: Single-speed chain = 43 EUR
Total price: 130 + 30 + 80 + 20 + 43 = 303 EUR
However, the price of some options might depend on others. For instance, the frame finish is applied over the whole bicycle, so the more area to cover, the more expensive it gets. Because of that, the matte finish over a full-suspension frame costs 50 EUR, while applied over a diamond frame it costs 35 EUR. These kinds of variations can always happen, and they might depend on any of the other choices, so Marcus asks you to consider this, as otherwise, he would be losing money.

## Implemented Solution

### Database Schema Relationships

This document summarizes the main database entities and their relationships, based on the actual Mongoose schemas in this project.

---

#### Entity Relationship Diagram (ERD)

```plaintext
+----------------+        +----------------+        +----------------+
|   Category     |<------>|    Product     |<------>|   Product      |
| (category)     |        | (product)      |        | (Variants,     |
| _id            |        | _id            |        | MasterProduct, |
| name           |        | name           |        | Composed)      |
| label          |        | label          |        +----------------+
| description    |        | description    |
| showInMenu     |        | image          |
+----------------+        | category_id    |
                          | variationAttrs |
                          | listPrice      |
                          | salesPrice     |
                          | stock          |
                          | productType    |
                          | composed       |
                          | variants       |
                          | masterProduct  |
                          +----------------+
                                   ^
                                   |
                                   |
                            +----------------+
                            |   User         |
                            | (user)         |
                            | _id            |
                            | ...            |
                            | cart:          |
                            |   total        |
                            |   items[]      |
                            |     product -->|---+
                            |     quantity   |   |
                            |     combination|---+
                            +----------------+
```

---

### Summary of Relationships

#### Category (`category/schemas/category.schema.ts`)
- **Fields:** `name`, `label`, `description`, `showInMenu`
- **Relationship:**  
  - One **Category** can have many **Products** (referenced by `category` field in Product).

### Product (`product/schemas/product.schema.ts`)
- **Fields:**  
  - `sku`, `name`, `label`, `description`, `image`, `category`, `variationAttributes`, `listPrice`, `salesPrice`, `stock`, `productType`, `composed`, `variants`, `masterProduct`
- **Relationships:**  
  - **Belongs to one Category** (`category` is an ObjectId ref to Category)
  - **Variants:**  
    - A "master" product can have many "variant" products (array of ObjectId refs to Product in `variants`)
    - Each "variant" product references its "master" via `masterProduct`
  - **Composed:**  
    - Products can be composed of other products (for customizable builds), via the `composed` field (array of arrays of `{ category, product }`)
  - **Variation Attributes:**  
    - Each product can have an array of variation attributes (e.g., color, size, finish)

#### User (`user/schemas/user.schema.ts`)
- **Fields:**  
  - User info, roles, and a `cart`
- **Cart:**  
  - `cart.items[]` contains:
    - `product`: ObjectId ref to Product
    - `combination`: array of ObjectId refs to Product (for composed/custom builds)
    - `quantity`
  - `cart.total`: total price

---

### Key Points

- **Products** are highly flexible: they can be simple, variants, or composed of other products.
- **Variants** allow for options like frame type, finish, wheels, etc., as separate products linked to a master.
- **Composed** products enable custom builds (e.g., a bike made of selected parts).
- **Categories** organize products (e.g., Bicycles, Skis).
- **Users** have a cart that references products and their combinations.

---

**This structure supports:**
- Customizable products with variants and composed parts.
- Stock and pricing per product/variant.
- User carts with custom combinations.