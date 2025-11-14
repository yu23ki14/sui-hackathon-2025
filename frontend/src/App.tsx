import { Container } from "@radix-ui/themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import Top from "./pages/Top";
import Support from "./pages/Support";
import MyPage from "./pages/MyPage";
import ExclusiveContent from "./pages/ExclusiveContent";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
          <Routes>
            <Route path="/" element={<Top />} />
            <Route path="/support" element={<Support />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/exclusive" element={<ExclusiveContent />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Container>
      </Container>
    </BrowserRouter>
  );
}

export default App;