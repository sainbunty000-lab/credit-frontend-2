import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

export default function GestureWrapper({ children }) {

  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate("/agriculture"),
    onSwipedRight: () => navigate("/working-capital"),
    trackMouse: true
  });

  return (
    <div {...handlers} className="min-h-screen">
      {children}
    </div>
  );
}
