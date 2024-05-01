import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: true },
];

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleRemoveItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleUpdateItems(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    const confirmed = window.confirm("Do you really want to clear the list?");
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onRemoveItems={handleRemoveItems}
        onUpdateItems={handleUpdateItems}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 👜</h1>;
}

function Form({ onAddItems }) {
  // Contolled elements
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const numberArr = Array.from({ length: 20 }, (_, i) => i + 1);

  function handleSubmit(e) {
    e.preventDefault();

    // Guard for not to be empty
    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select value={quantity} onChange={(e) => setQuantity(+e.target.value)}>
        {numberArr.map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>{" "}
      {/*We also can add onClick event here we it would only work with button and not for enter that why we have onSubmit on form */}
    </form>
  );
}

function PackingList({ items, onRemoveItems, onUpdateItems, onClearList }) {
  // Controlled element
  const [orderBy, setOrderBy] = useState("input");

  let sortedItems;

  if (orderBy === "input") sortedItems = items;

  if (orderBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (orderBy === "packed")
    sortedItems = items.slice().sort((a, b) => +a.packed - +b.packed);

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onRemoveItems={onRemoveItems}
            onUpdateItems={onUpdateItems}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
          <option value="input">Order by input</option>
          <option value="description">Order by description</option>
          <option value="packed">Order by packed</option>
        </select>

        <button onClick={onClearList}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ item, onRemoveItems, onUpdateItems }) {
  return (
    <li>
      {/* Contolled element - has the value defined by some state and also has eventListener that listens for the change*/}
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onUpdateItems(item.id)}
      />
      <span style={item.packed ? { textDecorationLine: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onRemoveItems(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>You can start packing your items!</em>
      </p>
    );
  }

  const numLength = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numLength) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? `You've got everything! You can go!`
          : `👜You have ${numLength} items on your list, and you already packed
        ${numPacked}(${percentage}%)`}
      </em>
    </footer>
  );
}
