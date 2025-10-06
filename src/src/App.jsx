import React, { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID;

export default function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("");

  const connectAndSave = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    try {
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: 0,
        data: ethers.toUtf8Bytes(note),
      });
      setStatus("Saving note to Monad...");
      await tx.wait();
      setStatus("Note saved successfully!");
      setNotes([...notes, note]);
      setNote("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to save note.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>📘 Monad Diary</h1>
      <textarea
        rows="4"
        style={{ width: "100%", padding: 10 }}
        placeholder="Write your note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={connectAndSave} style={{ marginTop: 10, padding: 10 }}>
        Save Note
      </button>
      <p>{status}</p>
      <h3>Your Notes</h3>
      <ul>
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
