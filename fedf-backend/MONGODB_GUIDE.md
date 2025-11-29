# MongoDB Integration Guide

## Setup Instructions

### 1. MongoDB Installation

**Option A: Local MongoDB (Windows)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Sign up at: https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Create a database user
4. Get connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/craftDB`)
5. Update `.env` file with your connection string

### 2. Start Backend Server

```bash
# Navigate to backend folder
cd D:\Front-End\FEDF_PROJECT-02\fedf-backend

# Start server
npm start
```

Backend will run on: **http://localhost:3001**

### 3. Start Frontend (React)

```bash
# Navigate to frontend folder
cd D:\Front-End\FEDF_PROJECT-02\fedf-ps02

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

## How to Use MongoDB in Your React App

### Example 1: Fetch Items from MongoDB

```javascript
import { itemsAPI } from '../services/api';

// In your component
useEffect(() => {
  async function loadItems() {
    try {
      const items = await itemsAPI.getAll();
      setItems(items);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }
  loadItems();
}, []);
```

### Example 2: Create Order in MongoDB

```javascript
import { ordersAPI } from '../services/api';

async function handleCheckout() {
  try {
    const orderData = {
      customer: { name, email, phone, address },
      items: cart,
      total: grandTotal,
      paymentMethod: 'card'
    };
    
    const savedOrder = await ordersAPI.create(orderData);
    console.log('Order saved:', savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
  }
}
```

### Example 3: User Login with MongoDB

```javascript
import { usersAPI } from '../services/api';

async function handleLogin(email, password) {
  try {
    const user = await usersAPI.login(email, password);
    setUser(user);
  } catch (error) {
    alert('Login failed');
  }
}
```

## API Endpoints

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order

### Users
- `POST /api/users/login` - Login
- `POST /api/users/register` - Register
- `GET /api/users` - Get all users

## Testing the API

Use these curl commands or Postman to test:

```bash
# Test if server is running
curl http://localhost:3001

# Create a new item
curl -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Vase","price":299,"stock":10}'

# Get all items
curl http://localhost:3001/api/items
```

## Environment Variables

Edit `fedf-backend/.env`:

```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/craftDB

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/craftDB?retryWrites=true&w=majority

PORT=3001
```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running (local) or connection string is correct (Atlas)
- Check port 3001 is not in use

### Frontend can't connect to backend
- Make sure backend is running on port 3001
- Check CORS is enabled in server.js

### MongoDB connection failed
- For local: Start MongoDB service
- For Atlas: Check firewall, whitelist your IP address
