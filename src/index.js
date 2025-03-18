import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { EnrollmentTriggerProvider } from "./Context/UseEnrollmentTriggercontext"
import { StoreProvider } from './store';

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <StoreProvider>
      <EnrollmentTriggerProvider>
        <App />
      </EnrollmentTriggerProvider>
    </StoreProvider>
  </React.StrictMode>
)
