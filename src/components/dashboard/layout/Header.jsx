import agriRootLogo from "../../../assets/images/agri-root.png";

const Header = () => {
  return (
    <div className="w-full md:w-1/4 rounded-lg px-2">
      <img
        src={agriRootLogo}
        alt="Agri-Root Logo"
        className="h-20 object-contain"
      />
    </div>
  );
};

export default Header;
