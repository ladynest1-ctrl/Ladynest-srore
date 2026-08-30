"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Cart parsing error:", error);
      return [];
    }
  });
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  /**
   * UNIQUE ID GENERATOR
   * ID + Color ko mila kar unique key banata hai.
   */
  const generateCartItemId = (id, color) => {
    const colorKey = color ? color.replace(/\s+/g, '-').toLowerCase() : 'standard';
    return `${id}-${colorKey}`;
  };

  // --- ADD TO CART LOGIC ---
  const addToCart = (product, selectedColor, quantity = 1) => {
    // 1. Color finalize karein
    const activeColor = selectedColor || product.selectedColor || "Standard";
    const cartItemId = generateCartItemId(product.id, activeColor);

    // 2. Image Index nikaalein (Ye sabse important step hai sync ke liye)
    let finalImageIndex = 0;
    try {
      const colorsArray = typeof product.colors === 'string' 
        ? JSON.parse(product.colors) 
        : (product.colors || []);
      
      const foundIdx = colorsArray.findIndex(c => 
        c.toLowerCase() === activeColor.toLowerCase()
      );
      
      if (foundIdx !== -1) finalImageIndex = foundIdx;
    } catch (e) {
      finalImageIndex = 0;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.cartItemId === cartItemId);

      if (existingItem) {
        // Agar product aur color wahi hai, toh quantity barhao
        return prevCart.map((item) =>
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }

      // Naya item add karein with imageIndex
      return [...prevCart, { 
        ...product, 
        cartItemId, 
        selectedColor: activeColor, 
        imageIndex: finalImageIndex, // Cart Page isay use karega photo dikhane ke liye
        quantity: quantity 
      }];
    });
  };

  // Minus button logic (Ek quantity kam karna)
  const removeFromCartOne = (cartItemId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.cartItemId === cartItemId);
      if (item && item.quantity > 1) {
        return prevCart.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prevCart.filter((i) => i.cartItemId !== cartItemId);
    });
  };

  // Full item delete karna
  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCartOne, 
        removeFromCart, 
        clearCart,
        isLoaded 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);