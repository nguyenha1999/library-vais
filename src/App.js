import Detail from "module/detail";
import List from "module/list";
import Main from "module/main";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route index path="/books" element={<List />} />
        <Route path="/books/:id" element={<Detail />} />
      </Route>
    </Routes>
  );
}

export default App;
