const delivery = 400;

// عناصر الصفحة
const quantitySelect = document.getElementById("quantity");
const totalCountDiv = document.getElementById("totalCountDiv");
const totalCountInput = document.getElementById("totalCount");
const piecesContainer = document.getElementById("piecesContainer");
const priceDiv = document.getElementById("price");
const modal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModal");
const wilayaSelect = document.getElementById("wilayaSelect");

// قائمة الولايات
const wilayas = ["أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار","البليدة","البويرة","تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر","الجلفة","جيجل","سطيف","سعيدة","سكيكدة","سيدي بلعباس","عنابة","قالمة","قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة","وهران","البيض","إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي","خنشلة","سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تموشنت","غرداية","غليزان","تيميمون","برج باجي مختار","أولاد جلال","بني عباس","عين صالح","عين قزام","تقرت","جانت","المغير","المنيعة"];
wilayas.forEach(w=>{
  let opt = document.createElement("option");
  opt.value = w;
  opt.textContent = w;
  wilayaSelect.appendChild(opt);
});

// تحديث الفورم حسب عدد القطع
function updateForm() {
  const qty = parseInt(quantitySelect.value);
  if(qty < 3) {
    totalCountDiv.classList.add("hidden");
    renderPieces(qty);
    updatePrice(qty);
  } else {
    totalCountDiv.classList.remove("hidden");
    const totalPieces = Math.max(parseInt(totalCountInput.value) || 3, 3);
    renderPieces(totalPieces);
  }
}

// إنشاء القطع داخل الفورم
function renderPieces(total) {
  piecesContainer.innerHTML = "";
  for(let i=1;i<=total;i++){
    const div = document.createElement("div");
    div.className = "piece";
    div.innerHTML = `
      <h3>👕 القطعة ${i}</h3>
      <label>🎨 اللون:</label>
      <select name="color${i}" class="colorSelect">
        <option value="أبيض">أبيض</option>
        <option value="أسود">أسود</option>
      </select>
      <label>📏 المقاس:</label>
      <select name="size${i}" class="sizeSelect">
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="XXL">XXL</option>
      </select>
      <div class="tshirt-preview" id="preview${i}">👕</div>
    `;
    const colorSelect = div.querySelector(".colorSelect");
    const sizeSelect = div.querySelector(".sizeSelect");
    const preview = div.querySelector(".tshirt-preview");

    function updatePreview() {
      const color = colorSelect.value;
      preview.textContent = "👕 " + color + " " + sizeSelect.value;
      preview.style.background = color === "أسود" ? "#333" : "#fff";
      preview.style.color = color === "أسود" ? "#fff" : "#555";
    }

    colorSelect.addEventListener("change", updatePreview);
    sizeSelect.addEventListener("change", updatePreview);
    updatePreview();

    piecesContainer.appendChild(div);
  }

  const qty = parseInt(quantitySelect.value);
  const totalPieces = qty >= 3 ? Math.max(parseInt(totalCountInput.value) || 3, 3) : qty;
  updatePrice(totalPieces);
}

// تحديث السعر
function updatePrice(totalPieces) {
  let price = 0;
  if(totalPieces === 1) price = 2200;
  else if(totalPieces === 2) price = 4000;
  else price = totalPieces * 2000;
  priceDiv.textContent = `💰 السعر: ${price + delivery} دج (${price} + ${delivery} توصيل)`;
}

// الأحداث
quantitySelect.addEventListener("change", updateForm);
totalCountInput.addEventListener("input", ()=> {
  const total = Math.max(parseInt(totalCountInput.value)||3,3);
  renderPieces(total);
});

// إغلاق المودال
closeModalBtn.onclick = ()=>modal.style.display="none";
window.onclick = (event)=>{if(event.target==modal) modal.style.display="none";}

// إرسال الطلبية
document.getElementById("orderForm").addEventListener("submit", async function(e){
  e.preventDefault();
  const formData = new FormData(this);
  const qty = parseInt(quantitySelect.value);
  const totalPieces = qty >= 3 ? Math.max(parseInt(totalCountInput.value) || 3, 3) : qty;
  let productPrice = totalPieces === 1 ? 2200 : totalPieces === 2 ? 4000 : totalPieces * 2000;
  const total = productPrice + delivery;
  formData.append("totalPrice", total);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycby0nX5qrBfJj_n4I7GDJmMw9Hlb2jNkHF9scYEu1RyX_or-cirBaBcExVg7RWZx0OAaWg/exec", {
      method: "POST",
      body: formData
    });
    await response.text();
    modal.style.display="flex";
    this.reset();
    updateForm();
  } catch(err){
    alert("❌ خطأ أثناء إرسال الطلبية: " + err.message);
  }
});

// تهيئة الفورم عند التحميل
updateForm();