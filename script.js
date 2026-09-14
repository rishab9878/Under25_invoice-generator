// ---------------------------------------------------------
// Setup
// ---------------------------------------------------------
const form = document.getElementById("invoiceForm");
const invoiceEl = document.getElementById("invoice");
const formError = document.getElementById("formError");

let sig = "";
let sigFile = null;

// ---------------------------------------------------------
// Validators — one function per field. Each returns "" when
// the value is valid, or an error message string otherwise.
// ---------------------------------------------------------
const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,99}$/;
const PHONE_RE = /^[6-9][0-9]{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PAN_RE = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
const ACCOUNT_NUM_RE = /^[0-9]{9,18}$/;
const IFSC_RE = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
const AMOUNT_RE = /^\d{1,10}(\.\d{1,2})?$/;

const validators = {
    name: v => {
        if (!v.trim()) return "Enter your full name.";
        if (!NAME_RE.test(v.trim())) return "Use letters, spaces, periods, apostrophes or hyphens only.";
        return "";
    },
    phone: v => {
        if (!v.trim()) return "Enter your phone number.";
        if (!PHONE_RE.test(v.trim())) return "Enter a valid 10-digit mobile number starting with 6–9.";
        return "";
    },
    address: v => {
        if (!v.trim()) return "Enter your full address.";
        if (v.trim().length < 10) return "Address looks too short — include street, city and pincode.";
        return "";
    },
    email: v => {
        if (!v.trim()) return "Enter your email address.";
        if (!EMAIL_RE.test(v.trim())) return "Enter a valid email address.";
        return "";
    },
    pan: v => {
        if (!v.trim()) return "Enter your PAN number.";
        if (!PAN_RE.test(v.trim())) return "Enter a valid PAN, e.g. ABCDE1234F.";
        return "";
    },
    date: v => {
        if (!v) return "Select the bill date.";
        const chosen = new Date(v + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (chosen > today) return "Bill date can't be in the future.";
        return "";
    },
    amount: v => {
        const clean = v.trim().replace(/,/g, "");
        if (!clean) return "Enter the invoice amount.";
        if (!AMOUNT_RE.test(clean)) return "Enter a valid amount, e.g. 25000 or 25000.50.";
        if (parseFloat(clean) <= 0) return "Amount must be greater than zero.";
        return "";
    },
    invoiceDescription: v => {
        if (!v) return "Select an invoice description.";
        return "";
    },
    accountName: v => {
        if (!v.trim()) return "Enter the account holder name.";
        if (v.trim().length < 2) return "Account name looks too short.";
        return "";
    },
    accountNumber: v => {
        if (!v.trim()) return "Enter the account number.";
        if (!ACCOUNT_NUM_RE.test(v.trim())) return "Enter a valid account number (9–18 digits).";
        return "";
    },
    bankName: v => {
        if (!v.trim()) return "Enter the bank name.";
        return "";
    },
    ifsc: v => {
        if (!v.trim()) return "Enter the IFSC code.";
        if (!IFSC_RE.test(v.trim())) return "Enter a valid IFSC code, e.g. SBIN0001234.";
        return "";
    }
};

// ---------------------------------------------------------
// Generic wiring: validate on blur, re-validate live once a
// field has already been touched, and on submit.
// ---------------------------------------------------------
function fieldWrap(id) {
    return document.getElementById(id).closest(".field");
}

function showFieldResult(id, message) {
    const wrap = fieldWrap(id);
    const errorEl = document.getElementById(id + "Error");
    if (!wrap || !errorEl) return;
    if (message) {
        wrap.classList.add("invalid");
        wrap.classList.remove("valid");
        errorEl.textContent = message;
    } else {
        wrap.classList.remove("invalid");
        wrap.classList.add("valid");
        errorEl.textContent = "";
    }
}

function validateField(id) {
    const el = document.getElementById(id);
    const validator = validators[id];
    if (!el || !validator) return true;
    const message = validator(el.value);
    showFieldResult(id, message);
    return !message;
}

Object.keys(validators).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    let touched = false;

    el.addEventListener("blur", () => {
        touched = true;
        validateField(id);
    });

    el.addEventListener("input", () => {
        if (touched) validateField(id);
    });

    el.addEventListener("change", () => {
        touched = true;
        validateField(id);
    });
});

