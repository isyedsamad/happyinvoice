const currencyShow = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
}
const generateInvoiceHTML = ({
  invoiceId,
  businessname,
  client,
  invoiceNo,
  invoiceDate,
  dueDate,
  summary,
  tax,
  discount,
  partialPayment,
  link,
  currency
}) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice Notification</title>
    <style>
      body {
        background: #f3f4f6;
        font-family: 'Segoe UI', sans-serif;
        margin: 0;
        padding: 0;
        color: #1f2937;
      }
  
      .container {
        width: 80%;
        max-width: 560px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        padding: 40px 30px;
      }
  
      .logo {
        text-align: center;
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 10px;
      }
  
        .check-icon {
            text-align: center;
            font-size: 35px;
            margin: 20px 0;
            color: black;
        }

  
      .main-heading {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        margin: 5px 0;
        color: #1f2937;
      }
  
      .sub-heading {
        font-size: 14px;
        color: #6b7280;
        text-align: center;
        margin-bottom: 24px;
      }
  
      .info {
        font-size: 14px;
        margin: 40px 0px;
      }
  
      .info-block {
        margin-top: 16px;
      }
  
      .info-label {
        font-size: 10px;
        color: #6b7280;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }
  
      .info-value {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
      }
  
      .summary-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
  
      .summary-table tr:nth-child(even) {
        background-color: #f9fafb;
      }
  
      .summary-table td {
        padding: 8px 10px;
        font-size: 14px;
      }
  
      .summary-table .label {
        color: #374151;
        font-weight: 600;
      }
  
      .summary-table .value {
        text-align: right;
        color: #111827;
      }
  
      .total {
        background: #f9fafb;
        font-weight: 700;
        padding: 12px 0;
        border-radius: 6px;
      }
  
      .total .value {
        color: #10b981;
        font-weight: 700;
      }
  
      .footer-note {
        font-size: 12px;
        color: #6b7280;
        line-height: 1.6;
        margin-top: 10px;
      }
  
      .footer {
        background: #f3f4f6;
        padding: 16px;
        text-align: center;
        font-size: 13px;
        line-height: 1.6;
        color: #6b7280;
      }
  
      .footer strong {
        color: #111827;
      }
  
      .btn-view {
        display: inline-block;
        background-color: #2563eb;
        color: #ffffff;
        padding: 10px 22px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 6px;
        text-decoration: none;
        margin: 12px 0;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">${businessname}</div>

      <div class="check-icon">✓</div>
  
      <div class="main-heading">You've received an Invoice</div>
      <div class="sub-heading">
        ${businessname} has sent you an invoice. Below is a quick summary.
      </div>
  
      <div class="info">
        <div class="info-block">
          <div class="info-label">Invoice No</div>
          <div class="info-value">#${invoiceNo}</div>
        </div>
  
        <div class="info-block">
          <div class="info-label">Invoice Date</div>
          <div class="info-value">${invoiceDate}</div>
        </div>

        <div class="info-block">
          <div class="info-label">Due Date</div>
          <div class="info-value">${dueDate != '' ? dueDate : '-'}</div>
        </div>
        
        <div class="info-block">
          <div class="info-label">Customer</div>
          <div class="info-value">${client.name}</div>
        </div>
      </div>
  
      <table class="summary-table">
        <tr>
          <td class="label">Subtotal</td>
          <td class="value">${currencyShow[currency]} ${summary.subtotal}</td>
        </tr>
        <tr>
          <td class="label">${(tax.taxType == 'On Total' || tax.taxType == 'Deducted') ? tax.taxLabel + ' (' + tax.taxValue + '%)' : 'Tax'}</td>
          <td class="value">${currencyShow[currency]} ${tax.taxType != 'None' ? summary.tax : '0'}</td>
        </tr>
        <tr>
          <td class="label">Total</td>
          <td class="value">${currencyShow[currency]} ${summary.total}</td>
        </tr>
        ${discount.discountType != 'None' ?
    `<tr><td class="label">Discount ${discount.discountType == 'Percent' ? '(' + discount.discountValue + '%)' : ''}</td><td class="value">${currencyShow[currency]} ${summary.discount}</td></tr>`
    :
    ''}
        ${partialPayment.isPartial == 'Yes' ?
    `<tr><td class="label">Partial Payment</td><td class="value">${currencyShow[currency]} ${Number(partialPayment.amount).toFixed(2)}</td></tr>`
    :
    ''}
        <tr style="border-top: 1px solid #ccc">
          <td class="label">Balance Due</td>
          <td class="value" style="font-weight: 700">${currencyShow[currency]} ${summary.balance}</td>
        </tr>
      </table>
  
      <div style="text-align: center;">
        <a href="${link}" class="btn-view" target="_blank">View Invoice</a>
      </div>
  
      <div class="footer-note">
        <strong>Note:</strong> This is an automated invoice sent by ${businessname} using HappyInvoice.
        No action is required unless payment is pending.
      </div>
    </div>
  
    <div class="footer">
      Sent via <strong>HappyInvoice</strong> on behalf of ${businessname}.<br />
      © ${new Date().getFullYear()} HappyInvoice Inc.
    </div>
  </body>
  </html>
  `;

module.exports = { generateInvoiceHTML }