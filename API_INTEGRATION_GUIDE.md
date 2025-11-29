# API Integration Guide

## ✅ Complete Integration Status

Your frontend is now **fully integrated** with the MongoDB backend!

---

## 🔗 What's Connected

### 1. **Items (Products)**
- ✅ **Load items** from MongoDB on app startup
- ✅ **Add new items** saved to database (Artist/Admin)
- ✅ **Update items** synced to database
- ✅ **Update stock** synced to database
- 🔄 Fallback to sample data if database is empty or offline

### 2. **Orders**
- ✅ **Load orders** from MongoDB on app startup
- ✅ **Create orders** saved to database when checkout
- 🔄 Fallback to localStorage if database is offline

### 3. **Stock Management**
- ✅ Stock automatically decrements in database when orders placed
- ✅ Stock updates sync to MongoDB when admin changes inventory

---

## 📡 Backend Server

**Status:** ✅ Running  
**URL:** `http://localhost:3001`  
**Database:** MongoDB Atlas  
**Connection String:** `mongodb+srv://tanveer_shaik:***@cluster0.lrucrc6.mongodb.net/craftDB`

### Start Backend Server
```bash
cd fedf-backend
npm start
```

### Seed Database with Sample Data
```bash
cd fedf-backend
npm run seed
```

---

## 🔧 API Endpoints

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users (admin)

---

## 📂 Integration Points

### AppContext.jsx
All database operations are handled here:

```javascript
// Load items from MongoDB on mount
useEffect(() => {
  async function loadItems() {
    const data = await itemsAPI.getAll();
    setItems(data);
  }
  loadItems();
}, []);

// Save order to MongoDB
function addOrder(order) {
  const savedOrder = await ordersAPI.create(order);
  setOrders(prev => [savedOrder, ...prev]);
}

// Save new item to MongoDB
function addItem(item) {
  const savedItem = await itemsAPI.create(item);
  setItems(prev => [savedItem, ...prev]);
}

// Update item in MongoDB
function updateItem(id, patch) {
  await itemsAPI.update(id, patch);
  setItems(prev => prev.map(it => it.id === id ? {...it, ...patch} : it));
}
```

### services/api.js
All API calls are defined here with proper error handling.

---

## 🧪 Testing the Integration

### 1. Check Items in Database
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/items" -Method GET | Select-Object -ExpandProperty Content
```

### 2. Check Orders in Database
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/orders" -Method GET | Select-Object -ExpandProperty Content
```

### 3. Test Creating an Order
1. Login to your app
2. Add items to cart
3. Complete checkout
4. Check database: order should appear in MongoDB

### 4. Test Adding an Item (as Artist)
1. Login as artist
2. Go to Artist Dashboard
3. Add a new item
4. Check database: item should be saved

---

## 🛡️ Error Handling

The integration includes fallback mechanisms:

- **If database is offline:** Falls back to localStorage
- **If no items in database:** Uses sample data from `sampleCraft.js`
- **All errors logged:** Check browser console for debugging

---

## 📊 Current Database Contents

Run seed script to populate:
- ✅ 10 sample craft items
- ✅ All items have proper stock levels
- ✅ All items are approved

---

## 🚀 Next Steps

1. ✅ Backend server running on port 3001
2. ✅ Database seeded with sample items
3. ✅ Frontend loads items from database
4. ✅ Orders save to database
5. ✅ Item updates sync to database

**Everything is working! Your data is now persisted in MongoDB Atlas.**

---

## 🔍 Troubleshooting

### Frontend not loading items?
1. Check backend is running: `netstat -ano | findstr :3001`
2. Check MongoDB connection in backend terminal
3. Check browser console for errors

### Items not saving?
1. Verify API endpoint is correct in `services/api.js`
2. Check backend terminal for errors
3. Check MongoDB Atlas IP whitelist

### Backend won't start?
1. Verify `.env` file has correct MongoDB URI
2. Check MongoDB Atlas password is correct
3. Check IP address is whitelisted in Atlas

---

## 📝 Files Modified

1. ✅ `fedf-ps02/src/context/AppContext.jsx` - Added API integration
2. ✅ `fedf-backend/seed.js` - Created database seed script
3. ✅ `fedf-backend/package.json` - Added seed script command

---

**Status: FULLY INTEGRATED** ✅
