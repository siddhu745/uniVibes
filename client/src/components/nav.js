export default function  Navbar({ options,selectedOption, onFilterChange }) {
    return (
      <div className="navbar">
        {options.map(option => (
          <p key={option} className={selectedOption === option ? 'selected' : ''} onClick={() => onFilterChange(option)}>
            {option}
          </p>
        ))}
      </div>
    );
  };