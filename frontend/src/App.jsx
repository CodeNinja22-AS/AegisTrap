import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import AttackSimulator from "./components/AttackSimulator";
import Logs from "./components/Logs";
import Insights from "./components/Insights";
import Settings from "./components/Settings";
import { WebSocketProvider } from "./context/WebSocketContext";

export default function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attack" element={<AttackSimulator />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </WebSocketProvider>
    </BrowserRouter>
  );
}
