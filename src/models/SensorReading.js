export class SensorReading {
  // Ideal thresholds for corn in Cagayan de Oro
  static THRESHOLDS = {
    nitrogen: { min: 3.5, max: 4.5, unit: "%" }, // 4 parts
    phosphorous: { min: 1.5, max: 2.5, unit: "%" }, // 2 parts
    potassium: { min: 0.5, max: 1.5, unit: "%" }, // 1 part
    soil_ph: { min: 6.0, max: 6.5, unit: "pH" },
    soil_moisture: { min: 50, max: 75, unit: "%" },
  };

  constructor(data) {
    this.nitrogen = data?.nitrogen || 0;
    this.phosphorous = data?.phosphorous || 0;
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
        status: "High",
        message: `Above optimal range (${idealRange})`,
        value: formattedValue,
        ideal: idealRange,
      };
    } else if (value < min && value >= extremeLowThreshold) {
      return {
        status: "Low",
        message: `Below optimal range (${idealRange})`,
        value: formattedValue,
        ideal: idealRange,
      };
    } else if (value > extremeHighThreshold) {
      return {
        status: "Extremely High",
        message: `Significantly above optimal range (${idealRange})`,
        value: formattedValue,
        ideal: idealRange,
      };
    } else {
      return {
        status: "Extremely Low",
        message: `Significantly below optimal range (${idealRange})`,
        value: formattedValue,
        ideal: idealRange,
      };
    }
  }

  getNPKRatio() {
    const total = this.nitrogen + this.phosphorous + this.potassium;
    if (total === 0) return { actual: "0:0:0", ideal: "4:2:1" };

    const n = ((this.nitrogen / total) * 7).toFixed(1);
    const p = ((this.phosphorous / total) * 7).toFixed(1);
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
