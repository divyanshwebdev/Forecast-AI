import LocationSearchInput from './location-search-input';
import ThemeToggle from './theme-toggle';
import { CloudHail } from 'lucide-react'; // Example icon

const Header: React.FC = () => {
  return (
    <header className="py-4 px-4 md:px-6 shadow-md bg-card sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
           <CloudHail className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary font-headline">Forecast AI</h1>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <LocationSearchInput />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
