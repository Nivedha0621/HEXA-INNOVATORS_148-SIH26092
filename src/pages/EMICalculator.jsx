import { useSearchParams } from 'react-router-dom';
import EMICalculatorWidget from '../components/EMICalculatorWidget';
import { useLanguage } from '../hooks/useLanguage';

export default function EMICalculator() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const defaultLoan = searchParams.get('loan') || '';
  const defaultRate = searchParams.get('rate') || '';
  const defaultTenure = searchParams.get('tenure') || '';

  return (
    <div className="emi-container">
      <EMICalculatorWidget
        defaultLoan={defaultLoan}
        defaultRate={defaultRate}
        defaultTenure={defaultTenure}
      />
    </div>
  );
}
