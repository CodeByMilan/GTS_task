📦 Order Packaging System
An end-to-end solution for optimizing product packaging and courier costs for an online store. This project demonstrates how to process customer orders, organize products into multiple packages following specific business rules, and calculate the shipping costs dynamically.

Built with Node.js for the backend, React.js for the frontend, and styled using Tailwind CSS, this solution ensures a clean, responsive, and functional user experience.

🚀 Features
Product List: Displays all available products with their name, price, and weight.
Order Placement: Customers can select multiple products and place an order with a simple click.
Package Optimization:
Ensures the total price of products in a package does not exceed $250.
Minimizes courier charges by distributing weights evenly across packages.
Dynamic Result Display:
Outputs the generated packages with item details, total weight, total price, and courier charges.
🛠️ Tech Stack
Frontend
React.js: Interactive and dynamic UI.
Tailwind CSS: Clean and responsive styling for a seamless user experience.
Backend
Node.js: Handles business logic and implements rules for product packaging and courier calculation.
Express.js: Powers the RESTful API.
🌟 How It Works
Product Selection:
Users select products from a list of items with checkboxes.
Order Processing:
Upon clicking "Place Order," the selected products are sent to the backend for processing.
Packaging Logic:
Products are divided into packages based on price and weight rules.
Courier charges are calculated dynamically.
Output:
Displays the packages in a clear, structured format, including item names, total weight, price, and courier charges.
