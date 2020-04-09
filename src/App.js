import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import pizzas from "./pizzas.json";
import { StyledDiv, StyledHeading, StyledRow } from "./styles";

function App() {
  const [pizzaState, setPizzas] = useState(null);
  useEffect(() => {
    if (!pizzaState) {
      setPizzas(processPizzas(pizzas))
    }
  }, [pizzaState]); //eslint-disable-line react-hooks/exhaustive-deps

  // 4. Perform the sort from highest to lowest, return the top 20 results
  const sortPizzas = useCallback(sortablePizzas => {
    sortablePizzas.sort((a, b) => b[1] - a[1]);
    return sortablePizzas.slice(0, 20);
  }, []);

  // 3. Now that we have a count of each topping, we convert each key value pair to an array to make sorting easier
  const makeSortable = useCallback(
    processedPizzas => {
      const sortablePizzas = [];
      for (const toppings in processedPizzas) {
        sortablePizzas.push([toppings, processedPizzas[toppings]]);
      }
      return sortPizzas(sortablePizzas);
    },
    [sortPizzas]
  );

  // 2. Take pizza toppings arrays, convert to string, use string as key, and store count as value in processPizzas, i.e.: { toppings: count }
  const processPizzas = pizzas => {
    const processedPizzas = {};
    pizzas.forEach(pizza => {
      if (processedPizzas[capitalizePizza(pizza.toppings)]) {
        processedPizzas[capitalizePizza(pizza.toppings)] += 1;
      }

      if (!processedPizzas[capitalizePizza(pizza.toppings)]) {
        processedPizzas[capitalizePizza(pizza.toppings)] = 1;
      }
    });
    return makeSortable(processedPizzas);
  };


  // 1. Capitalize the first letter of each word in the toppings
  const capitalizePizza = pizza => {
    return pizza
      .join(" ")
      .split(" ")
      .map(word => {
        const newWord = word[0].toUpperCase() + word.slice(1);
        return newWord;
      })
      .join(" ");
  };

  // Render pizzas if they exist. Alternatively display a loading indicator
  const renderPizzas = () => {
    return pizzaState ? (
      pizzaState.map((pizza, idx) => {
        return (
          <StyledRow key={idx}>
            <span>{idx + 1}</span>
            <span>{pizza[0]}</span>
            <span>{pizza[1]}</span>
          </StyledRow>
        );
      })
    ) : (
      <span>...loading</span>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Pizza Rankings</h3>
        <StyledDiv>
          <StyledHeading>
            <span>Rank</span>
            <span>Toppings</span>
            <span>Number of Orders</span>
          </StyledHeading>
          {renderPizzas()}
        </StyledDiv>
      </header>
    </div>
  );
}

export default App;
