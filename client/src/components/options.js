const options = [
    "All",
    "Events",
    "Research",
    "Sports",
    "CSE",
    "ECE",
    "CIVIL",
    "MECH",
    "EEE",
  ];


const OptionSelector = ({ selectedOption, onOptionChange }) => {
    return (
        <>
            <h4 style={{color:'gray'}}>select category</h4>
            <div className="options">
        {options.map(option => (
          <label key={option}>
            <input
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={onOptionChange}
            />
            {option}
          </label>
        ))}
      </div>
        </>
      
    );
  };


  export default OptionSelector;