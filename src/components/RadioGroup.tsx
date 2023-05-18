import { CSSProperties } from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  currentValue: string;
  setCurrentValue: (value: string) => void;
  style: CSSProperties;
}

export const RadioGroup = ({ name, options, currentValue, setCurrentValue, ...props }: RadioGroupProps) => {
  return (
    <fieldset {...props}>
      {options.map(({ value, label }) => (
        <div key={`${name}-fieldSet-${value}`}>
          <input name={name} type="radio" value={value} checked={value === currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
          <label>{label}</label>
        </div>
      ))}
    </fieldset>
  );
};
