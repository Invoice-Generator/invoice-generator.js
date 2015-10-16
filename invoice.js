var https   = require("https");
var fs      = require("fs");

var invoice = {
    logo: "http://invoiced.com/img/logo-invoice.png",
    from: "Invoiced\n701 Brazos St\nAustin, TX 78748",
    to: "Johnny Appleseed",
    currency: "usd",
    number: "INV-0001",
    payment_terms: "Auto-Billed - Do Not Pay",
    items: [
        {
            name: "Subscription to Starter",
            quantity: 1,
            unit_cost: 50
        }
    ],
    fields: {
        tax: "%"
    },
    tax: 5,
    notes: "Thanks for being an awesome customer!",
    terms: "No need to submit payment. You will be auto-billed for this invoice."
};

var postData = JSON.stringify(invoice);
var options = {
    hostname  : "invoice-generator.com",
    port      : 443,
    path      : "/",
    method    : "POST",
    headers   : {
        "Content-Type": "application/json",
        "Content-Length": postData.length
    }
};

var filename = "invoice.pdf";
var file = fs.createWriteStream(filename);

var req = https.request(options, function(res) {
    res.on('data', function(chunk) {
        file.write(chunk);
    })
    .on('end', function() {
        file.end();
        console.log("Saved invoice to "+filename);
    });
});
req.write(postData);
req.end();

req.on('error', function(e) {
    console.error(e);
});
