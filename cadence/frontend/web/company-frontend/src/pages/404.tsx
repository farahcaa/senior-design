import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";
import { useNavigate } from "react-router";

const FourOhFourPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background gap-8">
      <p className="px-4 z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        404 - Page Not Found
      </p>
      <Button variant="link" size="lg" onClick={() => navigate(-1)}>
        <Undo />
        Go Back
      </Button>
    </div>
  );
};

export default FourOhFourPage;
