/* Outback Modas — catálogo, abas, filtros e sacola */
const WHATSAPP = "5581900000000"; // troque pelo número da loja (DDI + DDD + número)

const SIZES = {
  adulto: ["P", "M", "G", "GG"],
  calcado: ["36", "38", "40", "42"],
  infantil: ["2", "4", "6", "8", "10"]
};

// [nome, categoria, preço, preço antigo (ou 0), emoji, cor, tamanhos, novo?]
const RAW = [
  ["Vestido midi floral", "feminino", 129.9, 169.9, "👗", "#f3dde1", "adulto"],
  ["Blusa de alça em linho", "feminino", 69.9, 0, "👚", "#e9efe6", "adulto", 1],
  ["Calça jeans reta cintura alta", "feminino", 149.9, 189.9, "👖", "#dbe5ee", "adulto"],
  ["Saia plissada acetinada", "feminino", 99.9, 0, "👗", "#efe6f3", "adulto", 1],
  ["Cardigan tricot leve", "feminino", 119.9, 159.9, "🧥", "#f3ead9", "adulto"],
  ["Conjunto cropped e short", "feminino", 109.9, 0, "👚", "#f3dde1", "adulto"],
  ["Camisa social slim", "masculino", 119.9, 0, "👔", "#dbe5ee", "adulto"],
  ["Camiseta básica algodão", "masculino", 49.9, 69.9, "👕", "#e6e7e2", "adulto"],
  ["Bermuda sarja", "masculino", 89.9, 0, "🩳", "#f3ead9", "adulto", 1],
  ["Calça jeans tradicional", "masculino", 139.9, 179.9, "👖", "#cfdbe6", "adulto"],
  ["Jaqueta corta-vento", "masculino", 199.9, 0, "🧥", "#e9efe6", "adulto"],
  ["Polo piquet", "masculino", 79.9, 99.9, "👕", "#dfe7e0", "adulto"],
  ["Conjunto camiseta e bermuda", "infantil", 79.9, 99.9, "👕", "#f6e7c4", "infantil"],
  ["Vestido infantil de algodão", "infantil", 74.9, 0, "👗", "#f3dde1", "infantil", 1],
  ["Macacão jeans", "infantil", 89.9, 0, "👖", "#dbe5ee", "infantil"],
  ["Moletom com capuz", "infantil", 84.9, 109.9, "🧥", "#e9efe6", "infantil"],
  ["Pijama estampado", "infantil", 59.9, 0, "🩳", "#efe6f3", "infantil"],
  ["Camiseta dino divertida", "infantil", 39.9, 54.9, "👕", "#f6e7c4", "infantil"],
  ["Bata bordada", "feminino", 79.9, 119.9, "👚", "#e9efe6", "adulto"],
  ["Regata esportiva", "masculino", 44.9, 64.9, "👕", "#dbe5ee", "adulto"]
];

const PRODUCTS = RAW.map((p, i) => ({
  id: i + 1, name: p[0], cat: p[1], price: p[2], old: p[3],
  emoji: p[4], color: p[5], sizes: SIZES[p[6]], isNew: !!p[7],
  discount: p[3] ? Math.round((1 - p[2] / p[3]) * 100) : 0
}));

const TITLES = {
  todos: "Todos os produtos", feminino: "Moda feminina", masculino: "Moda masculina",
  infantil: "Moda infantil", promocoes: "Promoções"
};
const CAT_LABEL = { feminino: "Feminino", masculino: "Masculino", infantil: "Infantil" };

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const state = { cat: "todos", size: "", sort: "rel", query: "", cart: [], picked: {} };

/* ---------- Catálogo ---------- */
function filtered() {
  let list = PRODUCTS.filter(p => {
    if (state.cat === "promocoes" && !p.old) return false;
    if (!["todos", "promocoes"].includes(state.cat) && p.cat !== state.cat) return false;
    if (state.size && !p.sizes.includes(state.size)) return false;
    if (state.query && !(p.name + " " + p.cat).toLowerCase().includes(state.query)) return false;
    return true;
  });
  const sorts = {
    menor: (a, b) => a.price - b.price,
    maior: (a, b) => b.price - a.price,
    desc: (a, b) => b.discount - a.discount
  };
  if (sorts[state.sort]) list.sort(sorts[state.sort]);
  return list;
}

function cardHTML(p) {
  const badge = p.discount ? `<span class="badge">-${p.discount}%</span>` : p.isNew ? `<span class="badge new">Novo</span>` : "";
  const sizes = p.sizes.map(s => `<button class="size ${state.picked[p.id] === s ? "sel" : ""}" data-id="${p.id}" data-size="${s}" aria-label="Tamanho ${s}">${s}</button>`).join("");
  return `
  <article class="card">
    <div class="thumb" style="background:${p.color}" aria-hidden="true">${badge}${p.emoji}</div>
    <div class="card-body">
      <span class="card-cat">${CAT_LABEL[p.cat]}</span>
      <h3>${p.name}</h3>
      <div class="price"><strong>${money(p.price)}</strong>${p.old ? `<s>${money(p.old)}</s>` : ""}</div>
      <span class="installment">ou 3x de ${money(p.price / 3)} sem juros</span>
      <div class="sizes">${sizes}</div>
      <button class="add" data-add="${p.id}">Adicionar à sacola</button>
    </div>
  </article>`;
}