// Force uppercase as the user types into PAN / IFSC
document.querySelectorAll(".uppercase-input").forEach(el => {
    el.addEventListener("input", () => {
        const pos = el.selectionStart;
        el.value = el.value.toUpperCase();
        el.setSelectionRange(pos, pos);
    });
});

// Digits-only, max 10, for phone
document.getElementById("phone").addEventListener("input", e => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
});

// Digits-only for account number
document.getElementById("accountNumber").addEventListener("input", e => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 18);
});

// Amount: allow digits and a single decimal point with up to 2 places
document.getElementById("amount").addEventListener("input", e => {
    let v = e.target.value.replace(/[^\d.]/g, "");
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
    const [intPart, decPart] = v.split(".");
    if (decPart !== undefined) v = intPart + "." + decPart.slice(0, 2);
    e.target.value = v;
});

// ---------------------------------------------------------
// Signature upload
// ---------------------------------------------------------
const signatureInput = document.getElementById("signature");
const signatureBody = document.getElementById("signatureBody");
const signaturePreviewRow = document.getElementById("signaturePreviewRow");
const signaturePreview = document.getElementById("signaturePreview");
const signatureFileName = document.getElementById("signatureFileName");
const signatureRemove = document.getElementById("signatureRemove");
const MAX_SIG_BYTES = 2 * 1024 * 1024;

function validateSignature() {
    const errorEl = document.getElementById("signatureError");
    if (!sigFile) {
        errorEl.textContent = "Upload your signature (PNG or JPG).";
        return false;
    }
    if (!["image/png", "image/jpeg"].includes(sigFile.type)) {
        errorEl.textContent = "Only PNG or JPG files are supported.";
        return false;
    }
    if (sigFile.size > MAX_SIG_BYTES) {
        errorEl.textContent = "File is too large — please keep it under 2 MB.";
        return false;
    }
    errorEl.textContent = "";
    return true;
}

signatureInput.addEventListener("change", e => {
    const f = e.target.files[0];
    if (!f) return;
    sigFile = f;

    if (!validateSignature()) {
        sig = "";
        return;
    }

    const r = new FileReader();
    r.onload = x => {
        sig = x.target.result;
        signaturePreview.src = sig;
        signatureFileName.textContent = f.name;
        signatureBody.hidden = true;
        signaturePreviewRow.hidden = false;
    };
    r.readAsDataURL(f);
});

signatureRemove.addEventListener("click", () => {
    sig = "";
    sigFile = null;
    signatureInput.value = "";
    signatureBody.hidden = false;
    signaturePreviewRow.hidden = true;
    document.getElementById("signatureError").textContent = "";
});

// ---------------------------------------------------------
// Amount in words (Indian numbering, handles paise)
// ---------------------------------------------------------
function words(n) {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function c(x) {
        if (x === 0) return '';
        if (x < 20) return a[x] + ' ';
        if (x < 100) return b[Math.floor(x / 10)] + ' ' + c(x % 10);
        if (x < 1000) return a[Math.floor(x / 100)] + ' Hundred ' + c(x % 100);
        if (x < 100000) return c(Math.floor(x / 1000)) + 'Thousand ' + c(x % 1000);
        if (x < 10000000) return c(Math.floor(x / 100000)) + 'Lakh ' + c(x % 100000);
        return c(Math.floor(x / 10000000)) + 'Crore ' + c(x % 10000000);
    }

    const rupees = Math.floor(n);
    const paise = Math.round((n - rupees) * 100);

    let out = (rupees === 0 ? 'Zero ' : c(rupees)).trim() + ' Rupees';
    if (paise > 0) out += ' and ' + c(paise).trim() + ' Paise';
    return out.trim() + ' Only';
}

// ---------------------------------------------------------
// Invoice scaling — keeps the .invoice element's own layout
// box fixed (794px, A4 proportions) on every device so the
// exported PDF is pixel-identical regardless of screen size.
// A CSS transform scales it down purely for on-screen display
// on narrow viewports; the transform is removed before capture.
// ---------------------------------------------------------
const scaleWrapper = document.getElementById("invoiceScaleWrapper");

function fitInvoiceToViewport() {
    // Reset any previously-set height/transform first so the
    // measurements below always reflect the invoice's true,
    // intrinsic size — not a size left over from a prior pass.
    scaleWrapper.style.height = "auto";
    invoiceEl.style.transform = "none";

    const available = scaleWrapper.clientWidth;
    const natural = 794; // fixed layout width, matches .invoice CSS
    const naturalHeight = invoiceEl.offsetHeight;
    const scale = Math.min(1, available / natural);

    invoiceEl.style.transform = `scale(${scale})`;
    scaleWrapper.style.height = (naturalHeight * scale) + "px";
}

