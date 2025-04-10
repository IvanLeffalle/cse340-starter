"use strict";

document.addEventListener("DOMContentLoaded", () => {
  fetch("/account/admin/get-accounts")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch accounts");
      return response.json();
    })
    .then((data) => {
      buildAccountsTable(data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
});

function buildAccountsTable(accounts) {
  const accountsDiv = document.getElementById("accountsDisplay");
  if (!accountsDiv) return;

  let html = `
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Type</th>
          <th>Modify</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
  `;

  accounts.forEach((account) => {
    html += `
      <tr>
        <td>${account.account_firstname}</td>
        <td>${account.account_lastname}</td>
        <td>${account.account_email}</td>
        <td>${account.account_type}</td>
        <td><a href="/account/edit/${account.account_id}" title="Edit">Edit</a></td>
        <td><a href="/account/delete/${account.account_id}" title="Delete">Delete</a></td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  accountsDiv.innerHTML = html;
}
