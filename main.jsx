import React, { createContext, useContext, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, MapPin, Phone, Clock, ChevronDown } from "lucide-react";
import "./styles.css";

const menu = [
  { id: 1, name: "Butter Chicken", category: "Mains", $price: 1, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85", desc: "Creamy tomato gravy, tender chicken and aromatic spices." },
  { id: 2, name: "Paneer Tikka", category: "Starters", price: 9, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=85", desc: "Char-grilled cottage cheese with peppers and smoky masala." },
  { id: 3, name: "Biryani", category: "Mains", price: 9, image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85", desc: "Fragrant basmati rice layered with saffron and whole spices." },
  { id: 4, name: "Garlic Naan", category: "Breads", price: 79, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85", desc: "Soft tandoor-baked naan finished with garlic and butter." },
  { id: 5, name: "Dal Makhani", category: "Mains", price: 2, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85", desc: "Slow-cooked black lentils with butter and gentle spices." },
  { id: 6, name: "Gulab Jamun", category: "Desserts", price: 9, image: "https://images.unsplash.com/photo-1601303516534-6d5c2b5d6a7f?auto=format&fit=crop&w=900&q=85", desc: "Warm milk-solid dumplings soaked in fragrant sugar syrup." },
  { id: 7, name: "Tandoori Platter", category: "Starters", price: 9, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85", desc: "A generous selection of smoky tandoor favourites." },
  { id: 8, name: "Mango Lassi", category: "Drinks", price: 9, image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=85", desc: "Chilled creamy yogurt drink blended with ripe mango." }
];

const CartContext = createContext(null);
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const add = (item) => setItems(prev => {
    const found = prev.find(x => x.id === item.id);
    return found ? prev.map(x => x.id === item.id ? {...x, qty: x.qty + 1} : x) : [...prev, {...item, qty: 1}];
  });
  const change = (id, delta) => setItems(prev => prev.map(x => x.id === id ? {...x, qty: x.qty + delta} : x).filter(x => x.qty > 0));
  const remove = (id) => setItems(prev => prev.filter(x => x.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);
  const delivery = subtotal > 0 ? 49 : 0;
  const total = subtotal + delivery;
  const value = useMemo(() => ({items, add, change, remove, clear, count, subtotal, delivery, total}), [items, count, subtotal, delivery, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
const useCart = () => useContext(CartContext);

function Header() {
  const { count } = useCart();
  return <header className="header">
    <div className="container nav">
      <Link to="/" className="brand"><span className="brand-mark">W</span><span>WEBNEST <b>RESTAURANT</b></span></Link>
      <nav className="desktop-nav">
        <Link to="/">Home</Link><Link to="/menu">Menu</Link><a href="#about">About</a><a href="#contact">Contact</a>
      </nav>
      <Link to="/cart" className="cart-btn"><ShoppingBag size={19}/><span>Cart</span>{count > 0 && <em>{count}</em>}</Link>
    </div>
  </header>;
}

function Home() {
  const featured = menu.slice(0, 4);
  return <>
    <section className="hero">
      <div className="hero-overlay"/>
      <div className="container hero-content">
        <p className="eyebrow">FRESH • FLAVOURFUL • MADE WITH CARE</p>
        <h1>Good food.<br/><span>Good mood.</span></h1>
        <p className="hero-copy">Authentic Indian favourites, slow-cooked with bold spices and served hot from our kitchen.</p>
        <div className="hero-actions"><Link className="btn primary" to="/menu">Explore Menu <ArrowRight size={18}/></Link><a className="btn ghost" href="#about">Our Story</a></div>
      </div>
    </section>
    <section className="section" id="about">
      <div className="container intro-grid">
        <div><p className="eyebrow">WELCOME TO WEBNEST</p><h2>A table full of <span>flavour.</span></h2></div>
        <p className="lead">At WEBNEST RESTAURANT, we bring together comforting classics, tandoor-fired favourites and modern touches. Every plate is prepared to order, using quality ingredients and plenty of heart.</p>
      </div>
    </section>
    <section className="section soft">
      <div className="container"><div className="section-head"><div><p className="eyebrow">CUSTOMER FAVOURITES</p><h2>Most loved dishes</h2></div><Link className="text-link" to="/menu">View full menu <ArrowRight size={16}/></Link></div>
      <div className="cards">{featured.map(item => <FoodCard key={item.id} item={item}/>)}</div></div>
    </section>
    <section className="info-strip" id="contact">
      <div className="container info-grid">
        <div><MapPin/><div><b>Visit us</b><span>14 Residency Road, Indiranagar, Bengaluru</span></div></div>
        <div><Phone/><div><b>Call us</b><span>+91 98765 43210</span></div></div>
        <div><Clock/><div><b>Open daily</b><span>11:00 AM – 11:00 PM</span></div></div>
      </div>
    </section>
  </>;
}

function FoodCard({item}) {
  const {add} = useCart();
  return <article className="food-card">
    <div className="food-img"><img src={item.image} alt={item.name}/><span>{item.category}</span></div>
    <div className="food-body"><div><h3>{item.name}</h3><p>{item.desc}</p></div><div className="food-bottom"><strong>₹{item.price}</strong><button className="add-btn" onClick={() => add(item)}><Plus size={17}/> Add</button></div></div>
  </article>;
}

function Menu() {
  const [cat, setCat] = useState("All");
  const categories = ["All", "Starters", "Mains", "Breads", "Desserts", "Drinks"];
  const filtered = cat === "All" ? menu : menu.filter(x => x.category === cat);
  return <section className="section menu-page"><div className="container">
    <div className="page-title"><p className="eyebrow">FROM OUR KITCHEN</p><h1>Our menu</h1><p>Pick your favourites. We’ll handle the rest.</p></div>
    <div className="filters">{categories.map(c => <button key={c} className={cat===c?"active":""} onClick={()=>setCat(c)}>{c}</button>)}</div>
    <div className="cards menu-grid">{filtered.map(item => <FoodCard key={item.id} item={item}/>)}</div>
  </div></section>;
}

function Cart() {
  const {items, change, remove, subtotal, delivery, total} = useCart();
  const navigate = useNavigate();
  return <section className="section cart-page"><div className="container narrow">
    <div className="page-title left"><p className="eyebrow">YOUR ORDER</p><h1>Shopping cart</h1></div>
    {items.length === 0 ? <div className="empty"><ShoppingBag size={42}/><h2>Your cart is empty</h2><p>Add something delicious from our menu.</p><Link className="btn primary" to="/menu">Browse menu</Link></div> :
    <div className="cart-layout"><div className="cart-items">{items.map(item => <div className="cart-row" key={item.id}><img src={item.image} alt=""/><div className="cart-main"><h3>{item.name}</h3><span>₹{item.price}</span><div className="qty"><button onClick={()=>change(item.id,-1)}><Minus size={15}/></button><b>{item.qty}</b><button onClick={()=>change(item.id,1)}><Plus size={15}/></button></div></div><strong>₹{item.price*item.qty}</strong><button className="remove" onClick={()=>remove(item.id)}><Trash2 size={18}/></button></div>)}</div>
    <aside className="summary"><h2>Order summary</h2><div><span>Subtotal</span><b>₹{subtotal}</b></div><div><span>Delivery</span><b>₹{delivery}</b></div><hr/><div className="grand"><span>Total</span><b>₹{total}</b></div><button className="btn primary full" onClick={()=>navigate("/checkout")}>Proceed to checkout <ArrowRight size={17}/></button><Link className="continue" to="/menu">Continue shopping</Link></aside></div>}
  </div></section>;
}

function Checkout() {
  const {items, total, clear} = useCart();
  const navigate = useNavigate();
  const submit = (e) => { e.preventDefault(); clear(); navigate("/success"); };
  if (!items.length) return <section className="section"><div className="container empty"><h2>No items to checkout</h2><Link className="btn primary" to="/menu">Go to menu</Link></div></section>;
  return <section className="section"><div className="container narrow"><div className="page-title left"><p className="eyebrow">ALMOST THERE</p><h1>Checkout</h1></div><form className="checkout" onSubmit={submit}><div className="form-card"><label>Full name<input required placeholder="Your name"/></label><label>Phone number<input required type="tel" placeholder="+06"/></label><label>Delivery address<textarea required placeholder="House / flat, street, area"/></label><label>Payment method<select><option>Cash on delivery</option><option>Pay on delivery (UPI)</option></select></label></div><aside className="summary"><h2>Pay on delivery</h2><div className="grand"><span>Total</span><b>₹{total}</b></div><button className="btn primary full">Place order</button></aside></form></div></section>;
}

function Success() { return <section className="section"><div className="container empty"><div className="success-icon">✓</div><p className="eyebrow">ORDER CONFIRMED</p><h1>Thank you!</h1><p>Your WEBNEST RESTAURANT order has been received. We’ll prepare it fresh.</p><Link className="btn primary" to="/menu">Order again</Link></div></section>; }

function Footer() { return <footer><div className="container footer-grid"><div><Link className="brand" to="/"><span className="brand-mark">W</span><span>WEBNEST <b>RESTAURANT</b></span></Link><p>Bold Indian flavours, warm hospitality.</p></div><div><b>Quick links</b><Link to="/">Home</Link><Link to="/menu">Menu</Link><Link to="/cart">Cart</Link></div><div><b>Contact</b><span>14 Residency Road, antartica</span><span>+01234567890</span></div></div><div className="copyright">© 2026 WEBNEST RESTAURANT. All rights reserved.</div></footer>; }

function App() { return <><Header/><main><Routes><Route path="/" element={<Home/>}/><Route path="/menu" element={<Menu/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/success" element={<Success/>}/></Routes></main><Footer/></>; }

createRoot(document.getElementById("root")).render(<React.StrictMode><BrowserRouter><CartProvider><App/></CartProvider></BrowserRouter></React.StrictMode>);
