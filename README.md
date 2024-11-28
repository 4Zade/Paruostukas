## API Documentation
### Authentication routes:

- `POST /api/auth/register` - Registers user.
- `POST /api/auth/login` - Logs user in.

### User routes

- `DELETE /api/users` - Deletes user account.

### Product routes

- `GET /api/products` - Get all products.
- `POST /api/products` - Create a new product.
- `GET /api/products/:id` - Get a single product.
- `PUT /api/products/:id` - Edit a single product.
- `DELETE /api/products/:id` - Delete a single product.
- `POST /api/products/:id/favorite` - Add product to favorites.

### Cart routes

- `GET /api/cart` - Get all user cart items.
- `DELETE /api/cart` - Clear users cart.
- `POST /api/cart/:id` - Add product to users cart.
- `DELETE /api/cart/:id` - Remove product from cart.