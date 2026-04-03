const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { route } = require("./utils/statics/statics");
const errorHandler = require("./middleware/errorHandler");

// ✅ import routes at top
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get(route.ping, () => {
  return "pong";
});

app.get(route.root, (req, res) => {
  console.log("hi");
  res.send({
    content: "hi",
  });
});

app.use(route.api.auth, authRoutes);
app.use(route.api.questions, questionRoutes);
app.use(route.api.modules, require("./routes/moduleRoutes"));
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`),
);
