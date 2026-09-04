<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Generator</title>

    <link rel="stylesheet" href="style.css">

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">

    <!-- html2canvas -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

    <!-- jsPDF -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>

<body>

    <div class="container">

    <div class="header">
    <h1>Invoice Generator</h1>
</div>
        <form id="invoiceForm" novalidate>

            <div class="section">

                <h2>Personal Details</h2>

                <div class="grid">

                    <div class="field">
                        <label for="name">Name <span class="required-mark">*</span></label>
                        <input type="text" id="name" name="name" required minlength="2" maxlength="100" pattern="[A-Za-z][A-Za-z .\'-]*" autocomplete="name" title="Enter a valid name using letters, spaces, periods, apostrophes or hyphens.">
                    </div>

                    <div class="field">
                        <label for="phone">Phone Number <span class="required-mark">*</span></label>
                        <input type="tel" id="phone" name="phone" required inputmode="numeric" pattern="[6-9][0-9]{9}" maxlength="10" autocomplete="tel" title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.">
                    </div>

                    <div class="field full">
                        <label for="address">Full Address with Pincode <span class="required-mark">*</span></label>
                        <textarea id="address" name="address" rows="3" required minlength="10" maxlength="300" autocomplete="street-address" placeholder="House/Flat, Street, Area, City, State - Pincode"></textarea>
                    </div>

                    <div class="field">
                        <label for="email">Email <span class="required-mark">*</span></label>
                        <input type="email" id="email" name="email" required maxlength="254" autocomplete="email" placeholder="name@example.com">
                    </div>

                    <div class="field">
                        <label for="pan">PAN Number <span class="required-mark">*</span></label>
                        <input type="text" id="pan" name="pan" required minlength="10" maxlength="10" pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" autocomplete="off" style="text-transform:uppercase" title="Enter a valid 10-character PAN, e.g. ABCDE1234F.">
                    </div>

                </div>

            </div>

            <div class="section">

                <h2>Invoice Details</h2>

                <div class="grid">

    <div class="field">
        <label for="date">Date <span class="required-mark">*</span></label>
        <input type="date" id="date" name="date" required>
    </div>
                    <div class="field full">
            <label for="invoiceDescription">Invoice Description <span class="required-mark">*</span></label>
            <select id="invoiceDescription" required>
                <option value="" disabled selected>Select a description</option>

                <option value="Professional fees for driving Sheinverse registrations">
                    Professional Fees for driving Sheinverse registrations
                </option>

                <option value="Professional Fees College Activations : Wok Tok">
                    Professional Fees for College Activations : Wok Tok
                </option>

                <option value="Professional Fees for Registrations : Goibibo Campaign">
                    Professional Fees for Registrations : Goibibo Campaign
                </option>
            </select>
                    </div>

    <div class="field">
        <label for="amount">Amount (₹) <span class="required-mark">*</span></label>
       <input type="text" id="amount" name="amount" inputmode="decimal" placeholder="Enter amount" required maxlength="15" autocomplete="off" title="Enter a positive amount with up to 2 decimal places.">
    </div>

