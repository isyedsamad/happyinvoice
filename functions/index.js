const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const { signupAuth } = require("./auth/signupAuth");
const { clientAdd } = require("./client/addclient");
const { clientDelete } = require("./client/deleteClient");
const { clientUpdate } = require("./client/updateClient");
const { productAdd } = require("./product/addProduct");
const { productDelete } = require("./product/deleteProduct");
const { productUpdate } = require("./product/updateProduct");
const { generateInvoice } = require("./invoice/generateInvoice");
const { mailInvoice } = require("./invoice/mailInvoice");
const { mailInvoiceToClient } = require("./invoice/mailInvoiceToClient");
const { onBoardingProcess } = require("./auth/onBoardingProcess");
const { paymentConfig } = require("./payment/paymentConfig");
// auth functions
exports.signupAuth = signupAuth;
exports.onBoardingProcess = onBoardingProcess;
// client functions
exports.clientAdd = clientAdd;
exports.clientDelete = clientDelete;
exports.clientUpdate = clientUpdate;
// product functions
exports.productAdd = productAdd;
exports.productDelete = productDelete;
exports.productUpdate = productUpdate;
// invoice functions
exports.generateInvoice = generateInvoice;
exports.mailInvoice = mailInvoice;
exports.mailInvoiceToClient = mailInvoiceToClient;
// payment functions
exports.paymentConfig = paymentConfig;