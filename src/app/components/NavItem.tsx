interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => (
  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
    active ? 'bg-gradient-to-br from-gradient-start to-gradient-end text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
  }`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default NavItem;