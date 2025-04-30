export class SensorReading {
  // Ideal thresholds for corn in Cagayan de Oro
  static THRESHOLDS = {
    nitrogen: { min: 80, max: 140, unit: "mg/kg" }, // Medium to high for corn
    phosphorus: { min: 15, max: 30, unit: "mg/kg" }, // Medium for corn
    potassium: { min: 80, max: 150, unit: "mg/kg" }, // Medium to high for corn
    soil_ph: { min: 6.0, max: 7.0, unit: "pH" }, // Optimal range for corn
    soil_moisture: { min: 40, max: 60, unit: "%" }, // Moderate moisture
  };

  constructor(data) {
    this.nitrogen = data?.nitrogen || 0;
    this.phosphorus = data?.phosphorus || 0;
    this.potassium = data?.potassium || 0;
    this.soil_ph = data?.soil_ph || 0;
    this.soil_moisture = data?.soil_moisture || 0;
    this.timestamp = data?.timestamp || new Date().toISOString();
  }

  getStatus(type) {
    const value = this[type];
    const threshold = SensorReading.THRESHOLDS[type];

    if (!threshold) {
      return {
        status: "Unknown",
        message: "No threshold data available",
        value: value?.toString() || "0",
        ideal: "N/A",
      };
    }

    const { min, max, unit } = threshold;
    const formattedValue = this.formatValue(type);
    const idealRange = `${min}${unit}-${max}${unit}`;

    // Special handling for pH
    if (type === "soil_ph") {
      if (value < 5.5) {
        return {
          status: "Very Acidic",
          message: "pH is too low for optimal corn growth",
          value: formattedValue,
          ideal: "6.0-7.0",
        };
      } else if (value >= 5.5 && value < 6.0) {
        return {
          status: "Acidic",
          message: "pH is slightly below optimal range",
          value: formattedValue,
          ideal: "6.0-7.0",
        };
      } else if (value >= 6.0 && value <= 7.0) {
        return {
          status: "Optimal",
          message: "pH is in optimal range for corn growth",
          value: formattedValue,
          ideal: "6.0-7.0",
        };
      } else if (value > 7.0 && value <= 7.5) {
        return {
          status: "Slightly Alkaline",
          message: "pH is slightly above optimal range",
          value: formattedValue,
          ideal: "6.0-7.0",
        };
      } else {
        return {
          status: "Alkaline",
          message: "pH is too high for optimal corn growth",
          value: formattedValue,
          ideal: "6.0-7.0",
        };
      }
    }

    // For other sensors, use the standard threshold logic
    // Define threshold margins for high/low (20% of range)
    const range = max - min;
    const margin = range * 0.2;
    const extremeHighThreshold = max + margin;
    const extremeLowThreshold = min - margin;

    if (value >= min && value <= max) {
      return {
        status: "Optimal",
        message: `Within ideal range for corn growth`,
        value: formattedValue,
        ideal: idealRange,
      };
    } else if (value > max && value <= extremeHighThreshold) {
      return {
        status: "Slightly High",
        message: `Above optimal range (${idealRange})`,
        value: formattedValue,
        ideal: idealRange,
      };
    } else if (value < min && value >= extremeLowThreshold) {
      return {
        status: "Slightly Low",
        message: `Below optimal range (${idealRange})`,
        value: formattedValue,
        ideal: idealRange,
      };
    } else if (value > extremeHighThreshold) {
      return {
        status: "High",
        message: `Significantly above optimal range (${idealRange})`,
        value: formattedValue,
        ideal: idealRange,
      };
    } else {
      return {
        status: "Low",
        message: `Significantly below optimal range (${idealRange})`,
        value: formattedValue,
        ideal: idealRange,
      };
    }
  }

  getNPKRatio() {
    const total = this.nitrogen + this.phosphorus + this.potassium;
    if (total === 0) return { actual: "0:0:0", ideal: "4:2:1" };

    const n = ((this.nitrogen / total) * 7).toFixed(1);
    const p = ((this.phosphorus / total) * 7).toFixed(1);
    const k = ((this.potassium / total) * 7).toFixed(1);

    return {
      actual: `${n}:${p}:${k}`,
      ideal: "4:2:1",
      isBalanced:
        Math.abs(n - 4) < 0.5 && Math.abs(p - 2) < 0.5 && Math.abs(k - 1) < 0.5,
    };
  }

  formatValue(type) {
    const threshold = SensorReading.THRESHOLDS[type];
    return `${this[type]}${threshold?.unit || ""}`;
  }

  getFormattedTimestamp() {
    return new Date(this.timestamp).toLocaleString();
  }
}
