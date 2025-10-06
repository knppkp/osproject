import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState("");
  const [thing, setThing] = useState("");

  useEffect(() => {
    axios.get("/api")
      .then(res => {
        setData(res.data.time.now);
        setThing(res.data.test);
        console.log(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return <h1>Server Time: {data} test testt {thing} fffdgkkfdff</h1>;
}

export default App;
