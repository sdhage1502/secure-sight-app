interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`nav-item ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default NavItem;