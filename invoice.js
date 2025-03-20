var https   = require("https");
var fs      = require("fs");

function generateInvoice(invoice, filename, success, error) {
    var postData = JSON.stringify(invoice);
    var options = {
        hostname  : "invoice-generator.com",
        port      : 443,
        path      : "/",
        method    : "POST",
        headers   : {
            "Authorization": "Bearer replace_this_with_api_key",
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
        }
    };

    var file = fs.createWriteStream(filename);

    var req = https.request(options, function(res) {
        res.on('data', function(chunk) {
            file.write(chunk);
        })
        .on('end', function() {
            file.end();

            if (typeof success === 'function') {
                success();
            }
        });
    });
    req.write(postData);
    req.end();

    if (typeof error === 'function') {
        req.on('error', error);
    }
}

var invoice = {
    from: "Nikolaus Ltd\n123 Main St\nAustin, TX 78701",
    to: "Acme, Corp.\n456 Main St\nAustin, TX 78701",
    currency: "usd",
    number: "INV-0001",
    payment_terms: "Auto-Billed - Do Not Pay",
    items: [
        {
            name: "Starter plan monthly",
            quantity: 1,
            unit_cost: 99
        }
    ],
    fields: {
        tax: "%"
    },
    tax: 5,
    notes: "Thanks for being an awesome customer!",
    terms: "No need to submit payment. You will be auto-billed for this invoice."
};

generateInvoice(invoice, 'invoice.pdf', function() {
    console.log("Saved invoice to invoice.pdf");
}, function(error) {
    console.error(error);
});
