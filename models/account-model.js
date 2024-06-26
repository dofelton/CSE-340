const pool = require("../database/")

/* ***********
 * Register new account
 ************************/
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        console.log('We are in the account model function')
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 * Check for existing email
 **************************/
async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
    try {
      console.log(`Account email in model: ${account_email}`)
      const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
        [account_email])
        console.log(`Query results: ${result.rows[0]}`)
      return result.rows[0]
    } catch (error) {
      return new Error("No matching email found")
    }
  }

/* *****************************
* Return account data using id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
      return result.rows[0]
  } catch (error) {
    return new Error("No matching account id found")
  }
}

/* *****************************
* Update account
* ***************************** */
async function updateAccount (account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3, WHERE account_id = $4";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result.rowCount> 0;
  } catch (error) {
    console.error('Error updating account', error);
    throw error;
  }
}

/* *****************************
* Update password
* ***************************** */
async function updatePassword(account_id, new_password) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
  } catch (error) {
    return error.message;
  }
}

/* ************************************
 * Get inventory reviews by account id
 **************************************/
async function getAccountReviews(accountId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r
      JOIN public.account AS a
      ON r.account_id = a.account_id
      WHERE a.account_id = $1`,
      [accountId]
    )
    console.log(`AccountModel Review method: ${data.rows.length}`)
    return data.rows
  } catch (error) {
    console.error("getreviews error " + error)
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword, getAccountReviews }