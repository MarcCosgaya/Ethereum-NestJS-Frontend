import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Send from "./pages/Send";
import ContractInteraction from "./pages/ContractInteraction";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="send" element={<Send />} />
          <Route path="contract" element={<ContractInteraction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}