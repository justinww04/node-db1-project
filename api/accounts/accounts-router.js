const router = require("express").Router();
const md = require("./accounts-middleware");
const Account = require("./accounts-model");

router.get("/", async (req, res, next) => {
  try {
    const accounts = await Account.getAll();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", md.checkAccountId, async (req, res, next) => {
  res.json(req.account);
});

// router.get("/:id", md.checkAccountId, async (req, res, next) => {
//   try {
//     const account = await Account.getById(req.params.id);
//     res.json(account);
//   } catch (err) {
//     next(err);
//   }
// });

router.post(
  "/",
  md.checkAccountPayload,
  md.checkAccountNameUnique,
  async (req, res, next) => {
    try {
      const newAccount = await Account.create(req.body); // Assuming Account.create is a valid method to create an account
      res.status(201).json(newAccount); // Respond with the newly created account
      console.log("New account created successfully.");
    } catch (error) {
      console.error("Error creating account:", error);
      next(error); // Pass the error to the error-handling middleware
    }
  }
);

router.put(
  "/:id",
  md.checkAccountId,
  md.checkAccountPayload,
  md.checkAccountNameUnique,
  async (req, res, next) => {
    try {
      console.log("Updating account with ID-->", req.params.id);
      const updatedAccount = await Account.updateById(req.params.id, req.body);
      if (!updatedAccount) {
        console.log("Account not found-->");
        return res.status(404).json({ message: "Account not found" });
      }
      console.log("Account updated successfully-->", updatedAccount);
      res.status(200).json(updatedAccount);
    } catch (error) {
      console.error("Error updating account-->", error);
      next(error);
    }
  }
);

// router.put(
//   "/:id",
//   md.checkAccountId,
//   md.checkAccountPayload,
//   async (req, res, next) => {
//     try {
//       const updated = await Account.updateById(req.params.id, req.body);
//       res.json(updated);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

router.delete("/:id", md.checkAccountId, async (req, res, next) => {
  try {
    await Account.deleteById(req.params.id);
    res.json(req.account);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  //eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = router;