function render() {
  const list = filtered();
  $("#grid").innerHTML = list.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;
  $("#catTitle").textContent = state.query ? `Resultados para “${state.query}”` : TITLES[state.cat];
  $("#catCount").textContent = `${list.length} ${list.length === 1 ? "produto" : "produtos"}`;
  $$(".tab").forEach(t => {
    const on = t.dataset.cat === state.cat;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on);
  });
}

function setCategory(cat, scroll) {
  state.cat = cat; state.query = ""; $("#searchInput").value = "";
  render();
  if (scroll) $("#catalogo").scrollIntoView({ behavior: "smooth" });
}

/* ---------- Sacola ---------- */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const size = state.picked[id];
  if (!size) return toast("Escolha um tamanho antes de adicionar.");
  const found = state.cart.find(i => i.id === id && i.size === size);
  found ? found.qty++ : state.cart.push({ id, size, qty: 1 });
  saveCart(); renderCart();
  toast(`${p.name} (${size}) adicionado.`);
}

function renderCart() {
  const count = state.cart.reduce((n, i) => n + i.qty, 0);
  $("#cartCount").textContent = count;
  const box = $("#cartItems");
  if (!state.cart.length) {
    box.innerHTML = `<p class="cart-empty">Sua sacola está vazia.<br>Escolha um tamanho e adicione suas peças.</p>`;
  } else {
    box.innerHTML = state.cart.map((it, idx) => {
      const p = PRODUCTS.find(x => x.id === it.id);
      return `<div class="item">
        <div class="item-thumb" style="background:${p.color}">${p.emoji}</div>
        <div><h4>${p.name}</h4><small>Tamanho ${it.size}</small>
          <div class="qty"><button data-q="-1" data-i="${idx}" aria-label="Diminuir">−</button><span>${it.qty}</span><button data-q="1" data-i="${idx}" aria-label="Aumentar">+</button></div>
        </div>
        <span class="item-price">${money(p.price * it.qty)}</span>
      </div>`;
    }).join("");
  }
  const total = state.cart.reduce((s, i) => s + PRODUCTS.find(x => x.id === i.id).price * i.qty, 0);
  $("#cartTotal").textContent = money(total);
}

function saveCart() { try { localStorage.setItem("outback-cart", JSON.stringify(state.cart)); } catch (e) {} }
function loadCart() { try { state.cart = JSON.parse(localStorage.getItem("outback-cart")) || []; } catch (e) { state.cart = []; } }

function toggleDrawer(open) {
  $("#drawer").classList.toggle("open", open);
  $("#drawer").setAttribute("aria-hidden", !open);
  $("#overlay").hidden = !open;
}

function checkout() {
  if (!state.cart.length) return toast("Sua sacola está vazia.");
  const lines = state.cart.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id);
    return `• ${i.qty}x ${p.name} (tam. ${i.size}) — ${money(p.price * i.qty)}`;
  });
  const total = state.cart.reduce((s, i) => s + PRODUCTS.find(x => x.id === i.id).price * i.qty, 0);
  const msg = `Olá, Outback Modas! Quero finalizar este pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Avisos ---------- */
let toastTimer;
function toast(text) {
  const t = $("#toast"); t.textContent = text; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Eventos ---------- */
document.addEventListener("click", e => {
  const tab = e.target.closest(".tab"); if (tab) return setCategory(tab.dataset.cat, false);
  const go = e.target.closest("[data-go]"); if (go) return setCategory(go.dataset.go, true);
  const size = e.target.closest(".size");
  if (size) { state.picked[size.dataset.id] = size.dataset.size; $$(`.size[data-id="${size.dataset.id}"]`).forEach(b => b.classList.toggle("sel", b === size)); return; }
  const add = e.target.closest("[data-add]"); if (add) return addToCart(+add.dataset.add);
  const q = e.target.closest("[data-q]");
  if (q) {
    const it = state.cart[+q.dataset.i]; it.qty += +q.dataset.q;
    if (it.qty < 1) state.cart.splice(+q.dataset.i, 1);
    saveCart(); renderCart();
  }
});

$("#cartOpen").onclick = () => toggleDrawer(true);
$("#cartClose").onclick = $("#overlay").onclick = () => toggleDrawer(false);
$("#clearCart").onclick = () => { state.cart = []; saveCart(); renderCart(); };
$("#checkout").onclick = checkout;
document.addEventListener("keydown", e => { if (e.key === "Escape") toggleDrawer(false); });

$("#sortSelect").onchange = e => { state.sort = e.target.value; render(); };
$("#sizeFilter").onchange = e => { state.size = e.target.value; render(); };
$("#searchForm").onsubmit = e => {
  e.preventDefault();
  state.query = $("#searchInput").value.trim().toLowerCase();
  state.cat = "todos"; render();
  $("#catalogo").scrollIntoView({ behavior: "smooth" });
};
$("#newsForm").onsubmit = e => { e.preventDefault(); e.target.reset(); toast("Pronto! Você vai receber nossas ofertas."); };

/* ---------- Início ---------- */
const allSizes = [...new Set(Object.values(SIZES).flat())];
$("#sizeFilter").insertAdjacentHTML("beforeend", allSizes.map(s => `<option>${s}</option>`).join(""));
$("#year").textContent = new Date().getFullYear();
loadCart(); renderCart(); render();
