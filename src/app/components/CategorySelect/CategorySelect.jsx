import { CATEGORIES } from '../../constants/categories';
import { formatCategoryName } from '../../utils/formatUtils';

export default function CategorySelect({ value, onChange, className, hasError = false, required = false }) {
    return (
        <select
            name="category"
            value={value}
            onChange={onChange}
            className={`${className} ${hasError ? 'error' : ''}`}
            required={required}
        >
            <option value="">{required ? 'Select a category' : 'All Categories'}</option>
            {CATEGORIES.map(category => (
                <option key={category} value={category}>
                    {formatCategoryName(category)}
                </option>
            ))}
        </select>
    );
}