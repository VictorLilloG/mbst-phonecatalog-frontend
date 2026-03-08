import type { StorageOption } from '@/domain/models/Product';
import styles from './StorageSelector.module.scss';

interface StorageSelectorProps {
  storageOptions: StorageOption[];
  selectedStorage: StorageOption | null;
  onSelect: (storage: StorageOption) => void;
}

/**
 * Storage selector displaying capacity options as buttons.
 * Each option shows the storage capacity.
 */
export function StorageSelector({
  storageOptions,
  selectedStorage,
  onSelect,
}: StorageSelectorProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>STORAGE ¿HOW MUCH SPACE DO YOU NEED?</legend>
      <div className={styles.options} role="radiogroup" aria-label="Storage options">
        {storageOptions.map((option) => {
          const isSelected = selectedStorage?.capacity === option.capacity;
          return (
            <button
              key={option.capacity}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.capacity} for ${option.price} EUR`}
              className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(option)}
            >
              <span className={styles.capacity}>{option.capacity}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
