import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your components
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";

function App() {
    return (
        <Router>
            <div>
                <h1>My React App </h1>
                <Routes>
                    <Route path="/" element={<Login />}
    ) />
    <Route path="/register" element={<Register />}
} />
<Route path="/dashboard" element={<Dashboard />} />
</Routes>
</div>
</Router>
);


export default App;