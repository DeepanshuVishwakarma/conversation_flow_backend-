const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { route } = require("./utils/statics/statics");
const errorHandler = require("./middleware/errorHandler");
const { authRoutes, questionRoutes, moduleRoutes } = require("./routes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://conversation-flow-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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
app.use(route.api.modules, moduleRoutes);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`),
);
