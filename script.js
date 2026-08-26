console.log("Script Loaded");
const form=document.getElementById("invoiceForm");
const preview=document.getElementById("invoice");
let sig="";
document.getElementById("signature").addEventListener("change",e=>{
 const f=e.target.files[0];
 if(!f)return;
 const r=new FileReader();
 r.onload=x=>sig=x.target.result;
 r.readAsDataURL(f);
});
function words(n){
 const a=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
 const b=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
 function c(x){
  if(x<20)return a[x];
  if(x<100)return b[Math.floor(x/10)]+' '+a[x%10];
  if(x<1000)return a[Math.floor(x/100)]+' Hundred '+c(x%100);
  if(x<100000)return c(Math.floor(x/1000))+' Thousand '+c(x%1000);
  if(x<10000000)return c(Math.floor(x/100000))+' Lakh '+c(x%100000);
  return c(Math.floor(x/10000000))+' Crore '+c(x%10000000);
 }
 return c(Number(n)).trim()+" Rupees Only";
}
form.addEventListener("submit",async e=>{
 e.preventDefault();
 const g=id=>document.getElementById(id).value;
 const inv=Math.floor(Math.random()*100)+1;
 const FIXED_AMOUNT = 2000;
 const amt = FIXED_AMOUNT.toLocaleString("en-IN");
document.getElementById("invoiceNumber").textContent = inv;

document.getElementById("billDate").textContent = g("date");

document.getElementById("billName").textContent = g("name");

document.getElementById("billAddress").textContent = g("address");

document.getElementById("billPhone").textContent = g("phone");

document.getElementById("billEmail").textContent = g("email");

document.getElementById("billPan").textContent = "PAN: " + g("pan");

document.getElementById("description").textContent =
    "Professional Fees for UGC reel : Sheinverse UGC Campaign";

document.getElementById("rate").textContent =
    "₹" + amt;

document.getElementById("tableAmount").textContent =
    "₹" + amt;

document.getElementById("subtotal").textContent =
    "₹" + amt;

document.getElementById("total").textContent =
    "₹" + amt;

document.getElementById("amountWords").textContent =
    words(g("amount"));

document.getElementById("accName").textContent =
    g("accountName");

document.getElementById("accNumber").textContent =
    g("accountNumber");

document.getElementById("bank").textContent =
    g("bankName");

document.getElementById("ifscDisplay").textContent =
    g("ifsc");

if(sig){
    document.getElementById("invoiceSignature").src = sig;
}

preview.style.display = "block";
document.getElementById("invoiceModal").style.display = "flex";
});

document.getElementById("downloadBtn").addEventListener("click", async () => {

    const { jsPDF } = window.jspdf;

    const invoice = document.getElementById("invoice");

const canvas = await html2canvas(invoice, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
});

    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const w = 190;
    const h = canvas.height * w / canvas.width;

    pdf.addImage(img, "PNG", 10, 10, w, h);

    pdf.save("Invoice.pdf");

});

document.getElementById("closeBtn").addEventListener("click", () => {

    document.getElementById("invoiceModal").style.display = "none";

});
