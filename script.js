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
 const amt=Number(g("amount")).toLocaleString("en-IN");
 preview.innerHTML=`
 <h2>Tax Invoice</h2>
 <p><b>Invoice No:</b> ${inv}</p>
 <p><b>Date:</b> ${g("date")}</p>
 <h3>Bill To</h3>
 <p>${g("name")}<br>${g("address")}<br>${g("phone")}<br>${g("email")}<br>PAN: ${g("pan")}</p>
 <h3>Collective Artists Network India Pvt. Ltd.</h3>
 <p>GST:27AAHCP2434K1Z9</p>
 <table>
 <tr><th>ID</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
 <tr><td>1</td><td>Performance Fee - ${g("event")}</td><td>1</td><td>₹${amt}</td><td>₹${amt}</td></tr>
 </table>
 <h3>Payment Details</h3>
 <p>${g("accountName")}<br>${g("accountNumber")}<br>${g("bankName")}<br>${g("ifsc")}</p>
 <h3>Total: ₹${amt}</h3>
 <p>${words(g("amount"))}</p>
 ${sig?`<img src="${sig}" style="height:80px"><p>Signature</p>`:''}
 `;
 const {jsPDF}=window.jspdf;
 const canvas=await html2canvas(preview,{scale:2});
 const img=canvas.toDataURL("image/png");
 const pdf=new jsPDF("p","mm","a4");
 const w=190,h=canvas.height*w/canvas.width;
 pdf.addImage(img,"PNG",10,10,w,h);
 pdf.save(`Invoice-${inv}.pdf`);
});
