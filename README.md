Demo Credentials
    - Create a .env file in the client folder and paste the following line:
        VITE_BACKEND_URL=https://restaurantapp-qbs3.onrender.com

    - Create a .env file in the server folder and paste the following line:
        MONGO_URI=mongodb+srv://shreyagavali32:F9m9A2UbzL2MFm7B@cluster0.tvkzdbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

Setup Instructions
    - Frontend
        cd client
        npm install
        npm run dev
    - Backend
        cd server
        npm install
        npm run dev

Features Implemented
    - Users can select menu items by clicking the + button. After selecting items, clicking the Next button redirects the user to the Checkout page.
    - On the Checkout page:
        Users can add cooking instructions.
        Users must select the order type: Dine-in or Takeaway.
        Users must provide personal information:
        For Dine-in: Name and phone number.
        For Takeaway: Name, phone number, and address.
        After entering the details, the user can place the order.
    - When an order is placed:
        The system searches for a table with status "available", stores the table ID in the database with the order, and changes the table status to "reserved".
        The chef with the fewest active orders is assigned the new order, and the chef’s ID is stored in the order document.
        All orders are visible on the Orders page. After placing an order, it will appear in the "Ongoing" state for 20 minutes. After 20 minutes:
        The order status changes to "Done".
        The assigned chef's order count is reduced by one.
    - Admin Features:
        Add and delete tables.
        View total chefs, total revenue, total clients, and total orders on the dashboard.
    - Search Feature:
        On the Analytics page, the admin can search for order summaries, revenue, tables, and chef tables.
        On the Chair page, the admin can search by table number and chair number.
        On the Orders page, the admin can search by order type, such as Dine-In, Takeaway, Served, or Done.
        Users can search for menu items like Pizza, Burger, Cold Drinks, and French Fries.

