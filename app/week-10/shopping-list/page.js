"use client";

import { getItems, addItem } from "../_services/shopping-list-service";
import { useEffect, useState } from "react";
import NewItem from './new-item';
import ItemList from './item-list';
import MealIdeas from './meal-ideas'; 
import './styles.css';
import { useUserAuth } from "../_utils/auth-context"; // Import the useUserAuth hook

export default function Page() {
  const { user } = useUserAuth(); // Get the user from the auth context
  const [items, setItems] = useState([]); // Initialize state with an empty array
  const [selectedItemName, setSelectedItemName] = useState("");

  useEffect(() => {
    if (user) {
      const loadItems = async () => {
        try {
          const itemsList = await getItems(user.uid);
          setItems(itemsList);
        } catch (error) {
          console.error("Error loading items:", error);
        }
      };
      loadItems();
    }
  }, [user]); // Runs only when `user` changes

  // If no user is logged in, do not render the shopping list
  if (!user) {
    return (
      <div>
        <h1>Please log in to access the shopping list.</h1>
      </div>
    );
  }

  const handleAddItem = async (newItem) => {
    try {
      const id = await addItem(user.uid, newItem);
      setItems([...items, { id, ...newItem }]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleItemSelect = (name) => {
    const cleanedName = name.split(",")[0].trim().replace(/[\u{1F300}-\u{1FAD6}]/gu, "");
    console.log("Selected Item:", cleanedName); // Debugging Log
    setSelectedItemName(cleanedName);
  };

  console.log("Current User:", user);

  return (
    <div className="container flex">
      <div className="shopping-section">
        <h1>Shopping List</h1>
        <NewItem onAddItem={handleAddItem} />
        <ItemList items={items} onItemSelect={handleItemSelect} /> 
      </div>
      <div className="meal-ideas-section">
        {selectedItemName ? <MealIdeas ingredient={selectedItemName} /> : <p>Select an item to see meal ideas.</p>}
      </div>
    </div>
  );
}