window.addEventListener("resize", () => {
    if (document.getElementById("invoiceModal").style.display === "flex") {
        fitInvoiceToViewport();
    }
});

// ---------------------------------------------------------
// Form submit — validate everything, then render invoice
// ---------------------------------------------------------
form.addEventListener("submit", e => {
    e.preventDefault();

    const results = Object.keys(validators).map(validateField);
    const signatureOk = validateSignature();
    if (!signatureOk) {
        document.getElementById("signatureDrop").classList.add("invalid");
    } else {
        document.getElementById("signatureDrop").classList.remove("invalid");
    }

    const allValid = results.every(Boolean) && signatureOk;

    if (!allValid) {
        formError.hidden = false;
        formError.textContent = "Please fix the highlighted fields before generating the invoice.";
        const firstInvalid = document.querySelector(".field.invalid input, .field.invalid textarea, .field.invalid select") || signatureInput;
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus({ preventScroll: true });
        return;
    }

    formError.hidden = true;

    const g = id => document.getElementById(id).value;
    const today = new Date();
    const stamp = today.toISOString().slice(0, 10).replace(/-/g, "");
    const invNum = "INV-" + stamp + "-" + String(Math.floor(Math.random() * 900) + 100);

    const amountValue = parseFloat(g("amount").replace(/,/g, ""));
    const amountDisplay = "₹" + amountValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById("invoiceNumber").textContent = invNum;
    document.getElementById("billDate").textContent = new Date(g("date") + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    document.getElementById("billName").textContent = g("name");
    document.getElementById("billAddress").textContent = g("address");
    document.getElementById("billPhone").textContent = "+91 " + g("phone");
    document.getElementById("billEmail").textContent = g("email");
    document.getElementById("billPan").textContent = "PAN: " + g("pan").toUpperCase();
    document.getElementById("description").textContent = g("invoiceDescription");
    document.getElementById("rate").textContent = amountDisplay;
    document.getElementById("tableAmount").textContent = amountDisplay;
    document.getElementById("subtotal").textContent = amountDisplay;
    document.getElementById("total").textContent = amountDisplay;
    document.getElementById("amountWords").textContent = words(amountValue);
    document.getElementById("accName").textContent = g("accountName");
    document.getElementById("accNumber").textContent = g("accountNumber");
    document.getElementById("bank").textContent = g("bankName");
    document.getElementById("ifscDisplay").textContent = g("ifsc").toUpperCase();

    if (sig) {
        document.getElementById("invoiceSignature").src = sig;
    }

    document.getElementById("invoiceModal").style.display = "flex";
    requestAnimationFrame(fitInvoiceToViewport);
});

// ---------------------------------------------------------
// PDF download — temporarily removes the display-only scale
// transform so html2canvas always captures the invoice at its
// true, fixed 794px-wide layout, giving an identical PDF on
// phones, tablets and laptops alike.
// ---------------------------------------------------------
document.getElementById("downloadBtn").addEventListener("click", async () => {
    const btn = document.getElementById("downloadBtn");
    const label = document.getElementById("downloadBtnLabel");
    const originalLabel = label.textContent;
    btn.disabled = true;
    label.textContent = "Preparing PDF…";

    const previousTransform = invoiceEl.style.transform;
    invoiceEl.style.transform = "none";

    try {
        const { jsPDF } = window.jspdf;
        const canvas = await html2canvas(invoiceEl, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        });

        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = 210;
        const w = pageWidth;
        const h = canvas.height * w / canvas.width;
        pdf.addImage(img, "PNG", 0, 0, w, h);
        pdf.save((document.getElementById("invoiceNumber").textContent || "Invoice") + ".pdf");
    } finally {
        invoiceEl.style.transform = previousTransform;
        fitInvoiceToViewport();
        btn.disabled = false;
        label.textContent = originalLabel;
    }
});

document.getElementById("closeBtn").addEventListener("click", () => {
    document.getElementById("invoiceModal").style.display = "none";
});

document.getElementById("invoiceModal").addEventListener("click", e => {
    if (e.target.id === "invoiceModal") {
        document.getElementById("invoiceModal").style.display = "none";
    }
});
