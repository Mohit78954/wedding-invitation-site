import { useState } from "react";
import InviteCover from "./components/InviteCover";
import RoyalEnvelopePage from "./templates/wedding/royal-envelope";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <RoyalEnvelopePage />
      {showIntro && <InviteCover onComplete={() => setShowIntro(false)} />}
    </div>
  );
}

export default App;