export default function  Navbar({ options,selectedOption, onFilterChange }) {
    return (
      <div className="navbar">
        {options.map(option => (
          <a key={option} className={selectedOption === option ? 'selected' : ''} onClick={() => onFilterChange(option)}>
            {option}
          </a>
        ))}
      </div>
    );
  };