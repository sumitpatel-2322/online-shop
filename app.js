const path = require("path"); //This will help you to read the path of the static files
const express = require("express"); // Import the Express framework to build the web application
const db = require("./data/database");
const authRoutes = require("./routes/auth_routes");
const baseRoutes = require("./routes/base_routes");
const productRoutes = require("./routes/products_routes");
const expressSession = require("express-session");
const createSessionConfig = require("./config/session");
const imageUploadMiddleware = require("./middlewares/imageUpload");
const app = express();
const csrf = require("csurf"); //to protect from csrf attacks
const csrfTokenMiddleware = require("./middlewares/csr-tokens");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check_auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const adminRoutes = require("./routes/admin_routes");
const cartRoutes = require("./routes/cart_routes");
const ordersRoutes=require("./routes/orders_routes");

app.set("view engine", "ejs"); // Set EJS as the view engine to render dynamic HTML templates
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public")); // Serve static files like CSS, images, and client-side JS from the 'public' directory
app.use(express.urlencoded({ extended: false })); // Parse incoming form data (application/x-www-form-urlencoded) extended: false means it will only parse simple key-value pairs (no nested objects).
app.use(express.json());
app.use("/products/assets", express.static("product-data"));
const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(imageUploadMiddleware);
app.use(csrf());
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);
app.use(csrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);
app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use("/cart", cartRoutes);
app.use(protectRoutesMiddleware);
app.use("/orders",ordersRoutes)
app.use("/admin", adminRoutes);
app.use(errorHandlerMiddleware);
db.connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
