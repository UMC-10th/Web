import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-500 py-6 mt-12">
      <div className="container max-auto text-center text-gray-300 dark:text-gray-200">
        <p>&copy; {new Date().getFullYear()} Spining Allrights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link to={"#"}>Privacy Policy</Link>
          <Link to={"#"}>Terms of Service</Link>
          <Link to={"#"}>Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
