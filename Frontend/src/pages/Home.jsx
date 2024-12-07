import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const Home = () => {
  // State variables to store the items, user-selected items, and the packages which are empty at the start
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items per page

  const backendUrl = import.meta.env.VITE_BACKENDURL;

  // Fetch products from the backend once the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/getItems`);
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handling the behavior of checkbox
  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        // Remove item if it's already selected
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem !== item
        );
      } else {
        // Previous data remains unchanged and add the new item
        return [...prevSelectedItems, item];
      }
    });
  };

  // Handle form submission
  const handlePlaceOrder = async (event) => {
    // Used to prevent page refresh on form submission
    event.preventDefault();

    if (selectedItems.length === 0) {
      setError("Please select at least one item.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/placeOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedItems }), // Stringify selectedItems to send as JSON
      });

      if (response.status === 200) {
        const data = await response.json();
        setPackages(data.packages);
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch (err) {
      setError("Failed to place order");
    }
  };

  // Pagination logic
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // Update currentPage when user clicks a page number
  };

  // Render loading state if data is still being fetched for better user experience
  if (loading) return <div>Loading...</div>;

  return (
    <div className="m-auto p-20">
      <h1 className="font-bold text-4xl text-center mb-10">Products List</h1>

      {/* I have used form as it will be easier because of browser's built-in form submission handling */}
      <form onSubmit={handlePlaceOrder}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Weight</th>
                <th className="px-4 py-2 text-left">Select</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.price}</td>
                  <td className="px-4 py-2">{item.weight}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      onChange={() => handleSelectItem(item)}
                      checked={selectedItems.includes(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Place Order
          </button>
        </div>
        {/* React Paginate Component */}
        <div className="mt-4 flex justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(items.length / itemsPerPage)}
            onPageChange={handlePageClick}
            containerClassName="flex space-x-2"
            pageClassName="flex"
            pageLinkClassName="px-3 py-1 border rounded-lg hover:bg-gray-100 text-blue-600"
            previousClassName="flex"
            nextClassName="flex"
            disabledClassName="opacity-50 cursor-not-allowed"
            activeClassName="bg-blue-500 text-white"
          />
        </div>
      </form>

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      {/* To display the summary of the data that user selects */}
      {packages.length > 0 && (
        <div className="mt-10">
          <h2 className="font-bold text-2xl text-center mb-4">Order Summary</h2>
          {packages.map((pkg, index) => (
            <div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg">
              <h3 className="font-bold">Package {index + 1}</h3>
              <ul>
                {pkg.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} - ${item.price}
                  </li>
                ))}
              </ul>
              <p>Total Weight: {pkg.totalWeight}g</p>
              <p>Total Price: ${pkg.totalPrice}</p>
              <p>Courier Charge: ${pkg.courierPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
