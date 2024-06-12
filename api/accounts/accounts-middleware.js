const Account = require("./accounts-model");
const db = require("../../data/db-config");

exports.checkAccountPayload = (req, res, next) => {
  const error = { status: 400 };
  let { name, budget } = req.body;

  // Trim leading and trailing whitespace from the name
  if (name) {
    name = name.trim();
  }

  if (name === undefined || budget === undefined) {
    error.message = "name and budget are required";
  } else if (typeof name !== "string") {
    error.message = "name of account must be a string";
  } else if (name.length < 3 || name.length > 100) {
    error.message = "name of account must be between 3 and 100";
  } else if (typeof budget !== "number" || isNaN(budget)) {
    error.message = "budget of account must be a number";
  } else if (budget < 0 || budget > 1000000) {
    error.message = "budget of account is too large or too small";
  }

  if (error.message) {
    next(error);
  } else {
    req.body.name = name;
    next();
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const existing = await db("accounts")
      .where("name", req.body.name.trim())
      .first();
    if (existing) {
      next({ status: 400, message: "that name is taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById(req.params.id);
    if (!account) {
      next({ status: 404, message: "account not found" });
    } else {
      req.account = account;
      next();
    }
  } catch (err) {
    next(err);
  }
};
