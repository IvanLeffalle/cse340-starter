const pool = require("../database/");

const accountModel = {};
/* *****************************
 *   Register new account
 * *************************** */

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}
/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Return account data using Id
 * ***************************** */

async function getAccountById(acc_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM account WHERE account_id = ${acc_id}`
    );
    return data.rows;
  } catch (error) {
    console.log("error fetching account by Id", error);
  }
}

/* *****************************
 * Update account data
 * ***************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    console.log("attempting to update");
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
  } catch (error) {
    return error.message;
  }
}
/* *****************************
 * Update account data as Admin
 * ***************************** */
async function editAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_type,
  account_id
) {
  try {
    console.log("attempting to update");
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3, account_type= $4 WHERE account_id = $5 RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      account_id,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Update password account
 * ***************************** */
async function updateAccountPassword(account_password, account_id) {
  try {
    const sql =
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    return await pool.query(sql, [account_password, account_id]);
  } catch (error) {
    return error.message;
  }
}

async function getAllAccounts() {
  try {
    const sql = "SELECT * FROM public.account ORDER BY account_id";
    return await pool.query(sql);
  } catch (error) {
    return error.message;
  }
}
/* ***************************
 *  delete account
 * ************************** */

async function deleteAccount(acc_id) {
  try {
    const sql = "DELETE FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [acc_id]);
    return result;
  } catch (error) {
    console.error("error deleting account", error);
    return error.message;
  }
}

module.exports = {
  registerAccount,
  getAllAccounts,
  checkExistingEmail,
  getAccountByEmail,
  updateAccountPassword,
  updateAccount,
  getAccountById,
  deleteAccount,
  editAccount,
};
