import { useState, useEffect } from 'react';

const API_URL = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Backend se tasks lana - FIXED VERSION
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      const data = await res.json();
      
      // Console me dekho backend kya bhej raha hai
      console.log("Data from backend:", data);

      // Chahe backend array bheje ya object me {tasks: []} ya {data: []}
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else if (data.data && Array.isArray(data.data)) {
        setTasks(data.data);
      } else {
        setTasks([]); // Agar kuch bhi na aaye to empty array
      }
    } catch (err) {
      console.log("Backend not connected", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return alert("Title likho!");
    
    await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status: "pending" })
    });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await fetch(`${API_URL}/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", fontFamily: "Arial", padding: "10px" }}>
      <h1 style={{ textAlign: "center" }}>📚 Student Task Manager</h1>
      <p style={{ textAlign: "center", color: "green", fontSize: "12px" }}>Backend: {API_URL} - Connected ✅</p>

      <form onSubmit={addTask} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", background: "#f5f5f5", padding: "20px", borderRadius: "10px" }}>
        <input 
          type="text" 
          placeholder="Task Title (e.g. Math Homework)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Add Task</button>
      </form>

      <div>
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center" }}>No tasks yet. Add one!</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", border: "1px solid #eee", padding: "12px", marginBottom: "10px", borderRadius: "8px", textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
              <div>
                <strong>{task.title}</strong>
                <p style={{ margin: "2px 0", fontSize: "13px", color: "#666" }}>{task.description}</p>
                <small style={{ color: task.status === 'completed' ? 'green' : 'orange', textTransform: "uppercase", fontWeight: "bold" }}>{task.status}</small>
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => toggleStatus(task)} style={{ background: "#2196F3", color: "white", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer" }}>✓</button>
                <button onClick={() => deleteTask(task._id)} style={{ background: "#f44336", color: "white", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer" }}>X</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;