import type { ColorOption } from '@/domain/models/Product';
import styles from './ColorSelector.module.scss';

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: ColorOption | null;
  onSelect: (color: ColorOption) => void;
}

/**
 * Color selector displaying square swatches.
 * Accessibility: each swatch has an aria-label with the color name.
 */
export function ColorSelector({ colors, selectedColor, onSelect }: ColorSelectorProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>COLOR. PICK YOUR FAVOURITE.</legend>
      <div className={styles.options} role="radiogroup" aria-label="Color options">
        {colors.map((color) => {
          const isSelected = selectedColor?.name === color.name;
          return (
            <button
              key={color.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color.name}
              className={`${styles.swatch} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(color)}
            >
              <span
                className={styles.color}
                style={{ backgroundColor: color.hexCode }}
              />
            </button>
          );
        })}
      </div>
      <span className={styles.colorName}>
        {selectedColor ? selectedColor.name : '\u00A0'}
      </span>
    </fieldset>
  );
}
