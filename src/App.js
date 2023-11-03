// App.js
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLightTheme, setIsLightTheme] = useState(false); // Track the theme state
  const [isSunIcon, setIsSunIcon] = useState(true);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = "http://localhost:4000/api" + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = "http://localhost:4000/api" + "/transaction";
    const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDateTime("");
        setDescription("");
        setTransactions([...transactions, json]);
        console.log("result", json);
      });
    });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);

  // Update the body background color based on the selected theme
  useEffect(() => {
    document.body.style.backgroundColor = isLightTheme ? "#ffffff" : "#1f1f1f";
  }, [isLightTheme]);

  // Define classes based on the theme
  const themeClass = isLightTheme ? "light-theme" : "dark-theme";

    // Define the color for the balance based on the theme
  const balanceColor = isLightTheme ? "#000000" : "#ffffff";

  const iconSource = isSunIcon ? "sun.png" : "moon.png";

  return (
    <main className={themeClass}>
      <div>
        <img
           src={require(`./images/${iconSource}`)} // Use dynamic import
          id="icon"
          alt="Theme Toggle"
          onClick={() => {
            setIsLightTheme(!isLightTheme);
            setIsSunIcon(!isSunIcon); // Toggle the icon state
          }}
        />
      </div>
      <h1 style={{ color: balanceColor }}>${balance}<span></span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basics">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"+/-Amount Transaction"}
          />
          <input
            value={datetime}
            onChange={(ev) => setDateTime(ev.target.value)}
            type="date"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder={"Description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div className="transaction" key={index}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className={"right"}>
                <div
                  className={"price " + (transaction.price < 0 ? "red" : "green")}
                >
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