</div>
                

            </div>

            <div class="section">

                <h2>Bank Details</h2>

                <div class="grid">

                    <div class="field">
                        <label for="accountName">Account Name <span class="required-mark">*</span></label>
                        <input type="text" id="accountName" name="accountName" required minlength="2" maxlength="100" pattern="[A-Za-z][A-Za-z .\'&-]*" autocomplete="off" title="Enter the account holder name.">
                    </div>

                    <div class="field">
                        <label for="accountNumber">Account Number <span class="required-mark">*</span></label>
                        <input type="text" id="accountNumber" name="accountNumber" required minlength="9" maxlength="18" inputmode="numeric" pattern="[0-9]{9,18}" autocomplete="off" title="Enter a valid bank account number containing 9 to 18 digits.">
                    </div>

                    <div class="field">
                        <label for="bankName">Bank Name <span class="required-mark">*</span></label>
                        <input type="text" id="bankName" name="bankName" required minlength="2" maxlength="100" autocomplete="off">
                    </div>

                    <div class="field">
                        <label for="ifsc">IFSC Code <span class="required-mark">*</span></label>
                        <input type="text" id="ifsc" name="ifsc" required minlength="11" maxlength="11" pattern="[A-Za-z]{4}0[A-Za-z0-9]{6}" autocomplete="off" title="Enter a valid 11-character IFSC code, e.g. SBIN0001234.">
                    </div>

                </div>

            </div>

            <div class="section">

                <h2>Signature <span class="required-mark">*</span></h2>

                <input type="file"
                    id="signature"
                    name="signature"
                    accept="image/png,image/jpeg,image/jpg"
                    required
                    aria-describedby="signatureHelp">
                <small id="signatureHelp" class="field-help">PNG or JPG only. Maximum file size: 2 MB.</small>

                <img
                    id="signaturePreview"
                    class="signature-preview">

            </div>

            <div id="formError" class="form-error" role="alert" aria-live="polite"></div>

            <button type="submit" class="generate-btn">
                Generate Invoice
            </button>

        </form>

    </div>

    <!-- Invoice -->

    <div id="invoiceModal" class="modal">

    <div class="modal-content">

        <div class="modal-header">

            <h2>Invoice Preview</h2>

                <button id="closeBtn" class="close-btn">
                    ✕
                </button>


        </div>

        <div id="invoice" class="invoice">

        <div class="invoice-header">

            <div>

                <h1>Tax Invoice</h1>

            </div>

            <div class="invoice-meta">

                <p><strong>Invoice Number:</strong> <span id="invoiceNumber"></span></p>

                <p><strong>Bill Date:</strong> <span id="billDate"></span></p>


            </div>

        </div>

        <hr>

        <div class="bill-section">

            <div>

                <h3>Bill To</h3>

                <p id="billName"></p>

                <p id="billAddress"></p>

                <p id="billPhone"></p>

                <p id="billEmail"></p>

                <p id="billPan"></p>

            </div>

            <div>

                <h3>Collective Artists Network India Pvt Ltd</h3>

                <p>
                    5th Floor, Lotus Business Park,
                    New Link Road,
                    Andheri West,
                    Mumbai,
                    Maharashtra - 400053
                </p>

                <p><strong>GST Number:</strong> 27AAHCP2434K1Z9</p>

                <p><strong>PAN Number:</strong> AAHCP2434K</p>

            </div>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Description</th>

                    <th>Qty</th>

                    <th>Rate</th>

                    <th>Amount</th>

                </tr>

            </thead>

            <tbody>

                <tr>

                    <td>1</td>

                    <td id="description"></td>

                    <td>1</td>

                    <td id="rate"></td>

                    <td id="tableAmount"></td>

                </tr>

            </tbody>

        </table>

        <div class="payment">

            <div>

                <h3>Payment Details</h3>

                <p><strong>Account Name:</strong> <span id="accName"></span></p>

                <p><strong>Account Number:</strong> <span id="accNumber"></span></p>

                <p><strong>Bank Name:</strong> <span id="bank"></span></p>

                <p><strong>IFSC:</strong> <span id="ifscDisplay"></span></p>

            </div>

            <div class="totals">

                <p>Subtotal : <span id="subtotal"></span></p>

                <h2>Total : <span id="total"></span></h2>

                <p id="amountWords"></p>

            </div>

        </div>

        <div class="signature-section">

    <img id="invoiceSignature">

    <p>Authorized Signature</p>

</div> <!-- End Signature -->

</div> <!-- End Invoice -->

<div class="download-wrapper">

    <button id="downloadBtn" class="download-btn">
        Download PDF
    </button>

</div>

</div> <!-- End Modal Content -->

</div> <!-- End Modal -->
    <script src="script.js"></script>

</body>
</html>
