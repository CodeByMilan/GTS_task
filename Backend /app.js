const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
//importing data from the another file
const data = require("./model/itemsData")

// Middleware to handle CORS and JSON body parsing
app.use(cors({
  origin: '*' 
}));
app.use(express.json()); 


// api to fetch data
app.get('/getItems', (req, res) => {
  res.send(data); 
});

const createPackage = (selectedItems) => {
    //function to calculate courier charges
    const calculateCourierCharge = (weight) => {
        switch (true) {
          case (weight <= 200):
            return 5;
          case (weight <= 500):
            return 10;
          case (weight <= 1000):
            return 15;
          case (weight <= 5000):
            return 20;
          default:
            return 25; // For weights beyond 5000g, just an asumption 
        }
      };
  //initial value of final and initial package
    const finalPackages = []; 
    let initialPackage = { 
        items: [],
         totalWeight: 0, 
         totalPrice: 0 
    }; 
  

    for (const item of selectedItems) {
      const price = item.price
      const weight = item.weight
  
      if (initialPackage.totalPrice + price <= 250) {
        // the data is added to the current package 
        initialPackage.items.push(item);
        initialPackage.totalWeight += weight;
        initialPackage.totalPrice += price;
      } else {
        // If the package price exceeds $250 we push the current package to the final packages array and start a new package
        finalPackages.push(initialPackage);
        initialPackage = {
          items: [item],
          totalWeight: weight,
          totalPrice: price,
        };
      }
    }
    //after the every item is finished we push the last package to the final packages array
    if (initialPackage.items.length > 0) {
      finalPackages.push(initialPackage);
    }
  
    // calculating  the courier charge based on the total weight of the items in the final package
    finalPackages.forEach((pkg) => {
      pkg.courierPrice = calculateCourierCharge(pkg.totalWeight);
    });  
    return finalPackages;  
  };

// api endpoint to place an order and divide selected items into packages
app.post('/placeOrder', (req, res) => {
  const selectedItems = req.body.selectedItems; 
  if (!selectedItems || selectedItems.length === 0) {
    return res.status(400).send({ error: "No items selected" });
  }
  const packages = createPackage(selectedItems); 
  res.send({ packages }); 
});


app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
