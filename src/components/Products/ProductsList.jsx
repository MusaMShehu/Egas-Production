// src/components/Products/Products.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categories = [
    { id: "all", name: "All Products" },
    { id: "gas", name: "Gas Cylinders" },
    { id: "cylinder", name: "Cylinder Accessories" },
    { id: "cooker", name: "Cooker Accessories" },
    { id: "safety", name: "Safety Equipment" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setTimeout(() => {
          const productsData = [
            // Gas Cylinders
            {
              id: 1,
              name: "6kg Cooking Gas",
              category: "gas",
              price: 9000,
              images: [
                "https://media.istockphoto.com/id/590245268/photo/3d-gas-bottle-on-white-background.jpg?s=612x612&w=0&k=20&c=bf1hif5vTk8Tg4T-kOPYrS0hbIVMu4mNfBosfCY31_k=",
                "https://media.istockphoto.com/id/1289113713/photo/a-set-of-lpg-or-butane-gas-is-packaged-in-a-steel-tank-in-the-shape-of-a-cylinder.jpg?s=612x612&w=0&k=20&c=9uO92Jo4cVNbBfDbhhx2j36ZVrvKHtgipYvIiWeIZD4=",
              ],
              description:
                "Perfect for small households, students, or occasional use",
              details:
                "Our 6kg cooking gas cylinder is perfect for small households, students, or occasional use. Compact and easy to handle, it provides reliable performance for all your cooking needs.",
              features: [
                "Compact and easy to handle",
                "Ideal for small households",
                "Perfect for students and singles",
                "Easy to transport and store",
                "Reliable performance",
              ],
              capacity: "6kg",
            },
            {
              id: 2,
              name: "12.5kg Cooking Gas",
              category: "gas",
              price: 18000,
              images: [
                "https://media.istockphoto.com/id/2142134090/photo/red-gas-tanks-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=kID4GDNaL-h3iwAwXf2JGWAx9_b7fRqF2PQhxML5Hl4=",
                "https://media.istockphoto.com/id/2142134085/photo/green-gas-tanks-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=URpVobcb9o_N37oq4FAIM81J1iBwG36XVHAAAF636Xw=",
              ],
              description:
                "Ideal for medium-sized families and regular cooking",
              details:
                "The 12.5kg cooking gas cylinder is ideal for medium-sized families and regular cooking. It offers the perfect balance between capacity and convenience for everyday use.",
              features: [
                "Perfect for medium-sized families",
                "Balanced capacity and convenience",
                "Ideal for regular cooking",
                "Cost-effective solution",
                "Easy to refill",
              ],
              capacity: "12.5kg",
            },
            {
              id: 3,
              name: "25kg Cooking Gas",
              category: "gas",
              price: 37500,
              images: [
                "https://media.istockphoto.com/id/1460745281/photo/blue-gas-cylinder.jpg?s=612x612&w=0&k=20&c=QeBsGUib1_k00OdwtuQu4pkZvlGQi1wDLFqzzYWaB-4=",
                "https://media.istockphoto.com/id/1460745541/photo/blue-gas-cylinder.jpg?s=612x612&w=0&k=20&c=b6YQr8_uFvAVd_gFLHhmUThylTKjb3i7SIfp8OCIWRY=",
              ],
              description: "For large families or small restaurants",
              details:
                "Our 25kg cooking gas cylinder is designed for large families or small restaurants. With substantial capacity, it reduces the frequency of refills while ensuring uninterrupted service.",
              features: [
                "Ideal for large families",
                "Perfect for small restaurants",
                "Reduces refill frequency",
                "Cost-efficient for heavy usage",
                "Sturdy construction",
              ],
              capacity: "25kg",
            },
            {
              id: 4,
              name: "50kg Commercial Gas",
              category: "gas",
              price: 75000,
              images: [
                "https://media.istockphoto.com/id/506557810/photo/lpg-gas-bottles-lpg-plant.jpg?s=612x612&w=0&k=20&c=AamrtxVcuUHNGorlMy90jnoQKYESdOLZ05t13WrS59U=",
                "https://media.istockphoto.com/id/1500654145/photo/highly-flammable-gas-propane-cylinders-at-caravan-park.jpg?s=612x612&w=0&k=20&c=fqs_zrTPCw3maxBPdNJGfCTPiwhr_bAJ3sGfWu1sp1Y=",
              ],
              description:
                "Commercial size for restaurants, hotels and industries",
              details:
                "The 50kg commercial gas cylinder is designed for restaurants, hotels, and industrial use. It provides high capacity for demanding commercial applications with reliable performance.",
              features: [
                "Commercial grade quality",
                "Ideal for restaurants and hotels",
                "High capacity for heavy usage",
                "Industrial-grade construction",
                "Reliable performance",
              ],
              capacity: "50kg",
            },

            // Gas Cylinder Accessories
            {
              id: 5,
              name: "Standard Regulator",
              category: "cylinder",
              price: 24999,
              images: [
                "https://media.istockphoto.com/id/1780087406/photo/low-pressure-lpg-gas-regulator.jpg?s=612x612&w=0&k=20&c=HVDExox8hvTdcaSrJ1j3_mN9I3RFwotRXVwWfOhcZ4k=",
                "https://media.istockphoto.com/id/1270654308/photo/gas-auto-safety-controller-valve-for-connecting-with-gas-stove-and-gas-tank-isolated.jpg?s=612x612&w=0&k=20&c=0dbWZ08fABIwpIHsfTKi7YZsAApvKs7bnsBzbBLFtQE=",
                "https://media.istockphoto.com/id/664144832/photo/gas-valve-pressure-regulator-on-white.jpg?s=612x612&w=0&k=20&c=YBbIuW60PKrE0qIN6jHBMCb5i8fKUcu5AV8w6EE6S5Y=",
              ],
              description:
                "High-quality standard regulator for controlling gas pressure from cylinder to cooker.",
              details:
                "Our standard regulator ensures consistent gas pressure for optimal cooker performance. Made from durable materials with safety features to prevent gas leaks. This regulator is compatible with most standard gas cylinders and provides reliable performance for everyday cooking needs.",
              features: [
                "Pressure control for consistent flow",
                "Built-in safety valve",
                "Easy to install and use",
                "Durable brass construction",
                "Compatible with most standard cylinders",
              ],
            },
            {
              id: 6,
              name: "High-Pressure Regulator",
              category: "cylinder",
              price: 34999,
              images: [
                "https://media.istockphoto.com/id/521512235/photo/gas-pressure-regulator-with-manometer-isolated-with-clipping-path.jpg?s=612x612&w=0&k=20&c=dnI-sVFFj-3LqHd8IMNlKX41vRjLMnGPucyNb8VkIdg=",
                "https://media.istockphoto.com/id/520540103/photo/gas-pressure-regulator-with-manometer-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=4hhlkpyRd5pIygRwiFnNQLCuheu6o0zXnkObB4sAsdQ=",
              ],
              description:
                "Designed for high-pressure applications with enhanced safety features.",
              details:
                "Ideal for commercial kitchens or high-BTU appliances. Features precision pressure control and advanced safety mechanisms. This heavy-duty regulator can handle the demands of professional cooking environments while maintaining safety standards.",
              features: [
                "Handles high-pressure gas flow",
                "Enhanced safety lock mechanism",
                "Precision pressure gauge",
                "Industrial-grade materials",
                "Suitable for commercial use",
              ],
            },
            {
              id: 7,
              name: "Gas Hose (5ft)",
              category: "cylinder",
              price: 12999,
              images: [
                "https://media.istockphoto.com/id/1904521907/photo/lpg-gas-regulator-with-hose.jpg?s=612x612&w=0&k=20&c=StP1v0X5JkHXbZsE77z_o5_qU75j0fD_XsaDZMlxy8o=",
                "https://media.istockphoto.com/id/1213728329/photo/old-gas-hose-for-cook-stove-on-a-white.jpg?s=612x612&w=0&k=20&c=Z41MZUSeEkNePzp93Hhk2t21wsQIqlD5WgOEm0NTXE0=",
              ],
              description:
                "Flexible, durable gas hose for connecting cylinder to cooker.",
              details:
                "High-quality rubber hose reinforced with steel mesh for maximum durability and safety. Resistant to heat and weather conditions. This hose is tested to withstand high pressure and extreme temperatures, ensuring long-lasting performance.",
              features: [
                "Reinforced steel mesh construction",
                "Heat and weather resistant",
                "Flexible and easy to install",
                "Multiple length options available",
                "Certified for safety standards",
              ],
            },
            {
              id: 8,
              name: "Gas Cylinder Stand",
              category: "cylinder",
              price: 5000,
              images: [
                "https://www.rolloverstock.com/cdn/shop/files/THE-RISING-SUN-Gas-Cylinder-Stands-2.webp?v=1737984383&width=1445",
                "https://rukminim2.flixcart.com/image/480/480/kvjuufk0/gas-cylinder-trolley/v/4/k/no-gas-cylinder-trolley-with-wheels-gas-trolly-lpg-cylinder-original-imag8f5vkcbdgyyr.jpeg?q=90",
              ],
              description: "Sturdy stand to securely hold gas cylinders",
              details:
                "Our heavy-duty gas cylinder stand provides secure and stable support for your gas cylinder. Made from durable steel with anti-slip base to prevent accidents and ensure safety in your kitchen or workspace.",
              features: [
                "Heavy-duty steel construction",
                "Anti-slip base for stability",
                "Easy to assemble",
                "Fits all standard cylinders",
                "Prevents cylinder tipping",
              ],
            },

            // Gas Cookers
            {
              id: 9,
              name: "4-Burner Gas Cooker",
              category: "cooker",
              price: 25000,
              images: [
                "https://media.istockphoto.com/id/135188447/photo/steel-gas-lifted.jpg?s=612x612&w=0&k=20&c=D5fEwKnbjytcn2glLYi88deLTZnOZNPXiCYUtVZwcRE=",
                "https://media.istockphoto.com/id/179282042/photo/gas-lifted.jpg?s=612x612&w=0&k=20&c=SC7HQb5gOMdHTxGl3K8qd9oTfRQ9l-S4oirh8NkijM0=",
              ],
              description:
                "Stainless steel gas cooker with high-efficiency burners",
              details:
                "Premium 4-burner gas cooker made from high-quality stainless steel. Features efficient burners for fast cooking, easy-to-clean surface, and durable construction for long-lasting performance.",
              features: [
                "Stainless steel construction",
                "Four high-efficiency burners",
                "Easy to clean surface",
                "Durable and long-lasting",
                "Modern design",
              ],
            },
            {
              id: 10,
              name: "3-Burner Gas Cooker",
              category: "cooker",
              price: 18000,
              images: [
                "https://media.istockphoto.com/id/2192937263/photo/assorted-home-appliances.jpg?s=612x612&w=0&k=20&c=n1HvaM-VpNk3LnOnZjLDgisE4QrBdgPVFAVtyWuumv0=",
                "https://media.istockphoto.com/id/2211573873/photo/luxury-yacht-yachting-in-the-netherlands.jpg?s=612x612&w=0&k=20&c=u7pC5vm67cXgWnwE8pUy72IHBY-25vymuV4d9c5bQg0=",
              ],
              description: "Compact design perfect for medium-sized kitchens",
              details:
                "Efficient 3-burner gas cooker with compact design ideal for medium-sized kitchens. Offers perfect balance between cooking capacity and space efficiency with reliable performance.",
              features: [
                "Compact space-saving design",
                "Three efficient burners",
                "Ideal for medium kitchens",
                "Easy to install and use",
                "Reliable performance",
              ],
            },
            {
              id: 11,
              name: "Burner Set",
              category: "cooker",
              price: 32999,
              images: [
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              ],
              description:
                "Complete burner set with caps for efficient flame production.",
              details:
                "High-quality burner set designed for optimal gas distribution and efficient flame production. Compatible with most standard cookers. These burners are precision-engineered to provide even heat distribution for consistent cooking results.",
              features: [
                "Efficient flame distribution",
                "Durable stainless steel construction",
                "Easy to clean and maintain",
                "Compatible with most cookers",
                "Even heat distribution",
              ],
            },
            {
              id: 12,
              name: "Burner Grates",
              category: "cooker",
              price: 28999,
              images: [
                "https://media.istockphoto.com/id/2239034970/photo/a-worker-wearing-gloves-sets-a-grate-on-a-gas-stove-a-man-takes-care-of-a-gas-stove-at-home.jpg?s=612x612&w=0&k=20&c=_Lt-txrigSfgrWHcz9IeQn8MBmFELBhzACloBQ0qyQg=",
                "https://media.istockphoto.com/id/2222805207/photo/high-quality-gas-stove-with-multiple-burners-designed-for-efficient-cooking-in-modern-kitchens.jpg?s=612x612&w=0&k=20&c=3vZpABNIGfiM2DrLYJ7RkFqV77J8kEX_C3yWTq3aRhk=",
              ],
              description:
                "Sturdy cast iron grates for supporting pots and pans.",
              details:
                "Heavy-duty cast iron grates that provide stable support for cookware. Enamel-coated for easy cleaning and rust resistance. These grates are designed to withstand high temperatures and daily use while maintaining their structural integrity.",
              features: [
                "Heavy-duty cast iron construction",
                "Enamel-coated for easy cleaning",
                "Stable support for cookware",
                "Rust-resistant",
                "Withstands high temperatures",
              ],
            },

            // Safety Equipment
            {
              id: 13,
              name: "Gas Leak Detector",
              category: "safety",
              price: 12000,
              images: [
                "https://www.substation.com.my/data/uploads/2021/06/substation-SF6-Gas-Leak-Detector-1.jpg",
                "https://res.cloudinary.com/cps/images/c_scale,w_1582,h_1189,dpr_2/f_auto,q_auto/v1715711817/lscg_a-1/lscg_a-1.jpg?_i=AA",
              ],
              description: "Early warning system for gas leaks with alarm",
              details:
                "Advanced gas leak detector with early warning system. Features audible alarm and visual indicators to alert you of potential gas leaks. Essential safety equipment for every household using gas appliances.",
              features: [
                "Early leak detection",
                "Audible and visual alarms",
                "Easy to install",
                "Battery operated",
                "Essential safety device",
              ],
            },
            {
              id: 14,
              name: "High Pressure Gas Hose",
              category: "safety",
              price: 3500,
              images: [
                "https://5.imimg.com/data5/SELLER/Default/2020/8/VC/YU/GZ/111501698/images.jpeg",
                "https://media.istockphoto.com/id/486828176/photo/flexible-hoses-for-gas-or-water.jpg?s=612x612&w=0&k=20&c=SoGe9GmxKQkQXtAKb5ybShYIqocgUFVHpsBi3unMAeg=",
              ],
              description:
                "Durable, high-pressure reinforced gas hoses (2 meters)",
              details:
                "Professional-grade high-pressure gas hose designed for safety and durability. Reinforced construction withstands high pressure while maintaining flexibility. Certified for gas applications with leak-proof connections.",
              features: [
                "High-pressure reinforced construction",
                "2-meter length",
                "Leak-proof connections",
                "Flexible and durable",
                "Safety certified",
              ],
            },
            {
              id: 15,
              name: "Gas Regulator",
              category: "safety",
              price: 4500,
              images: [
                "https://cdn11.bigcommerce.com/s-0baae/images/stencil/1280x1280/products/1947/7216/28mbar_igt_single_stage_low_pressure_gas_regulator_A310i__72803.1595839282.jpg?c=2?imbypass=on",
                "https://media.istockphoto.com/id/1486873425/photo/an-lpg-gas-regulator.jpg?s=612x612&w=0&k=20&c=1ubJwWHBTY97MY8nzHiKpNKenaF1IZ-ZXz0QVIr3f54=",
              ],
              description: "Precision pressure regulators with safety lock",
              details:
                "Precision gas regulator with built-in safety lock mechanism. Ensures consistent pressure delivery while preventing accidental disconnection. Essential for safe gas appliance operation.",
              features: [
                "Precision pressure control",
                "Safety lock mechanism",
                "Easy to install",
                "Durable construction",
                "Consistent performance",
              ],
            },
          ];

          setProducts(productsData);
          setFilteredProducts(productsData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === category)
      );
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setActiveImageIndex(0);
  };

  const changeModalImage = (index) => {
    setActiveImageIndex(index);
  };

  if (loading) {
    return (
      <div className="pro-list-loading-container">
        <div className="pro-list-loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="pro-list-products-page">
      {/* Hero Section */}
      <section className="pro-list-hero">
        <div className="pro-list-container">
          <h2>Our Products and Services</h2>
          <div className="pro-list-hero-content">
            <p>
              We provide fast, reliable, and convenient LPG cooking gas services
              designed to make your everyday cooking easier and stress-free.
              Customers can easily book their LPG refills online and have them
              delivered directly to their home, office, or preferred location.
            </p>
            <p>
              We also sell high-quality gas cylinders, burners, regulators, hoses,
              and other gas accessories to ensure safe and efficient usage.
            </p>
            <p>
              For added convenience, we offer subscription-based routine gas
              delivery, so you never run out of cooking gas again. With our
              subscription service, your LPG refill is automatically delivered on
              schedule without the need to reorder. Our goal is to deliver
              comfort, safety, and reliability with every order.
            </p>
          </div>
          <Link to="/order" className="pro-list-btn">
            Place Order
          </Link>
        </div>
      </section>

      {/* Category Navigation */}
      <div className="pro-list-container">
        <div className="pro-list-category-nav">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`pro-list-category-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => filterProducts(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <section className="pro-list-products-section">
        <div className="pro-list-container">
          <h2 className="pro-list-section-title">Our Products</h2>
          <div className="pro-list-products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="pro-list-product-card">
                <div className="pro-list-product-image">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80";
                    }}
                  />
                  <div className="pro-list-product-image-nav">
                    {product.images.map((_, index) => (
                      <div
                        key={index}
                        className={`pro-list-image-dot ${
                          index === 0 ? "active" : ""
                        }`}
                      ></div>
                    ))}
                  </div>
                  {product.capacity && (
                    <span className="pro-list-capacity-badge">
                      {product.capacity}
                    </span>
                  )}
                  {product.category === "safety" && (
                    <span className="pro-list-safety-badge">Safety</span>
                  )}
                </div>
                <div className="pro-list-product-info">
                  <div className="pro-list-product-category">
                    {product.category === "gas"
                      ? "Gas Cylinder"
                      : product.category === "cylinder"
                      ? "Cylinder Accessory"
                      : product.category === "cooker"
                      ? "Cooker Accessory"
                      : "Safety Equipment"}
                  </div>
                  <h3 className="pro-list-product-name">{product.name}</h3>
                  <p className="pro-list-product-description">
                    {product.description}
                  </p>
                  <div className="pro-list-product-price">
                    ₦{product.price.toLocaleString()}
                  </div>
                  <div className="pro-list-product-actions">
                    <button
                      className="pro-list-view-details"
                      onClick={() => openProductModal(product)}
                    >
                      View Details
                    </button>
                    <Link to="/order" className="pro-list-order-now-btn">
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          className="pro-list-modal-overlay active"
          onClick={closeProductModal}
        >
          <div className="pro-list-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="pro-list-modal-close"
              onClick={closeProductModal}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="pro-list-modal-content">
              <div className="pro-list-modal-image-container">
                <div className="pro-list-modal-main-image">
                  <img
                    src={selectedProduct.images[activeImageIndex]}
                    alt={selectedProduct.name}
                  />
                </div>
                <div className="pro-list-modal-thumbnails">
                  {selectedProduct.images.map((img, index) => (
                    <div
                      key={index}
                      className={`pro-list-modal-thumbnail ${
                        index === activeImageIndex ? "active" : ""
                      }`}
                      onClick={() => changeModalImage(index)}
                    >
                      <img src={img} alt={selectedProduct.name} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="pro-list-modal-info">
                <h2>{selectedProduct.name}</h2>
                <div className="pro-list-modal-price">
                  ₦{selectedProduct.price.toLocaleString()}
                </div>
                <p className="pro-list-modal-description">
                  {selectedProduct.details}
                </p>
                <div className="pro-list-modal-features">
                  <h3>Key Features</h3>
                  <ul>
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="pro-list-modal-actions">
                  <Link
                    to="/order"
                    className="pro-list-btn pro-list-order-now-btn"
                    onClick={closeProductModal}
                  >
                    Place Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;