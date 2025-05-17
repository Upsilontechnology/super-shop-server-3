// const cors = require("cors");
// const express = require("express");
// const cookieParser = require("cookie-parser");

// const allowedOrigins = [
//   "https://viptailorstock.com",
//   "http://viptailorstock.com",
//   "http://localhost:5173",
//   "http://localhost:5174",
// ];

// const applyMiddleware = (app) => {
//   app.use(
//     cors({
//       origin: (origin, callback) => {
//         if (!origin) return callback(null, true);
//         console.log(origin);
//         if (!allowedOrigins.includes(origin)) {
//           const msg =
//             "The CORS policy for this site does not allow access from the specified Origin.";
//           return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//       },
//       credentials: true,
//       preflightContinue: false,
//     })
//   );
//   app.options("*", cors());
//   app.use(express.json());
//   app.use(cookieParser());
// };

// module.exports = applyMiddleware;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const allowedOrigins = [
  "https://viptailorstock.com",
  "http://viptailorstock.com",
  "http://localhost:5173",
  "https://vip-tailor.vercel.app",
  "http://vip-tailor.vercel.app",
  "http://localhost:5174",
];

const applyMiddleware = (app) => {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200, // Return a successful status for OPTIONS requests
    })
  );

  // Explicitly handle preflight requests
  app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Accept, Content-Type"
    );
    res.sendStatus(200);
  });

  app.use(express.json());
  app.use(cookieParser());
};

module.exports = applyMiddleware;
