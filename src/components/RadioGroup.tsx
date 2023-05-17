interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  currentValue: string;
  setCurrentValue: (value: string) => void;
}

export const RadioGroup = ({ name, options, currentValue, setCurrentValue }: RadioGroupProps) => {
  return (
    <fieldset>
      {options.map(({ value, label }) => (
        <div key={`${name}-fieldSet-${value}`}>
          <input name={name} type="radio" value={value} checked={value === currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
          <label>{label}</label>
        </div>
      ))}
    </fieldset>
  );
};
