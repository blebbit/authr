import { Link } from "@tanstack/react-router";
import { useAuthrContext } from "@/components/context/authr";

const Button = () => {
  
  const authr = useAuthrContext();

  if (authr.session.did) {
    return (
      <Link to="/profile" className="bg-white text-black px-2 py-1 rounded hover:bg-blue-200">
        @{authr.session.handle}
      </Link>
    );
  }

  return (
    <Link to="/sign-in" className="bg-white text-black px-2 py-1 rounded hover:bg-blue-200">
      Sign In
    </Link>
  );
}

export default Button