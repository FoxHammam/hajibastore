import React from "react";                  
import ReactDOM from "react-dom/client";  
import App from "./App.jsx";                
import { BrowserRouter } from "react-router-dom"; 
 import { Provider } from "react-redux";
 import { store } from "./redux/store";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";                        


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <Provider store={store}> 
      <BrowserRouter>
        <AuthProvider>
          <ProductsProvider>
            <App />
          </ProductsProvider>
        </AuthProvider>
      </BrowserRouter>
     </Provider> 
  </React.StrictMode>
);